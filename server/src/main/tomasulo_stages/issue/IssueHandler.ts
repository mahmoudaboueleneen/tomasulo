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
import ExecutionSummaryTable from "../../ExecutionSummaryTable";

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

    private tagsToBeCleared: Tag[];

    private executionSummaryTable: ExecutionSummaryTable;
    private currentIterationInCode: number | null;

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
        BranchNotEqualZeroLatency: number,
        tagsToBeCleared: Tag[],
        executionSummaryTable: ExecutionSummaryTable,
        currentIterationInCode: number | null
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
        this.tagsToBeCleared = tagsToBeCleared;
        this.executionSummaryTable = executionSummaryTable;
        this.currentIterationInCode = currentIterationInCode;
    }

    public handleIssuing() {
        const peekInstruction = this.instructionQueue.peek();

        if (!peekInstruction) {
            return;
        }

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

        if (
            this.isAnyLoadIssuedForAddress(storeInstruction.Address) ||
            this.isAnyStoreIssuedForAddress(storeInstruction.Address)
        ) {
            return;
        }

        freeBuffer.loadInstructionIntoBuffer(storeInstruction.Address);

        freeBuffer.setCyclesLeft(this.StoreLatency);

        this.handleSettingVOrQInFreeSpot(freeBuffer, "v", "q", storeInstruction.Src);

        this.instructionQueue.dequeue();

        this.recordIssuingStoreInstructionInSummaryTable(storeInstruction, freeBuffer);
    }
    private recordIssuingStoreInstructionInSummaryTable(storeInstruction: StoreType, freeBuffer: StoreBuffer) {
        this.executionSummaryTable.addNewIssuedInstruction({
            iteration: this.currentIterationInCode,
            operation: storeInstruction.Op as InstructionOperation,
            tag: freeBuffer.tag,
            issuingClockCycle: this.currentClockCycle,
            firstOperandRegister: storeInstruction.Src,
            address: storeInstruction.Address
        });
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

        this.instructionQueue.dequeue();

        this.recordIssuingLoadInstructionInSummaryTable(loadInstruction, freeBuffer);
    }
    private recordIssuingLoadInstructionInSummaryTable(loadInstruction: LoadType, freeBuffer: LoadBuffer) {
        this.executionSummaryTable.addNewIssuedInstruction({
            iteration: this.currentIterationInCode,
            operation: loadInstruction.Op as InstructionOperation,
            tag: freeBuffer.tag,
            issuingClockCycle: this.currentClockCycle,
            destinationRegister: loadInstruction.Dest,
            address: loadInstruction.Address
        });
    }

    private isAnyStoreIssuedForAddress(address: number) {
        const existingStoreTag = this.storeBuffers.find(
            (buffer) => buffer.address === address && buffer.busy === 1
        )?.tag;
        return existingStoreTag && !this.tagsToBeCleared.includes(existingStoreTag);
    }
    private isAnyLoadIssuedForAddress(address: number) {
        const existingLoadTag = this.loadBuffers.find((buffer) => buffer.address === address && buffer.busy === 1)?.tag;
        return existingLoadTag && !this.tagsToBeCleared.includes(existingLoadTag);
    }

    private handleMulDivInstruction() {
        const freeStation = this.mulDivReservationStations.find((station) => station.busy === 0);

        if (!freeStation) {
            return;
        }

        const mulDivInstruction = this.instructionDecoded as RType;

        freeStation.loadInstructionIntoStation(mulDivInstruction.Op as InstructionOperation);

        setCyclesLeftForStation(this, freeStation);

        this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", mulDivInstruction.Src1);
        this.handleSettingVOrQInFreeSpot(freeStation, "vk", "qk", mulDivInstruction.Src2);

        this.registerFile.writeTag(mulDivInstruction.Dest, freeStation.tag);

        this.instructionQueue.dequeue();

        this.recordIssuingRTypeInstructionInSummaryTable(mulDivInstruction, freeStation, mulDivInstruction);

        function setCyclesLeftForStation(issueHandler: IssueHandler, freeStation: MulDivReservationStation) {
            if (MulInstructions.has(mulDivInstruction.Op)) {
                freeStation.setCyclesLeft(issueHandler.FPMultiplyLatency);
            } else {
                freeStation.setCyclesLeft(issueHandler.FPDivideLatency);
            }

            issueHandler.tagTimeMap.set(freeStation.tag, issueHandler.currentClockCycle);
        }
    }

    private handleAddSubInstruction() {
        const freeStation = this.addSubReservationStations.find((station) => station.busy === 0);
        if (!freeStation) {
            return;
        }

        freeStation.loadInstructionIntoStation(this.instructionDecoded!.Op as InstructionOperation);

        setCyclesLeftForStation(this, freeStation);

        if (this.isBNEZInstruction(this.instructionDecoded!)) {
            const branchInstruction = this.instructionDecoded as BranchType;
            this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", branchInstruction.Operand);
            freeStation.A = branchInstruction.BranchAddress;
            this.instructionQueue.dequeue();

            this.recordIssuingBNEZInstructionInSummaryTable(branchInstruction, freeStation);
            return;
        }

        const addSubInstruction = this.instructionDecoded as RType | IType;

        if (this.isIType(addSubInstruction)) {
            const ImmediateInstruction = addSubInstruction as IType;
            this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", ImmediateInstruction.Src);
            freeStation.vk = ImmediateInstruction.Immediate;
            this.registerFile.writeTag(addSubInstruction.Dest, freeStation.tag);
            this.instructionQueue.dequeue();

            this.recordIssuingITypeInstructionInSummaryTable(ImmediateInstruction, freeStation, ImmediateInstruction);
            return;
        }

        const RInstruction = addSubInstruction as RType;

        this.handleSettingVOrQInFreeSpot(freeStation, "vj", "qj", RInstruction.Src1);

        this.handleSettingVOrQInFreeSpot(freeStation, "vk", "qk", RInstruction.Src2);

        this.registerFile.writeTag(addSubInstruction.Dest, freeStation.tag);

        this.instructionQueue.dequeue();

        this.recordIssuingRTypeInstructionInSummaryTable(RInstruction, freeStation, RInstruction);

        function setCyclesLeftForStation(issueHandler: IssueHandler, freeStation: AddSubReservationStation) {
            if (FPAddInstructions.has(issueHandler.instructionDecoded!.Op)) {
                freeStation.setCyclesLeft(issueHandler.FPAddLatency);
            } else if (FPSubInstructions.has(issueHandler.instructionDecoded!.Op)) {
                freeStation.setCyclesLeft(issueHandler.FPSubtractLatency);
            } else if (AddImmediateInstructions.has(issueHandler.instructionDecoded!.Op)) {
                freeStation.setCyclesLeft(issueHandler.IntAddLatency);
            } else if (SubImmediateInstructions.has(issueHandler.instructionDecoded!.Op)) {
                freeStation.setCyclesLeft(issueHandler.IntSubtractLatency);
            } else if (BranchInstructions.has(issueHandler.instructionDecoded!.Op)) {
                freeStation.setCyclesLeft(issueHandler.BranchNotEqualZeroLatency);
            }

            issueHandler.tagTimeMap.set(freeStation.tag, issueHandler.currentClockCycle);
        }
    }

    private recordIssuingBNEZInstructionInSummaryTable(
        branchInstruction: BranchType,
        freeStation: AddSubReservationStation
    ) {
        this.executionSummaryTable.addNewIssuedInstruction({
            iteration: this.currentIterationInCode,
            operation: branchInstruction.Op as InstructionOperation,
            tag: freeStation.tag,
            issuingClockCycle: this.currentClockCycle,
            firstOperandRegister: branchInstruction.Operand,
            address: branchInstruction.BranchAddress
        });
    }

    private recordIssuingITypeInstructionInSummaryTable(
        ImmediateInstruction: IType,
        freeStation: AddSubReservationStation,
        addSubInstruction: IType
    ) {
        this.executionSummaryTable.addNewIssuedInstruction({
            iteration: this.currentIterationInCode,
            operation: ImmediateInstruction.Op as InstructionOperation,
            tag: freeStation.tag,
            issuingClockCycle: this.currentClockCycle,
            destinationRegister: addSubInstruction.Dest,
            firstOperandRegister: ImmediateInstruction.Src,
            secondOperand: ImmediateInstruction.Immediate
        });
    }

    private recordIssuingRTypeInstructionInSummaryTable(
        RInstruction: RType,
        freeStation: AddSubReservationStation | MulDivReservationStation,
        addSubInstruction: RType
    ) {
        this.executionSummaryTable.addNewIssuedInstruction({
            iteration: this.currentIterationInCode,
            operation: RInstruction.Op as InstructionOperation,
            tag: freeStation.tag,
            issuingClockCycle: this.currentClockCycle,
            destinationRegister: addSubInstruction.Dest,
            firstOperandRegister: RInstruction.Src1,
            secondOperand: RInstruction.Src2
        });
    }

    private handleSettingVOrQInFreeSpot(
        freeSpot: any,
        VField: "vj" | "vk" | "v",
        QField: "qj" | "qk" | "q",
        operand: string
    ) {
        if (this.registerFile.readQi(operand) === 0 || this.registerFile.readQi(operand) === null) {
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
