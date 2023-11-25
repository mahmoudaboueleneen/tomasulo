import { useContext } from "react";
import { InputContext } from "../../contexts/InputContext";
import { Controller } from "react-hook-form";

const InstructionsInput: React.FC = () => {
  const context = useContext(InputContext);

  return (
    <Controller
      name="instructions"
      control={context.formActions!.control}
      defaultValue=""
      render={({ field }) => (
        <textarea placeholder="Enter instructions" onChange={(e) => context.setInstructions(e.target.value)} />
      )}
    />
  );
};

export default InstructionsInput;
