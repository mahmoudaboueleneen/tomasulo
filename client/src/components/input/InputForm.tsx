import { useContext, useEffect } from "react";
import { Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import InstructionLatencyInput from "./InstructionLatencyInput";
import BufferSizeInput from "./BufferSizeInput";
import ReservationStationSizeInput from "./ReservationStationSizeInput";
import { InputContext } from "../../contexts/InputContext";
import TextAreaInput from "./TextAreaInput";
import FileInput from "./FileInput";
import RegisterPreloadInput from "./RegisterPreloadInput";
import MemoryPreloadInput from "./MemoryPreloadInput";

interface Props {
    setStage: React.Dispatch<React.SetStateAction<string>>;
}

const InputForm: React.FC<Props> = ({ setStage }) => {
    const context = useContext(InputContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        context.setInstructionsFormat(event.target.value);
    };

    const onSubmit = async () => {
        setStage("output");
    };

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === "Enter") onSubmit();
        };
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <Container>
            <Box
                component="form"
                sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" }
                }}
                onSubmit={context.formActions?.handleSubmit(onSubmit)}
            >
                <Box style={{ marginBottom: 40 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Instructions
                    </Typography>
                    <Box>
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
                        <Box>{context.instructionsFormat === "string" ? <TextAreaInput /> : <FileInput />}</Box>
                        {context.instructionsError && <p style={{ color: "red" }}>{context.instructionsError}</p>}
                    </Box>
                </Box>

                <Box style={{ marginBottom: 40 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Instruction Latencies
                    </Typography>

                    <Box>
                        <Typography variant="h5" component="div" gutterBottom>
                            FP Instruction Latencies
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
                    </Box>

                    <Box>
                        <Typography variant="h5" component="div" gutterBottom>
                            Integer Instruction Latencies
                        </Typography>

                        <InstructionLatencyInput
                            name="IntSubtractLatency"
                            value={context.instructionLatencies.IntSubtractLatency}
                            label="Int Subtract"
                        />
                    </Box>

                    <Box>
                        <Typography variant="h5" component="div" gutterBottom>
                            Memory Instruction Latencies
                        </Typography>

                        <InstructionLatencyInput
                            name="LoadLatency"
                            value={context.instructionLatencies.LoadLatency}
                            label="Load"
                        />

                        <InstructionLatencyInput
                            name="StoreLatency"
                            value={context.instructionLatencies.StoreLatency}
                            label="Store"
                        />
                    </Box>
                </Box>

                <Box style={{ marginBottom: 40 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Buffer sizes
                    </Typography>

                    <BufferSizeInput
                        name="LoadBufferSize"
                        value={context.bufferSizes.LoadBufferSize}
                        label="Load Buffer"
                    />

                    <BufferSizeInput
                        name="StoreBufferSize"
                        value={context.bufferSizes.StoreBufferSize}
                        label="Store Buffer"
                    />
                </Box>

                <Box style={{ marginBottom: 40 }}>
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
                </Box>

                <Box style={{ marginBottom: 40 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Preload Registers
                    </Typography>

                    <RegisterPreloadInput />
                </Box>

                <Box style={{ marginBottom: 40 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Preload Memory
                    </Typography>

                    <MemoryPreloadInput />
                </Box>

                <Button type="submit" variant="contained">
                    Get results
                </Button>
            </Box>
        </Container>
    );
};

export default InputForm;
