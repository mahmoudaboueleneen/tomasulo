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
}

export default StoreBuffer;
