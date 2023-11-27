import IssuedInstructionDestination from "../../enums/IssuedInstructionDestination";
import { StoreType, LoadType, RType } from "../../interfaces/instructionOperationType";
import InstructionOperationCategory from "../../types/InstructionOperationCategory";
import decodeInstruction from "../../utils/decode";
import getIssuedInstructionDestination from "../../utils/getIssuedInstructionDestination";
import InstructionQueue from "../InstructionQueue";
import RegisterFile from "../RegisterFile";
import LoadBuffer from "../buffers/LoadBuffer";
import StoreBuffer from "../buffers/StoreBuffer";
import AddSubReservationStation from "../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../reservation_stations/MulDivReservationStation";

class IssueHandler {
    private instructionQueue: InstructionQueue;
    private issuedInstructionDestination: IssuedInstructionDestination | null;
    private instructionDecoded: InstructionOperationCategory | null;
    private currentClockCycle: number;
    private tagTimeMap: Map<Tag, number>;
    private storeBuffers: StoreBuffer[];
    private registerFile: RegisterFile;
    private loadBuffers: LoadBuffer[];
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];

    constructor(
        instructionQueue: InstructionQueue,
        currentClockCycle: number,
        tagTimeMap: Map<Tag, number>,
        storeBuffers: StoreBuffer[],
        registerFile: RegisterFile,
        loadBuffers: LoadBuffer[],
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[]
    ) {
        this.instructionQueue = instructionQueue;
        this.instructionDecoded = null;
        this.issuedInstructionDestination = null;
        this.currentClockCycle = currentClockCycle;
        this.tagTimeMap = tagTimeMap;
        this.storeBuffers = storeBuffers;
        this.registerFile = registerFile;
        this.loadBuffers = loadBuffers;
        this.addSubReservationStations = addSubReservationStations;
        this.mulDivReservationStations = mulDivReservationStations;
    }

    public handleIssuing() {
        const peekInstruction = this.instructionQueue.peek();
        if (!peekInstruction) {
            return;
        }
        this.instructionQueue.dequeue();

        this.instructionDecoded = decodeInstruction(peekInstruction);
        this.issuedInstructionDestination = getIssuedInstructionDestination(
            this.instructionDecoded.Op as InstructionOperation
        );
        switch (this.issuedInstructionDestination) {
            case IssuedInstructionDestination.ADD_SUB: {
                this.handleAddSubInstruction();
                break;
            }
            case IssuedInstructionDestination.MUL_DIV: {
                this.handleMulDivInstruction();
                break;
            }
            case IssuedInstructionDestination.LOAD_BUFFER: {
                this.handleLoadInstruction();
                break;
            }
            case IssuedInstructionDestination.STORE_BUFFER: {
                this.handleStoreInstruction();
                break;
            }
            default: {
                throw new Error("Invalid issued instruction destination");
            }
        }
    }

    private handleStoreInstruction() {
        const freeBuffer = this.storeBuffers.find((buffer) => buffer.busy === 0);
        if (!freeBuffer) {
            //TODO: stall
            return;
        }
        const storeInstruction = this.instructionDecoded as StoreType;
        freeBuffer.loadInstructionIntoBuffer(storeInstruction.Address);

        if (this.registerFile.readQi(storeInstruction.Src) === 0) {
            freeBuffer.v = this.registerFile.readContent(storeInstruction.Src);
        } else {
            freeBuffer.q = this.registerFile.readQi(storeInstruction.Src);
        }
    }

    private handleLoadInstruction() {
        const freeBuffer = this.loadBuffers.find((buffer) => buffer.busy === 0);
        if (!freeBuffer) {
            //TODO: stall
            return;
        }

        const loadInstruction = this.instructionDecoded as LoadType;
        if (this.isAnyStoreIssuedForAddress(loadInstruction.Address)) {
            //TODO: stall
            return;
        }

        freeBuffer.loadInstructionIntoBuffer(loadInstruction.Address);

        this.registerFile.writeTag(loadInstruction.Dest, freeBuffer.tag);

        this.tagTimeMap.set(freeBuffer.tag, this.currentClockCycle);
    }
    private isAnyStoreIssuedForAddress(address: number) {
        return this.storeBuffers.some((buffer) => buffer.address === address && buffer.busy === 1);
    }

    private handleMulDivInstruction() {
        const freeStation = this.mulDivReservationStations.find((station) => station.busy === 0);
        if (!freeStation) {
            //TODO: stall
            return;
        }

        const mulDivInstruction = this.instructionDecoded as RType;
        freeStation.loadInstructionIntoStation(mulDivInstruction.Op as InstructionOperation);

        this.registerFile.writeTag(mulDivInstruction.Dest, freeStation.tag);

        this.tagTimeMap.set(freeStation.tag, this.currentClockCycle);

        if (this.registerFile.readQi(mulDivInstruction.Src1) === 0) {
            freeStation.vj = this.registerFile.readContent(mulDivInstruction.Src1);
        } else {
            freeStation.qj = this.registerFile.readQi(mulDivInstruction.Src1);
        }
        if (this.registerFile.readQi(mulDivInstruction.Src2) === 0) {
            freeStation.vk = this.registerFile.readContent(mulDivInstruction.Src2);
        } else {
            freeStation.qk = this.registerFile.readQi(mulDivInstruction.Src2);
        }
    }

    private handleAddSubInstruction() {
        const freeStation = this.addSubReservationStations.find((station) => station.busy === 0);
        if (!freeStation) {
            //TODO: stall
            return;
        }
        freeStation.loadInstructionIntoStation(this.instructionDecoded!.Op as InstructionOperation);
        if (!this.isRType(this.instructionDecoded!)) {
            return;
        }

        const addSubInstruction = this.instructionDecoded as RType;
        this.registerFile.writeTag(addSubInstruction.Dest, freeStation.tag);

        this.tagTimeMap.set(freeStation.tag, this.currentClockCycle);

        if (this.registerFile.readQi(addSubInstruction.Src1) === 0) {
            freeStation.vj = this.registerFile.readContent(addSubInstruction.Src1);
        } else {
            freeStation.qj = this.registerFile.readQi(addSubInstruction.Src1);
        }
        if (this.registerFile.readQi(addSubInstruction.Src2) === 0) {
            freeStation.vk = this.registerFile.readContent(addSubInstruction.Src2);
        } else {
            freeStation.qk = this.registerFile.readQi(addSubInstruction.Src2);
        }
    }
    private isRType(instructionDecoded: InstructionOperationCategory) {
        return (instructionDecoded as RType).Dest !== undefined;
    }
}

export default IssueHandler;
