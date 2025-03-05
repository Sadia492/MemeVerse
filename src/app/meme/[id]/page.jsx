"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { authContext } from "@/providers/AuthProvider";
import { MemeContext } from "@/providers/MemeProvider";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaShareNodes } from "react-icons/fa6";

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
    <PrivateRoute>
      <motion.div
        animate={{
          borderColor: ["#1EF18C", "#FF5733", "#1EF18C"], // Colors transitioning
        }}
        transition={{
          duration: 3, // Duration of the animation
          repeat: Infinity, // Make the animation repeat forever
          repeatType: "loop", // The animation will loop
        }}
        className="w-11/12 mx-auto flex flex-col md:flex-row border-4 p-4 mt-24 gap-12 dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <motion.img
          className="w-full md:w-1/2 border-4 rounded-lg mb-4"
          animate={{
            borderColor: ["#1EF18C", "#FF5733", "#1EF18C"], // Colors transitioning
          }}
          transition={{
            duration: 3, // Duration of the animation
            repeat: Infinity, // Make the animation repeat forever
            repeatType: "loop", // The animation will loop
          }}
          src={meme.url}
          alt={meme.name}
        />
        <div>
          <h1 className="text-2xl flex items-center justify-center font-bold bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text my-4">
            {meme.name}
          </h1>

          {/* Like & Share Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex">
              <motion.button
                animate={{
                  backgroundColor: isLiked ? "#aefb2a" : "#1EF18C", // Change color between red and green
                  scale: isLiked ? 1.1 : 1, // Scale up when liked
                }}
                transition={{
                  duration: 0.3, // Duration of the color transition
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                onClick={handleLike}
                className={`btn border-2 btn-sm mr-2`}
                whileTap={{ scale: 0.95 }} // Slight scale down on click
              >
                <AiOutlineLike className="text-2xl text-white" />
              </motion.button>
              <span className="text-lg flex items-center justify-center font-bold bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text ">
                {likes} Likes
              </span>
            </div>
            <motion.button
              onClick={() => {
                navigator.clipboard
                  .writeText(`${window.location.origin}/meme/${id}`)
                  .then(() => toast.success("Link copied to clipboard!"))
                  .catch(() => toast.error("Failed to copy link"));
              }}
              className="px-4 py-2 bg-myGreen text-white rounded-lg hover:bg-green-700 transition"
              whileHover={{ scale: 1.1 }} // Scale up the button on hover
              whileTap={{ scale: 0.95 }} // Slight scale down on click
              transition={{ duration: 0.2 }} // Smooth transition for scale effect
            >
              <FaShareNodes />
            </motion.button>

            <button
              onClick={toggleCommentSection}
              className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
            >
              <FaComment />{" "}
              {!isCommentSectionVisible
                ? "Click to Open Comment Section"
                : "Click to Close Comment Section"}
            </button>
          </div>

          {/* Comment Section */}
          <div className="mt-4">
            {isCommentSectionVisible && (
              <div className="comments-section mt-4">
                <h3 className="text-lg font-semibold">
                  {comments.length} Comments
                </h3>

                <div className="comments-list mt-2">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="p-2 border-b">
                        <p className="text-sm font-bold">
                          {comment.displayName}
                        </p>
                        <p className="text-sm text-gray-400">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm ">No comments yet.</p>
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
                  <button
                    type="submit"
                    className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
                  >
                    Add Comment
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </PrivateRoute>
  );
}
