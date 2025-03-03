"use client";
import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const MemeContext = createContext();

export const MemeProvider = ({ children }) => {
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [category, setCategory] = useState("Trending");

  // Fetch memes from API
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const { data } = await axios.get("https://api.imgflip.com/get_memes");
        setMemes(data.data.memes); // Show top 10 memes
      } catch (error) {
        console.error("Error fetching memes:", error);
      }
    };
    fetchMemes();
  }, []);

  // Filter memes based on category
  useEffect(() => {
    let categorizedMemes = [];

    if (category === "Trending") {
      categorizedMemes = memes.slice(0, 20); // First 20 for Trending
    } else if (category === "New") {
      categorizedMemes = memes.slice(20, 40); // 21-40 for New
    } else if (category === "Classic") {
      categorizedMemes = memes.slice(40, 60); // 41-60 for Classic
    } else if (category === "Random") {
      categorizedMemes = memes.sort(() => Math.random() - 0.5); // Shuffle for random memes
    }

    setFilteredMemes(categorizedMemes);
  }, [category, memes]);

  return (
    <MemeContext.Provider
      value={{ memes, filteredMemes, category, setCategory }}
    >
      {children}
    </MemeContext.Provider>
  );
};
