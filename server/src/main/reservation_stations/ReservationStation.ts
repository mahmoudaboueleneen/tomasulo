import V from "../../types/V";
import Q from "../../types/Q";
import InstructionOperation from "../../types/InstructionOperation";
import Address from "../../types/Address";
import Tag from "../../types/Tag";
import Executable from "../../interfaces/Executable";

abstract class ReservationStation implements Executable {
    tag: Tag;
    busy: 0 | 1;
    op: InstructionOperation | null;
    vj: V;
    vk: V;
    qj: Q;
    qk: Q;
    A: Address;
    cyclesLeft: number;

    constructor(
        tag: string,
        busy?: 0 | 1,
        op?: InstructionOperation,
        vj?: V,
        vk?: V,
        qj?: Q,
        qk?: Q,
        A?: Address,
        cyclesLeft?: number
    ) {
        this.tag = tag;
        this.busy = busy !== undefined ? busy : 0;
        this.op = op || null;
        this.vj = vj !== undefined ? vj : null;
        this.vk = vk !== undefined ? vk : null;
        this.qj = qj !== undefined ? qj : null;
        this.qk = qk !== undefined ? qk : null;
        this.A = A !== undefined ? A : null;
        this.cyclesLeft = cyclesLeft !== undefined ? cyclesLeft : 0;
    }
    abstract clone(): ReservationStation;

    public loadInstructionIntoStation(op: InstructionOperation) {
        this.busy = 1;
        this.op = op;
    }

    public decrementCyclesLeft() {
        if (this.cyclesLeft > 0) {
            this.cyclesLeft--;
        }
    }

    public canExecute() {
        return (
            !this.isFinished() &&
            this.busy === 1 &&
            (this.qj === 0 || this.qj === null) &&
            (this.qk === 0 || this.qk === null)
        );
    }

    public isFinished() {
        return this.cyclesLeft === 0;
    }

    public clear() {
        this.busy = 0;
        this.op = null;
        this.vj = null;
        this.vk = null;
        this.qj = null;
        this.qk = null;
        this.A = null;
    }

    public update(tag: Tag, value: number) {
        if (this.qj === tag) {
            this.qj = 0;
            this.vj = value;
        }
        if (this.qk === tag) {
            this.qk = 0;
            this.vk = value;
        }
    }

    public setCyclesLeft(cycles: number) {
        this.cyclesLeft = cycles;
    }
}

export default ReservationStation;
