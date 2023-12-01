import RegisterInfo from "../interfaces/RegisterInfo";
import Q from "../types/Q";
import Tag from "../types/Tag";

class RegisterFile {
    private registers: Map<string, RegisterInfo>;

    constructor(registers?: Map<string, RegisterInfo>) {
        if (registers) {
            this.registers = registers;
        } else {
            this.registers = new Map<string, RegisterInfo>();
            this.initializeRegisters();
        }
    }

    clone(): RegisterFile {
        return new RegisterFile(new Map(this.registers));
    }

    private initializeRegisters() {
        this.loadIntegerValueRegisters();
        this.loadFloatingPointRegisters();
        this.loadSpecialRegisters();
    }

    private loadSpecialRegisters() {
        this.registers.set("PC", {
            content: 0
        });
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

    preloadRegisters(preloadedRegisters: any) {
        preloadedRegisters.forEach((register: any) => {
            if (register.name === "R0") {
                throw new Error("Cannot set R0 as it has a constant value of 0");
            }
            this.registers.set(register.name, {
                content: register.value,
                qi: 0
            });
        });
    }

    readContent(register: string): number {
        return this.registers.get(register)!.content;
    }

    readQi(register: string): Q {
        return this.registers.get(register)!.qi!;
    }

    writeContent(register: string, content: number): void {
        if (register === "R0") {
            throw new Error("Cannot set R0 as it has a constant value of 0");
        }
        this.registers.get(register)!.content = content;
    }

    writeTag(register: string, tag: Tag): void {
        this.registers.get(register)!.qi = tag;
    }

    public getPCRegister(): RegisterInfo {
        return this.registers.get("PC")!;
    }

    public setPCRegisterValue(value: number): void {
        this.registers.get("PC")!.content = value;
    }

    public getRegisters(): Map<string, RegisterInfo> {
        return this.registers;
    }

    public updateRegisters(tag: Tag, value: number): void {
        this.registers.forEach((registerInfo, _register) => {
            if (registerInfo.qi === tag) {
                registerInfo.qi = 0;
                registerInfo.content = value;
            }
        });
    }
}

export default RegisterFile;
