import Leftbar from "@/components/Leftbar";
import Topbar from "@/components/Topbar";
import { setCurrentSnippet } from "@/features/snippets/snippetSlice";
import { BACKEND_URL } from "@/utils/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Edit, Heart, MessageSquareText, Share2 } from "lucide-react";

const PublicProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users/${id}/`);
        const profile = response.data;
        setProfileData(profile);
        setLoading(false);

        // Fetch snippets based on the IDs
        if (profile.snippets && profile.snippets.length > 0) {
          const snippetRequests = profile.snippets.map((snippetId) =>
            axios.get(`${BACKEND_URL}/api/snippets/${snippetId}`)
          );
          const snippetsResponses = await Promise.all(snippetRequests);
          setSnippets(snippetsResponses.map((res) => res.data));
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  console.log("Snippets:", snippets);

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

  const handleViewFullSnippet = (snippet) => {
    dispatch(setCurrentSnippet(snippet));
    navigate(`/snippet/${snippet.id}`);
  };

  return (
    <section className="bg-black">
      <Topbar />
      <div className="flex flex-row">
        <Leftbar />
        <div className="text-white w-[84%] h-full min-h-screen mt-4 py-9 px-8 bg-black">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <div className="flex justify-center items-center">
            <div className="my-16 bg-gradient-to-b from-zinc-800 to-zinc-500 rounded-2xl w-1/2">
              <div className="flex items-center justify-center w-full ">
                <img
                  src={profileData.image || "/assets/defaultProfile.png"}
                  alt="profile"
                  className="w-36 h-36 rounded-full object-cover bg-zinc-800 -translate-y-14"
                />
              </div>
              <div className="flex flex-col justify-center items-center w-full pb-8">
                <h2 className="text-2xl font-semibold capitalize">
                  {profileData.user?.name || "N/A"}
                </h2>
                <p className="mt-2 text-lg">
                  {profileData.bio || "No bio available."}
                </p>

                <div className="mt-8 flex justify-between w-1/3 text-center">
                  <div className="w-36">
                    <p className="text-xl font-bold">
                      {profileData.snippets_count?.total || 0}
                    </p>
                    <h3 className="font-semibold">Snippets</h3>
                  </div>
                  <div className="w-36">
                    <p className="text-xl font-bold">
                      {profileData.liked_posts_count || 0}
                    </p>
                    <h3 className="font-semibold">Likes</h3>
                  </div>
                  <div className="w-36">
                    <p className="text-xl font-bold">
                      {profileData.commented_posts_count || 0}
                    </p>
                    <h3 className="font-semibold">Comments</h3>
                  </div>
                </div>
                <div className="mt-8 w-full">
                  <h3 className="font-semibold text-lg text-center">
                    Tech Stack
                  </h3>
                  {profileData.tech_stack &&
                  profileData.tech_stack.length > 0 ? (
                    <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center items-center my-3 px-4">
                      {profileData.tech_stack.map((tech, index) => (
                        <p
                          key={index}
                          className="bg-rose-500 px-3 py-1 rounded-full text-white font-semibold"
                        >
                          {tech}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p>No tech stack available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full">
            <h3 className="font-semibold text-2xl">Snippets</h3>
            {snippets.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-4">
                {snippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="flex flex-col gap-2 rounded-lg px-4 py-4 bg-gradient-to-b from-zinc-800 to-zinc-500"
                  >
                    <div className="mb-1 rounded-lg h-72 overflow-hidden flex flex-col justify-between p-2">
                      <div className="">
                        <h2 className="text-xl font-semibold">
                          {snippet.title}
                        </h2>
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
                        <Heart className="text-rose-600 fill-rose-600" />
                        {snippet.liked_by_count}
                      </p>
                      <p className="flex gap-2 items-center justify-center">
                        <MessageSquareText className="text-blue-500" />
                        {snippet.comments_count}
                      </p>
                      <Share2 className="text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No snippets available.</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default PublicProfile;
