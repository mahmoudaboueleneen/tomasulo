import Tag from "../../../types/Tag";
import CommonDataBus from "../../misc/CommonDataBus";

class WriteHandler {
    private commonDataBus: CommonDataBus;
    private finishedTagValuePairs: TagValuePair[];
    private tagsToBeCleared: Tag[];
    constructor(commonDataBus: CommonDataBus, finishedTagValuePairs: TagValuePair[], tagsToBeCleared: Tag[]) {
        this.commonDataBus = commonDataBus;
        this.finishedTagValuePairs = finishedTagValuePairs;
        this.tagsToBeCleared = tagsToBeCleared;
    }

    public handleWriting() {
        if (this.finishedTagValuePairs.length === 0) {
            return;
        }

        const nextPair = this.getNextFinishedTagValuePair();

        if (!nextPair) {
            throw new Error("No finished tag-value pairs left");
        }

        const { tag, value } = nextPair;
        this.commonDataBus.write(tag, value);
        this.tagsToBeCleared.push(tag);
    }

    private getNextFinishedTagValuePair() {
        return this.finishedTagValuePairs.shift();
    }
}

export default WriteHandler;
