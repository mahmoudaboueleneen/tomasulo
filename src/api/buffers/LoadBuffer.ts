import Buffer from "./Buffer";

class LoadBuffer extends Buffer {
    canExecute(): boolean {
        return this.busy === 1;
    }
}

export default LoadBuffer;
