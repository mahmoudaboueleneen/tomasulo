import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { InputsContext } from "../contexts/Inputs";
import { BufferSizes, InstructionLatencies, ReservationStationsSizes } from "../interfaces";

type InputsComponentProps = {
  name: string;
  value: number;
  label: string;
  setFormStateFunction?: React.Dispatch<React.SetStateAction<any>>;
};

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

type InputOptions = InstructionLatencies | BufferSizes | ReservationStationsSizes;
const InputComponent: React.FC<InputsComponentProps> = ({ name, value, label, setFormStateFunction }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormStateFunction?.((prevState: InputOptions) => ({
      ...prevState,
      [name]: Number(value)
    }));
  };

  return (
    <TextField
      id="filled-number"
      label={label}
      type="number"
      name={name}
      InputLabelProps={{
        shrink: true
      }}
      value={value}
      onChange={handleInputChange}
      variant="filled"
    />
  );
};

export { InstructionLatencyInput, BufferSizeInput, ReservationStationSizeInput };
