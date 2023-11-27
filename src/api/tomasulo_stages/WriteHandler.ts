import CommonDataBus from "../CommonDataBus";
import LoadBuffer from "../buffers/LoadBuffer";
import StoreBuffer from "../buffers/StoreBuffer";
import DataCache from "../caches/DataCache";
import AddSubReservationStation from "../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../reservation_stations/MulDivReservationStation";

class WriteHandler {
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private dataCache: DataCache;
    private commonDataBus: CommonDataBus;
    private tagTimeMap: Map<Tag, number>;
    private finishedTagValuePairs: TagValuePair[];

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        commonDataBus: CommonDataBus,
        tagTimeMap: Map<Tag, number>,
        finishedTagValuePairs: TagValuePair[]
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.commonDataBus = commonDataBus;
        this.tagTimeMap = tagTimeMap;
        this.finishedTagValuePairs = finishedTagValuePairs;
    }

    public handleWriting() {
        // loop through all stations and buffers and do IF ELSE checks
    }

    private getNextInstructionToWrite() {
        return this.finishedTagValuePairs.shift();
    }
}

export default WriteHandler;
