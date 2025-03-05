"use client";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { MemeContext } from "@/providers/MemeProvider";
import MemeCard from "@/components/MemeCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const { filteredMemes, loading } = useContext(MemeContext);
  if (loading) return <LoadingSpinner></LoadingSpinner>;
  return (
    <div className="w-11/12 mx-auto mt-24">
      <h2 className="text-4xl flex items-center justify-center font-bold bg-gradient-to-r from-myYellow to-myGreen text-transparent bg-clip-text mb-12">
        Trending Memes
      </h2>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        {filteredMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme}></MemeCard>
        ))}
      </div>
    </div>
  );
}
