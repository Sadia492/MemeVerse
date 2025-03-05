"use client";

import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MemeContext } from "@/providers/MemeProvider";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const { memes, loading } = useContext(MemeContext); // Full meme data

  useEffect(() => {
    const likedMemes = [];
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Fetch meme like counts from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("likes-")) {
        const memeId = key.replace("likes-", "");
        const likes = parseInt(localStorage.getItem(key), 10) || 0;

        // Find the full meme data from MemeContext
        const fullMeme = memes.find((meme) => meme.id === memeId);
        if (fullMeme) {
          likedMemes.push({ ...fullMeme, likes });
        }
      }
    });

    // Sort memes by likes and get the top 10
    const sortedMemes = likedMemes
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
    setTopMemes(sortedMemes);

    // Sort users by engagement (higher engagement = higher rank)
    const sortedUsers = users.sort((a, b) => b.engagement - a.engagement);
    setTopUsers(sortedUsers);
  }, [memes]); // Depend on memes to update correctly

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="w-11/12 mx-auto mt-24">
      <h1 className="text-3xl flex items-center justify-center font-bold bg-gradient-to-r mb-6 from-myYellow to-myGreen text-transparent bg-clip-text">
        Leaderboard
      </h1>

      {/* Top 10 Most Liked Memes */}
      <div className="mb-10">
        <h2 className="text-lg text-left font-bold">
          🔥 Top 10 Most Liked Memes
        </h2>
        {/* Ensure scrollbar is always visible */}
        <div
          className="overflow-x-scroll"
          style={{ overflowX: "scroll", whiteSpace: "nowrap" }}
        >
          <table className="table text-center border-separate border-spacing-y-3 w-full">
            {/* head */}
            <thead className="bg-gradient-to-r from-myGreen to-myYellow">
              <tr className=" rounded-lg">
                <th className="py-3 px-6">#</th>
                <th className="py-3 px-6">Meme</th>
                <th className="py-3 px-6">Meme Name</th>
                <th className="py-3 px-6">Total Likes</th>
              </tr>
            </thead>
            <tbody>
              {topMemes.length ? (
                topMemes.map((meme, idx) => (
                  <tr
                    key={meme.id}
                    className="shadow-lg rounded-lg hover:scale-105 transform transition duration-300 ease-in-out"
                  >
                    <th className="py-3 px-6 text-primary">{idx + 1}</th>
                    <td className="py-3 px-6  font-medium">
                      <img
                        src={meme?.url}
                        alt={meme?.name}
                        className="w-10 h-10"
                      />
                    </td>
                    <td className="py-3 px-6  font-medium">{meme.name}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 font-medium rounded-full ${
                          meme.likes > 5
                            ? "bg-myYellow/40 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        } `}
                      >
                        {meme.likes}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-2xl font-bold text-primary">
                    No Memes Liked
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Rankings by Engagement */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          🏆 User Rankings by Engagement
        </h2>
        {/* Ensure scrollbar is always visible */}
        <div
          className="overflow-x-scroll"
          style={{ overflowX: "scroll", whiteSpace: "nowrap" }}
        >
          <table className="table text-center border-separate border-spacing-y-3 w-full">
            {/* head */}
            <thead className="bg-gradient-to-r from-myGreen to-myYellow">
              <tr className="rounded-lg">
                <th className="py-3 px-6">#</th>
                <th className="py-3 px-6">User Image</th>
                <th className="py-3 px-6">User Name</th>
                <th className="py-3 px-6">User Engagement</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.length ? (
                topUsers.map((user, idx) => (
                  <tr
                    key={user.email}
                    className="shadow-lg rounded-lg hover:scale-105 transform transition duration-300 ease-in-out"
                  >
                    <th className="py-3 px-6 text-primary">{idx + 1}</th>
                    <td className="py-3 px-6  flex justify-center items-center">
                      <img
                        src={user?.photoURL}
                        alt={user?.displayName}
                        className="w-15 h-15 rounded-full"
                      />
                    </td>
                    <td className="py-3 px-6  font-medium">
                      {user?.displayName}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 font-medium rounded-full ${
                          user?.engagement === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        } `}
                      >
                        {user?.engagement}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-2xl font-bold text-primary">
                    No User Engaged
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
