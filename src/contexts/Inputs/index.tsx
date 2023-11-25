import { createContext, useState } from "react";
import { InputsContextValues, InstructionLatencies } from "../../interfaces";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const InputsContext = createContext<InputsContextValues>({
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

  formActions: null
});

const schema = z.object({
  FPAddLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  FPSubtractLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  FPMultiplyLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  FPDivideLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  IntSubtractLatency: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  LoadBufferSize: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  StoreBufferSize: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  AddSubtractReservationStationSize: z.preprocess((value) => parseInt(value as string), z.number().positive().int()),
  MultiplyDivideReservationStationSize: z.preprocess((value) => parseInt(value as string), z.number().positive().int())
});
type FormData = z.infer<typeof schema>;

type InputsContextProviderProps = {
  children: React.ReactNode;
};
const InputsContextProvider: React.FC<InputsContextProviderProps> = ({ children }) => {
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

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const contextValues = {
    instructionLatencies,
    setInstructionLatencies,

    bufferSizes,
    setBufferSizes,

    reservationStationsSizes,
    setReservationStationsSizes,

    formActions: {
      control,
      handleSubmit,
      errors
    }
  };

  return <InputsContext.Provider value={contextValues}>{children}</InputsContext.Provider>;
};

export default InputsContextProvider;
