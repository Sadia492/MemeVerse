import React from "react";

export default function MemeCard({ meme }) {
  console.log(meme);
  return (
    <div className="card shadow-sm">
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
  );
}
