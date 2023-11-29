class InstructionQueue {
    private instructions: string[];

    constructor(instructions?: string[]) {
        this.instructions = instructions || [];
    }
    clone(): InstructionQueue {
        return new InstructionQueue([...this.instructions]);
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

    isEmpty(): boolean {
        return this.instructions.length === 0;
    }
}

export default InstructionQueue;
