import React, { useContext, useState } from "react";
import { FaComment, FaDownload } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { authContext } from "@/providers/AuthProvider";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MemeCard({ meme }) {
  const { user } = useContext(authContext);

  const [likes, setLikes] = useState(() => {
    // Get the stored likes count from localStorage on initial load
    const storedLikes = localStorage.getItem(`likes-${meme.id}`);
    return storedLikes ? parseInt(storedLikes, 10) : 0; // If no likes in localStorage, default to 0
  });
  const [isLiked, setIsLiked] = useState(() => {
    // Get the stored like status from localStorage on initial load
    const storedIsLiked = localStorage.getItem(`isLiked-${meme.id}`);
    return storedIsLiked === "true"; // Convert string "true"/"false" to boolean
  });
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false); // State for comment section visibility

  // Handle downloading the image
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = meme.url;
    link.target = "_blank";
    link.download = meme.name || "meme"; // Set default download name as meme
    link.click();
  };

  // Handle liking the meme
  const handleLike = () => {
    const newLikes = isLiked ? likes - 1 : likes + 1; // Increment or decrement likes
    setLikes(newLikes); // Update likes state

    const newIsLiked = !isLiked; // Toggle like state
    setIsLiked(newIsLiked);

    // Store the updated likes count and like status in localStorage
    localStorage.setItem(`likes-${meme.id}`, newLikes);
  };

  // Function to handle copying the meme link to the clipboard
  const handleShare = () => {
    const memeUrl = `${window.location.origin}/meme/${meme.id}`;
    navigator.clipboard
      .writeText(memeUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch((err) => toast.error("Failed to copy link: " + err));
  };

  return (
    <div className="card shadow-sm">
      <h2 className="card-title px-10">{meme.name}</h2>
      <figure className="px-10 pt-10 w-full lg:h-[600px] mx-auto flex justify-center items-center">
        <img
          src={meme.url}
          alt={meme.name}
          className="rounded-xl w-full h-full object-cover border-4"
        />
      </figure>
      <div className="card-body items-center">
        <div className="flex justify-between items-center w-full">
          {/* Likes Section with Animation */}
          <div className="likes-section my-4 flex items-center justify-center">
            <button
              onClick={handleLike}
              className={`btn btn-outline btn-sm mr-2 ${
                isLiked ? "animate-like" : ""
              }`} // Animation when liked
            >
              <AiOutlineLike />
            </button>
            <span className="text-sm text-gray-600">{likes} Likes</span>
          </div>

          <div>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔗 Share
            </button>
          </div>

          {/* Download Button */}
          <div className="card-actions my-4">
            <Link className="btn btn-secondary" href={`/meme/${meme.id}`}>
              Details
            </Link>
            <button className="btn btn-primary" onClick={handleDownload}>
              <FaDownload />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
