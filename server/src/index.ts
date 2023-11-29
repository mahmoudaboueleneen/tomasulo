// import express, { Request, Response } from 'express';

import Tomasulo from "./tumasolu_service/Tomasulo";

// const app = express();
// const port = 3000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript!');
// });

// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });
const instructions1: string[] = ["DIV.D F0, F2, F4", "ADD.D F6, F0, F8", "SUB.D F8, F10, F14", "MUL.D F6, F10, F8"];

const instructions2: string[] = [
    "L.D F6, 32",
    "L.D F2, 44",
    "MUL.D F0, F2, F4",
    "SUB.D F8, F2, F6",
    "DIV.D F10, F0, F6",
    "ADD.D F6, F8, F2"
];

new Tomasulo(instructions2, 3, 2, 3, 3).runTomasuloAlgorithm();
