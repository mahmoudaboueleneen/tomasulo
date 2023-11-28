import LoadBuffer from "../../buffers/LoadBuffer";
import StoreBuffer from "../../buffers/StoreBuffer";
import DataCache from "../../caches/DataCache";
import CommonDataBus from "../../misc/CommonDataBus";
import RegisterFile from "../../misc/RegisterFile";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";

class UpdateHandler {
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private dataCache: DataCache;
    private registerFile: RegisterFile;
    private commonDataBus: CommonDataBus;
    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        loadBuffers: LoadBuffer[],
        storeBuffers: StoreBuffer[],
        dataCache: DataCache,
        registerFile: RegisterFile,
        commonDataBus: CommonDataBus
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.loadBuffers = loadBuffers;
        this.storeBuffers = storeBuffers;
        this.dataCache = dataCache;
        this.registerFile = registerFile;
        this.commonDataBus = commonDataBus;
    }

    public handleUpdating() {
        this.updateAddSubReservationStations();
        this.updateMulDivReservationStations();
        this.updateStoreBuffers();
        this.updateRegisterFile();
    }

    private updateAddSubReservationStations() {
        const { tag: tagOnBus, value: valueOnBus } = this.commonDataBus.read();

        this.addSubReservationStations.forEach((station) => {
            station.update(tagOnBus, valueOnBus);
        });
    }

    private updateMulDivReservationStations() {
        const { tag: tagOnBus, value: valueOnBus } = this.commonDataBus.read();

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

export default UpdateHandler;
