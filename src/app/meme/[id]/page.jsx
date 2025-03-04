"use client";
import { authContext } from "@/providers/AuthProvider";
import { MemeContext } from "@/providers/MemeProvider";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

export default function MemeDetailsPage() {
  const { memes } = useContext(MemeContext);
  const { id } = useParams(); // ✅ Extracts the ID correctly
  const { user } = useContext(authContext);

  const [meme, setMeme] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // ✅ Load data safely in useEffect (avoids SSR issues)
  useEffect(() => {
    if (!id || !memes) return;

    const findMeme = memes.find((m) => m.id === id);
    setMeme(findMeme);

    if (typeof window !== "undefined") {
      const storedIsLiked = localStorage.getItem(`isLiked-${id}`);
      setIsLiked(storedIsLiked === "true");

      const storedLikes = localStorage.getItem(`likes-${id}`);
      setLikes(storedLikes ? parseInt(storedLikes, 10) : 0);

      const storedComments = localStorage.getItem(`comments-${id}`);
      setComments(storedComments ? JSON.parse(storedComments) : []);
    }
  }, [id, memes]);

  // ✅ Handle Like Toggle
  const handleLike = () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);

    if (typeof window !== "undefined") {
      localStorage.setItem(`likes-${id}`, newLikes);
      localStorage.setItem(`isLiked-${id}`, (!isLiked).toString());
    }
  };

  // ✅ Handle Meme Sharing
  const handleShare = () => {
    const memeUrl = `${window.location.origin}/meme/${id}`;
    navigator.clipboard
      .writeText(memeUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  // ✅ Handle Comment Submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      displayName: user?.displayName || "Anonymous",
      text: comment,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setComment("");

    if (typeof window !== "undefined") {
      localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    }
  };

  // ✅ Toggle Comment Section
  const toggleCommentSection = () => {
    setIsCommentSectionVisible(!isCommentSectionVisible);
  };

  if (!meme) return <p>Loading meme details...</p>;

  return (
    <div className="w-11/12 mx-auto flex flex-col md:flex-row p-4 mt-24 gap-6 dark:bg-gray-800 rounded-lg shadow-lg">
      <Toaster /> {/* Toast Notifications */}
      <img
        src={meme.url}
        alt={meme.name}
        className="w-full md:w-1/2 border-4 rounded-lg mb-4"
      />
      <div>
        <h1 className="text-2xl font-bold mb-2 text-center">{meme.name}</h1>

        {/* Like & Share Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`btn btn-outline btn-sm ${
              isLiked ? "text-blue-500" : ""
            }`}
          >
            <AiOutlineLike />
          </button>
          <span className="text-sm text-gray-600">{likes} Likes</span>

          <button
            onClick={handleShare}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
          >
            🔗 Share
          </button>
        </div>

        {/* Comment Section */}
        <div className="mt-4">
          <button
            onClick={toggleCommentSection}
            className="btn btn-secondary w-full"
          >
            <FaComment /> {comments.length} Comments
          </button>

          {isCommentSectionVisible && (
            <div className="comments-section mt-4">
              <h3 className="text-lg font-semibold">Comments</h3>

              <div className="comments-list mt-2">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="p-2 border-b">
                      <p className="text-sm font-bold">{comment.displayName}</p>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No comments yet.</p>
                )}
              </div>

              <form
                onSubmit={handleCommentSubmit}
                className="comment-form mt-4"
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input input-bordered w-full mb-2"
                />
                <button type="submit" className="btn btn-secondary w-full">
                  Add Comment
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
