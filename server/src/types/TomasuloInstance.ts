import InstructionQueue from "../main/InstructionQueue";
import LoadBuffer from "../main/buffers/LoadBuffer";
import StoreBuffer from "../main/buffers/StoreBuffer";
import InstructionCache from "../main/caches/InstructionCache";
import AddSubReservationStation from "../main/reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../main/reservation_stations/MulDivReservationStation";
import DataCacheCellInstance from "./DataCacheCellInstance";
import RegisterFileCellInstance from "./RegisterFileCellInstance";

type TomasuloInstance = {
    addSubReservationStations: AddSubReservationStation[];
    mulDivReservationStations: MulDivReservationStation[];
    loadBuffers: LoadBuffer[];
    storeBuffers: StoreBuffer[];
    instructionCache: InstructionCache;
    dataCache: DataCacheCellInstance[];
    instructionQueue: InstructionQueue;
    registerFile: RegisterFileCellInstance[];
    currentClockCycle: number;
};

export default TomasuloInstance;
