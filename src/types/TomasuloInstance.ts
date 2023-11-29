import LoadBuffer from "../api/buffers/LoadBuffer";
import StoreBuffer from "../api/buffers/StoreBuffer";
import DataCache from "../api/caches/DataCache";
import InstructionCache from "../api/caches/InstructionCache";
import InstructionQueue from "../api/misc/InstructionQueue";
import RegisterFile from "../api/misc/RegisterFile";
import AddSubReservationStation from "../api/reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../api/reservation_stations/MulDivReservationStation";

type TomasuloElements = {
    addSubReservationStations: AddSubReservationStation[];
    mulDivReservationStations: MulDivReservationStation[];
    loadBuffers: LoadBuffer[];
    storeBuffers: StoreBuffer[];
    instructionCache: InstructionCache;
    dataCache: DataCache;
    instructionQueue: InstructionQueue;
    registerFile: RegisterFile;
    currentClockCycle: number;
};

export default TomasuloElements;
