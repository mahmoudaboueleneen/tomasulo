import { RType, IType, LoadType, StoreType, BranchType } from "../interfaces/decoded_instruction_operation_categories";

type InstructionOperationCategory = RType | IType | LoadType | StoreType | BranchType;

export default InstructionOperationCategory;
