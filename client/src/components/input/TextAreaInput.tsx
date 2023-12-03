import { useContext } from "react";
import { InputContext } from "../../contexts/InputContext";
import { Controller } from "react-hook-form";

const TextAreaInput: React.FC = () => {
  const context = useContext(InputContext);

  return (
    <Controller
      name="instructions"
      control={context.formActions!.control}
      defaultValue=""
      render={() => (
        <textarea
          value={context.instructions as string}
          placeholder="Enter instructions"
          onChange={(e) => context.setInstructions(e.target.value)}
        />
      )}
    />
  );
};

export default TextAreaInput;
