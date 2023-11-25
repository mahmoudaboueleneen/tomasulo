import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { InputContext } from "../../contexts/InputContext";
import { Controller, FieldError } from "react-hook-form";
import InputOptions from "../../types/InputOptions";

export type NumberInputProps = {
  name:
    | "FPAddLatency"
    | "FPSubtractLatency"
    | "FPMultiplyLatency"
    | "FPDivideLatency"
    | "IntSubtractLatency"
    | "LoadBufferSize"
    | "StoreBufferSize"
    | "AddSubtractReservationStationSize"
    | "MultiplyDivideReservationStationSize";
  value: number;
  label: string;
  setFormStateFunction?: React.Dispatch<React.SetStateAction<any>>;
};

const NumberInput: React.FC<NumberInputProps> = ({ name, value, label, setFormStateFunction }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormStateFunction?.((prevState: InputOptions) => ({
      ...prevState,
      [name]: Number(value)
    }));
  };

  const { formActions } = useContext(InputContext);

  return (
    <Controller
      name={name}
      control={formActions!.control}
      defaultValue={value}
      render={({ field }) => (
        <div>
          <TextField
            {...field}
            id="filled-number"
            label={label}
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            variant="filled"
            onChange={(event) => {
              handleInputChange(event);
              field.onChange(event);
            }}
          />

          {formActions!.errors[name] && (
            <p style={{ color: "red" }}>{(formActions!.errors[name] as FieldError).message}</p>
          )}
        </div>
      )}
    />
  );
};

export default NumberInput;
