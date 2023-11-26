// TODO: ensef el bta3 da
class RegisterFile {
    private registers: Map<string, number>;

    constructor() {
        this.registers = new Map<string, number>();
    }

    read(register: string): number {
        return this.registers.get(register) || 0;
    }

    write(register: string, value: number): void {
        this.registers.set(register, value);
    }
}

export default RegisterFile;
