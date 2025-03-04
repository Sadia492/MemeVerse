"use client";
import React, { useState } from "react";
import axios from "axios";

export default function page() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImageUrl(URL.createObjectURL(file)); // Preview image before upload
    }
  };

  // Handle caption input
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  // Handle AI-based meme caption generation (Simulated function)
  const generateAICaption = async () => {
    setLoading(true);
    try {
      // Prepare the data to be sent as URL-encoded parameters
      const formData = new URLSearchParams({
        template_id: "61579", // Meme template ID
        text0: "Generated caption from AI!", // Caption text
        text1: caption, // The second text field (your caption)
        username: "your_username", // Replace with your Imgflip username
        password: "your_password", // Replace with your Imgflip password
      });

      // Make the POST request with form data
      const response = await fetch("https://api.imgflip.com/caption_image", {
        method: "POST",
        body: formData, // URL-encoded body
      });

      const result = await response.json();

      console.log(result); // Log the response for debugging

      // Check if the response contains the expected data
      if (result && result.data) {
        setGeneratedCaption(result.data.text0 || "No caption generated");
      } else {
        console.error("Error in API response:", result);
        setGeneratedCaption("Error generating caption");
      }
    } catch (error) {
      console.error("Error generating caption:", error);
      setGeneratedCaption("Error generating caption");
    } finally {
      setLoading(false);
    }
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_Image_Hosting_Key}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.url; // Get the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle the image upload and submit the meme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    // Set loading state while the image is being uploaded
    setLoading(true);

    try {
      // Upload image to ImgBB
      const uploadedImageUrl = await uploadImageToImgBB(image);
      if (uploadedImageUrl) {
        console.log("Image uploaded to ImgBB:", uploadedImageUrl);

        // Save meme with caption and image URL (use local storage or a backend service)
        console.log("Meme uploaded with caption:", caption);
        setLoading(false);
      } else {
        setLoading(false);
        alert("Failed to upload the image.");
      }
    } catch (error) {
      console.error("Error uploading meme:", error);
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

        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={generateAICaption}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate AI Caption"}
          </button>
        </div>

        {generatedCaption && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Generated AI Caption:</h3>
            <p>{generatedCaption}</p>
          </div>
        )}

        <div className="mb-4">
          {previewImageUrl && (
            <div className="flex flex-col items-center">
              <img
                src={previewImageUrl}
                alt="Preview"
                className="w-64 h-auto mb-4"
              />
              <h2 className="text-lg font-semibold">Preview Caption:</h2>
              <p>{generatedCaption || caption}</p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <button type="submit" className="btn btn-primary w-full">
            {loading ? "Uploading..." : "Upload Meme"}
          </button>
        </div>
      </form>
    </div>
  );
}
