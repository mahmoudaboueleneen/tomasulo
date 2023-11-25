import { useContext } from "react";
import { InputsContext } from "../../contexts/Inputs";
import InputComponent, { InputsComponentProps } from "./InputComponent";

const InstructionLatencyInput: React.FC<InputsComponentProps> = ({ name, value, label }) => {
  const { setInstructionLatencies } = useContext(InputsContext);
  return <InputComponent name={name} value={value} label={label} setFormStateFunction={setInstructionLatencies} />;
};

const BufferSizeInput: React.FC<InputsComponentProps> = ({ name, value, label }) => {
  const { setBufferSizes } = useContext(InputsContext);
  return <InputComponent name={name} value={value} label={label} setFormStateFunction={setBufferSizes} />;
};

const ReservationStationSizeInput: React.FC<InputsComponentProps> = ({ name, value, label }) => {
  const { setReservationStationsSizes } = useContext(InputsContext);
  return <InputComponent name={name} value={value} label={label} setFormStateFunction={setReservationStationsSizes} />;
};

export { InstructionLatencyInput, BufferSizeInput, ReservationStationSizeInput };
