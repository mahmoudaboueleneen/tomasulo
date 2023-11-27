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
                    this.executeArithmetic(station);
                }
            }
        });

        this.mulDivReservationStations.forEach((station) => {
            if (station.canExecute()) {
                station.decrementCyclesLeft();

                if (station.isFinished()) {
                    this.executeArithmetic(station);
                }
            }
        });
    }

    private decrementCyclesLeftForRunningBuffers() {
        this.loadBuffers.forEach((buffer) => {
            if (buffer.canExecute() && !this.dataCache.isBusy()) {
                this.dataCache.setRunningInstructionTag(buffer.tag);
            } else if (buffer.canExecute() && this.dataCache.isFilledWithTag(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    this.executeLoad(buffer);
                }
            }
        });

        this.storeBuffers.forEach((buffer) => {
            if (buffer.canExecute() && !this.dataCache.isBusy()) {
                this.dataCache.setRunningInstructionTag(buffer.tag);
            } else if (buffer.canExecute() && this.dataCache.isFilledWithTag(buffer.tag)) {
                buffer.decrementCyclesLeft();

                if (buffer.isFinished()) {
                    this.executeStore(buffer);
                }
            }
        });
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

    // TODO: Find out which Adder to go to
    private executeArithmetic(station: ReservationStation) {
        const { tag, op, vj, vk } = station;

        const computedValue = this.UseALU(op as InstructionOperation, vj, vk);
        this.commonDataBus.write(computedValue, station.tag!);
    }

    // TODO: We should have a ALU class and use instead of this function
    private UseALU(operation: InstructionOperation, vj: V, vk: V): number {
        // TODO: Handle ALU operations here.
        return 0;
    }
}

export default ExecuteHandler;
