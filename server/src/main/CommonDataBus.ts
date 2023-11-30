import Tag from "../types/Tag";

class CommonDataBus {
    private tag: Tag;
    private value: number;

    constructor() {
        this.tag = null;
        this.value = 0;
    }

    write(tag: Tag, value: number) {
        this.tag = tag;
        this.value = value;
    }

    read() {
        return {
            tag: this.tag,
            value: this.value
        };
    }
}

export default CommonDataBus;
