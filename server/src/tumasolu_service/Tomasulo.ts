import InstructionCache from "./caches/InstructionCache";
import DataCache from "./caches/DataCache";
import InstructionQueue from "./misc/InstructionQueue";
import AddSubReservationStation from "./reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "./reservation_stations/MulDivReservationStation";
import LoadBuffer from "./buffers/LoadBuffer";
import StoreBuffer from "./buffers/StoreBuffer";
import RegisterFile from "./misc/RegisterFile";
import IssueHandler from "./tomasulo_stages/issue/IssueHandler";
import CommonDataBus from "./misc/CommonDataBus";
import ExecuteHandler from "./tomasulo_stages/execute/ExecuteHandler";
import WriteHandler from "./tomasulo_stages/write/WriteHandler";
import FPAdder from "./arithmetic_units/FPAdder";
import FPMultiplier from "./arithmetic_units/FPMultiplier";
import UpdateHandler from "./tomasulo_stages/update/UpdateHandler";
import ClearHandler from "./tomasulo_stages/clear/ClearHandler";
import FetchHandler from "./tomasulo_stages/fetch/FetchHandler";
import Tag from "../types/Tag";
import TagValuePair from "../interfaces/TagValuePair";

class Tomasulo {
    private instructionCache: InstructionCache;
    private dataCache: DataCache;

    private instructionQueue: InstructionQueue;

    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];

    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];

    private registerFile: RegisterFile;
    private commonDataBus: CommonDataBus;
    private currentClockCycle: number;
    private tagTimeMap: Map<Tag, number>;
    private finishedTagValuePairs: TagValuePair[];

    private FPAdders: FPAdder[];
    private FPMultipliers: FPMultiplier[];

    private tagsToBeCleared: Tag[];
    private contentToBeWrittenToPCRegister: { content: number | null };

    private instructionLatencies: Map<string, number>;

    constructor(
        instructions: string[],
        addSubReservationStationCount: number,
        mulDivReservationStationCount: number,
        loadBufferCount: number,
        storeBufferCount: number
    ) {
        this.registerFile = new RegisterFile();
        this.instructionCache = new InstructionCache(instructions, this.registerFile.getPCRegister());
        this.dataCache = new DataCache();
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
        this.contentToBeWrittenToPCRegister = { content: null };

        this.instructionLatencies = new Map().set("ADDI", 2).set("BNEZ", 1);
    }

    public runTomasuloAlgorithm() {
        // this.instructionCache.hasNonFetchedInstructions() ||
        //     !this.instructionQueue.isEmpty() ||
        //     this.existRunningStationOrBuffer() ||
        //     this.tagsToBeCleared.length > 0 ||
        //     this.contentToBeWrittenToPCRegister.content ||
        //     this.existWritesAwaitingWriting
        let i = 0;
        while (i++ < 60) {
            console.log("[+] Cycle Number", this.currentClockCycle);
            console.log();

            this.write();
            this.execute();
            this.issue();
            this.fetch();
            this.update();
            this.clear();
            this.currentClockCycle++;

            console.log("Instruction Queue", this.instructionQueue, "\n");

            console.log(
                "Busy AddSub Stations",
                this.addSubReservationStations.filter((station) => station.busy === 1),
                "\n"
            );
            console.log(
                "Busy MulDiv Stations",
                this.mulDivReservationStations.filter((station) => station.busy === 1),
                "\n"
            );
            console.log(
                "Busy Load Buffers",
                this.loadBuffers.filter((buffer) => buffer.busy === 1),
                "\n"
            );
            console.log(
                "Busy Store Buffers",
                this.storeBuffers.filter((buffer) => buffer.busy === 1),
                "\n"
            );

            this.registerFile.getRegisters().forEach((value, key) => {
                if (value.qi !== 0 || value.content !== 0) {
                    console.log(key, value);
                }
            });

            console.log("\n");

            console.log(
                "[+] ====================================================================================",
                "\n"
            );
        }
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
        new WriteHandler(this.commonDataBus, this.finishedTagValuePairs, this.tagsToBeCleared).handleWriting();
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
            this.tagsToBeCleared,
            this.contentToBeWrittenToPCRegister
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
            this.mulDivReservationStations
        ).handleIssuing();
    }

    private fetch() {
        new FetchHandler(this.instructionCache, this.instructionQueue).handleFetching();
    }

    private update() {
        new UpdateHandler(
            this.addSubReservationStations,
            this.mulDivReservationStations,
            this.storeBuffers,
            this.registerFile,
            this.commonDataBus,
            this.contentToBeWrittenToPCRegister
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
}

export default Tomasulo;
