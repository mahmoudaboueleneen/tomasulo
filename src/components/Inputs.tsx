import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useContext } from "react";
import { InputsContext } from "../contexts/Inputs";
import { BufferSizeInput, InstructionLatencyInput, ReservationStationSizeInput } from "./InputComponent";
import { Button } from "@mui/material";

function InputsFormComponent() {
  const context = useContext(InputsContext);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // main logic starts from here
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" }
        }}
        onSubmit={handleSubmit}
      >
        <div style={{ marginBottom: 40 }}>
          <Typography variant="h4" component="div" gutterBottom>
            Instruction latencies
          </Typography>
          <div>
            <Typography variant="h5" component="div" gutterBottom>
              FP instructions latencies
            </Typography>
            <InstructionLatencyInput
              name="FPAddLatency"
              value={context.instructionLatencies.FPAddLatency}
              label="FP Add"
            />
            <InstructionLatencyInput
              name="FPSubtractLatency"
              value={context.instructionLatencies.FPSubtractLatency}
              label="FP Subtract"
            />
            <InstructionLatencyInput
              name="FPMultiplyLatency"
              value={context.instructionLatencies.FPMultiplyLatency}
              label="FP Multiply"
            />
            <InstructionLatencyInput
              name="FPDivideLatency"
              value={context.instructionLatencies.FPDivideLatency}
              label="FP Divide"
            />
          </div>
          <div>
            <Typography variant="h5" component="div" gutterBottom>
              Integer instructions latencies
            </Typography>
            <InstructionLatencyInput
              name="IntSubtractLatency"
              value={context.instructionLatencies.IntSubtractLatency}
              label="Int Subtract"
            />
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <Typography variant="h4" component="div" gutterBottom>
            Buffer sizes
          </Typography>
          <BufferSizeInput name="LoadBufferSize" value={context.bufferSizes.LoadBufferSize} label="Load Buffer" />
          <BufferSizeInput name="StoreBufferSize" value={context.bufferSizes.StoreBufferSize} label="Store Buffer" />
        </div>

        <div style={{ marginBottom: 40 }}>
          <Typography variant="h4" component="div" gutterBottom>
            Reservation Station sizes
          </Typography>
          <ReservationStationSizeInput
            name="AddSubtractReservationStationSize"
            value={context.reservationStationsSizes.AddSubtractReservationStationSize}
            label="Add/Subtract Reservation Station"
          />
          <ReservationStationSizeInput
            name="MultiplyDivideReservationStationSize"
            value={context.reservationStationsSizes.MultiplyDivideReservationStationSize}
            label="Multiply/Divide Reservation Station"
          />
        </div>
        <Button type="submit" variant="contained">
          Get results
        </Button>
      </Box>
    </div>
  );
}

export default InputsFormComponent;
