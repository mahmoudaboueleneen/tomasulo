import Buffer from "./Buffer";

class LoadBuffer extends Buffer {
    clone(): Buffer {
        return new LoadBuffer(this.tag!, this.busy, this.address!, this.cyclesLeft);
    }
}

export default LoadBuffer;
