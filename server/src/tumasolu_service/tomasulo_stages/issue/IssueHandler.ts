import IssuedInstructionDestination from "../../../types/enums/IssuedInstructionDestination";
import {
    StoreType,
    LoadType,
    RType,
    BranchType,
    IType
} from "../../../interfaces/decoded_instruction_operation_categories";
import InstructionOperationCategory from "../../../types/InstructionOperationCategory";
import getIssuedInstructionDestination from "../../../utils/getIssuedInstructionDestination";
import InstructionQueue from "../../misc/InstructionQueue";
import RegisterFile from "../../misc/RegisterFile";
import LoadBuffer from "../../buffers/LoadBuffer";
import StoreBuffer from "../../buffers/StoreBuffer";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";
import InstructionOperation from "../../../types/InstructionOperation";
import DecodeHandler from "./DecodeHandler";
import InstructionCache from "../../caches/InstructionCache";
import Tag from "../../../types/Tag";

class IssueHandler {
    private decodeHandler: DecodeHandler;

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
        instructionCache: InstructionCache,
        instructionQueue: InstructionQueue,
        currentClockCycle: number,
        tagTimeMap: Map<Tag, number>,
        storeBuffers: StoreBuffer[],
        registerFile: RegisterFile,
        loadBuffers: LoadBuffer[],
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[]
    ) {
        this.decodeHandler = new DecodeHandler(instructionCache);
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

        this.instructionDecoded = this.decodeHandler.decodeInstruction(peekInstruction);

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
            return;
        }

        const storeInstruction = this.instructionDecoded as StoreType;
        freeBuffer.loadInstructionIntoBuffer(storeInstruction.Address);
        freeBuffer.setCyclesLeft(2); // TODO: GET ACTUAL INITIAL CYCLES LEFT FROM THE MAP!!!!!!!!

        this.handleSettingVOrQInFreeSpot(freeBuffer, "v", "q", storeInstruction.Src);
    }

    private handleLoadInstruction() {
        const freeBuffer = this.loadBuffers.find((buffer) => buffer.busy === 0);

        if (!freeBuffer) {
            return;
        }

        const loadInstruction = this.instructionDecoded as LoadType;

        if (this.isAnyStoreIssuedForAddress(loadInstruction.Address)) {
            return;
        }

        freeBuffer.loadInstructionIntoBuffer(loadInstruction.Address);
        freeBuffer.setCyclesLeft(2); // TODO: GET ACTUAL INITIAL CYCLES LEFT FROM THE MAP!!!!!!!!

        this.registerFile.writeTag(loadInstruction.Dest, freeBuffer.tag);

        this.tagTimeMap.set(freeBuffer.tag, this.currentClockCycle);
    }
    private isAnyStoreIssuedForAddress(address: number) {
        return this.storeBuffers.some((buffer) => buffer.address === address && buffer.busy === 1);
    }

    private handleMulDivInstruction() {
        const freeStation = this.mulDivReservationStations.find((station) => station.busy === 0);

        if (!freeStation) {
            return;
        }

        const mulDivInstruction = this.instructionDecoded as RType;
        freeStation.loadInstructionIntoStation(mulDivInstruction.Op as InstructionOperation);

        freeStation.setCyclesLeft(10); // TODO: GET ACTUAL INITIAL CYCLES LEFT FROM THE MAP!!!!!!!!

        switch (freeStation.op) {
            case "DIV.D":
                freeStation.setCyclesLeft(40);
                break;
            case "MUL.D":
                freeStation.setCyclesLeft(10);
                break;
            default:
                throw new Error("Invalid operation");
        }

        this.tagTimeMap.set(freeStation.tag, this.currentClockCycle);

        this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", mulDivInstruction.Src1);
        this.handleSettingVOrQInFreeSpot(freeStation, "vk", "qk", mulDivInstruction.Src2);

        this.registerFile.writeTag(mulDivInstruction.Dest, freeStation.tag);
    }

    private handleAddSubInstruction() {
        const freeStation = this.addSubReservationStations.find((station) => station.busy === 0);

        if (!freeStation) {
            return;
        }

        freeStation.loadInstructionIntoStation(this.instructionDecoded!.Op as InstructionOperation);
        freeStation.setCyclesLeft(2); // TODO: GET ACTUAL INITIAL CYCLES LEFT FROM THE MAP!!!!!!!!

        this.tagTimeMap.set(freeStation.tag, this.currentClockCycle);

        if (this.isBNEZInstruction(this.instructionDecoded!)) {
            const branchInstruction = this.instructionDecoded as BranchType;
            this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", branchInstruction.Operand);
            freeStation.A = branchInstruction.BranchAddress;
            return;
        }

        const addSubInstruction = this.instructionDecoded as RType | IType;

        if (this.isIType(addSubInstruction)) {
            const ImmediateInstruction = addSubInstruction as IType;
            this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", ImmediateInstruction.Src);
            freeStation.vk = ImmediateInstruction.Immediate;
            return;
        }

        const RInstruction = addSubInstruction as RType;
        this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", RInstruction.Src1);
        this.handleSettingVOrQInFreeSpot(freeStation, "vk", "qk", RInstruction.Src2);

        this.registerFile.writeTag(addSubInstruction.Dest, freeStation.tag);
    }

    private handleSettingVOrQInFreeSpot(
        freeSpot: any,
        VField: "vj" | "vk" | "v",
        QField: "qj" | "qk" | "q",
        operand: string
    ) {
        if (this.registerFile.readQi(operand) === 0) {
            freeSpot[VField] = this.registerFile.readContent(operand);
        } else {
            freeSpot[QField] = this.registerFile.readQi(operand);
        }
    }

    private isBNEZInstruction(instructionDecoded: InstructionOperationCategory) {
        return (instructionDecoded as BranchType).Op === "BNEZ";
    }

    private isIType(instructionDecoded: InstructionOperationCategory) {
        return (instructionDecoded as IType).Immediate !== undefined;
    }
}

export default IssueHandler;