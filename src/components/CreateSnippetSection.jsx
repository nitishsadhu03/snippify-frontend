import { Button } from "./ui/button";
import { useState } from "react";
import LanguageDropdown from "./LanguageDropdown";
import { languageOptions } from "@/constants/languages";
import CodeEditorWindow from "./CodeEditorWindow";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateSnippetSection = () => {
  const user = useSelector((state) => state.auth.user);

  const [snippetName, setSnippetName] = useState("");
  const [snippetDesc, setSnippetDesc] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(languageOptions[0]);

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const [codeFileComponents, setCodeFileComponents] = useState([
    {
      title: "",
      fileName: "",
      visibility: "public",
      language: languageOptions[0],
      codeContent: "",
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const newCodeFileComponents = [...codeFileComponents];
    newCodeFileComponents[index][field] = value;
    setCodeFileComponents(newCodeFileComponents);
  };

  const addCodeFileComponent = () => {
    if (codeFileComponents.length < 5) {
      setCodeFileComponents([
        ...codeFileComponents,
        {
          title: "",
          fileName: "",
          visibility: "public",
          language: languageOptions[0],
          codeContent: "",
        },
      ]);
    }
  };

  const removeCodeFileComponent = (indexToRemove) => {
    setCodeFileComponents(
      codeFileComponents.filter((_, index) => index !== indexToRemove)
    );
  };

  const saveSnippet = async () => {
    const snippetData = {
      title: snippetName,
      description: snippetDesc,
      language: codeFileComponents.map((component) => component.language.label.split(" ")[0]),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: user.id,
      visibility: "public",
      codes: codeFileComponents.map((component) => ({
        title: component.title,
        file_name: component.fileName,
        description: component.title,
        language: component.language.label.split(" ")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        visibility: component.visibility,
        code_content: component.codeContent,
        numberOfLines: component.codeContent.split("\n").length,
      })),
    };

    console.log(snippetData);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/snippets/`,
        snippetData
      );
      console.log("Snippet saved successfully:", response.data);
      toast.success("Snippet saved successfully!");
    } catch (error) {
      toast.error("Error saving snippet!");
      console.error("Error saving snippet:", error);
    }
  };

  return (
    <section className="text-white w-[84%] h-full mt-4 py-9 px-9">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create A New Snippet</h1>
        <Button
          className="text-md bg-rose-600 hover:bg-rose-500"
          onClick={saveSnippet}
        >
          Save Snippet
        </Button>
      </div>
      <div className="flex gap-4 items-center mt-8">
        <input
          placeholder="Enter Snippet Name"
          className="w-72 bg-zinc-700 px-3 py-2 rounded-lg text-white outline-none"
          onChange={(e) => setSnippetName(e.target.value)}
        />
        <input
          placeholder="Enter Snippet Description"
          className="w-full bg-zinc-700 px-3 py-2 rounded-lg text-white outline-none"
          onChange={(e) => setSnippetDesc(e.target.value)}
        />
      </div>
      <div className="app">
        {codeFileComponents.map((component, index) => (
          <div
            key={index}
            className="mt-8 flex flex-col justify-center items-center px-6 py-4 bg-zinc-900 rounded-xl"
          >
            <input
              placeholder="Enter Code Title"
              className="w-full bg-zinc-700 px-3 py-2 mt-4 rounded-lg text-white outline-none"
              onChange={(e) =>
                handleInputChange(index, "title", e.target.value)
              }
            />
            <div className="flex flex-col justify-center items-center w-full py-4 rounded-xl my-3">
              <div className="flex justify-evenly w-full px-1">
                <div className="flex items-center gap-8 w-full">
                  <input
                    placeholder="Enter Filename"
                    className="bg-zinc-700 px-3 py-2 rounded-lg text-white outline-none"
                    onChange={(e) =>
                      handleInputChange(index, "fileName", e.target.value)
                    }
                  />
                  <LanguageDropdown
                    onSelectChange={(language) => {
                      const newCodeFileComponents = [...codeFileComponents];
                      newCodeFileComponents[index].language = language;
                      setCodeFileComponents(newCodeFileComponents);
                    }}
                  />
                  <Select
                    value={component.visibility}
                    onValueChange={(value) =>
                      handleInputChange(index, "visibility", value)
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-zinc-700 text-white border-none">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 text-white border-none">
                      <SelectGroup>
                        <SelectItem value="public" className="text-white">
                          Public
                        </SelectItem>
                        <SelectItem value="private" className="text-white">
                          Private
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4">
                  {codeFileComponents.length < 5 && (
                    <Button
                      className=" bg-rose-600 hover:bg-rose-500 text-md"
                      onClick={addCodeFileComponent}
                    >
                      Add File
                    </Button>
                  )}
                  {codeFileComponents.length > 1 && (
                    <Button
                      className="bg-rose-600 hover:bg-rose-500 text-md"
                      onClick={() => removeCodeFileComponent(index)}
                    >
                      Remove File
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-6 w-full h-96 flex flex-col justify-center gap-3">
                <CodeEditorWindow
                  code={component.codeContent}
                  onChange={(action, data) => {
                    if (action === "code") {
                      handleInputChange(index, "codeContent", data);
                    }
                  }}
                  language={component.language?.value}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CreateSnippetSection;
