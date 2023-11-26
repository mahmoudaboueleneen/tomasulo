import { RType, IType, LoadType, StoreType, BNEZType } from "../interfaces/instructionOperationType";

type InstructionOperationType = RType | IType | LoadType | StoreType | BNEZType;

export default InstructionOperationType;
