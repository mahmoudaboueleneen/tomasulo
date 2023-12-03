import { RType, IType, LoadType, StoreType, BranchType } from "../interfaces/op_categories";

type InstructionOperationCategory = RType | IType | LoadType | StoreType | BranchType;

export default InstructionOperationCategory;
