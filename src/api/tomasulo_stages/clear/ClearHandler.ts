import LoadBuffer from "../../buffers/LoadBuffer";
import StoreBuffer from "../../buffers/StoreBuffer";
import DataCache from "../../caches/DataCache";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";

class ClearHandler {
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private dataCache: DataCache;
    private tagsToBeCleared: Tag[];

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        tagsToBeCleared: Tag[]
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.tagsToBeCleared = tagsToBeCleared;
    }

    public handleClearing() {
        this.tagsToBeCleared.forEach((tag) => {
            this.clearStationOrBuffer(tag);
        });
    }

    private clearStationOrBuffer(tag: Tag) {
        if (!tag) throw new Error("Cannot clear invalid tag");

        if (tag.startsWith("L")) {
            const buffer = this.loadBuffers.find((buffer) => buffer.tag === tag)!;
            buffer.clear();
            this.dataCache.clearRunningBufferTag();
        } else if (tag.startsWith("S")) {
            const buffer = this.storeBuffers.find((buffer) => buffer.tag === tag)!;
            buffer.clear();
            this.dataCache.clearRunningBufferTag();
        } else if (tag.startsWith("A")) {
            const station = this.addSubReservationStations.find((station) => station.tag === tag)!;
            station.clear();
        } else if (tag.startsWith("M")) {
            const station = this.mulDivReservationStations.find((station) => station.tag === tag)!;
            station.clear();
        }
    }
}

export default ClearHandler;
