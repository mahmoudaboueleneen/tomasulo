import { createContext, useState } from "react";
import { InputsContextValues, InstructionLatencies } from "../interfaces";

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
  setReservationStationsSizes: () => {}
});

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

  const contextValues = {
    instructionLatencies,
    setInstructionLatencies,

    bufferSizes,
    setBufferSizes,

    reservationStationsSizes,
    setReservationStationsSizes
  };

  return <InputsContext.Provider value={contextValues}>{children}</InputsContext.Provider>;
};

export default InputsContextProvider;
