import TagValuePair from "../../../interfaces/TagValuePair";
import BNEZStationToBeCleared from "../../../types/BNEZStationToBeCleared";
import StoreBufferToBeCleared from "../../../types/StoreBufferToBeCleared";
import Tag from "../../../types/Tag";
import CommonDataBus from "../../CommonDataBus";
import ExecutionSummaryTable from "../../ExecutionSummaryTable";
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

    private executionSummaryTable: ExecutionSummaryTable;
    private currentClockCycle: number;
    private currentIterationInCode: number | null;

    constructor(
        commonDataBus: CommonDataBus,
        finishedTagValuePairs: TagValuePair[],
        tagsToBeCleared: Tag[],
        storeBufferToBeCleared: StoreBufferToBeCleared,
        dataCache: DataCache,
        BNEZStationToBeCleared: BNEZStationToBeCleared,
        executionSummaryTable: ExecutionSummaryTable,
        currentClockCycle: number,
        currentIterationInCode: number | null
    ) {
        this.commonDataBus = commonDataBus;
        this.finishedTagValuePairs = finishedTagValuePairs;
        this.tagsToBeCleared = tagsToBeCleared;

        this.storeBufferToBeCleared = storeBufferToBeCleared;
        this.dataCache = dataCache;

        this.BNEZStationToBeCleared = BNEZStationToBeCleared;

        this.executionSummaryTable = executionSummaryTable;
        this.currentClockCycle = currentClockCycle;
        this.currentIterationInCode = currentIterationInCode;
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

            this.executionSummaryTable.addWriteResultCycle(tag, this.currentClockCycle);
        }
        if (
            this.storeBufferToBeCleared.tag &&
            this.storeBufferToBeCleared.address !== null &&
            this.storeBufferToBeCleared.v !== null
        ) {
            this.storeValueInDataCache(this.storeBufferToBeCleared.address, this.storeBufferToBeCleared.v);
            this.tagsToBeCleared.push(this.storeBufferToBeCleared.tag);

            this.executionSummaryTable.addWriteResultCycle(this.storeBufferToBeCleared.tag, this.currentClockCycle);

            clearStoreBuffer(this.storeBufferToBeCleared);
        }

        if (this.BNEZStationToBeCleared.tag) {
            this.tagsToBeCleared.push(this.BNEZStationToBeCleared.tag);

            if (this.BNEZStationToBeCleared.executionResult === 1 && this.currentIterationInCode !== null) {
                this.currentIterationInCode++;
            }
            this.executionSummaryTable.addWriteResultCycle(this.BNEZStationToBeCleared.tag, this.currentClockCycle);
        }

        function clearStoreBuffer(storeBufferToBeCleared: StoreBufferToBeCleared) {
            storeBufferToBeCleared.tag = null;
            storeBufferToBeCleared.address = null;
            storeBufferToBeCleared.v = null;
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
