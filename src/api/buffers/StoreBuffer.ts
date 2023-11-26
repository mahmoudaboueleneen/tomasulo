import Q from "../../types/Q";
import V from "../../types/V";
import Buffer from "./Buffer";

class StoreBuffer extends Buffer {
    v: V;
    q: Q;

    constructor(tag: string) {
        super(tag);
        this.v = null;
        this.q = null;
    }
    setV(v: V) {
        this.v = v;
    }
    setQ(q: Q) {
        this.q = q;
    }
}

export default StoreBuffer;
