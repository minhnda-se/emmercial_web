import React from "react";

export default function SideBar() {
  const categories = Array(20).fill("Category");

  return (
    <div className="flex flex-col gap-y-2 !p-4">
      <h3>Danh muc</h3>
      {categories.map((category, index) => (
        <button key={index} className="btn btn-ghost flex justify-start !px-2">
          {category}
        </button>
      ))}
    </div>
  );
}
