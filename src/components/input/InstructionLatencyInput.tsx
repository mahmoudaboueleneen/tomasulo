import { useContext } from "react";
import { InputContext } from "../../contexts/InputContext";
import NumberInput, { NumberInputProps } from "./NumberInput";

const InstructionLatencyInput: React.FC<NumberInputProps> = ({ name, value, label }) => {
  const { setInstructionLatencies } = useContext(InputContext);
  return <NumberInput name={name} value={value} label={label} setFormStateFunction={setInstructionLatencies} />;
};

export default InstructionLatencyInput;
