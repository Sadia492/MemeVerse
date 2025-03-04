"use client";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { MemeContext } from "@/providers/MemeProvider";
import MemeCard from "@/components/MemeCard";

export default function Home() {
  const { filteredMemes } = useContext(MemeContext);

  return (
    <div className="w-11/12 mx-auto mt-24">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        {filteredMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme}></MemeCard>
        ))}
      </div>
      {/* </Masonry> */}
    </div>
  );
}
