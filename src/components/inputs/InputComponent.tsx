import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { InputsContext } from "../../contexts/Inputs";
import { Controller, FieldError } from "react-hook-form";
import InputOptions from "../../interfaces/InputOptions";

export type InputsComponentProps = {
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

const InputComponent: React.FC<InputsComponentProps> = ({ name, value, label, setFormStateFunction }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormStateFunction?.((prevState: InputOptions) => ({
      ...prevState,
      [name]: Number(value)
    }));
  };

  const { formActions } = useContext(InputsContext);
  console.log("Errors: " + formActions!.errors.FPAddLatency?.message);
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

export default InputComponent;
