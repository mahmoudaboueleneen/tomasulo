import { useContext } from "react";
import { InputContext } from "../../contexts/InputContext";
import NumberInput, { NumberInputProps } from "./NumberInput";

const BufferSizeInput: React.FC<NumberInputProps> = ({ name, value, label }) => {
  const { setBufferSizes } = useContext(InputContext);
  return <NumberInput name={name} value={value} label={label} setFormStateFunction={setBufferSizes} />;
};

export default BufferSizeInput;
