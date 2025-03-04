"use client";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { MemeContext } from "@/providers/MemeProvider";

export default function Home() {
  const { filteredMemes } = useContext(MemeContext);

  return (
    <div className="w-11/12 mx-auto mt-24">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        {filteredMemes.map((meme) => (
          <div key={meme.id} className="card shadow-sm">
            <figure className="px-10 pt-10 w-full lg:h-[600px]  mx-auto flex justify-center items-center">
              <img
                src={meme.url}
                alt={meme.name}
                className="rounded-xl w-full h-full object-cover border-4 "
                // width={meme.width}
                // height={meme.height}
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{meme.name}</h2>
              <div className="card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* </Masonry> */}
    </div>
  );
}
