class DataCache {
    private data: Map<number, number>;

    constructor() {
        this.data = new Map<number, number>();
    }

    read(address: number): number {
        return this.data.get(address) || 0;
    }

    write(address: number, value: number): void {
        this.data.set(address, value);
    }
}

export default DataCache;
