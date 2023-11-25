import { useContext } from "react";
import { InputContext } from "../../contexts/InputContext";
import { Controller } from "react-hook-form";

const FileInput: React.FC = () => {
  const context = useContext(InputContext);

  return (
    <Controller
      name="file"
      control={context.formActions!.control}
      render={({ field }) => (
        <input {...field} type="file" accept=".txt" onChange={(e) => context.setFile(e.target.files[0])} />
      )}
    />
  );
};

export default FileInput;
