import InputsFormComponent from "./components/Inputs";
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
