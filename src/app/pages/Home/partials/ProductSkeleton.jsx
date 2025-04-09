import React from "react";

export default function ProductSkeleton() {
  const arr = Array(15).fill(0);
  return (
    <>
      {arr.map((item, index) => (
        <div
          className="flex h-100 flex-col gap-4 rounded-lg skeleton"
          key={index}
        ></div>
      ))}
    </>
  );
}
