import RegisterInfo from "../interfaces/Register";
import Q from "../types/Q";

class RegisterFile {
    private registers: Map<string, RegisterInfo>;

    constructor() {
        this.registers = new Map<string, RegisterInfo>();
        this.initializeRegisters();
    }
    private initializeRegisters() {
        this.loadIntegerValueRegisters();
        this.loadFloatingPointRegisters();
    }

    private loadFloatingPointRegisters() {
        for (let i = 0; i < 32; i++) {
            this.registers.set(`F${i}`, {
                content: 0,
                qi: 0
            });
        }
    }

    private loadIntegerValueRegisters() {
        for (let i = 0; i < 32; i++) {
            this.registers.set(`R${i}`, {
                content: 0,
                qi: 0
            });
        }
    }

    readContent(register: string): number {
        return this.registers.get(register)!.content;
    }
    readQi(register: string): Q {
        return this.registers.get(register)!.qi!;
    }

    writeContent(register: string, content: number): void {
        this.registers.get(register)!.content = content;
    }
    writeTag(register: string, tag: Tag): void {
        this.registers.get(register)!.qi = tag;
    }
}

export default RegisterFile;
