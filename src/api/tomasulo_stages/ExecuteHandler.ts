import { WriteData } from "../../interfaces/writeData";
import V from "../../types/V";
import LoadBuffer from "../buffers/LoadBuffer";
import StoreBuffer from "../buffers/StoreBuffer";
import DataCache from "../caches/DataCache";
import AddSubReservationStation from "../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../reservation_stations/MulDivReservationStation";
import ReservationStation from "../reservation_stations/ReservationStation";

class ExecuteHandler {
    private addSubReserbationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private dataCache: DataCache;
    private tagTimeMap: Map<Tag, number>;
    private mayExecuteStoreBuffer: StoreBuffer | null;
    private mayExecuteLoadBuffer: LoadBuffer | null;

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        tagTimeMap: Map<Tag, number>
    ) {
        this.mayExecuteStoreBuffer = null;
        this.mayExecuteLoadBuffer = null;
        this.addSubReserbationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.tagTimeMap = tagTimeMap;
    }

    public handleExecuting() {
        this.decrementCyclesFromResevationStations(this.addSubReserbationStations);

        this.decrementCyclesFromResevationStations(this.mulDivReservationStations);

        this.chooseStoreBuffertoExecute();

        this.chooseLoadBuffertoExecute();

        this.executeLoadOrStore();
    }

    private decrementCyclesFromResevationStations(reservationsStations: ReservationStation[]) {
        reservationsStations.forEach((station) => {
            if (station.busy === 1 && station.canExecute()) {
                station.decrementCyclesLeft();
                if (station.isFinished()) {
                    this.executeArithmetic(station);
                }
            }
        });
    }

    private chooseStoreBuffertoExecute() {
        this.storeBuffers.forEach((buffer) => {
            if (buffer.canExecute()) {
                this.mayExecuteStoreBuffer = buffer;
            }
        });
    }

    private chooseLoadBuffertoExecute() {
        this.loadBuffers.forEach((buffer) => {
            if (buffer.canExecute()) {
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

    private executeStore(storeBuffer: StoreBuffer): WriteData {
        const { address, v, tag } = storeBuffer;
        this.dataCache.write(address!, v!);

        return { value: v, tag };
    }
    private executeLoad(loadBuffer: LoadBuffer): WriteData {
        const { address, tag } = loadBuffer!;
        const v = this.dataCache.read(address!);
        return { value: v, tag };
    }

    private executeArithmetic(station: ReservationStation) {
        const { vj, vk } = station;
        const value = this.UseALU(vj, vk);
        const sendToWrite = { value, tag: station.tag! };
    }
    //TODO: We should have a ALU class and use instead of this function
    private UseALU(op1: V, op2: V): V {
        return op1! + op2!;
    }
}

export default ExecuteHandler;
