import InstructionCache from "./caches/InstructionCache";
import DataCache from "./caches/DataCache";
import InstructionQueue from "./misc/InstructionQueue";
import AddSubReservationStation from "./reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "./reservation_stations/MulDivReservationStation";
import LoadBuffer from "./buffers/LoadBuffer";
import StoreBuffer from "./buffers/StoreBuffer";
import RegisterFile from "./misc/RegisterFile";
import IssueHandler from "./tomasulo_stages/issuing/IssueHandler";
import CommonDataBus from "./misc/CommonDataBus";
import ExecuteHandler from "./tomasulo_stages/execution/ExecuteHandler";
import WriteHandler from "./tomasulo_stages/writing_back/WriteHandler";
import FPAdder from "./arithmetic_units/FPAdder";
import FPMultiplier from "./arithmetic_units/FPMultiplier";

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
        this.FPAdders = Array(addSubReservationStationCount);

        this.mulDivReservationStations = Array(mulDivReservationStationCount)
            .fill(null)
            .map((_, index) => new MulDivReservationStation(`M${index + 1}`));
        this.FPMultipliers = Array(mulDivReservationStationCount);

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
    }

    public runTomasuloAlgorithm() {
        let temp = true;
        while (temp) {
            this.write();
            this.issue();
            this.execute();
            this.fetch();

            this.currentClockCycle++;
        }
    }

    // TODO: Move the logic to FetchHandler.ts
    private fetch() {
        const fetchedInstruction = this.instructionCache.fetch();
        if (fetchedInstruction) {
            this.instructionQueue.enqueue(fetchedInstruction);
        }
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
            this.registerFile.getPCRegister()
        ).handleExecuting();
    }

    private write() {
        new WriteHandler(
            this.addSubReservationStations,
            this.mulDivReservationStations,
            this.loadBuffers,
            this.storeBuffers,
            this.dataCache,
            this.registerFile,
            this.commonDataBus,
            this.finishedTagValuePairs
        ).handleWriting();
    }
}

export default Tomasulo;
