"use client";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { authContext } from "@/providers/AuthProvider";
import { MemeContext } from "@/providers/MemeProvider";
import MemeCard from "@/components/MemeCard";
import PrivateRoute from "@/components/PrivateRoute";
import { motion } from "framer-motion";

const image_hosting_key = process.env.NEXT_PUBLIC_Image_Hosting_Key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(""); // Manage the bio field
  const { user, setLoading, updateUser, loading } = useContext(authContext);
  const { memes } = useContext(MemeContext);
  const [userMemes, SetUserMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);

  // Filter memes the user liked
  useEffect(() => {
    const userLikedMemes = memes.filter((meme) => {
      // Get the list of users who liked this meme from localStorage
      const usersWhoLiked =
        JSON.parse(localStorage.getItem(`usersLiked-${meme.id}`)) || [];
      return usersWhoLiked.includes(user?.email); // Check if the user's email is in the list
    });
    setLikedMemes(userLikedMemes); // Set the liked memes in the state

    const userMemes = memes.filter((m) => m?.email === user?.email);
    SetUserMemes(userMemes);
  }, [user?.email, memes]);

  // Initialize bio from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find((u) => u.email === user?.email);
    if (currentUser) {
      setBio(currentUser.bio || ""); // Set the bio from localStorage or default to an empty string
    }
  }, [user?.email]); // Run when the user's email changes

  const handleEdit = () => {
    setEditMode(true);
    setBio(user?.bio || ""); // Pre-fill bio if it exists
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const avatar = form.avatar.files[0];
    const bio = form.bio.value;

    try {
      let imageURL = user?.photoURL;

      if (avatar) {
        const formData = new FormData();
        formData.append("image", avatar);

        const res = await axios.post(image_hosting_api, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });

        if (res.data.success) {
          imageURL = res.data.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const updatedUserData = {
        displayName: name,
        photoURL: imageURL,
        bio: bio,
      };

      await updateUser(updatedUserData);

      // Update localStorage users array
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((u) =>
        u.email === user.email ? { ...u, ...updatedUserData } : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setBio(bio); // Update bio state
      toast.success("Profile updated successfully!");
      form.reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="mt-24 w-11/12 mx-auto">
        <div className="flex justify-center items-center">
          <div className="shadow-2xl rounded-2xl w-full">
            <h2 className="text-3xl flex items-center justify-center font-bold bg-gradient-to-r mb-6 from-myYellow to-myGreen text-transparent bg-clip-text">
              My Profile
            </h2>
            <motion.div
              animate={{
                borderColor: ["#1EF18C", "#FF5733", "#1EF18C"], // Colors transitioning
              }}
              transition={{
                duration: 3, // Duration of the animation
                repeat: Infinity, // Make the animation repeat forever
                repeatType: "loop", // The animation will loop
              }}
              className="flex flex-col items-center justify-center p-8 border-4"
            >
              <img
                alt="profile"
                src={user?.photoURL}
                className="mx-auto object-cover rounded-full h-24 w-24 border-2 border-white"
              />
              <p>{bio}</p>

              {!editMode && (
                <div className="mt-4 w-full flex justify-end">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
                  >
                    Edit
                  </button>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 w-full gap-6"
              >
                {/* Avatar */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Avatar</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    name="avatar"
                    className="file-input file-input-bordered file-input-accent w-full"
                    accept="image/*"
                    disabled={!editMode}
                  />
                </div>

                {/* Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <br />
                  <input
                    type="text"
                    name="name"
                    defaultValue={user?.displayName}
                    className="input input-bordered w-full"
                    disabled={!editMode}
                  />
                </div>

                {/* Bio */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <br />
                  <textarea
                    name="bio"
                    value={bio} // Ensure the state value is reflected
                    onChange={(e) => setBio(e.target.value)} // Manage bio field input
                    className="input input-bordered w-full"
                    disabled={!editMode}
                    rows="4"
                  />
                </div>

                {/* Email */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <br />
                  <input
                    type="email"
                    name="email"
                    defaultValue={user?.email}
                    className="input input-bordered w-full"
                    disabled // Email is always disabled
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-center md:col-span-2 gap-4">
                  {editMode && (
                    <button
                      type="submit"
                      className="btn bg-gradient-to-r from-myGreen to-myYellow text-white"
                    >
                      Save
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl flex items-center justify-center font-bold bg-gradient-to-r mb-6 from-myYellow to-myGreen text-transparent bg-clip-text">
            Your Uploaded memes
          </h2>
          <div className="grid grid-cols-2">
            {userMemes.length > 0 ? (
              userMemes.map((meme) => <MemeCard key={meme.id} meme={meme} />)
            ) : (
              <p className="font-bold text-2xl">No memes uploaded yet.</p>
            )}
          </div>
        </div>
        {/* Displaying Liked Memes */}
        <div>
          <h2 className="text-xl flex items-center justify-center font-bold bg-gradient-to-r mb-6 from-myYellow to-myGreen text-transparent bg-clip-text">
            Your Liked Memes
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {likedMemes.length > 0 ? (
              likedMemes.map((meme) => <MemeCard key={meme.id} meme={meme} />)
            ) : (
              <p className="font-bold text-2xl">No memes liked yet.</p>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
