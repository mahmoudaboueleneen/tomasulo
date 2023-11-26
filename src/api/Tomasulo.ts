import InstructionCache from "./caches/InstructionCache";
import DataCache from "./caches/DataCache";
import InstructionQueue from "./InstructionQueue";
import AddSubReservationStation from "./reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "./reservation_stations/MulDivReservationStation";
import LoadBuffer from "./buffers/LoadBuffer";
import StoreBuffer from "./buffers/StoreBuffer";
import RegisterFile from "./RegisterFile";

class Tomasulo {
    private instructionCache: InstructionCache;
    private dataCache: DataCache;
    private instructionQueue: InstructionQueue;
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private registerFile: RegisterFile;

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
            .map((_value, index) => new AddSubReservationStation(`A${index + 1}`));
        this.mulDivReservationStations = Array(mulDivReservationStationCount)
            .fill(null)
            .map((_value, index) => new MulDivReservationStation(`M${index + 1}`));
        this.loadBuffers = Array(loadBufferCount)
            .fill(null)
            .map((_value, index) => new LoadBuffer(`L${index + 1}`));
        this.storeBuffers = Array(storeBufferCount)
            .fill(null)
            .map((_value, index) => new StoreBuffer(`S${index + 1}`));
        this.registerFile = new RegisterFile();
    }

    public runTomasuloAlgorithm() {
        while (true) {
            /* there are still instructions to execute */
            this.write();
            this.issue();
            this.execute();
        }
    }

    private write() {
        // Implement the write stage of the Tomasulo algorithm here
    }

    private issue() {
        // Implement the issue stage of the Tomasulo algorithm here
    }

    private execute() {
        // Implement the execute stage of the Tomasulo algorithm here
        //  loop over all reservation stations and buffers
        //  for each station
        //    if it can execute
        //      decrement the remaining cycles for the instruction in this station
    }
}

export default Tomasulo;
