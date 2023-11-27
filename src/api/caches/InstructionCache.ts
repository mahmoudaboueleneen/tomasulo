import RegisterInfo from "../../interfaces/RegisterInfo";

class InstructionCache {
    private instructions: string[];
    private PCRegister: RegisterInfo;
    private codeLabelAddressPair: Map<string, number>;

    constructor(instructions: string[], PCRegister: RegisterInfo) {
        this.instructions = instructions;
        this.PCRegister = PCRegister;
        this.codeLabelAddressPair = new Map();
        this.loadCodeLabelAddressPair();
    }

    private loadCodeLabelAddressPair() {
        this.instructions.forEach((instruction, index) => {
            const label = instruction.split(":")[0].trim();
            if (label) {
                this.codeLabelAddressPair.set(label, index);
            }
        });
    }

    public getInstructionAddress(label: string): number {
        const address = this.codeLabelAddressPair.get(label);
        if (!address) {
            throw new Error(`Invalid label ${label}`);
        }
        return address;
    }

    fetch(): string | null {
        return this.instructions[this.PCRegister.content++] || null;
    }
}

export default InstructionCache;
