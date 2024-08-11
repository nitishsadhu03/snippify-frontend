import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Heart,
  MessageSquareText,
  SearchIcon,
  Share2,
} from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

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

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(search.toLowerCase()) ||
      snippet.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      inputRef.current.focus();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
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
    <div className="text-white w-[84%] h-full min-h-screen mt-4 py-9 px-8 bg-black">
      <h1 className="text-2xl font-bold">Snippets</h1>
      <div className="relative">
        <div
          className="absolute top-1 left-1 flex items-center h-full translate-x-2 cursor-pointer"
          onClick={handleToggleExpand}
        >
          <SearchIcon size={26} color="white" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by snippet title or description"
          onFocus={handleToggleExpand}
          onBlur={handleToggleExpand}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`transition-all duration-300 px-5 py-3  mt-4 mb-2 rounded-lg bg-zinc-800 text-white ${
            isExpanded
              ? "w-2/3 pl-14 pr-4 border border-gray-600"
              : "w-1/2 pl-14 pr-4 border-none"
          } focus:outline-none`}
        />
      </div>
      {snippets.length === 0 ? (
        <p>No snippets found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-4">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="flex flex-col gap-2 rounded-lg px-4 py-4 bg-gradient-to-b from-zinc-800 to-zinc-500"
            >
              <div className="mb-1 rounded-lg h-72 overflow-hidden flex flex-col justify-between p-2">
                <div className="flex justify-between items-center -mt-2 bg-zinc-900 px-3 py-2 rounded-lg">
                  <div className="flex gap-2 items-center">
                    <img
                      src={snippet.owner.image || "/assets/defaultProfile.png"}
                      alt="profile"
                      className="h-7 w-7 rounded-full"
                    />
                    <p className="font-semibold">{snippet.owner.user.name}</p>
                  </div>
                  <div className="">
                    <p className="w-full font-semibold">
                      created on {formatDate(snippet.created_at)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
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
                        className="flex flex-col overflow-hidden"
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
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-lg"
              >
                <p>View Full Snippet</p>
              </button>
              <div className="bg-zinc-900 flex justify-evenly py-2.5 px-2 rounded-lg">
                <p className="flex gap-2 items-center justify-center">
                  <Heart className="text-rose-600 fill-rose-600" />
                  {snippet.liked_by_count}
                </p>
                <p className="flex gap-2 items-center justify-center">
                  <MessageSquareText className="text-blue-500" />
                  {snippet.comments_count}
                </p>
                <Bookmark className="text-green-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Snippets;
