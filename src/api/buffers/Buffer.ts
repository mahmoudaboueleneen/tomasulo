abstract class Buffer {
    tag: Tag;
    busy: 0 | 1;
    address: number | null;

    constructor(tag: string) {
        this.tag = tag;
        this.busy = 0;
        this.address = null;
    }
}

export default Buffer;
