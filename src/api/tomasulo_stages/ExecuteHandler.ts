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
    private tagTimeMap: Map<Tag, number>;
    private finishedTagValuePairs: TagValuePair[];

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        tagTimeMap: Map<Tag, number>,
        finishedTagValuePairs: TagValuePair[]
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.tagTimeMap = tagTimeMap;
        this.finishedTagValuePairs = finishedTagValuePairs;
    }

    public handleExecuting() {
        this.decrementCyclesLeftForRunningStations();
        this.decrementCyclesLeftForRunningBuffers();
    }

    private decrementCyclesLeftForRunningStations() {
        this.addSubReservationStations.forEach((station) => {
            if (station.canExecute()) {
                station.decrementCyclesLeft();

                if (station.isFinished()) {
                    const computedValue = this.executeAddSubArithmetic(station);
                    this.addToFinishedTagValuePairs(station.tag, computedValue);
                }
            }
        });

        this.mulDivReservationStations.forEach((station) => {
            if (station.canExecute()) {
                station.decrementCyclesLeft();

                if (station.isFinished()) {
                    const computedValue = this.executeMulDivArithmetic(station);
                    this.addToFinishedTagValuePairs(station.tag, computedValue);
                }
            }
        });
    }

    private decrementCyclesLeftForRunningBuffers() {
        // We assume loads are favored over stores if both are ready to execute at the same time.

        this.loadBuffers.forEach((buffer) => {
            if (buffer.canExecute() && !this.dataCache.isBusy()) {
                this.dataCache.setRunningBufferTag(buffer.tag);
            } else if (buffer.canExecute() && this.dataCache.isFilledWithTag(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    const readValue = this.executeLoad(buffer);
                    this.addToFinishedTagValuePairs(buffer.tag, readValue);
                }
            }
        });

        this.storeBuffers.forEach((buffer) => {
            if (buffer.canExecute() && !this.dataCache.isBusy()) {
                this.dataCache.setRunningBufferTag(buffer.tag);
            } else if (buffer.canExecute() && this.dataCache.isFilledWithTag(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    this.executeStore(buffer);
                }
            }
        });
    }

    // TODO: Review this method and its helper and maybe implement a more efficient solution
    private addToFinishedTagValuePairs(newTag: Tag, newValue: number) {
        const newPair: TagValuePair = { tag: newTag, value: newValue };

        const pairsIssuedBeforeOrAtSameTime = this.finishedTagValuePairs.filter(
            (pair) => !this.isExistingTagIssuedAfterNewTag(pair.tag, newTag)
        );

        const pairsIssuedAfter = this.finishedTagValuePairs.filter((pair) =>
            this.isExistingTagIssuedAfterNewTag(pair.tag, newTag)
        );

        this.finishedTagValuePairs = pairsIssuedBeforeOrAtSameTime.concat(newPair).concat(pairsIssuedAfter);
    }

    private isExistingTagIssuedAfterNewTag(existingTag: Tag, newTag: Tag) {
        const existingTagTime = this.tagTimeMap.get(existingTag)!;
        const newTagTime = this.tagTimeMap.get(newTag)!;
        return existingTagTime > newTagTime;
    }

    private executeStore(storeBuffer: StoreBuffer) {
        const { address, v } = storeBuffer;
        this.dataCache.write(address!, v!);
    }

    private executeLoad(loadBuffer: LoadBuffer) {
        const { address } = loadBuffer!;
        return this.dataCache.read(address!);
    }

    private executeAddSubArithmetic(station: ReservationStation) {
        const { op, vj, vk } = station;
        return this.UseALU(op!, vj, vk); // TODO: Replace with a method from FPAdder class
    }

    private executeMulDivArithmetic(station: ReservationStation) {
        const { op, vj, vk } = station;
        return this.UseALU(op!, vj, vk); // TODO: Replace with a method from FPMultiplier class
    }

    // TODO: Remove this method once we have the methods for FPAdder and FPMultiplier classes
    private UseALU(operation: InstructionOperation, vj: V, vk: V): number {
        return 0;
    }
}

export default ExecuteHandler;
