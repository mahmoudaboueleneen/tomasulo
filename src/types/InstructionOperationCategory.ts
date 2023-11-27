import { RType, IType, LoadType, StoreType, BNEZType } from "../interfaces/decoded_instruction_operation_categories";

type InstructionOperationCategory = RType | IType | LoadType | StoreType | BNEZType;

export default InstructionOperationCategory;
