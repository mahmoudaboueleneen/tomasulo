import { BranchInstructions } from "../../constants/SupportedInstructions";
import RegisterInfo from "../../interfaces/RegisterInfo";

class InstructionCache {
    private instructions: string[];
    private PCRegister: RegisterInfo;
    codeLabelAddressPairs: Map<string, number>;

    constructor(instructions: string[], PCRegister: RegisterInfo, codeLabelAddressPairs?: Map<string, number>) {
        this.instructions = instructions;
        this.PCRegister = PCRegister;

        if (codeLabelAddressPairs) {
            this.codeLabelAddressPairs = codeLabelAddressPairs;
        } else {
            this.codeLabelAddressPairs = new Map();
            this.loadCodeLabelAddressPairs();
        }
    }

    public clone(): InstructionCache {
        return new InstructionCache(
            [...this.instructions],
            { ...this.PCRegister },
            new Map(this.codeLabelAddressPairs)
        );
    }

    private loadCodeLabelAddressPairs() {
        this.instructions.forEach((instruction, address) => {
            const parts = instruction.split(":");

            if (parts.length > 1) {
                const label = instruction.split(":")[0].trim();

                if (label) {
                    this.codeLabelAddressPairs.set(label, address);
                }
            }
        });
    }

    areInstructionsHavingLoop(): boolean {
        for (const [label, labelAddress] of this.codeLabelAddressPairs) {
            for (let i = 0; i < this.instructions.length; i++) {
                const instruction = this.instructions[i];
                if (instruction.includes(label) && BranchInstructions.has(instruction.split(" ")[0])) {
                    const bnezAddress = i;
                    if (labelAddress < bnezAddress) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public getInstructionAddress(label: string): number {
        const address = this.codeLabelAddressPairs.get(label);

        if (address === undefined) {
            throw new Error(`Invalid label ${label}`);
        }

        return address;
    }

    public hasNonFetchedInstructions(): boolean {
        return this.PCRegister.content < this.instructions.length;
    }

    fetch(): string | null {
        if (!this.hasNonFetchedInstructions()) {
            return null;
        }
        return this.instructions[this.PCRegister.content++] || null;
    }
}

export default InstructionCache;
