import InstructionCache from "./caches/InstructionCache";
import DataCache from "./caches/DataCache";
import InstructionQueue from "./InstructionQueue";
import AddSubReservationStation from "./reservation_stations/AddSubReservationStation";
import MulDivReservationStation from "./reservation_stations/MulDivReservationStation";
import LoadBuffer from "./buffers/LoadBuffer";
import StoreBuffer from "./buffers/StoreBuffer";
import RegisterFile from "./RegisterFile";
import getIssuedInstructionDestination from "../utils/getIssuedInstructionDestination";
import decodeInstruction from "../utils/decode";
import IssuedInstructionDestination from "../enums/IssuedInstructionDestination";
import { LoadType, RType, StoreType } from "../interfaces/InstructionOperationType";

class Tomasulo {
    private instructionCache: InstructionCache;
    private dataCache: DataCache;
    private instructionQueue: InstructionQueue;
    private addSubReservationStations: AddSubReservationStation[];
    private mulDivReservationStations: MulDivReservationStation[];
    private loadBuffers: LoadBuffer[];
    private storeBuffers: StoreBuffer[];
    private registerFile: RegisterFile;
    private currentClockCycle: number;

    constructor(
        instructions: string[],
        addSubReservationStationCount: number,
        mulDivReservationStationCount: number,
        loadBufferCount: number,
        storeBufferCount: number
    ) {
        this.instructionCache = new InstructionCache(instructions);
        this.dataCache = new DataCache();
        this.instructionQueue = new InstructionQueue();

        this.addSubReservationStations = Array(addSubReservationStationCount)
            .fill(null)
            .map((_, index) => new AddSubReservationStation(`A${index + 1}`));
        this.mulDivReservationStations = Array(mulDivReservationStationCount)
            .fill(null)
            .map((_, index) => new MulDivReservationStation(`M${index + 1}`));
        this.loadBuffers = Array(loadBufferCount)
            .fill(null)
            .map((_, index) => new LoadBuffer(`L${index + 1}`));
        this.storeBuffers = Array(storeBufferCount)
            .fill(null)
            .map((_, index) => new StoreBuffer(`S${index + 1}`));

        this.registerFile = new RegisterFile();
        this.currentClockCycle = 0;
    }

    public runTomasuloAlgorithm() {
        let temp = true;
        while (temp) {
            this.fetch();
            this.write();
            this.issue();
            this.execute();

            this.currentClockCycle++;
        }
    }

    private fetch() {
        const fetchedInstruction = this.instructionCache.fetch();
        if (fetchedInstruction) {
            this.instructionQueue.enqueue(fetchedInstruction);
        }
    }

    private issue() {
        const peekInstruction = this.instructionQueue.peek();
        if (!peekInstruction) {
            return;
        }
        this.instructionQueue.dequeue();

        const instructionDecoded = decodeInstruction(peekInstruction);
        const issuedInstructionDestination = getIssuedInstructionDestination(
            instructionDecoded.Op as InstructionOperation
        );

        this.assignEachInstructionToItsDestinationIfPossible(issuedInstructionDestination, instructionDecoded);
    }

    private assignEachInstructionToItsDestinationIfPossible(
        issuedInstructionDestination: IssuedInstructionDestination,
        instructionDecoded: any
    ) {
        switch (issuedInstructionDestination) {
            case IssuedInstructionDestination.ADD_SUB: {
                const freeStation = this.addSubReservationStations.find((station) => station.busy === 0);
                if (!freeStation) {
                    //TODO: stall
                    return;
                }

                const addSubInstruction = instructionDecoded as RType;
                freeStation.loadInstructionIntoStation(addSubInstruction.Op as InstructionOperation);

                this.registerFile.writeTag(addSubInstruction.Dest, freeStation.tag);

                break;
            }
            case IssuedInstructionDestination.MUL_DIV: {
                const freeStation = this.mulDivReservationStations.find((station) => station.busy === 0);
                if (!freeStation) {
                    //TODO: stall
                    return;
                }

                const mulDivInstruction = instructionDecoded as RType;
                freeStation.loadInstructionIntoStation(mulDivInstruction.Op as InstructionOperation);

                this.registerFile.writeTag(mulDivInstruction.Dest, freeStation.tag);

                break;
            }
            case IssuedInstructionDestination.LOAD_BUFFER: {
                const freeBuffer = this.loadBuffers.find((buffer) => buffer.busy === 0);
                if (!freeBuffer) {
                    //TODO: stall
                    return;
                }

                const loadInstruction = instructionDecoded as LoadType;
                if (this.isAnyStoreIssuedForAddress(loadInstruction.Address)) {
                    //TODO: stall
                    return;
                }

                freeBuffer.loadInstructionIntoBuffer(loadInstruction.Address);

                this.registerFile.writeTag(loadInstruction.Dest, freeBuffer.tag);
                break;
            }
            case IssuedInstructionDestination.STORE_BUFFER: {
                const freeBuffer = this.storeBuffers.find((buffer) => buffer.busy === 0);
                if (!freeBuffer) {
                    //TODO: stall
                    return;
                }
                const storeInstruction = instructionDecoded as StoreType;
                freeBuffer.loadInstructionIntoBuffer(storeInstruction.Address);
                break;
            }
            default: {
                throw new Error("Invalid issued instruction destination");
            }
        }
    }

    private isAnyStoreIssuedForAddress(address: number) {
        return this.storeBuffers.some((buffer) => buffer.address === address && buffer.busy === 1);
    }

    private execute() {
        // Implement the execute stage of the Tomasulo algorithm here
        //  loop over all reservation stations and buffers
        //  for each station
        //    if it can execute
        //      decrement the remaining cycles for the instruction in this station
    }

    private write() {
        // Implement the write stage of the Tomasulo algorithm here
    }
}

export default Tomasulo;
