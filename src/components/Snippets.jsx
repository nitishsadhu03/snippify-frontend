import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquareText, Share2 } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useDispatch } from "react-redux";
import { setCurrentSnippet } from "@/features/snippets/snippetSlice";

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/snippets/`);
        setSnippets(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const handleViewFullSnippet = (snippet) => {
    dispatch(setCurrentSnippet(snippet));
    navigate(`/snippet/${snippet.id}`);
  };

  if (loading) {
    return (
      <div className="text-white w-[84%] h-screen mt-14 py-9 px-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white w-[84%] h-screen mt-14 py-9 px-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="text-white w-[84%] h-screen mt-4 py-9 px-8">
      <h1 className="text-2xl font-bold">Snippets</h1>
      {snippets.length === 0 ? (
        <p>No snippets found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-4">
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="flex flex-col gap-2 rounded-lg px-4 py-4 bg-gradient-to-b from-zinc-800 to-zinc-500"
            >
              <div className="mb-1 rounded-lg h-72 overflow-hidden flex flex-col justify-between p-2">
                <div className="">
                  <h2 className="text-xl font-semibold">{snippet.title}</h2>
                  <p className="mt-2">{snippet.description}</p>
                  <div className="flex gap-3 mt-2">
                    {snippet.language.map((lang, id) => (
                      <div
                        key={id}
                        className="bg-rose-600 px-3 py-1 text-sm font-semibold rounded-full"
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                  <pre className="overflow-x-auto">
                    {snippet.codes.map((code, index) => (
                      <div
                        key={index}
                        className="flex flex-col my-6 overflow-hidden"
                      >
                        <SyntaxHighlighter
                          language={code.language}
                          style={a11yDark}
                          className="rounded-lg mt-2"
                          showLineNumbers
                          wrapLongLines
                        >
                          {code.code_content}
                        </SyntaxHighlighter>
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
              <button
                onClick={() => handleViewFullSnippet(snippet)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-lg"
              >
                <p>View Full Snippet</p>
              </button>
              <div className="bg-zinc-800 flex justify-evenly py-2.5 px-2 rounded-lg">
              <p className="flex gap-2 items-center justify-center">
                <Heart className="text-rose-600 fill-rose-600 transition ease-in-out delay-150 hover:scale-125 duration-300" />
                {snippet.liked_by_count}

              </p>
              <p className="flex gap-2 items-center justify-center">
                <MessageSquareText className="text-blue-500 transition ease-in-out delay-150 hover:scale-125 duration-300" />
                {snippet.comments_count}
              </p>
                <Share2 className="text-green-600 transition ease-in-out delay-150 hover:scale-125 duration-300" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Snippets;
