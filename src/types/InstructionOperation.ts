type InstructionOperation =
    | "ADD.D"
    | "ADD.S"
    | "ADD.PS"
    | "ADDI"
    | "SUB.D"
    | "SUB.S"
    | "SUB.PS"
    | "SUBI"
    | "MUL.D"
    | "MUL.S"
    | "MUL.PS"
    | "DIV.D"
    | "DIV.S"
    | "DIV.PS"
    | "LD"
    | "LW"
    | "LWU"
    | "LB"
    | "LBU"
    | "LH"
    | "LHU"
    | "L.D"
    | "L.S"
    | "SD"
    | "SW"
    | "SWU"
    | "SB"
    | "SBU"
    | "SH"
    | "SHU"
    | "S.D"
    | "S.S"
    | "BNEZ";

export default InstructionOperation;

// TODO: Add all possible instruction types (R, I , J)
// Ensef elle foo2
