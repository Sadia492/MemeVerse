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
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Store the image URL from ImgBB
  const [generatedPrompt, setGeneratedPrompt] = useState(""); // Store the prompt for AI caption
  const [output, setOutput] = useState(""); // AI-generated caption

  // Handle file upload and immediate upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImageUrl(URL.createObjectURL(file)); // Preview before upload

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_Image_Hosting_Key}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const imageUrl = response.data.data.url;
        setUploadedImageUrl(imageUrl); // Store the uploaded image URL
        setGeneratedPrompt(
          `${imageUrl}, generate a single funny caption based on this image. Without any extra line just the caption without quotes`
        ); // Update the prompt for AI caption
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }
  };
  // Generate AI Caption based on uploaded image
  const generateText = async () => {
    try {
      if (!generatedPrompt) {
        toast.error("Please upload an image first!");
        return;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ body: generatedPrompt }), // Send the generated prompt for AI caption
      });

      // Check if response is OK
      if (!response.ok) {
        throw new Error("Failed to generate caption");
      }

      const data = await response.json();

      // Ensure the response has the expected format
      if (data?.output?.candidates?.length > 0) {
        // Extract the first candidate caption
        let rawCaption =
          data.output.candidates[0]?.content?.parts[0]?.text ||
          "No caption generated";

        // Clean the caption by removing any surrounding quotes, stars, or other unwanted symbols
        rawCaption = rawCaption.replace(/^['"*]+|['"*]+$/g, "").trim();

        // Update caption state
        setCaption(rawCaption || "No caption generated");
      } else {
        setCaption("No caption generated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate caption.");
      setCaption("Error generating caption");
    }
  };

  // Handle caption input
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  // Upload meme and store in localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedImageUrl || !caption) {
      toast.error("Please upload an image and add a caption!");
      return;
    }

    setLoading(true);

    try {
      // Create meme object
      const memeData = {
        id: Date.now().toString(), // Unique ID
        url: uploadedImageUrl,
        name: caption || output,
        email: user?.email || "anonymous", // Store user email
        category: "new",
        date: new Date().toISOString(), // Timestamp for sorting
      };

      // Retrieve existing memes from localStorage
      const storedMemes = JSON.parse(localStorage.getItem("memes")) || [];
      const updatedMemes = [memeData, ...storedMemes]; // Add new meme
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      // Success message
      toast.success("Meme uploaded successfully!");

      // Reset the form values after the meme has been uploaded
      setImage(null);
      setCaption("");
      setPreviewImageUrl(null);
      setUploadedImageUrl(null); // Reset uploaded image URL
    } catch (error) {
      console.error("Error uploading meme:", error);
      toast.error("Failed to upload meme.");
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
            onChange={handleCaptionChange}
            value={caption}
            placeholder="Add a funny caption here..."
            className="textarea textarea-bordered w-full h-32"
          ></textarea>

          <div>
            <button
              type="button"
              onClick={generateText}
              className="btn btn-secondary w-full mt-2"
            >
              Generate AI Caption
            </button>
          </div>
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
              <p>{caption || output}</p>{" "}
              {/* Show AI-generated caption or the user-provided one */}
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
