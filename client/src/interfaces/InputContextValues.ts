import { Control, FieldErrors, FieldValues, UseFormHandleSubmit } from "react-hook-form";

import { BufferSizes, InstructionLatencies, ReservationStationsSizes } from ".";
import Instructions from "../types/Instructions";
import Register from "./Register";
import MemoryLocation from "./MemoryLocation";

interface InputContextValues {
    instructionLatencies: InstructionLatencies;
    setInstructionLatencies: React.Dispatch<React.SetStateAction<InstructionLatencies>>;

    bufferSizes: BufferSizes;
    setBufferSizes: React.Dispatch<React.SetStateAction<BufferSizes>>;

    reservationStationsSizes: ReservationStationsSizes;
    setReservationStationsSizes: React.Dispatch<React.SetStateAction<ReservationStationsSizes>>;

    instructions: Instructions | null | undefined;
    setInstructions: React.Dispatch<React.SetStateAction<Instructions | null | undefined>>;

    preloadedRegisters: Register[] | null;
    setPreloadedRegisters: React.Dispatch<React.SetStateAction<Register[] | null>>;

    preloadedMemoryLocations: MemoryLocation[] | null;
    setPreloadedMemoryLocations: React.Dispatch<React.SetStateAction<MemoryLocation[] | null>>;

    formActions: {
        control: Control<FieldValues>;
        errors: FieldErrors<FieldValues>;
        handleSubmit: UseFormHandleSubmit<FieldValues>;
    } | null;

    instructionsFormat: string;
    setInstructionsFormat: React.Dispatch<React.SetStateAction<string>>;
    instructionsError: string | null;
    setInstructionsError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default InputContextValues;
