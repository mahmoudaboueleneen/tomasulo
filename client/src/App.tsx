import InputForm from "./components/input/InputForm";
import Output from "./components/output/Output";
import InputContextProvider from "./contexts/InputContext";

function App() {
    return (
        <InputContextProvider>
            {/* <InputForm /> */}
            <Output />
        </InputContextProvider>
    );
}

export default App;
