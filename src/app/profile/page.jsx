"use client";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { authContext } from "@/providers/AuthProvider";
import { MemeContext } from "@/providers/MemeProvider";
import MemeCard from "@/components/MemeCard";

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

  const handleEdit = () => {
    setEditMode(true);
    setBio(user?.bio || ""); // Pre-fill bio if it exists
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const avatar = form.avatar.files[0];
    const bio = form.bio.value; // Getting bio from form

    try {
      let imageURL = user?.photoURL; // Default to current image URL

      if (avatar) {
        const formData = new FormData();
        formData.append("image", avatar);

        const res = await axios.post(image_hosting_api, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });

        if (res.data.success) {
          imageURL = res.data.data.url; // Get the new image URL
        } else {
          throw new Error("Image upload failed");
        }
      }

      const updatedUserData = {
        displayName: name,
        photoURL: imageURL, // Use the new image URL if uploaded
        bio: bio, // Include bio in the update
      };

      // Update user profile in Firebase
      await updateUser(updatedUserData);

      // Display success toast
      toast.success("Profile updated successfully!");

      form.reset(); // Reset form fields only after successful submission
    } catch (error) {
      toast.error(error.message); // Display error toast if any error occurs
    } finally {
      setLoading(false);
      setEditMode(false); // Exit edit mode after saving
    }
  };

  return (
    <div className="mt-24">
      <div className="flex justify-center items-center">
        <div className="shadow-2xl rounded-2xl md:w-4/5 lg:w-3/5">
          <div className="flex flex-col items-center justify-center p-8">
            <img
              alt="profile"
              src={user?.photoURL}
              className="mx-auto object-cover rounded-full h-24 w-24 border-2 border-white"
            />
            <p>{user?.bio}</p>

            {!editMode && (
              <div className="mt-4 w-full flex justify-end">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="btn bg-gradient-to-r text-white from-primary to-secondary"
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
                  className="file-input file-input-bordered file-input-error w-full"
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
                    className="btn bg-gradient-to-r text-white from-primary to-secondary"
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <h2>User Uploaded memes</h2>
        <div className="grid grid-cols-2">
          {userMemes.map((meme) => (
            <MemeCard key={meme.id} meme={meme}></MemeCard>
          ))}
        </div>
      </div>
      {/* Displaying Liked Memes */}
      <div>
        <h2>User Liked Memes</h2>
        <div className="grid grid-cols-2 gap-4">
          {likedMemes.length > 0 ? (
            likedMemes.map((meme) => <MemeCard key={meme.id} meme={meme} />)
          ) : (
            <p>No memes liked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
