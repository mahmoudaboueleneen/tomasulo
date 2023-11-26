class InstructionCache {
    private instructions: string[];

    constructor(instructions: string[]) {
        this.instructions = instructions;
    }

    fetch(): string | null {
        return this.instructions.shift() || null;
    }
}

export default InstructionCache;
