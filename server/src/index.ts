import express, { Request, Response } from "express";
import cors from "cors";
import Tomasulo from "./main/Tomasulo";

const app = express();
const port = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is up and running!");
});

app.post("/api/v1/tomasulo", (req: Request, res: Response) => {
    try {
        const {
            FPAddLatency,
            FPSubtractLatency,
            FPMultiplyLatency,
            FPDivideLatency,
            IntSubtractLatency,
            LoadLatency,
            StoreLatency
            // IntAddLatency,
            // BranchNotEqualZeroLatency
        } = req.body.instructionLatencies;

        const { LoadBufferSize, StoreBufferSize } = req.body.bufferSizes;

        const { AddSubtractReservationStationSize, MultiplyDivideReservationStationSize } =
            req.body.reservationStationsSizes;

        const parsedInstructions = req.body.parsedInstructions;

        const tomasulo = new Tomasulo(
            parsedInstructions,
            AddSubtractReservationStationSize,
            MultiplyDivideReservationStationSize,
            LoadBufferSize,
            StoreBufferSize,
            FPAddLatency,
            FPSubtractLatency,
            FPMultiplyLatency,
            FPDivideLatency,
            IntSubtractLatency,
            LoadLatency,
            StoreLatency
        );

        const tomasuloInstances = tomasulo.runTomasuloAlgorithm();

        res.status(200).json({
            tomasuloInstances: tomasuloInstances
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).toString() });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// DEBUG MANUALLY IN THE CLI, DON'T DELETE

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
