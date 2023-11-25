import { useContext } from "react";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import InstructionLatencyInput from "./InstructionLatencyInput";
import BufferSizeInput from "./BufferSizeInput";
import ReservationStationSizeInput from "./ReservationStationSizeInput";
import { InputContext } from "../../contexts/InputContext";
import TextAreaInput from "./TextAreaInput";
import FileInput from "./FileInput";
import { parseInstructions } from "../../utils";

const InputForm = () => {
  const context = useContext(InputContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    context.setInstructionsFormat(event.target.value);
  };

  const onSubmit = async () => {
    console.log("Buffer sizes" + JSON.stringify(context.bufferSizes));
    console.log("Instruction latencies" + JSON.stringify(context.instructionLatencies));
    console.log("Reservation Station sizes" + JSON.stringify(context.reservationStationsSizes));

    // Main logic starts from here

    // Some submission logic here . . .

    // Instruction submission logic here
    const instructions = await parseInstructions(context.instructions);
    console.log("Instructions: " + JSON.stringify(instructions));
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
            <FormControl component="fieldset">
              <FormLabel component="legend">Choose an option</FormLabel>
              <RadioGroup aria-label="options" value={context.instructionsFormat} onChange={handleChange}>
                <FormControlLabel value="string" control={<Radio />} label="Write instructions" />
                <FormControlLabel
                  value="file-upload"
                  control={<Radio />}
                  label="Upload text file containing instructions"
                />
              </RadioGroup>
            </FormControl>
            <div>{context.instructionsFormat === "string" ? <TextAreaInput /> : <FileInput />}</div>
            {context.instructionsError && <p style={{ color: "red" }}>{context.instructionsError}</p>}
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
