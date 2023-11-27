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

    peek(): string | null {
        return this.instructions[0] || null;
    }
}

export default InstructionQueue;
