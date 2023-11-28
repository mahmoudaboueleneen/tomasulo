import LoadBuffer from "../../buffers/LoadBuffer";
import StoreBuffer from "../../buffers/StoreBuffer";
import DataCache from "../../caches/DataCache";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";
import ReservationStation from "../../reservation_stations/ReservationStation";
import FPMultiplier from "../../arithmetic_units/FPMultiplier";
import FPAdder from "../../arithmetic_units/FPAdder";
import AluElement from "../../arithmetic_units/AluElement";
import RegisterInfo from "../../../interfaces/RegisterInfo";

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
    private PCRegister: RegisterInfo;
    private tagsToBeCleared: Tag[];

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
        PCRegister: RegisterInfo,
        tagsToBeCleared: Tag[]
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
        this.PCRegister = PCRegister;

        this.candidateLoadBuffer = null;
        this.candidateStoreBuffer = null;
        this.tagsToBeCleared = tagsToBeCleared;
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
                station.decrementCyclesLeft();
                stationAluElement.setBusy(1);
                if (station.isFinished()) {
                    const computedValue = stationAluElement.compute(station.op!, station.vj!, station.vk!);
                    if (station.op === "BNEZ") {
                        if (computedValue !== 0) {
                            // this.PCRegister.value = station.v;
                        }
                    } else {
                        this.addToFinishedTagValuePairs(station.tag, computedValue);
                    }
                    stationAluElement.setBusy(0);
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

            if (buffer.canExecute() && this.dataCache.isFilledWithTag(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    const readValue = this.executeLoad(buffer);
                    this.addToFinishedTagValuePairs(buffer.tag, readValue);
                }
            }
        }

        for (const buffer of this.storeBuffers) {
            if (buffer.canExecute() && !this.dataCache.isBusy()) {
                this.candidateStoreBuffer = buffer;
                break;
            }
            if (buffer.canExecute() && this.dataCache.isFilledWithTag(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    this.executeStore(buffer);
                    this.tagsToBeCleared.push(buffer.tag);
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
            } else {
                this.dataCache.setRunningBufferTag(loadTag!);
            }
        } else if (this.candidateStoreBuffer) {
            this.dataCache.setRunningBufferTag(storeTag!);
        } else if (this.candidateLoadBuffer) {
            this.dataCache.setRunningBufferTag(loadTag!);
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

        this.finishedTagValuePairs = pairsIssuedBeforeOrAtSameTime.concat(newPair).concat(pairsIssuedAfter);
    }

    private isFirstTagLaterThanSecondTag(firstTag: Tag, secondTag: Tag) {
        const firstTagTime = this.tagTimeMap.get(firstTag)!;
        const secondTagTime = this.tagTimeMap.get(secondTag)!;
        return firstTagTime > secondTagTime;
    }

    private executeStore(storeBuffer: StoreBuffer) {
        const { address, v } = storeBuffer;
        this.dataCache.write(address!, v!);
    }

    private executeLoad(loadBuffer: LoadBuffer) {
        const { address } = loadBuffer!;
        return this.dataCache.read(address!);
    }
}

export default ExecuteHandler;
