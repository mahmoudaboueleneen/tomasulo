import DecodedInstruction from "../DecodedInstruction";

abstract class ReservationStation {
    tag: string | null;
    busy: 0 | 1;
    op: InstructionOperation | null;
    vj: number | null;
    vk: number | null;
    qj: string | 0 | null;
    qk: string | 0 | null;
    decodedInstructionObject: DecodedInstruction | null;

    constructor(tag: string) {
        this.tag = tag;
        this.busy = 0;
        this.op = null;
        this.vj = null;
        this.vk = null;
        this.qj = null;
        this.qk = null;
        this.decodedInstructionObject = null;
    }

    loadInstructionIntoStation(op: InstructionOperation) {
        this.busy = 1;
        this.op = op;
    }

    setQj(qj: string) {
        this.qj = qj;
    }

    setQk(qk: string) {
        this.qk = qk;
    }

    setVj(vj: number) {
        this.vj = vj;
    }

    setVk(vk: number) {
        this.vk = vk;
    }

    canExecute() {
        return this.busy === 1 && this.qj === 0 && this.qk === 0;
    }

    isFinished() {
        return this.decodedInstructionObject !== null && this.decodedInstructionObject.isFinished();
    }

    decrementCyclesLeft() {
        if (this.decodedInstructionObject !== null) {
            this.decodedInstructionObject.decrementCyclesLeft();
        }
    }

    clear() {
        this.busy = 0;
        this.op = null;
        this.vj = null;
        this.vk = null;
        this.qj = null;
        this.qk = null;
    }
}

export default ReservationStation;
