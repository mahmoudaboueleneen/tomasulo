import InstructionCache from "./caches/InstructionCache";
import DataCache from "./caches/DataCache";
import InstructionQueue from "./InstructionQueue";
import AddSubReservationStation from "./reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "./reservation_stations/MulDivReservationStation";
import LoadBuffer from "./buffers/LoadBuffer";
import StoreBuffer from "./buffers/StoreBuffer";
import RegisterFile from "./RegisterFile";
import IssueHandler from "./tomasulo_stages/issue/IssueHandler";
import CommonDataBus from "./CommonDataBus";
import ExecuteHandler from "./tomasulo_stages/execute/ExecuteHandler";
import WriteHandler from "./tomasulo_stages/write/WriteHandler";
import FPAdder from "./arithmetic_units/FPAdder";
import FPMultiplier from "./arithmetic_units/FPMultiplier";
import UpdateHandler from "./tomasulo_stages/update/UpdateHandler";
import ClearHandler from "./tomasulo_stages/clear/ClearHandler";
import FetchHandler from "./tomasulo_stages/fetch/FetchHandler";
import Tag from "../types/Tag";
import TagValuePair from "../interfaces/TagValuePair";
import TomasuloInstance from "../types/TomasuloInstance";
import { mapToDataArray, mapToRegisterArray } from "../utils/jsonMapHandler";
import StoreBufferToBeCleared from "../types/StoreBufferToBeCleared";
import BNEZStationToBeCleared from "../types/BNEZStationToBeCleared";

class Tomasulo {
    private instructionCache: InstructionCache;
    private instructionQueue: InstructionQueue;
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private commonDataBus: CommonDataBus;
    private currentClockCycle: number;
    private tagTimeMap: Map<Tag, number>;
    private finishedTagValuePairs: TagValuePair[];
    private FPAdders: FPAdder[];
    private FPMultipliers: FPMultiplier[];
    private tagsToBeCleared: Tag[];
    private storeBufferToBeCleared: StoreBufferToBeCleared;
    private BNEZStationToBeCleared: BNEZStationToBeCleared;

    // Taken as input from the user
    private FPAddLatency: number;
    private FPSubtractLatency: number;
    private FPMultiplyLatency: number;
    private FPDivideLatency: number;
    private IntSubtractLatency: number;
    private LoadLatency: number;
    private StoreLatency: number;

    // Assumed constant for our implementation and not taken as input from the user
    private IntAddLatency: number;
    private BranchNotEqualZeroLatency: number;

    private registerFile: RegisterFile;
    private dataCache: DataCache;

    constructor(
        instructions: string[],
        addSubReservationStationCount: number,
        mulDivReservationStationCount: number,
        loadBufferCount: number,
        storeBufferCount: number,
        FPAddLatency: number,
        FPSubtractLatency: number,
        FPMultiplyLatency: number,
        FPDivideLatency: number,
        IntSubtractLatency: number,
        LoadLatency: number,
        StoreLatency: number,
        preloadedRegisters?: any,
        preloadedMemoryLocations?: any
    ) {
        this.registerFile = new RegisterFile();
        if (preloadedRegisters && preloadedRegisters.length > 0) {
            this.registerFile.preloadRegisters(preloadedRegisters);
        }

        this.dataCache = new DataCache();
        if (preloadedMemoryLocations && preloadedMemoryLocations.length > 0) {
            this.dataCache.preloadMemoryLocations(preloadedMemoryLocations);
        }

        this.instructionCache = new InstructionCache(instructions, this.registerFile.getPCRegister());
        this.instructionQueue = new InstructionQueue();

        this.addSubReservationStations = Array(addSubReservationStationCount)
            .fill(null)
            .map((_, index) => new AddSubReservationStation(`A${index + 1}`));
        this.FPAdders = Array(addSubReservationStationCount)
            .fill(null)
            .map((_) => new FPAdder());

        this.mulDivReservationStations = Array(mulDivReservationStationCount)
            .fill(null)
            .map((_, index) => new MulDivReservationStation(`M${index + 1}`));
        this.FPMultipliers = Array(mulDivReservationStationCount)
            .fill(null)
            .map((_) => new FPMultiplier());

        this.loadBuffers = Array(loadBufferCount)
            .fill(null)
            .map((_, index) => new LoadBuffer(`L${index + 1}`));
        this.storeBuffers = Array(storeBufferCount)
            .fill(null)
            .map((_, index) => new StoreBuffer(`S${index + 1}`));

        this.commonDataBus = new CommonDataBus();
        this.currentClockCycle = 0;
        this.tagTimeMap = new Map();

        this.finishedTagValuePairs = [];

        this.tagsToBeCleared = [];

        this.storeBufferToBeCleared = { tag: null, address: null, v: null };
        this.BNEZStationToBeCleared = { tag: null };

        this.FPAddLatency = FPAddLatency;
        this.FPSubtractLatency = FPSubtractLatency;
        this.FPMultiplyLatency = FPMultiplyLatency;
        this.FPDivideLatency = FPDivideLatency;
        this.IntSubtractLatency = IntSubtractLatency;
        this.LoadLatency = LoadLatency;
        this.StoreLatency = StoreLatency;

        this.IntAddLatency = 1;
        this.BranchNotEqualZeroLatency = 1;
    }

    // TODO: Update the condition
    public runTomasuloAlgorithm(): TomasuloInstance[] {
        const tomasuloInstancesAtEachCycle: TomasuloInstance[] = [];

        while (this.toKeepRunning()) {
            this.write();
            this.execute();
            this.issue();
            this.fetch();
            this.update();
            this.clear();

            tomasuloInstancesAtEachCycle.push(this.createTomasuloInstance());

            this.currentClockCycle++;
        }
        return tomasuloInstancesAtEachCycle;
    }

    private toKeepRunning() {
        return (
            this.instructionCache.hasNonFetchedInstructions() ||
            !this.instructionQueue.isEmpty() ||
            this.existRunningStationOrBuffer() ||
            this.tagsToBeCleared.length > 0 ||
            this.existWritesAwaitingWriting()
        );
    }

    private createTomasuloInstance(): TomasuloInstance {
        return JSON.parse(
            JSON.stringify({
                addSubReservationStations: this.addSubReservationStations,
                mulDivReservationStations: this.mulDivReservationStations,
                loadBuffers: this.loadBuffers,
                storeBuffers: this.storeBuffers,
                instructionCache: this.instructionCache,
                dataCache: mapToDataArray(this.dataCache),
                instructionQueue: this.instructionQueue,
                registerFile: mapToRegisterArray(this.registerFile),
                currentClockCycle: this.currentClockCycle
            })
        );
    }

    private existRunningStationOrBuffer(): boolean {
        return (
            this.addSubReservationStations.some((station) => station.busy) ||
            this.mulDivReservationStations.some((station) => station.busy) ||
            this.loadBuffers.some((buffer) => buffer.busy) ||
            this.storeBuffers.some((buffer) => buffer.busy)
        );
    }

    private existWritesAwaitingWriting() {
        return this.finishedTagValuePairs.length > 0;
    }

    private write() {
        new WriteHandler(
            this.commonDataBus,
            this.finishedTagValuePairs,
            this.tagsToBeCleared,
            this.storeBufferToBeCleared,
            this.dataCache,
            this.BNEZStationToBeCleared,
            this.registerFile
        ).handleWriting();
    }

    private execute() {
        new ExecuteHandler(
            this.addSubReservationStations,
            this.mulDivReservationStations,
            this.FPAdders,
            this.FPMultipliers,
            this.loadBuffers,
            this.storeBuffers,
            this.dataCache,
            this.tagTimeMap,
            this.finishedTagValuePairs,
            this.storeBufferToBeCleared,
            this.BNEZStationToBeCleared,
            this.registerFile
        ).handleExecuting();
    }

    private issue() {
        new IssueHandler(
            this.instructionCache,
            this.instructionQueue,
            this.currentClockCycle,
            this.tagTimeMap,
            this.storeBuffers,
            this.registerFile,
            this.loadBuffers,
            this.addSubReservationStations,
            this.mulDivReservationStations,
            this.FPAddLatency,
            this.FPSubtractLatency,
            this.FPMultiplyLatency,
            this.FPDivideLatency,
            this.IntSubtractLatency,
            this.LoadLatency,
            this.StoreLatency,
            this.IntAddLatency,
            this.BranchNotEqualZeroLatency
        ).handleIssuing();
    }

    private fetch() {
        new FetchHandler(this.instructionCache, this.instructionQueue, this.canContinueFetching()).handleFetching();
    }

    private canContinueFetching() {
        return (
            this.addSubReservationStations.every((station) => station.op !== "BNEZ") ||
            (this.addSubReservationStations.some((station) => station.busy === 1 && station.op === "BNEZ") &&
                this.tagsToBeCleared.includes(this.BNEZStationToBeCleared.tag))
        );
    }

    private update() {
        new UpdateHandler(
            this.addSubReservationStations,
            this.mulDivReservationStations,
            this.storeBuffers,
            this.registerFile,
            this.commonDataBus
        ).handleUpdating();
    }

    private clear() {
        new ClearHandler(
            this.addSubReservationStations,
            this.mulDivReservationStations,
            this.loadBuffers,
            this.storeBuffers,
            this.dataCache,
            this.tagsToBeCleared
        ).handleClearing();
    }

    public getInstructionCache(): InstructionCache {
        return this.instructionCache;
    }
    public getDataCache(): DataCache {
        return this.dataCache;
    }
    public getInstructionQueue(): InstructionQueue {
        return this.instructionQueue;
    }
    public getAddSubReservationStations(): AddSubReservationStation[] {
        return this.addSubReservationStations;
    }
    public getMulDivReservationStations(): MulDivReservationStation[] {
        return this.mulDivReservationStations;
    }
    public getLoadBuffers(): LoadBuffer[] {
        return this.loadBuffers;
    }
    public getStoreBuffers(): StoreBuffer[] {
        return this.storeBuffers;
    }
    public getRegisterFile(): RegisterFile {
        return this.registerFile;
    }
    public getCommonDataBus(): CommonDataBus {
        return this.commonDataBus;
    }
    public getCurrentClockCycle(): number {
        return this.currentClockCycle;
    }
}

export default Tomasulo;
