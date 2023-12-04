import InstructionQueue from "../main/InstructionQueue";
import RegisterFile from "../main/RegisterFile";
import LoadBuffer from "../main/buffers/LoadBuffer";
import StoreBuffer from "../main/buffers/StoreBuffer";
import DataCache from "../main/caches/DataCache";
import InstructionCache from "../main/caches/InstructionCache";
import AddSubReservationStation from "../main/reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../main/reservation_stations/MulDivReservationStation";
import DataCacheCellInstance from "./DataCacheCellInstance";
import RegisterFileCellInstance from "./RegisterFileCellInstance";
import SummaryTableRecord from "./SummaryTableRecord";

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
    summaryTable: SummaryTableRecord[];
};

export default TomasuloInstance;
