import RegisterInfo from "../../interfaces/RegisterInfo";
import Q from "../../types/Q";
import Tag from "../../types/Tag";

class RegisterFile {
    private registers: Map<string, RegisterInfo>;

    constructor() {
        this.registers = new Map<string, RegisterInfo>();
        this.initializeRegisters();
    }

    private initializeRegisters() {
        this.loadIntegerValueRegisters();
        this.loadFloatingPointRegisters();
        this.loadSpecialRegisters();

        // TODO: REMOVE THIS FOR TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.registers.set("F2", {
            content: 2,
            qi: 0
        });
        this.registers.set("F4", {
            content: 4,
            qi: 0
        });
        this.registers.set("F8", {
            content: 8,
            qi: 0
        });
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

    public getPCRegister(): RegisterInfo {
        return this.registers.get("PC")!;
    }

    public setPCRegisterValue(value: number): void {
        this.registers.get("PC")!.content = value;
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
