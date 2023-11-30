import Q from "../../types/Q";
import Tag from "../../types/Tag";
import V from "../../types/V";
import Buffer from "./Buffer";

class StoreBuffer extends Buffer {
    v: V;
    q: Q;

    constructor(tag: string, busy?: 0 | 1, address?: number, cyclesLeft?: number, v?: V, q?: Q) {
        super(tag, busy, address, cyclesLeft);
        this.v = v !== undefined ? v : null;
        this.q = q !== undefined ? q : null;
    }
    clone(): Buffer {
        return new StoreBuffer(this.tag!, this.busy, this.address!, this.cyclesLeft, this.v, this.q);
    }

    setV(v: V) {
        this.v = v;
    }

    setQ(q: Q) {
        this.q = q;
    }

    public canExecute(): boolean {
        return super.canExecute() && this.q === 0 && this.v !== null;
    }

    public clear() {
        super.clear();
        this.v = null;
        this.q = null;
    }

    public update(tag: Tag, value: number) {
        if (this.q === tag) {
            this.q = 0;
            this.v = value;
        }
    }
}

export default StoreBuffer;
