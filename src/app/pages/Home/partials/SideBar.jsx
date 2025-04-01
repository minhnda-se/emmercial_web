import React from "react";

export const SideBar = (props) => {
  const categories = props.categories.menu_block;
  const benifits = props.categories.highlight_block;

  return (
    <div className="flex flex-col gap-y-2 !p-4">
      <h3>{categories?.title}</h3>
      {categories?.items?.length > 0 ? (
        categories.items.map((category) => (
          <div key={category.id || category.text} className="flex">
            <button
              className="btn btn-ghost flex justify-start text-left !px-1  !mt-2 text-[12px]"
              style={{ width: "100%" }}
            >
              <div className="avatar !mr-2">
                <div className="w-9">
                  <img src={category.icon_url} />
                </div>
              </div>
              {category.text}
            </button>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};
