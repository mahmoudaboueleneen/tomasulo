import express, { Request, Response } from "express";
import cors from "cors";
import Tomasulo from "./tumasolu_service/Tomasulo";

const app = express();
const port = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is up and running!");
});

app.post("/api/v1/tomasulo", (req: Request, res: Response) => {
    const {
        FPAddLatency,
        FPSubtractLatency,
        FPMultiplyLatency,
        FPDivideLatency,
        IntSubtractLatency,
        IntAddLatency,
        BranchNotEqualZeroLatency
    } = req.body.instructionLatencies;

    const { LoadBufferSize, StoreBufferSize } = req.body.bufferSizes;

    const { AddSubtractReservationStationSize, MultiplyDivideReservationStationSize } =
        req.body.reservationStationsSizes;

    const parsedInstructions = req.body.parsedInstructions;

    res.status(200).json({
        instructionLatencies: req.body.instructionLatencies,
        bufferSizes: req.body.bufferSizes,
        reservationStationsSizes: req.body.reservationStationsSizes,
        parsedInstructions: req.body.parsedInstructions,
        numberOfCycles: req.body.numberOfCycles
    });
    // Run the Tomasulo algorithm
    // const tomasulo = new Tomasulo();
    // const tomasuloInstances = tomasulo.runTomasuloAlgorithm();
    // Send the response back to the client
    // res.send(tomasuloInstances);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// const instructions1: string[] = ["DIV.D F0, F2, F4", "ADD.D F6, F0, F8", "SUB.D F8, F10, F14", "MUL.D F6, F10, F8"];

// const instructions2: string[] = [
//     "L.D F6, 32",
//     "L.D F2, 44",
//     "MUL.D F0, F2, F4",
//     "SUB.D F8, F2, F6",
//     "DIV.D F10, F0, F6",
//     "ADD.D F6, F8, F2"
// ];

// const instructions3: string[] = ["LOOP: L.D F0, 0", "MUL.D F4, F0, F2", "S.D F4, 0", "SUBI R1, R1, 8", "BNEZ R1, LOOP"];

// new Tomasulo(instructions3, 3, 2, 3, 3).runTomasuloAlgorithm();
