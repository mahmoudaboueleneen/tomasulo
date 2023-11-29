import Tomasulo from "../../api/Tomasulo";

const instructions: string[] = ["DIV.D F0, F2, F4", "ADD.D F6, F0, F8", "SUB.D F8, F10, F14", "MUL.D F6, F10, F8"];

new Tomasulo(instructions, 3, 2, 3, 3).runTomasuloAlgorithm();
