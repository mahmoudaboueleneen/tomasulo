import { createContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputContextValues, InstructionLatencies } from "../interfaces";
import Instructions from "../types/Instructions";
import InputFormSchema from "../schemas/InputFormSchema";
import Register from "../interfaces/Register";
import MemoryLocation from "../interfaces/MemoryLocation";

export const InputContext = createContext<InputContextValues>({
    instructionLatencies: {
        FPAddLatency: 0,
        FPSubtractLatency: 0,
        FPMultiplyLatency: 0,
        FPDivideLatency: 0,
        IntSubtractLatency: 0,
        LoadLatency: 0,
        StoreLatency: 0
        // IntAddLatency: 1,
        // BranchNotEqualZeroLatency: 1,
    },
    setInstructionLatencies: () => {},

    bufferSizes: {
        LoadBufferSize: 0,
        StoreBufferSize: 0
    },
    setBufferSizes: () => {},

    reservationStationsSizes: {
        AddSubtractReservationStationSize: 0,
        MultiplyDivideReservationStationSize: 0
    },
    setReservationStationsSizes: () => {},

    instructions: "",
    setInstructions: () => {},

    preloadedRegisters: [],
    setPreloadedRegisters: () => {},

    preloadedMemoryLocations: [],
    setPreloadedMemoryLocations: () => {},

    formActions: null,

    instructionsFormat: "file-upload",
    setInstructionsFormat: () => {},
    instructionsError: null,
    setInstructionsError: () => {}
});

type InputsContextProviderProps = {
    children: React.ReactNode;
};

const InputContextProvider: React.FC<InputsContextProviderProps> = ({ children }) => {
    const [instructionLatencies, setInstructionLatencies] = useState<InstructionLatencies>({
        FPAddLatency: 2,
        FPSubtractLatency: 2,
        FPMultiplyLatency: 3,
        FPDivideLatency: 3,
        IntSubtractLatency: 1,
        LoadLatency: 2,
        StoreLatency: 2
        // IntAddLatency: 1,
        // BranchNotEqualZeroLatency: 1,
    });

    const [bufferSizes, setBufferSizes] = useState({
        LoadBufferSize: 2,
        StoreBufferSize: 2
    });

    const [reservationStationsSizes, setReservationStationsSizes] = useState({
        AddSubtractReservationStationSize: 2,
        MultiplyDivideReservationStationSize: 2
    });

    const [instructions, setInstructions] = useState<Instructions | null | undefined>(
        "ADDI R1, R1, 16\nLOOP: L.D F4, 0\nMUL.D F4, F4, F2\nS.D F4, 0\nSUBI R1, R1, 8\nBNEZ R1, LOOP"
    );

    const [preloadedRegisters, setPreloadedRegisters] = useState<Register[] | null>([{ name: "F2", value: 3 }]);

    const [preloadedMemoryLocations, setPreloadedMemoryLocations] = useState<MemoryLocation[] | null>([
        { address: 0, value: 2 }
    ]);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(InputFormSchema)
    });

    const [instructionsFormat, setInstructionsFormat] = useState("string");
    const [instructionsError, setInstructionsError] = useState<string | null>(null);

    const contextValues = {
        instructionLatencies,
        setInstructionLatencies,

        bufferSizes,
        setBufferSizes,

        reservationStationsSizes,
        setReservationStationsSizes,

        instructions,
        setInstructions,

        preloadedRegisters,
        setPreloadedRegisters,

        preloadedMemoryLocations,
        setPreloadedMemoryLocations,

        formActions: {
            control,
            handleSubmit,
            errors
        },

        instructionsFormat,
        setInstructionsFormat,
        instructionsError,
        setInstructionsError
    };

    return <InputContext.Provider value={contextValues}>{children}</InputContext.Provider>;
};

export default InputContextProvider;
