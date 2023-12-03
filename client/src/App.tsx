import { useState } from "react";
import InputForm from "./components/input/InputForm";
import Output from "./components/output/Output";
import InputContextProvider from "./contexts/InputContext";

function App() {
    const [stage, setStage] = useState("input");

    return (
        <InputContextProvider>
            {stage === "input" ? <InputForm setStage={setStage} /> : <Output />}
        </InputContextProvider>
    );
}

export default App;
