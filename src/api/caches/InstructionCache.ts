import RegisterInfo from "../../interfaces/RegisterInfo";

class InstructionCache {
    private instructions: string[];
    private PCRegister: RegisterInfo;
    private codeLabelAddressPairs: Map<string, number>;

    constructor(instructions: string[], PCRegister: RegisterInfo) {
        this.instructions = instructions;
        this.PCRegister = PCRegister;
        this.codeLabelAddressPairs = new Map();
        this.loadCodeLabelAddressPairs();
    }

    private loadCodeLabelAddressPairs() {
        this.instructions.forEach((instruction, address) => {
            const label = instruction.split(":")[0].trim();
            if (label) {
                this.codeLabelAddressPairs.set(label, address);
            }
        });
    }

    public getInstructionAddress(label: string): number {
        const address = this.codeLabelAddressPairs.get(label);
        if (!address) {
            throw new Error(`Invalid label ${label}`);
        }
        return address;
    }

    public hasNonFetchedInstructions(): boolean {
        return this.PCRegister.content < this.instructions.length;
    }

    fetch(): string | null {
        return this.instructions[this.PCRegister.content++] || null;
    }
}

export default InstructionCache;
