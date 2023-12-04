import AddNewIssuedInstructionToTableParams from "../types/AddNewIssuedInstructionToTableParams";
import SummaryTableRecord from "../types/SummaryTableRecord";
import Tag from "../types/Tag";

class ExecutionSummaryTable {
    private table: SummaryTableRecord[];

    constructor() {
        this.table = [];
    }

    addNewIssuedInstruction(params: AddNewIssuedInstructionToTableParams): void {
        const {
            iteration,
            tag,
            operation,
            issuingClockCycle,
            firstOperandRegister,
            destinationRegister,
            secondOperand,
            address
        } = params;
        this.table.push({
            iteration,
            instructionTag: tag,
            instructionOperation: operation,
            instructionDestinationRegister: destinationRegister || null,
            instructionFirstOperandRegister: firstOperandRegister || null,
            instructionSecondOperand: secondOperand !== undefined ? secondOperand : null,
            loadOrStoreInstructionAddress: address !== undefined ? address : null,
            issuingCycle: issuingClockCycle,
            executionRangeCycles: null,
            writeResultCycle: null
        });
    }

    isTagNotYetExecuting(tag: Tag) {
        const recordHavingTag = this.table.find((record) => record.instructionTag === tag);
        if (!recordHavingTag)
            throw new Error(`Record with tag ${tag} not found, cannot check if it is not yet executing`);
        return recordHavingTag.executionRangeCycles === null;
    }

    addExecutionStartingCycle(tag: Tag, from: number): void {
        const recordHavingTag = this.table.find((record) => record.instructionTag === tag);
        if (!recordHavingTag) throw new Error(`Record with tag ${tag} not found, cannot add execution starting cycle`);
        recordHavingTag.executionRangeCycles = { from, to: null };
    }

    addExecutionEndingCycle(tag: Tag, to: number): void {
        const recordHavingTag = this.table.find((record) => record.instructionTag === tag);
        if (!recordHavingTag) throw new Error(`Record with tag ${tag} not found, cannot add execution ending cycle`);
        if (!recordHavingTag.executionRangeCycles) throw new Error(`Record with tag ${tag} has no execution range`);
        recordHavingTag.executionRangeCycles.to = to;
    }

    addWriteResultCycle(tag: Tag, cycle: number): void {
        const recordHavingTag = this.table.find((record) => record.instructionTag === tag);
        if (!recordHavingTag) throw new Error(`Record with tag ${tag} not found, cannot add write result cycle`);
        recordHavingTag.writeResultCycle = cycle;
    }

    getTable(): SummaryTableRecord[] {
        return this.table;
    }
}

export default ExecutionSummaryTable;
