import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Comments = ({ id, existingComments }) => {
  const user = useSelector((state) => state.auth.user);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleComment = async () => {
    const commentData = {
      user: user.id,
      snippet: id,
      comment_text: comment,
    };
    console.log(commentData);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/comments/`,
        commentData
      );
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Comment could not be added");
      console.log(error);
    } finally {
      setComment("");
      navigate("/home");
    }
  };

  console.log(existingComments);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // Create a copy of existingComments and reverse it
  const reversedComments = [...existingComments].reverse();

  return (
    <div>
      <h1 className="text-xl font-semibold">Comments</h1>
      <div className="flex gap-3 my-6">
        <img
          src="/assets/logo.png"
          alt="profile"
          className="h-10 w-10 rounded-full"
        />
        <div className="flex flex-col gap-3 w-full">
          <Textarea
            placeholder="Leave a comment"
            className="bg-zinc-700 text-white border-none w-[80%] h-24"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <Button
            className="bg-rose-600 text-white font-semibold hover:bg-rose-500 w-28"
            onClick={handleComment}
            type="submit"
          >
            Comment
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10 mt-10">
        {reversedComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img
              src="/assets/logo.png"
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
            <div className=" flex flex-col rounded-lg w-[80%]">
              <div className="bg-zinc-700 px-4 py-2 rounded-t-lg">
                <h1 className="">
                  {comment.user}
                  <span className="ml-4">
                    commented on {formatDate(comment.updated_at)}
                  </span>
                </h1>
              </div>
              <div className="bg-zinc-800 px-4 py-5 rounded-b-lg">
                <p className="text-white">{comment.comment_text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Comments;
