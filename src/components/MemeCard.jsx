import React, { useContext, useState } from "react";
import { FaComment, FaDownload, FaRegShareSquare } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { authContext } from "@/providers/AuthProvider";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaShareNodes } from "react-icons/fa6";

export default function MemeCard({ meme }) {
  const { user } = useContext(authContext);
  const [comments, setComments] = useState(() => {
    const storedComments =
      JSON.parse(localStorage.getItem(`comments-${meme.id}`)) || [];
    return storedComments;
  });

  const [likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem(`likes-${meme.id}`);
    return storedLikes ? parseInt(storedLikes, 10) : 0;
  });

  const [isLiked, setIsLiked] = useState(() => {
    const storedIsLiked = localStorage.getItem(`isLiked-${meme.id}`);
    return storedIsLiked === "true";
  });

  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);

  // Handle downloading the image
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = meme.url;
    link.target = "_blank";
    link.download = meme.name || "meme";
    link.click();
  };

  // Function to update user engagement in localStorage
  const updateUserEngagement = (email, points) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex !== -1) {
      users[userIndex].engagement = (users[userIndex].engagement || 0) + points;
    } else {
      users.push({ email, engagement: points });
    }

    localStorage.setItem("users", JSON.stringify(users));
  };

  // Handle liking the meme
  const handleLike = () => {
    if (!user) {
      toast.error("You need to be logged in to like a meme.");
      return;
    }

    const userEmail = user.email;

    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    localStorage.setItem(`likes-${meme.id}`, newLikes);
    localStorage.setItem(`isLiked-${meme.id}`, newIsLiked);

    let usersWhoLiked =
      JSON.parse(localStorage.getItem(`usersLiked-${meme.id}`)) || [];

    if (newIsLiked) {
      usersWhoLiked.push(userEmail);
      updateUserEngagement(userEmail, 1); // Increase engagement
    } else {
      usersWhoLiked = usersWhoLiked.filter((email) => email !== userEmail);
      updateUserEngagement(userEmail, -1); // Decrease engagement
    }

    localStorage.setItem(
      `usersLiked-${meme.id}`,
      JSON.stringify(usersWhoLiked)
    );
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
    <motion.div
      className="border-4 card shadow-sm border-solid px-8"
      animate={{
        borderColor: ["#1EF18C", "#FF5733", "#1EF18C"], // Colors transitioning
      }}
      transition={{
        duration: 3, // Duration of the animation
        repeat: Infinity, // Make the animation repeat forever
        repeatType: "loop", // The animation will loop
      }}
    >
      <h2 className="text-2xl flex items-center justify-center font-bold bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text my-4">
        {meme.name}
      </h2>
      <figure className=" w-full lg:h-[600px] mx-auto flex justify-center items-center">
        <motion.img
          className="rounded-xl w-full h-full  border-4"
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
      </figure>
      <div className=" items-center">
        <div className="flex justify-between items-center w-full">
          {/* Likes Section with Animation */}
          <div className="flex gap-4 justify-center items-center">
            <div className="likes-section my-4 flex items-center justify-center">
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
            <Link className="sm:flex gap-2 hidden " href={`/meme/${meme?.id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }} // Scale up the button on hover
                whileTap={{ scale: 0.95 }} // Slight scale down on click
                transition={{ duration: 0.2 }} // Smooth transition for scale effect
                className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
              >
                <FaComment />
              </motion.button>
              <span className="text-lg flex items-center justify-center font-bold bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text ">
                {comments.length} Comments
              </span>
            </Link>
          </div>

          {/* Download Button */}
          <div className="card-actions my-4">
            <motion.button
              onClick={handleShare}
              className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
              whileHover={{ scale: 1.1 }} // Scale up the button on hover
              whileTap={{ scale: 0.95 }} // Slight scale down on click
              transition={{ duration: 0.2 }} // Smooth transition for scale effect
            >
              <FaShareNodes />
            </motion.button>
            <motion.button
              className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
              whileHover={{ scale: 1.1 }} // Scale up the button on hover
              whileTap={{ scale: 0.95 }} // Slight scale down on click
              transition={{ duration: 0.2 }} // Smooth transition for scale effect
              onClick={handleDownload}
            >
              <FaDownload />
            </motion.button>
            <Link href={`/meme/${meme?.id}`}>
              <motion.button
                className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
                whileHover={{ scale: 1.1 }} // Scale up the button on hover
                whileTap={{ scale: 0.95 }} // Slight scale down on click
                transition={{ duration: 0.2 }} // Smooth transition for scale effect
              >
                <FaRegShareSquare />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
