import { Control, FieldErrors, UseFormHandleSubmit } from "react-hook-form";

import { BufferSizes, InstructionLatencies, ReservationStationsSizes } from ".";
import Instructions from "./Instructions";

interface InputContextValues {
  instructionLatencies: InstructionLatencies;
  setInstructionLatencies: React.Dispatch<React.SetStateAction<InstructionLatencies>>;
  bufferSizes: BufferSizes;
  setBufferSizes: React.Dispatch<React.SetStateAction<BufferSizes>>;
  reservationStationsSizes: ReservationStationsSizes;
  setReservationStationsSizes: React.Dispatch<React.SetStateAction<ReservationStationsSizes>>;
  instructions: string;
  setInstructions: React.Dispatch<React.SetStateAction<string>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  formActions: {
    control: Control<InstructionLatencies & BufferSizes & ReservationStationsSizes & Instructions>;
    errors: FieldErrors<InstructionLatencies & BufferSizes & ReservationStationsSizes & Instructions>;
    handleSubmit: UseFormHandleSubmit<InstructionLatencies & BufferSizes & ReservationStationsSizes & Instructions>;
  } | null;
}

export default InputContextValues;
