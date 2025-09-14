import { FaFileImage } from "react-icons/fa";
import type { ChangeEventHandler } from "react";

type FileInputProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
};

function FileInput({ onChange }: FileInputProps) {
  return (
    <label htmlFor="file-upload" className="file-upload" style={{ cursor: "pointer" }}>
      Upload your image 
      <FaFileImage color="black" className="file-symbol" />
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
      />
    </label>
  );
}

export default FileInput;