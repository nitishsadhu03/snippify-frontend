import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Leftbar from "@/components/Leftbar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils/env";
import { languageOptions } from "@/constants/languages";
import LanguageDropdown from "../components/LanguageDropdown";
import CodeEditorWindow from "../components/CodeEditorWindow";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [snippetName, setSnippetName] = useState("");
  const [snippetDesc, setSnippetDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [codeFileComponents, setCodeFileComponents] = useState([
    {
      title: "",
      fileName: "",
      visibility: "public",
      language: languageOptions[0],
      codeContent: "",
    },
  ]);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/snippets/${id}`);
        const snippetData = response.data;
        setSnippetName(snippetData.title);
        setSnippetDesc(snippetData.description);
        setCodeFileComponents(snippetData.codes.map(code => ({
          title: code.title,
          fileName: code.file_name,
          visibility: code.visibility,
          language: languageOptions.find(opt => opt.label.includes(code.language)) || languageOptions[0],
          codeContent: code.code_content,
        })));
      } catch (error) {
        toast.error("Error fetching snippet details!");
        console.error("Error fetching snippet:", error);
      }
    };

    fetchSnippet();
  }, [id]);

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
    setSubmitting(true);
    const snippetData = {
      title: snippetName,
      description: snippetDesc,
      language: codeFileComponents.map((component) => component.language.label.split(" ")[0]),
      updated_at: new Date().toISOString(),
      codes: codeFileComponents.map((component) => ({
        title: component.title,
        file_name: component.fileName,
        description: component.title,
        language: component.language.label.split(" ")[0],
        updated_at: new Date().toISOString(),
        visibility: component.visibility,
        code_content: component.codeContent,
        numberOfLines: component.codeContent.split("\n").length,
      })),
    };

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/snippets/${id}/`,
        snippetData
      );
      console.log("Snippet updated successfully:", response.data);
      setSubmitting(false);
      toast.success("Snippet updated successfully!");
      navigate('/home');
    } catch (error) {
      toast.error("Error updating snippet!");
      console.error("Error updating snippet:", error);
    }
  };

  return (
    <section className="bg-black">
      <Topbar />
      <div className="flex flex-row">
        <Leftbar />
        <div className="text-white w-[84%] h-full mt-4 py-9 px-9">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Snippet</h1>
            {submitting ? (
              <Button
                className="text-md bg-rose-600 hover:bg-rose-500"
                disabled={submitting}
              >
                Loading...
              </Button>
            ) : (
              <Button className="text-md bg-rose-600 hover:bg-rose-500" onClick={saveSnippet}>
                Save Snippet
              </Button>
            )}
          </div>
          <div className="flex gap-4 items-center mt-8">
            <input
              value={snippetName}
              placeholder="Enter Snippet Name"
              className="w-72 bg-zinc-700 px-3 py-2 rounded-lg text-white outline-none"
              onChange={(e) => setSnippetName(e.target.value)}
            />
            <input
              value={snippetDesc}
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
                  value={component.title}
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
                        value={component.fileName}
                        placeholder="Enter Filename"
                        className="bg-zinc-700 px-3 py-2 rounded-lg text-white outline-none"
                        onChange={(e) =>
                          handleInputChange(index, "fileName", e.target.value)
                        }
                      />
                      <LanguageDropdown
                        selectedLanguage={component.language}
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
                </div>
                <CodeEditorWindow
                  code={component.codeContent}
                  language={component.language.value}
                  onChange={(code) =>
                    handleInputChange(index, "codeContent", code)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default EditSnippet;
