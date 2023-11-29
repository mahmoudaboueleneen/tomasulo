import LoadBuffer from "../tumasolu_service/buffers/LoadBuffer";
import StoreBuffer from "../tumasolu_service/buffers/StoreBuffer";
import DataCache from "../tumasolu_service/caches/DataCache";
import InstructionCache from "../tumasolu_service/caches/InstructionCache";
import InstructionQueue from "../tumasolu_service/misc/InstructionQueue";
import RegisterFile from "../tumasolu_service/misc/RegisterFile";
import AddSubReservationStation from "../tumasolu_service/reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../tumasolu_service/reservation_stations/MulDivReservationStation";

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
