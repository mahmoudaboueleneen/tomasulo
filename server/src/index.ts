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
const instructions: string[] = [
    "DIV.D F0, F2, F4",
    "ADD.D F6, F0, F8",
    "SUB.D F8, F10, F14",
    "MUL.D F6, F10, F8"
];

new Tomasulo(instructions, 3, 2, 3, 3).runTomasuloAlgorithm();