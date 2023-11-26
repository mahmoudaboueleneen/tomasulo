import InstructionType from "../enums/InstructionType";
import { RType, IType, LoadType, BNEZType, StoreType } from "../interfaces/InstructionOperationType";
import removeLastSymbol from "./removeLastSymbol";

// TODO: add support for all instructions (ensef)
function getInstructionType(op: string): InstructionType | null {
    switch (op) {
        case "ADD":
        case "SUB":
            return InstructionType.R;
        case "ADDI":
        case "SUBI":
            return InstructionType.I;
        case "LD":
            return InstructionType.LOAD;
        case "SD":
            return InstructionType.STORE;
        default:
            return null;
    }
}

function decodeInstruction(instruction: string) {
    // Split the instruction into parts
    const parts = instruction.split(" ");

    let label: string | undefined;
    const type = getInstructionType(removeLastSymbol(parts[0]));
    if (type === null) {
        label = removeLastSymbol(parts.shift()!);
    }

    switch (type) {
        case InstructionType.R: {
            const decoded: RType = {
                Label: label,
                Op: parts[0],
                Dest: removeLastSymbol(parts[1]),
                Src1: removeLastSymbol(parts[2]),
                Src2: parts[3]
            };
            return decoded;
        }
        case InstructionType.I: {
            const decoded: IType = {
                Label: label,
                Op: parts[0],
                Dest: removeLastSymbol(parts[1]),
                Src1: removeLastSymbol(parts[2]),
                Immediate: parts[3]
            };
            return decoded;
        }
        case InstructionType.LOAD: {
            const decoded: LoadType = {
                Label: label,
                Op: parts[0],
                Dest: removeLastSymbol(parts[1]),
                Address: Number(parts[2])
            };
            return decoded;
        }
        case InstructionType.STORE: {
            const decoded: StoreType = {
                Label: label,
                Op: parts[0],
                Src: removeLastSymbol(parts[1]),
                Address: Number(parts[2])
            };
            return decoded;
        }
        case InstructionType.BNEZ: {
            const decoded: BNEZType = {
                Label: label!,
                Op: parts[2]
            };
            return decoded;
        }
        default:
            throw new Error("Invalid instruction type");
    }
}

// add f1, f2, f3
// mul f1, f2, f3
// div f1, f2, f3
// loop: add f1, f2, f3

// addi f1, f2, 100
// loop: addi f1, f2, 100

// ld f1, 100
// sd f1, 100

// loop: ld f1, 100
// loop: sd f1, 100

// bnez f1, loop

export default decodeInstruction;
