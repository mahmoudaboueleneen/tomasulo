import StoreBuffer from "../../buffers/StoreBuffer";
import CommonDataBus from "../../CommonDataBus";
import RegisterFile from "../../RegisterFile";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";

class UpdateHandler {
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private storeBuffers: StoreBuffer[];
    private registerFile: RegisterFile;
    private commonDataBus: CommonDataBus;

    constructor(
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        storeBuffers: StoreBuffer[],
        registerFile: RegisterFile,
        commonDataBus: CommonDataBus
    ) {
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
        this.storeBuffers = storeBuffers;
        this.registerFile = registerFile;
        this.commonDataBus = commonDataBus;
    }

    public handleUpdating() {
        if (!this.commonDataBus.containsData()) {
            return;
        }
        this.updateAddSubReservationStations();
        this.updateMulDivReservationStations();
        this.updateStoreBuffers();
        this.updateRegisterFile();

        this.commonDataBus.clear();
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
