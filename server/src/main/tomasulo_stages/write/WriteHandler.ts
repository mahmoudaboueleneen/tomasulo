import TagValuePair from "../../../interfaces/TagValuePair";
import BNEZStationToBeCleared from "../../../types/BNEZStationToBeCleared";
import StoreBufferToBeCleared from "../../../types/StoreBufferToBeCleared";
import Tag from "../../../types/Tag";
import CommonDataBus from "../../CommonDataBus";
import RegisterFile from "../../RegisterFile";
import StoreBuffer from "../../buffers/StoreBuffer";
import DataCache from "../../caches/DataCache";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";

class WriteHandler {
    private commonDataBus: CommonDataBus;
    private finishedTagValuePairs: TagValuePair[];
    private tagsToBeCleared: Tag[];
    private storeBufferToBeCleared: StoreBufferToBeCleared;
    private dataCache: DataCache;
    private BNEZStationToBeCleared: BNEZStationToBeCleared;
    private registerFile: RegisterFile;

    constructor(
        commonDataBus: CommonDataBus,
        finishedTagValuePairs: TagValuePair[],
        tagsToBeCleared: Tag[],
        storeBufferToBeCleared: StoreBufferToBeCleared,
        dataCache: DataCache,
        BNEZStationToBeCleared: BNEZStationToBeCleared,
        registerFile: RegisterFile
    ) {
        this.commonDataBus = commonDataBus;
        this.finishedTagValuePairs = finishedTagValuePairs;
        this.tagsToBeCleared = tagsToBeCleared;

        this.storeBufferToBeCleared = storeBufferToBeCleared;
        this.dataCache = dataCache;

        this.BNEZStationToBeCleared = BNEZStationToBeCleared;
        this.registerFile = registerFile;
    }

    public handleWriting() {
        if (
            this.finishedTagValuePairs.length === 0 &&
            this.BNEZStationToBeCleared === null &&
            this.storeBufferToBeCleared === null
        ) {
            return;
        }

        if (this.finishedTagValuePairs.length > 0) {
            const nextPair = this.getNextFinishedTagValuePair();

            if (!nextPair) {
                throw new Error("No finished tag-value pairs left");
            }

            const { tag, value } = nextPair;
            this.commonDataBus.write(tag, value);
            this.tagsToBeCleared.push(tag);
        }
        if (
            this.storeBufferToBeCleared.tag &&
            this.storeBufferToBeCleared.address !== null &&
            this.storeBufferToBeCleared.v !== null
        ) {
            this.storeValueInDataCache(this.storeBufferToBeCleared.address, this.storeBufferToBeCleared.v);
            this.tagsToBeCleared.push(this.storeBufferToBeCleared.tag);
        }

        if (this.BNEZStationToBeCleared.tag) {
            this.tagsToBeCleared.push(this.BNEZStationToBeCleared.tag);
        }
    }

    private storeValueInDataCache(address: number, value: number) {
        this.dataCache.write(address, value);
    }

    private getNextFinishedTagValuePair() {
        return this.finishedTagValuePairs.shift();
    }
}

export default WriteHandler;
