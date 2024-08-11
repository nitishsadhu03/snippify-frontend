import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code }) => {
  const [value, setValue] = useState(code || "");

  useEffect(() => {
    setValue(code || "");
  }, [code]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange(value);
  };

  return (
    <div className="overlay rounded-lg overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="25rem"
        width="100%"
        language={language || "javascript"}
        value={value}
        theme="vs-dark"
        onChange={handleEditorChange}
      />
    </div>
  );
};


export default CodeEditorWindow;
