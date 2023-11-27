import {
    ImmediateInstructions,
    RInstructions,
    LoadInstructions,
    BranchInstructions
} from "../../../constants/SupportedInstructions";
import { StoreBufferInstructions } from "../../../constants/SupportedInstructionsPerStationOrBuffer";
import {
    BranchType,
    StoreType,
    LoadType,
    IType,
    RType
} from "../../../interfaces/decoded_instruction_operation_categories";
import InstructionType from "../../../types/enums/InstructionType";
import removeLastSymbol from "../../../utils/removeLastSymbol";
import InstructionCache from "../../caches/InstructionCache";

class DecodeHandler {
    private instructionCache: InstructionCache;
    constructor(instructionCache: InstructionCache) {
        this.instructionCache = instructionCache;
    }

    public decodeInstruction(instruction: string) {
        const words = instruction.split(" ");

        let label: string | undefined;
        if (this.isALabel(words[0])) {
            label = removeLastSymbol(words.shift()!.trim());
        }

        const type = this.getInstructionType(words[0]);

        switch (type) {
            case InstructionType.R: {
                return this.getDecodedRTypeInstruction(label, words);
            }
            case InstructionType.I: {
                return this.getDecodedITypeInstruction(label, words);
            }
            case InstructionType.LOAD: {
                return this.getDecodedLoadInstruction(label, words);
            }
            case InstructionType.STORE: {
                return this.getDecodedStoreInstruction(label, words);
            }
            case InstructionType.BNEZ: {
                return this.getDecodedBranchInstruction(label, words);
            }
            default:
                throw new Error("Invalid instruction type");
        }
    }

    private getInstructionType(op: string): InstructionType | null {
        if (ImmediateInstructions.has(op)) {
            return InstructionType.I;
        }
        if (RInstructions.has(op)) {
            return InstructionType.R;
        }
        if (LoadInstructions.has(op)) {
            return InstructionType.LOAD;
        }
        if (StoreBufferInstructions.has(op)) {
            return InstructionType.STORE;
        }
        if (BranchInstructions.has(op)) {
            return InstructionType.BNEZ;
        }
        return null;
    }

    private getDecodedBranchInstruction(label: string | undefined, words: string[]): BranchType {
        return {
            Label: label,
            Op: words[0].trim(),
            Operand: removeLastSymbol(words[1].trim()),
            BranchAddress: this.instructionCache.getInstructionAddress(words[2].trim())
        };
    }

    private getDecodedStoreInstruction(label: string | undefined, words: string[]): StoreType {
        return {
            Label: label,
            Op: words[0].trim(),
            Src: removeLastSymbol(words[1].trim()),
            Address: Number(words[2])
        };
    }

    private getDecodedLoadInstruction(label: string | undefined, words: string[]): LoadType {
        return {
            Label: label,
            Op: words[0].trim(),
            Dest: removeLastSymbol(words[1].trim()),
            Address: Number(words[2].trim())
        };
    }

    private getDecodedITypeInstruction(label: string | undefined, words: string[]): IType {
        return {
            Label: label,
            Op: words[0].trim(),
            Dest: removeLastSymbol(words[1].trim()),
            Src: removeLastSymbol(words[2].trim()),
            Immediate: Number(words[3])
        };
    }

    private getDecodedRTypeInstruction(label: string | undefined, words: string[]): RType {
        return {
            Label: label,
            Op: words[0].trim(),
            Dest: removeLastSymbol(words[1].trim()),
            Src1: removeLastSymbol(words[2].trim()),
            Src2: words[3]
        };
    }

    private isALabel(word: string) {
        return word.trim().endsWith(":");
    }
}

export default DecodeHandler;
