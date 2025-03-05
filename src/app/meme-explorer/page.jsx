"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import MemeCard from "@/components/MemeCard";
import { MemeContext } from "@/providers/MemeProvider";
import React, { useContext, useEffect, useState } from "react";

export default function Page() {
  const { filteredMemes, category, setCategory, loading } =
    useContext(MemeContext);
  const [searchQuery, setSearchQuery] = useState(""); // 🔹 Search state
  const [searchedMemes, setSearchedMemes] = useState([]); // 🔹 State for filtered memes
  const [sortBy, setSortBy] = useState(""); // 🔹 Sorting state

  console.log("Filtered Memes:", filteredMemes);

  // 🔹 Get likes & comments from localStorage
  const getMemeStats = (id) => {
    const likes = parseInt(localStorage.getItem(`likes-${id}`)) || 0;
    const comments = JSON.parse(localStorage.getItem(`comments-${id}`)) || []; // Retrieve comments array
    return { likes, commentsCount: comments.length }; // Return the number of comments
  };

  useEffect(() => {
    let memesWithStats = filteredMemes.map((meme) => {
      const stats = getMemeStats(meme.id);
      return { ...meme, ...stats };
    });

    if (searchQuery.trim() !== "") {
      memesWithStats = memesWithStats.filter((meme) =>
        meme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 🔹 Apply sorting
    if (sortBy === "likes") {
      memesWithStats = [...memesWithStats].sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "date") {
      memesWithStats = [...memesWithStats].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } else if (sortBy === "comments") {
      memesWithStats = [...memesWithStats].sort(
        (a, b) => b.commentsCount - a.commentsCount // Sort by the number of comments
      );
    }

    setSearchedMemes(memesWithStats);
  }, [searchQuery, filteredMemes, sortBy]);

  const categories = ["Trending", "New", "Classic", "Random"];
  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="mt-24">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <div className="w-11/12 mx-auto">
            {/* 🔹 Search & Sort Bar */}
            <div className="mb-4 mt-6 flex gap-4">
              <input
                type="text"
                placeholder="Search memes..."
                className="input input-bordered border-4 border-myYellow w-full max-w-lg p-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="select select-bordered w-full border-4 border-myYellow"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="likes">Most Liked</option>
                <option value="comments">Most Commented</option>
              </select>
            </div>

            <div>
              {/* 🔹 Category Buttons (Main Content) */}
              <div className="flex justify-center items-center gap-6 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`btn  ${
                      category === cat
                        ? "bg-gradient-to-r from-myYellow to-myGreen text-white"
                        : "border-4 border-myYellow"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 🔹 Meme Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {searchedMemes.length > 0 ? (
                  searchedMemes.map((meme) => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No memes found...</p>
                )}
              </div>
            </div>
          </div>

          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button hidden"
          >
            Open drawer
          </label>
        </div>

        {/* 🔹 Sidebar Menu */}
        <div className="drawer-side fixed top-20">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content space-y-3 min-h-full w-80 p-4">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setCategory(cat)}
                  className={`w-full p-2 rounded-full font-bold ${
                    category === cat
                      ? "bg-gradient-to-r from-myYellow to-myGreen text-white"
                      : "border-4 border-myYellow"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
