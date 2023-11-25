import { useContext } from "react";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import InstructionLatencyInput from "./InstructionLatencyInput";
import BufferSizeInput from "./BufferSizeInput";
import ReservationStationSizeInput from "./ReservationStationSizeInput";
import { InputContext } from "../../contexts/InputContext";
import InstructionsInput from "./InstructionsInput";
import FileInput from "./FileInput";

const InputForm = () => {
  const context = useContext(InputContext);

  const onSubmit = () => {
    console.log("Buffer sizes" + JSON.stringify(context.bufferSizes));
    console.log("Instruction latencies" + JSON.stringify(context.instructionLatencies));
    console.log("Reservation Station sizes" + JSON.stringify(context.reservationStationsSizes));

    // Main logic starts from here

    // Some submission logic here . . .

    // Instruction submission logic here
    const instructions = context.instructions;
    const file = context.file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const instructionsFromFile = (e?.target?.result as string).split("\n");
        // Handle the instructions from the file . . .
      };
      reader.readAsText(file);
    } else {
      // Handle the instructions from the text area . . .
    }
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" }
        }}
        onSubmit={context.formActions?.handleSubmit(onSubmit)}
      >
        <div style={{ marginBottom: 40 }}>
          <Typography variant="h4" component="div" gutterBottom>
            Instructions
          </Typography>

          <div>
            <InstructionsInput />

            <FileInput />
          </div>
        </div>

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
};

export default InputForm;
