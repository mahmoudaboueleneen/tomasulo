import CommonDataBus from "../../misc/CommonDataBus";
import RegisterFile from "../../misc/RegisterFile";
import LoadBuffer from "../../buffers/LoadBuffer";
import StoreBuffer from "../../buffers/StoreBuffer";
import DataCache from "../../caches/DataCache";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";

class WriteHandler {
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private dataCache: DataCache;
    private registerFile: RegisterFile;
    private commonDataBus: CommonDataBus;
    private finishedTagValuePairs: TagValuePair[];

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        registerFile: RegisterFile,
        commonDataBus: CommonDataBus,
        finishedTagValuePairs: TagValuePair[]
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.registerFile = registerFile;
        this.commonDataBus = commonDataBus;
        this.finishedTagValuePairs = finishedTagValuePairs;
    }

    public handleWriting() {
        if (this.finishedTagValuePairs.length === 0) {
            return;
        }

        const nextPair = this.getNextFinishedTagValuePair();

        if (!nextPair) {
            throw new Error("No finished tag-value pairs left");
        }

        const { tag, value } = nextPair;
        this.commonDataBus.write(tag, value);

        this.clearStationOrBuffer(tag);
        this.updateReservationStations();
        this.updateStoreBuffers();
        this.updateRegisterFile();
    }

    private getNextFinishedTagValuePair() {
        return this.finishedTagValuePairs.shift();
    }

    private clearStationOrBuffer(tag: Tag) {
        if (tag!.startsWith("L")) {
            const buffer = this.loadBuffers.find((buffer) => buffer.tag === tag)!;
            buffer.clear();
            this.dataCache.clearRunningBufferTag();
        } else if (tag!.startsWith("S")) {
            const buffer = this.storeBuffers.find((buffer) => buffer.tag === tag)!;
            buffer.clear();
            this.dataCache.clearRunningBufferTag();
        } else if (tag!.startsWith("A")) {
            const station = this.addSubReservationStations.find((station) => station.tag === tag)!;
            station.clear();
        } else if (tag!.startsWith("M")) {
            const station = this.mulDivReservationStations.find((station) => station.tag === tag)!;
            station.clear();
        }
    }

    private updateReservationStations() {
        const { tag: tagOnBus, value: valueOnBus } = this.commonDataBus.read();

        this.addSubReservationStations.forEach((station) => {
            station.update(tagOnBus, valueOnBus);
        });

        this.mulDivReservationStations.forEach((station) => {
            station.update(tagOnBus, valueOnBus);
        });
    }

    private updateStoreBuffers() {
        const { tag: tagOnBus, value: valueOnBus } = this.commonDataBus.read();

        this.storeBuffers.forEach((buffer) => {
            buffer.update(tagOnBus, valueOnBus);
        });
    }

    private updateRegisterFile() {
        const { tag: tagOnBus, value: valueOnBus } = this.commonDataBus.read();

        this.registerFile.updateRegisters(tagOnBus, valueOnBus);
    }
}

export default WriteHandler;
