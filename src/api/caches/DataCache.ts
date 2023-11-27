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

    getRunningBufferTag(): Tag {
        return this.runningBufferTag;
    }

    setRunningBufferTag(tag: Tag): void {
        this.runningBufferTag = tag;
    }

    isBusy(): boolean {
        return this.runningBufferTag !== null;
    }

    isFilledWithTag(tag: Tag): boolean {
        return this.runningBufferTag === tag;
    }

    clearRunningBufferTag(): void {
        this.runningBufferTag = null;
    }
}

export default DataCache;
