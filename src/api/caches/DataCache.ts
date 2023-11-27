/**
 * DataCache represents the main data memory unit in our architecture.
 */
class DataCache {
    private data: Map<number, number>;
    private runningBufferTag: Tag;

    constructor() {
        this.data = new Map<number, number>();
        this.runningBufferTag = null;
    }

    read(address: number): number {
        return this.data.get(address) || 0;
    }

    write(address: number, value: number): void {
        this.data.set(address, value);
    }

    getRunningInstructionTag(): Tag {
        return this.runningBufferTag;
    }

    setRunningInstructionTag(tag: Tag): void {
        this.runningBufferTag = tag;
    }

    isBusyWithTag(tag: Tag): boolean {
        return this.runningBufferTag !== null && this.runningBufferTag === tag;
    }

    clearRunningInstructionTag(): void {
        this.runningBufferTag = null;
    }
}

export default DataCache;
