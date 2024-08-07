import Comments from "@/components/Comments";
import Leftbar from "@/components/Leftbar";
import Topbar from "@/components/Topbar";
import { FileJson, Heart, Pencil, Share2, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";
import { Link, useNavigate } from "react-router-dom";

const SnippetPage = () => {
  const currentSnippet = useSelector((state) => state.snippet.currentSnippet);
  const user = useSelector((state) => state.auth.user);
  const [likeData, setLikeData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchLikeData = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/likes/?snippet=${currentSnippet.id}`
      );
      const likes = response.data;

      // Count only likes where is_liked is true
      const likedCount = likes.filter((like) => like.is_liked).length;

      // Find the current user's like status
      const userLike = likes.find((like) => like.user === user.id);
      if (userLike) {
        setLikeData(userLike);
        setIsLiked(userLike.is_liked);
      } else {
        setLikeData(null);
        setIsLiked(false);
      }

      // Set the like count
      setLikeCount(likedCount);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  useEffect(() => {
    if (currentSnippet && user) {
      fetchLikeData();
    }
  }, [currentSnippet, user]);

  const handleLike = async () => {
    try {
      if (likeData) {
        // Update like status
        await axios.patch(`${BACKEND_URL}/api/likes/${likeData.id}/`, {
          user: user.id,
          snippet: currentSnippet.id,
          is_liked: !isLiked,
        });
        setIsLiked(!isLiked);

        // Re-fetch like data to update the count
        fetchLikeData();
      } else {
        // Create new like
        await axios.post(`${BACKEND_URL}/api/likes/`, {
          user: user.id,
          snippet: currentSnippet.id,
          is_liked: true,
        });
        setLikeData({
          user: user.id,
          snippet: currentSnippet.id,
          is_liked: true,
        });
        setIsLiked(true);

        // Re-fetch like data to update the count
        fetchLikeData();
      }
    } catch (error) {
      console.error("Error updating like status:", error);
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
  console.log(user);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formattedDate = formatDate(currentSnippet.updated_at);

  console.log(user.id === currentSnippet.owner);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/snippets/${currentSnippet.id}/`);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting snippet:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <section className="bg-black">
      <Topbar />
      <div className="flex flex-row">
        <Leftbar />

        <div className="text-white w-[84%] h-full min-h-screen mt-4 py-9 px-8 bg-black">
          <div className="flex justify-between items-center">
            <div className="flex gap-14">
              <div className="max-w-[40rem]">
                <h1 className="text-2xl font-bold break-words">
                  {currentSnippet.title}
                </h1>
                <p className="mt-2 break-words">{currentSnippet.description}</p>
                <div className="flex flex-wrap gap-3 mt-2">
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
              {user.id === currentSnippet.owner && (
                <div className="flex gap-4 items-start">
                  <Link
                    to={`/edit-snippet/${currentSnippet.id}`}
                    className="bg-zinc-700 rounded-lg p-3 w-fit h-fit cursor-pointer"
                  >
                    <Pencil className="text-green-600 transition ease-in-out delay-150 hover:scale-125 duration-300" />
                  </Link>
                  <div
                    className="bg-zinc-700 rounded-lg p-3 w-fit h-fit cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Trash className="text-red-600 transition ease-in-out delay-150 hover:scale-125 duration-300" />
                  </div>
                </div>
              )}
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
                  <FileJson />
                  {code.file_name}
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
          <Comments
            id={currentSnippet.id}
            existingComments={currentSnippet.comments}
          />
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this snippet?</p>
            <div className="flex gap-4 mt-8 w-full">
              <button
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-500 text-white py-2 px-4 rounded-lg w-1/2"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg w-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SnippetPage;
