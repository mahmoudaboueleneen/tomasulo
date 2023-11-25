import InputForm from "./components/input/InputForm";
import InputContextProvider from "./contexts/InputContext";

function App() {
  return (
    <InputContextProvider>
      <InputForm />
    </InputContextProvider>
  );
}

export default App;
