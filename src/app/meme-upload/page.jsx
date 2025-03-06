"use client";
import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { authContext } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import PrivateRoute from "@/components/PrivateRoute";
import DOMPurify from "dompurify";
import { MemeContext } from "@/providers/MemeProvider"; // Import Meme Context

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function Page() {
  const { user } = useContext(authContext);
  const { memes, setMemes } = useContext(MemeContext); // Get memes & updater
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const editor = useRef(null);

  // Handle file upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImageUrl(URL.createObjectURL(file));

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
        setUploadedImageUrl(imageUrl);
        setGeneratedPrompt(
          `${imageUrl}, generate a single funny caption based on this image. Do not give any other text or quotation just give the caption.`
        );
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Generate AI Caption
  const generateText = async () => {
    if (!generatedPrompt) {
      toast.error("Please upload an image first!");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ body: generatedPrompt }),
      });

      if (!response.ok) throw new Error("Failed to generate caption");

      const data = await response.json();
      if (data?.output?.candidates?.length > 0) {
        let rawCaption =
          data.output.candidates[0]?.content?.parts[0]?.text ||
          "No caption generated";

        rawCaption = rawCaption.replace(/^['"*]+|['"*]+$/g, "").trim();
        setCaption(DOMPurify.sanitize(rawCaption, { ALLOWED_TAGS: [] }));
      } else {
        setCaption("No caption generated");
      }
    } catch (error) {
      toast.error("Failed to generate caption.");
      setCaption("Error generating caption");
    }
  };

  // Handle Caption Change
  const handleCaptionChange = (newContent) => {
    setCaption(DOMPurify.sanitize(newContent, { ALLOWED_TAGS: [] }));
  };

  // Upload Meme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedImageUrl || !caption) {
      toast.error("Please upload an image and add a caption!");
      return;
    }

    setLoading(true);
    try {
      const memeData = {
        id: Date.now().toString(),
        url: uploadedImageUrl,
        name: caption,
        email: user?.email,
        category: "new",
        date: new Date().toISOString(),
      };

      const updatedMemes = [...memes, memeData]; // Merge with existing memes
      setMemes(updatedMemes); // Update context
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      toast.success("Meme uploaded successfully!");
      setImage(null);
      setCaption("");
      setPreviewImageUrl(null);
      setUploadedImageUrl(null);
    } catch (error) {
      toast.error("Failed to upload meme.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="w-11/12 mx-auto mt-24">
        <h1 className="text-3xl flex items-center justify-center font-bold bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text mb-6">
          Upload Your Meme
        </h1>

        <motion.form
          animate={{ borderColor: ["#1EF18C", "#FF5733", "#1EF18C"] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
          onSubmit={handleSubmit}
          className="p-4 border-4 shadow-lg rounded-md"
        >
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text">
              Upload Meme Image
            </label>
            <input
              type="file"
              accept="image/*, .gif"
              onChange={handleImageUpload}
              className="file-input file-input-bordered file-input-accent border-myYellow w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text">
              Meme Caption
            </label>
            <JoditEditor
              ref={editor}
              value={caption}
              onBlur={handleCaptionChange}
              onChange={handleCaptionChange}
            />

            <div>
              <button
                type="button"
                onClick={generateText}
                disabled={!uploadedImageUrl}
                className="btn bg-gradient-to-r mt-4 from-myGreen to-myYellow text-white"
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
                <div dangerouslySetInnerHTML={{ __html: caption }} />
              </div>
            )}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="btn bg-gradient-to-r w-full from-myGreen to-myYellow text-white"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Meme"}
            </button>
          </div>
        </motion.form>
      </div>
    </PrivateRoute>
  );
}
