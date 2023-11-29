import TagValuePair from "../../../interfaces/TagValuePair";
import Tag from "../../../types/Tag";
import CommonDataBus from "../../misc/CommonDataBus";

class WriteHandler {
    private commonDataBus: CommonDataBus;
    private finishedTagValuePairs: TagValuePair[];
    private tagsToBeCleared: Tag[];
    private storeBufferToBeCleared: { tag: Tag };
    private BNEZStationToBeCleared: { tag: Tag };

    constructor(
        commonDataBus: CommonDataBus,
        finishedTagValuePairs: TagValuePair[],
        tagsToBeCleared: Tag[],
        storeBufferToBeCleared: { tag: Tag },
        BNEZStationToBeCleared: { tag: Tag }
    ) {
        this.commonDataBus = commonDataBus;
        this.finishedTagValuePairs = finishedTagValuePairs;
        this.tagsToBeCleared = tagsToBeCleared;
        this.storeBufferToBeCleared = storeBufferToBeCleared;
        this.BNEZStationToBeCleared = BNEZStationToBeCleared;
    }

    public handleWriting() {
        console.log(this.tagsToBeCleared);

        if (
            this.finishedTagValuePairs.length === 0 &&
            this.BNEZStationToBeCleared.tag === null &&
            this.storeBufferToBeCleared.tag === null
        ) {
            return;
        }

        if (this.finishedTagValuePairs.length > 0) {
            const nextPair = this.getNextFinishedTagValuePair();

            if (!nextPair) {
                throw new Error("No finished tag-value pairs left");
            }

            const { tag, value } = nextPair;
            this.commonDataBus.write(tag, value);
            this.tagsToBeCleared.push(tag);
        }

        console.log("Store buffer to be cleared", this.storeBufferToBeCleared);
        console.log("BNEZ station to be cleared", this.BNEZStationToBeCleared);

        if (this.storeBufferToBeCleared.tag) {
            this.tagsToBeCleared.push(this.storeBufferToBeCleared.tag);
        }

        if (this.BNEZStationToBeCleared.tag) {
            this.tagsToBeCleared.push(this.BNEZStationToBeCleared.tag);
        }
    }

    private getNextFinishedTagValuePair() {
        return this.finishedTagValuePairs.shift();
    }
}

export default WriteHandler;
