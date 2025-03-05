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
  const { id } = useParams();
  const { user } = useContext(authContext);

  const [meme, setMeme] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!id || !memes) return;

    const findMeme = memes.find((m) => m.id === id);
    setMeme(findMeme);

    if (typeof window !== "undefined") {
      setIsLiked(localStorage.getItem(`isLiked-${id}`) === "true");
      setLikes(parseInt(localStorage.getItem(`likes-${id}`), 10) || 0);
      setComments(JSON.parse(localStorage.getItem(`comments-${id}`)) || []);
    }
  }, [id, memes]);

  // ✅ Increase User Engagement
  const increaseUserEngagement = () => {
    if (!user) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === user.email);

    if (userIndex !== -1) {
      users[userIndex].engagement = (users[userIndex].engagement || 0) + 1;
    } else {
      users.push({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        engagement: 1,
      });
    }

    localStorage.setItem("users", JSON.stringify(users));
  };

  // ✅ Handle Like Toggle
  const handleLike = () => {
    if (!user) {
      toast.error("You need to be logged in to like a meme.");
      return;
    }

    const userEmail = user.email;
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);

    localStorage.setItem(`likes-${id}`, newLikes);
    localStorage.setItem(`isLiked-${id}`, !isLiked);

    let usersWhoLiked =
      JSON.parse(localStorage.getItem(`usersLiked-${id}`)) || [];

    if (!isLiked) {
      usersWhoLiked.push(userEmail);
      increaseUserEngagement(); // Increase engagement only when liking
    } else {
      usersWhoLiked = usersWhoLiked.filter((email) => email !== userEmail);
    }

    localStorage.setItem(`usersLiked-${id}`, JSON.stringify(usersWhoLiked));
  };

  // ✅ Handle Comment Submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    const newComment = {
      displayName: user?.displayName || "Anonymous",
      text: comment,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setComment("");

    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    increaseUserEngagement(); // Increase engagement when commenting
  };

  const toggleCommentSection = () => {
    setIsCommentSectionVisible(!isCommentSectionVisible);
  };

  if (!meme) return <p>Loading meme details...</p>;

  return (
    <div className="w-11/12 mx-auto flex flex-col md:flex-row p-4 mt-24 gap-6 dark:bg-gray-800 rounded-lg shadow-lg">
      <Toaster />
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
            onClick={() => {
              navigator.clipboard
                .writeText(`${window.location.origin}/meme/${id}`)
                .then(() => toast.success("Link copied to clipboard!"))
                .catch(() => toast.error("Failed to copy link"));
            }}
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
