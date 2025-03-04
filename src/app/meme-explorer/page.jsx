"use client";
import MemeCard from "@/components/MemeCard";
import { MemeContext } from "@/providers/MemeProvider";
import React, { useContext, useEffect, useState } from "react";

export default function page() {
  const { filteredMemes, category, setCategory } = useContext(MemeContext);
  const [searchQuery, setSearchQuery] = useState(""); // 🔹 State for search query
  const [searchedMemes, setSearchedMemes] = useState(filteredMemes); // 🔹 State for filtered memes
  console.log(filteredMemes);

  // 🔹 Update search results when memes or searchQuery change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchedMemes(filteredMemes); // Show all memes if no search input
    } else {
      const filtered = filteredMemes.filter(
        (meme) => meme.name.toLowerCase().includes(searchQuery.toLowerCase()) // Use 'name' instead of 'title'
      );
      setSearchedMemes(filtered);
    }
  }, [searchQuery, filteredMemes]);
  return (
    <div className="mt-24">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          {/* 🔹 Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search memes..."
              className="input input-bordered w-full max-w-lg p-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
