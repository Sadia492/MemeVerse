"use client";
import MemeCard from "@/components/MemeCard";
import { MemeContext } from "@/providers/MemeProvider";
import React, { useContext, useEffect, useState } from "react";

export default function Page() {
  const { filteredMemes, category, setCategory } = useContext(MemeContext);
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

  return (
    <div className="mt-24">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          {/* 🔹 Search & Sort Bar */}
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Search memes..."
              className="input input-bordered w-full max-w-lg p-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="likes">Most Liked</option>
              <option value="comments">Most Commented</option>
            </select>
          </div>

          <div>
            <div>
              <button onClick={() => setCategory("Trending")} className="btn">
                Trending
              </button>
              <button onClick={() => setCategory("New")} className="btn">
                New
              </button>
              <button onClick={() => setCategory("Classic")} className="btn">
                Classic
              </button>
              <button onClick={() => setCategory("Random")} className="btn">
                Random
              </button>
            </div>

            {/* 🔹 Meme Grid */}
            <div className="grid grid-cols-2 gap-6">
              {searchedMemes.length > 0 ? (
                searchedMemes.map((meme) => (
                  <MemeCard key={meme.id} meme={meme} />
                ))
              ) : (
                <p className="text-center text-gray-500">No memes found...</p>
              )}
            </div>
          </div>

          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button hidden"
          >
            Open drawer
          </label>
        </div>
        <div className="drawer-side fixed top-20">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <button onClick={() => setCategory("Trending")}>Trending</button>
            </li>
            <li>
              <button onClick={() => setCategory("New")}>New</button>
            </li>
            <li>
              <button onClick={() => setCategory("Classic")}>Classic</button>
            </li>
            <li>
              <button onClick={() => setCategory("Random")}>Random</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
