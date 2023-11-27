## Assumptions

We have made the following assumptions for our MIPS Interpreter:

-   For adding a label, the label must end with a ':' or ',' or any other character, and when calling branch instruction to jump to this label, the branch instruction will call the label without this last character (e.g.)
-   Addresses for Load and Store Instructions are assumed already precomputed and the instruction is written with the address as an immediate value (e.g.)
-   In an instruction, fields following the operation field are separated from each other by a comma and a space.
-   Register names are from F0 to F31, and from R0 to R31.

We have also made the following assumptions for our algorithm:

-   We assume loads are favored over stores if both are become ready to execute at the same time, as we will have to pick one of them as the memory in our architecture can only be executing one instruction.
