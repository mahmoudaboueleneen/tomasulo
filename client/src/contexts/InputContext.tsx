import { createContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputContextValues, InstructionLatencies } from "../interfaces";
import Instructions from "../types/Instructions";
import { inputFormSchema } from "../schemas";

export const InputContext = createContext<InputContextValues>({
    instructionLatencies: {
        FPAddLatency: 0,
        FPSubtractLatency: 0,
        FPMultiplyLatency: 0,
        FPDivideLatency: 0,
        IntSubtractLatency: 0
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
        FPAddLatency: 0,
        FPSubtractLatency: 0,
        FPMultiplyLatency: 0,
        FPDivideLatency: 0,
        IntSubtractLatency: 0
    });

    const [bufferSizes, setBufferSizes] = useState({
        LoadBufferSize: 0,
        StoreBufferSize: 0
    });

    const [reservationStationsSizes, setReservationStationsSizes] = useState({
        AddSubtractReservationStationSize: 0,
        MultiplyDivideReservationStationSize: 0
    });

    const [instructions, setInstructions] = useState<Instructions | null>();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(inputFormSchema)
    });

    const [instructionsFormat, setInstructionsFormat] = useState("file-upload");
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
