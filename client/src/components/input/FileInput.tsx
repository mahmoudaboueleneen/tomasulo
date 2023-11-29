import { ChangeEvent, useContext } from "react";
import { InputContext } from "../../contexts/InputContext";

const FileInput: React.FC = () => {
  const context = useContext(InputContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files ? e.target.files[0] : null;
    if (!selectedFile) {
      context.setInstructionsError("No file selected");
      return;
    }

    let extension = selectedFile.name.split(".").pop();
    if (extension === "txt") {
      context.setInstructions(selectedFile);
      return;
    }
    context.setInstructions(null);
    context.setInstructionsError("Only .txt files are allowed");
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
    </div>
  );
};

export default FileInput;
