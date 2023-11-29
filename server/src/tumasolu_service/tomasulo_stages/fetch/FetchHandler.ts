import InstructionCache from "../../caches/InstructionCache";
import InstructionQueue from "../../misc/InstructionQueue";

class FetchHandler {
    private instructionCache: InstructionCache;
    private instructionQueue: InstructionQueue;

    constructor(instructionCache: InstructionCache, instructionQueue: InstructionQueue) {
        this.instructionCache = instructionCache;
        this.instructionQueue = instructionQueue;
    }

    public handleFetching() {
        const fetchedInstruction = this.instructionCache.fetch();

        if (fetchedInstruction) {
            this.instructionQueue.enqueue(fetchedInstruction);
        }
    }
}

export default FetchHandler;
