import IssuedInstructionDestination from "../../../types/enums/IssuedInstructionDestination";
import { StoreType, LoadType, RType, BranchType, IType } from "../../../interfaces/op_categories";
import InstructionOperationCategory from "../../../types/InstructionOperationCategory";
import InstructionQueue from "../../InstructionQueue";
import RegisterFile from "../../RegisterFile";
import LoadBuffer from "../../buffers/LoadBuffer";
import StoreBuffer from "../../buffers/StoreBuffer";
import AddSubReservationStation from "../../reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "../../reservation_stations/MulDivReservationStation";
import InstructionOperation from "../../../types/InstructionOperation";
import DecodeHandler from "./DecodeHandler";
import InstructionCache from "../../caches/InstructionCache";
import Tag from "../../../types/Tag";
import getIssuedInstructionDestination from "../../../utils/getIssuedInstructionDestination";
import {
    AddImmediateInstructions,
    BranchInstructions,
    FPAddInstructions,
    FPSubInstructions,
    MulInstructions,
    SubImmediateInstructions
} from "../../../constants/SupportedInstructions";

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

    private FPAddLatency: number;
    private FPSubtractLatency: number;
    private FPMultiplyLatency: number;
    private FPDivideLatency: number;
    private IntSubtractLatency: number;
    private LoadLatency: number;
    private StoreLatency: number;
    private IntAddLatency: number;
    private BranchNotEqualZeroLatency: number;

    constructor(
        instructionCache: InstructionCache,
        instructionQueue: InstructionQueue,
        currentClockCycle: number,
        tagTimeMap: Map<Tag, number>,
        storeBuffers: StoreBuffer[],
        registerFile: RegisterFile,
        loadBuffers: LoadBuffer[],
        addSubReservationStations: AddSubReservationStation[],
        mulDivReservationStations: MulDivReservationStation[],
        FPAddLatency: number,
        FPSubtractLatency: number,
        FPMultiplyLatency: number,
        FPDivideLatency: number,
        IntSubtractLatency: number,
        LoadLatency: number,
        StoreLatency: number,
        IntAddLatency: number,
        BranchNotEqualZeroLatency: number
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
        this.FPAddLatency = FPAddLatency;
        this.FPSubtractLatency = FPSubtractLatency;
        this.FPMultiplyLatency = FPMultiplyLatency;
        this.FPDivideLatency = FPDivideLatency;
        this.IntSubtractLatency = IntSubtractLatency;
        this.LoadLatency = LoadLatency;
        this.StoreLatency = StoreLatency;
        this.IntAddLatency = IntAddLatency;
        this.BranchNotEqualZeroLatency = BranchNotEqualZeroLatency;
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

        freeBuffer.setCyclesLeft(this.StoreLatency);

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

        freeBuffer.setCyclesLeft(this.LoadLatency);

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

        if (MulInstructions.has(mulDivInstruction.Op)) {
            freeStation.setCyclesLeft(this.FPMultiplyLatency);
        } else {
            freeStation.setCyclesLeft(this.FPDivideLatency);
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

        if (FPAddInstructions.has(this.instructionDecoded!.Op)) {
            freeStation.setCyclesLeft(this.FPAddLatency);
        } else if (FPSubInstructions.has(this.instructionDecoded!.Op)) {
            freeStation.setCyclesLeft(this.FPSubtractLatency);
        } else if (AddImmediateInstructions.has(this.instructionDecoded!.Op)) {
            freeStation.setCyclesLeft(this.IntAddLatency);
        } else if (SubImmediateInstructions.has(this.instructionDecoded!.Op)) {
            freeStation.setCyclesLeft(this.IntSubtractLatency);
        } else if (BranchInstructions.has(this.instructionDecoded!.Op)) {
            freeStation.setCyclesLeft(this.BranchNotEqualZeroLatency);
        }

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
            this.registerFile.writeTag(addSubInstruction.Dest, freeStation.tag);
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
