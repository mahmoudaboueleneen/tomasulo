class InstructionQueue {
    private instructions: string[];

    constructor() {
        this.instructions = [];
    }

    enqueue(instruction: string): void {
        this.instructions.push(instruction);
    }

    dequeue(): string | null {
        return this.instructions.shift() || null;
    }
}

export default InstructionQueue;
