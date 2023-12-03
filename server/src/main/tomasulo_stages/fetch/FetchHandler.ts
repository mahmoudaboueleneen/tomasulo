import InstructionCache from "../../caches/InstructionCache";
import InstructionQueue from "../../InstructionQueue";

class FetchHandler {
    private instructionCache: InstructionCache;
    private instructionQueue: InstructionQueue;
    private canContinueFetching: boolean;

    constructor(instructionCache: InstructionCache, instructionQueue: InstructionQueue, canContinueFetching: boolean) {
        this.instructionCache = instructionCache;
        this.instructionQueue = instructionQueue;
        this.canContinueFetching = canContinueFetching;
    }

    public handleFetching() {
        if (!this.canContinueFetching) {
            return;
        }
        const fetchedInstruction = this.instructionCache.fetch();

        if (fetchedInstruction) {
            this.instructionQueue.enqueue(fetchedInstruction);
        }
    }
}

export default FetchHandler;
