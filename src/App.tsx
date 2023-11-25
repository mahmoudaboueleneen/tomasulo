import InputsFormComponent from "./components/inputs/Inputs";
import InputsContextProvider from "./contexts/Inputs";

function App() {
  return (
    <>
      <InputsContextProvider>
        <InputsFormComponent />
      </InputsContextProvider>
    </>
  );
}

export default App;
