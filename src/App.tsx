import { useEffect } from "react";
import InputForm from "./components/input/InputForm";
import InputContextProvider from "./contexts/InputContext";
import Tomasulo from "./api/Tomasulo";

function App() {
    useEffect(() => {
        const instructions: string[] = [
            "DIV.D F0, F2, F4",
            "ADD.D F6, F0, F8",
            "SUB.D F8, F10, F14",
            "MUL.D F6, F10, F8"
        ];

        new Tomasulo(instructions, 3, 2, 3, 3).runTomasuloAlgorithm();
    }, []);

    return (
        <InputContextProvider>
            <InputForm />
        </InputContextProvider>
    );
}

export default App;
