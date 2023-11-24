interface InstructionLatencies {
  FPAddLatency: number;
  FPSubtractLatency: number;
  FPMultiplyLatency: number;
  FPDivideLatency: number;
  IntSubtractLatency: number;
  IntAddLatency?: 1;
  BranchNotEqualZeroLatency?: 1;
}

interface BufferSizes {
  LoadBufferSize: number;
  StoreBufferSize: number;
}

interface ReservationStationsSizes {
  AddSubtractReservationStationSize: number;
  MultiplyDivideReservationStationSize: number;
}

interface InputsContextValues {
  instructionLatencies: InstructionLatencies;
  setInstructionLatencies: React.Dispatch<React.SetStateAction<InstructionLatencies>>;
  bufferSizes: BufferSizes;
  setBufferSizes: React.Dispatch<React.SetStateAction<BufferSizes>>;
  reservationStationsSizes: ReservationStationsSizes;
  setReservationStationsSizes: React.Dispatch<React.SetStateAction<ReservationStationsSizes>>;
}

export type { InstructionLatencies, InputsContextValues, BufferSizes, ReservationStationsSizes };
