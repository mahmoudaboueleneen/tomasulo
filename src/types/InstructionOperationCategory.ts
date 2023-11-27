import { RType, IType, LoadType, StoreType, BNEZType } from "../interfaces/instructionOperationType";

type InstructionOperationCategory = RType | IType | LoadType | StoreType | BNEZType;

export default InstructionOperationCategory;
