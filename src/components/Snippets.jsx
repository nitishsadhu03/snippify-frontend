import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="text-white w-[84%] h-screen mt-14 py-9 px-8">
      <h1 className="text-2xl font-bold">Snippets</h1>
      {snippets.length === 0 ? (
        <p>No snippets found.</p>
      ) : (
        <ul>
          {snippets.map((snippet) => (
            <li key={snippet.id} className="my-4 p-4 bg-zinc-800 rounded-lg">
              <h2 className="text-xl font-semibold">{snippet.title}</h2>
              <p className="mt-2">{snippet.description}</p>
              <pre className="mt-2 overflow-x-auto">
                {snippet.codes.map((code, index) => (
                  <div key={index} className="flex flex-col">
                    <strong className="bg-zinc-700 px-2.5 py-1.5 w-fit rounded-lg">{code.file_name}</strong>
                    <code className="mt-2 bg-zinc-700 p-4 rounded-lg">{code.code_content}</code>
                  </div>
                ))}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Snippets;
