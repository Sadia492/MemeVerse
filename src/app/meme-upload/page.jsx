"use client";
import React, { useState, useContext } from "react";
import axios from "axios";
import { authContext } from "@/providers/AuthProvider";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useContext(authContext); // Get user info from context
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImageUrl(URL.createObjectURL(file)); // Preview before upload
    }
  };

  // Handle caption input
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  // Upload image to ImgBB and store meme data in localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption.trim()) {
      toast.error("Please upload an image and add a caption!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_Image_Hosting_Key}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = response.data.data.url;

      // Create meme object
      const memeData = {
        id: Date.now().toString(), // Unique ID
        url: imageUrl,
        name: caption,
        email: user?.email || "anonymous", // Store user email
        category: "new",
        date: new Date().toISOString(), // Timestamp for sorting
      };

      // Retrieve existing memes from localStorage
      const storedMemes = JSON.parse(localStorage.getItem("memes")) || [];
      const updatedMemes = [memeData, ...storedMemes]; // Add new meme
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      toast.success("Meme uploaded successfully!");
      setImage(null);
      setCaption("");
      setPreviewImageUrl(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-24">
      <h1 className="text-4xl font-bold text-center mb-6">Upload Your Meme</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 border shadow-lg rounded-md"
      >
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Upload Meme Image
          </label>
          <input
            type="file"
            accept="image/*, .gif"
            onChange={handleImageUpload}
            className="file-input file-input-bordered file-input-primary w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Meme Caption
          </label>
          <textarea
            value={caption}
            onChange={handleCaptionChange}
            placeholder="Add a funny caption here..."
            className="textarea textarea-bordered w-full h-32"
          ></textarea>
        </div>

        <div className="mb-4">
          {previewImageUrl && (
            <div className="flex flex-col items-center">
              <img
                src={previewImageUrl}
                alt="Preview"
                className="w-64 h-auto mb-4"
              />
              <h2 className="text-lg font-semibold">Preview Caption:</h2>
              <p>{caption}</p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Meme"}
          </button>
        </div>
      </form>
    </div>
  );
}
