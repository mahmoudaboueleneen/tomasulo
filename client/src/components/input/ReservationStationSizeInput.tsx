import { useContext } from "react";
import { InputContext } from "../../contexts/InputContext";
import NumberInput, { NumberInputProps } from "./NumberInput";

const ReservationStationSizeInput: React.FC<NumberInputProps> = ({ name, value, label }) => {
  const { setReservationStationsSizes } = useContext(InputContext);
  return <NumberInput name={name} value={value} label={label} setFormStateFunction={setReservationStationsSizes} />;
};

export default ReservationStationSizeInput;
