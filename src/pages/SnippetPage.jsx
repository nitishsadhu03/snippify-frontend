import Comments from "@/components/Comments";
import Leftbar from "@/components/Leftbar";
import Topbar from "@/components/Topbar";
import { FileJson, Heart, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";

const SnippetPage = () => {
  const currentSnippet = useSelector((state) => state.snippet.currentSnippet);
  const user = useSelector((state) => state.auth.user);
  const [likeData, setLikeData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/likes/?user=${user.id}&snippet=${currentSnippet.id}`
      );
      if (response.data.length > 0) {
        const likeId = response.data[0].id;
        const likeResponse = await axios.get(`${BACKEND_URL}/api/likes/${likeId}/`);
        setLikeData(likeResponse.data);
        setIsLiked(likeResponse.data.is_liked);
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  useEffect(() => {
    if (currentSnippet && user) {
      fetchLikeStatus();
    }
  }, [currentSnippet, user]);

  const handleLike = async () => {
    if (likeData) {
      // Update like status
      try {
        await axios.patch(`${BACKEND_URL}/api/likes/${likeData.id}/`, {
          user: user.id,
          snippet: currentSnippet.id,
          is_liked: !isLiked,
        });
        setIsLiked(!isLiked);
      } catch (error) {
        console.error("Error updating like status:", error);
      }
    } else {
      // Create new like
      try {
        const response = await axios.post(`${BACKEND_URL}/api/likes/`, {
          user: user.id,
          snippet: currentSnippet.id,
          is_liked: true,
        });
        setLikeData(response.data);
        setIsLiked(true);
      } catch (error) {
        console.error("Error creating like:", error);
      }
    }
  };

  if (!currentSnippet) {
    return (
      <div className="text-white w-[84%] h-screen mt-14 py-9 px-8">
        No snippet selected.
      </div>
    );
  }

  console.log(currentSnippet);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formattedDate = formatDate(currentSnippet.updated_at);

  return (
    <section className="bg-black">
      <Topbar />
      <div className="flex flex-row">
        <Leftbar />

        <div className="text-white w-[84%] h-full min-h-screen mt-4 py-9 px-8 bg-black">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{currentSnippet.title}</h1>
              <p className="mt-2">{currentSnippet.description}</p>
              <div className="flex gap-3 mt-2">
                {currentSnippet.language.map((lang, id) => (
                  <div
                    key={id}
                    className="bg-rose-600 px-3 py-1 text-sm font-semibold rounded-full"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 justify-center items-center">
              <div className="flex gap-4">
                <div
                  className="bg-zinc-700 rounded-lg p-3 w-fit h-fit cursor-pointer"
                  onClick={handleLike}
                >
                  <Heart
                    className={`${
                      isLiked ? "text-rose-600 fill-rose-600" : "text-rose-600"
                    } transition ease-in-out delay-150 hover:scale-125 duration-300`}
                  />
                </div>
                <div className="bg-zinc-700 rounded-lg p-3 w-fit h-fit">
                  <Share2 className="text-green-600 transition ease-in-out delay-150 hover:scale-125 duration-300" />
                </div>
              </div>
              <div className="w-full">
                <p className="bg-zinc-700 rounded-lg px-2 py-1 w-full">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
          <pre className="overflow-x-auto">
            {currentSnippet.codes.map((code, index) => (
              <div key={index} className="flex flex-col my-8 overflow-hidden">
                <h1 className="text-lg font-semibold">
                  Description: {code.description}
                </h1>
                <p className="bg-zinc-700 w-full px-2 py-2 rounded-t-lg mt-2 flex gap-2 items-center">
                <FileJson />{code.file_name}
                </p>
                <SyntaxHighlighter
                  language={code.language}
                  style={a11yDark}
                  className="rounded-b-lg"
                  showLineNumbers
                  wrapLongLines
                >
                  {code.code_content}
                </SyntaxHighlighter>
                <hr className="mt-6"></hr>
              </div>
            ))}
          </pre>
          <Comments id={currentSnippet.id} existingComments={currentSnippet.comments}/>
        </div>
      </div>
    </section>
  );
};

export default SnippetPage;
