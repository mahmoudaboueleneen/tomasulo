import Tag from "../../types/Tag";

/**
 * DataCache represents the main data memory unit in our architecture.
 */
class DataCache {
    private data: Map<number, number>;
    private runningBufferTag: Tag;

    constructor(data?: Map<number, number>, runningBufferTag?: Tag) {
        this.data = data || new Map();
        this.runningBufferTag = runningBufferTag || null;
    }

    clone(): DataCache {
        return new DataCache(new Map(this.data), this.runningBufferTag);
    }

    preloadMemoryLocations(preloadedMemoryLocations: any) {
        preloadedMemoryLocations.forEach((memoryLocation: any) => {
            this.data.set(memoryLocation.address, memoryLocation.value);
        });
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

    isInstructionTagExecuting(tag: Tag): boolean {
        return this.runningBufferTag === tag;
    }

    clearRunningBufferTag(): void {
        this.runningBufferTag = null;
    }

    getData(): Map<number, number> {
        return this.data;
    }
}

export default DataCache;
