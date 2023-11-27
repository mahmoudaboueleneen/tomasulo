class CommonDataBus {
    private value: number;
    private tag: Tag;

    constructor() {
        this.value = 0;
        this.tag = null;
    }

    write(value: number, tag: Tag) {
        this.value = value;
        this.tag = tag;
    }

    read() {
        return {
            value: this.value,
            tag: this.tag
        };
    }
}

export default CommonDataBus;
