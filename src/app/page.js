"use client";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import Masonry from "react-masonry-css";
import { MemeContext } from "@/providers/MemeProvider";

export default function Home() {
  const { filteredMemes } = useContext(MemeContext);
  console.log(filteredMemes);

  // ✅ Define breakpointColumnsObj inside the component
  // const breakpointColumnsObj = {
  //   default: 4, // 4 columns on large screens
  //   1100: 3, // 3 columns on medium screens
  //   768: 2, // 2 columns on tablets
  //   500: 1, // 1 column on small screens
  // };

  return (
    <div className="w-11/12 mx-auto mt-24">
      {/* Meme Grid */}
      {/* <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4 p-4"
        columnClassName="masonry-column"
      > */}
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        {filteredMemes.map((meme) => (
          <div key={meme.id} className="card bg-base-100 shadow-sm">
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
