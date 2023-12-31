import LoadBuffer from "../../buffers/LoadBuffer";
import StoreBuffer from "../../buffers/StoreBuffer";
import DataCache from "../../caches/DataCache";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";
import ReservationStation from "../../reservation_stations/ReservationStation";
import FPMultiplier from "../../arithmetic_units/FPMultiplier";
import FPAdder from "../../arithmetic_units/FPAdder";
import AluElement from "../../arithmetic_units/AluElement";
import Tag from "../../../types/Tag";
import TagValuePair from "../../../interfaces/TagValuePair";
import RegisterFile from "../../RegisterFile";
import StoreBufferToBeCleared from "../../../types/StoreBufferToBeCleared";
import BNEZStationToBeCleared from "../../../types/BNEZStationToBeCleared";
import ExecutionSummaryTable from "../../ExecutionSummaryTable";

class ExecuteHandler {
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private FPAdders: FPAdder[];
    private FPMultipliers: FPMultiplier[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private dataCache: DataCache;
    private tagTimeMap: Map<Tag, number>;
    private finishedTagValuePairs: TagValuePair[];
    private candidateLoadBuffer: LoadBuffer | null;
    private candidateStoreBuffer: StoreBuffer | null;
    private storeBufferToBeCleared: StoreBufferToBeCleared;
    private BNEZStationToBeCleared: BNEZStationToBeCleared;
    private registerFile: RegisterFile;

    private executionSummaryTable: ExecutionSummaryTable;
    private currentClockCycle: number;

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        FPAdders: FPAdder[],
        FPMultipliers: FPMultiplier[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        tagTimeMap: Map<Tag, number>,
        finishedTagValuePairs: TagValuePair[],
        storeBufferToBeCleared: StoreBufferToBeCleared,
        BNEZStationToBeCleared: BNEZStationToBeCleared,
        registerFile: RegisterFile,
        executionSummaryTable: ExecutionSummaryTable,
        currentClockCycle: number
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.FPAdders = FPAdders;
        this.FPMultipliers = FPMultipliers;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.tagTimeMap = tagTimeMap;
        this.finishedTagValuePairs = finishedTagValuePairs;
        this.candidateLoadBuffer = null;
        this.candidateStoreBuffer = null;
        this.storeBufferToBeCleared = storeBufferToBeCleared;
        this.BNEZStationToBeCleared = BNEZStationToBeCleared;
        this.registerFile = registerFile;
        this.executionSummaryTable = executionSummaryTable;
        this.currentClockCycle = currentClockCycle;
    }

    public handleExecuting() {
        this.handleRunningInstructionsInStations(this.addSubReservationStations, this.FPAdders);
        this.handleRunningInstructionsInStations(this.mulDivReservationStations, this.FPMultipliers);
        this.handleRunningInstructionsInBuffers();
        this.assignEarlierBufferToDataCache();
        this.clearCandidates();
    }

    private clearCandidates() {
        this.candidateLoadBuffer = null;
        this.candidateStoreBuffer = null;
    }

    private handleRunningInstructionsInStations(stations: ReservationStation[], AluElements: AluElement[]) {
        stations.forEach((station, index) => {
            const stationAluElement = AluElements[index];
            if (station.canExecute()) {
                if (this.executionSummaryTable.isTagNotYetExecuting(station.tag)) {
                    this.executionSummaryTable.addExecutionStartingCycle(station.tag, this.currentClockCycle);
                }
                station.decrementCyclesLeft();
                stationAluElement.setBusy(1);

                if (station.isFinished()) {
                    const computedValue = stationAluElement.compute(station.op!, station.vj!, station.vk!);

                    if (station.op === "BNEZ") {
                        if (computedValue === 1) {
                            this.registerFile.setPCRegisterValue(station.A!);
                        }
                        this.BNEZStationToBeCleared.tag = station.tag;
                        this.BNEZStationToBeCleared.executionResult = computedValue;
                    } else {
                        this.addToFinishedTagValuePairs(station.tag, computedValue);
                    }
                    stationAluElement.setBusy(0);

                    this.executionSummaryTable.addExecutionEndingCycle(station.tag, this.currentClockCycle);
                }
            }
        });
    }

    private handleRunningInstructionsInBuffers() {
        for (const buffer of this.loadBuffers) {
            if (buffer.canExecute() && !this.dataCache.isBusy()) {
                this.candidateLoadBuffer = buffer;
                break;
            }

            if (buffer.canExecute() && this.dataCache.isInstructionTagExecuting(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    const readValue = this.executeLoad(buffer);
                    this.addToFinishedTagValuePairs(buffer.tag, readValue);

                    this.executionSummaryTable.addExecutionEndingCycle(buffer.tag, this.currentClockCycle);
                }
            }
        }

        for (const buffer of this.storeBuffers) {
            if (buffer.canExecute() && !this.dataCache.isBusy()) {
                this.candidateStoreBuffer = buffer;
                break;
            }
            if (buffer.canExecute() && this.dataCache.isInstructionTagExecuting(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    copyFieldsFromSecondIntoFirst(this.storeBufferToBeCleared, buffer);

                    this.executionSummaryTable.addExecutionEndingCycle(buffer.tag, this.currentClockCycle);
                }
            }
        }
    }

    private assignEarlierBufferToDataCache() {
        const loadTag = this.candidateLoadBuffer?.tag;

        const storeTag = this.candidateStoreBuffer?.tag;

        if (this.candidateLoadBuffer && this.candidateStoreBuffer) {
            if (this.isFirstTagLaterThanSecondTag(loadTag!, storeTag!)) {
                this.dataCache.setRunningBufferTag(storeTag!);
                this.candidateStoreBuffer.decrementCyclesLeft();
            } else {
                this.dataCache.setRunningBufferTag(loadTag!);
                this.candidateLoadBuffer.decrementCyclesLeft();
            }
        } else if (this.candidateStoreBuffer) {
            this.dataCache.setRunningBufferTag(storeTag!);
            this.candidateStoreBuffer.decrementCyclesLeft();
        } else if (this.candidateLoadBuffer) {
            this.dataCache.setRunningBufferTag(loadTag!);
            this.candidateLoadBuffer.decrementCyclesLeft();
        }

        if (this.candidateStoreBuffer || this.candidateLoadBuffer) {
            this.executionSummaryTable.addExecutionStartingCycle(
                this.dataCache.getRunningBufferTag(),
                this.currentClockCycle
            );
        }
    }

    private addToFinishedTagValuePairs(newTag: Tag, newValue: number) {
        const newPair: TagValuePair = { tag: newTag, value: newValue };

        const pairsIssuedBeforeOrAtSameTime = this.finishedTagValuePairs.filter(
            (pair) => !this.isFirstTagLaterThanSecondTag(pair.tag, newTag)
        );

        const pairsIssuedAfter = this.finishedTagValuePairs.filter((pair) =>
            this.isFirstTagLaterThanSecondTag(pair.tag, newTag)
        );

        // Clear the array
        this.finishedTagValuePairs.length = 0;

        // Add the elements back in the desired order
        this.finishedTagValuePairs.push(...pairsIssuedBeforeOrAtSameTime, newPair, ...pairsIssuedAfter);
    }

    private isFirstTagLaterThanSecondTag(firstTag: Tag, secondTag: Tag) {
        const firstTagTime = this.tagTimeMap.get(firstTag)!;
        const secondTagTime = this.tagTimeMap.get(secondTag)!;
        return firstTagTime > secondTagTime;
    }

    private executeLoad(loadBuffer: LoadBuffer) {
        const { address } = loadBuffer!;
        return this.dataCache.read(address!);
    }
}

const copyFieldsFromSecondIntoFirst = (first: any, second: any) => {
    Object.keys(first).forEach((key) => {
        first[key] = second[key];
    });
};

export default ExecuteHandler;
