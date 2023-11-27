import InstructionCache from "./caches/InstructionCache";
import DataCache from "./caches/DataCache";
import InstructionQueue from "./InstructionQueue";
import AddSubReservationStation from "./reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "./reservation_stations/MulDivReservationStation";
import LoadBuffer from "./buffers/LoadBuffer";
import StoreBuffer from "./buffers/StoreBuffer";
import RegisterFile from "./RegisterFile";
import IssueHandler from "./tomasulo_stages/IssueHandler";
import CommonDataBus from "./CommonDataBus";
import ExecuteHandler from "./tomasulo_stages/ExecuteHandler";
import WriteHandler from "./tomasulo_stages/WriteHandler";

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

    constructor(
        instructions: string[],
        addSubReservationStationCount: number,
        mulDivReservationStationCount: number,
        loadBufferCount: number,
        storeBufferCount: number
    ) {
        this.instructionCache = new InstructionCache(instructions);
        this.dataCache = new DataCache();
        this.instructionQueue = new InstructionQueue();
        this.addSubReservationStations = Array(addSubReservationStationCount)
            .fill(null)
            .map((_, index) => new AddSubReservationStation(`A${index + 1}`));
        this.mulDivReservationStations = Array(mulDivReservationStationCount)
            .fill(null)
            .map((_, index) => new MulDivReservationStation(`M${index + 1}`));
        this.loadBuffers = Array(loadBufferCount)
            .fill(null)
            .map((_, index) => new LoadBuffer(`L${index + 1}`));
        this.storeBuffers = Array(storeBufferCount)
            .fill(null)
            .map((_, index) => new StoreBuffer(`S${index + 1}`));
        this.registerFile = new RegisterFile();
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
            this.loadBuffers,
            this.storeBuffers,
            this.dataCache,
            this.commonDataBus,
            this.tagTimeMap,
            this.finishedTagValuePairs
        ).handleExecuting();
    }

    private write() {
        // new WriteHandler().handleWriting();
    }
}

export default Tomasulo;
