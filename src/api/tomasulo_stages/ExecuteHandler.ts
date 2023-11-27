import CommonDataBus from "../CommonDataBus";
import LoadBuffer from "../buffers/LoadBuffer";
import StoreBuffer from "../buffers/StoreBuffer";
import DataCache from "../caches/DataCache";
import AddSubReservationStation from "../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../reservation_stations/MulDivReservationStation";
import ReservationStation from "../reservation_stations/ReservationStation";
import V from "../../types/V";

class ExecuteHandler {
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private dataCache: DataCache;
    private commonDataBus: CommonDataBus;
    private tagTimeMap: Map<Tag, number>;

    private mayExecuteStoreBuffer: StoreBuffer | null;
    private mayExecuteLoadBuffer: LoadBuffer | null;

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        commonDataBus: CommonDataBus,
        tagTimeMap: Map<Tag, number>
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.commonDataBus = commonDataBus;
        this.tagTimeMap = tagTimeMap;

        this.mayExecuteStoreBuffer = null;
        this.mayExecuteLoadBuffer = null;
    }

    public handleExecuting() {
        this.decrementCyclesLeftForRunningStations();

        this.chooseStoreBufferToExecute();
        this.chooseLoadBufferToExecute();
        this.executeLoadOrStore();
    }

    private decrementCyclesLeftForRunningStations() {
        this.addSubReservationStations.forEach((station) => {
            if (station.canExecute()) {
                station.decrementCyclesLeft(); // simulate execution
            }
        });

        this.mulDivReservationStations.forEach((station) => {
            if (station.canExecute()) {
                station.decrementCyclesLeft(); // simulate execution
            }
        });
    }

    private chooseStoreBufferToExecute() {
        this.storeBuffers.forEach((buffer) => {
            if (!this.dataCache.isBusyWithTag(buffer.tag) && buffer.canExecute()) {
                this.mayExecuteStoreBuffer = buffer;
            }
        });
    }

    private chooseLoadBufferToExecute() {
        this.loadBuffers.forEach((buffer) => {
            if (!this.dataCache.isBusyWithTag(buffer.tag) && buffer.canExecute()) {
                this.mayExecuteLoadBuffer = buffer;
            }
        });
    }

    private executeLoadOrStore() {
        if (this.mayExecuteStoreBuffer && this.mayExecuteLoadBuffer) {
            const storeTag = this.mayExecuteStoreBuffer.tag;
            const storeTime = this.tagTimeMap.get(storeTag)!;

            const loadTag = this.mayExecuteLoadBuffer.tag;
            const loadTime = this.tagTimeMap.get(loadTag)!;

            if (loadTime < storeTime) {
                const sendToWrite = this.executeLoad(this.mayExecuteLoadBuffer);
                //TODO: send value and tag to the write stage ???
            } else {
                const sendToWrite = this.executeStore(this.mayExecuteStoreBuffer);
                //TODO: send value and tag to the write stage ???
            }
        } else if (this.mayExecuteStoreBuffer) {
            const sendToWrite = this.executeStore(this.mayExecuteStoreBuffer);
            //TODO: send value and tag to the write stage ???
        } else if (this.mayExecuteLoadBuffer) {
            const sendToWrite = this.executeLoad(this.mayExecuteLoadBuffer);
            //TODO: send value and tag to the write stage ???
        }

        this.mayExecuteStoreBuffer = null;
        this.mayExecuteLoadBuffer = null;
    }

    private executeStore(storeBuffer: StoreBuffer) {
        const { address, v } = storeBuffer;
        this.dataCache.write(address!, v!);
    }

    private executeLoad(loadBuffer: LoadBuffer) {
        const { address, tag } = loadBuffer!;
        const readValue = this.dataCache.read(address!);
        this.commonDataBus.write(readValue, tag!);
    }

    private executeArithmetic(station: ReservationStation) {
        const { op, vj, vk } = station;
        const computedValue = this.UseALU(op as InstructionOperation, vj, vk);
        this.commonDataBus.write(computedValue, station.tag!);
    }

    //TODO: We should have a ALU class and use instead of this function
    private UseALU(operation: InstructionOperation, vj: V, vk: V): number {
        // TODO: Handle ALU operations here.
        return 0;
    }
}

export default ExecuteHandler;
