"use client";
import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const MemeContext = createContext();

export const MemeProvider = ({ children }) => {
  const [memes, setMemes] = useState([]); // All memes (API + LocalStorage)
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [category, setCategory] = useState("Trending");
  const [loading, setLoading] = useState(true); // Add loading state

  // Retrieve new memes from localStorage
  const getNewMemesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("memes")) || [];
  };

  // Fetch memes from API and merge with stored memes
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const { data } = await axios.get("https://api.imgflip.com/get_memes");
        const apiMemes = data.data.memes; // API memes
        const storedMemes = getNewMemesFromLocalStorage(); // LocalStorage memes

        setMemes([...apiMemes, ...storedMemes]); // Merge both
        setLoading(false); // Set loading to false when memes are loaded
      } catch (error) {
        console.error("Error fetching memes:", error);
        setLoading(false); // Set loading to false even if there's an error
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
      categorizedMemes = memes.filter((meme) => meme.category === "new"); // Extract only "New" memes
    } else if (category === "Classic") {
      categorizedMemes = memes.slice(40, 60); // 41-60 for Classic
    } else if (category === "Random") {
      categorizedMemes = [...memes]
        .sort(() => Math.random() - 0.5)
        .slice(0, 100); // Shuffle for random memes
    }

    setFilteredMemes(categorizedMemes);
  }, [category, memes]);

  return (
    <MemeContext.Provider
      value={{
        memes,
        filteredMemes,
        category,
        setCategory,
        loading, // Pass loading state to children
      }}
    >
      {children}
    </MemeContext.Provider>
  );
};
