import React, { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { fetchCategory } from "./services/fetchCategory";
import { fetchProduct } from "./services/fetchProduct";
import { Product } from "../Search/partials/Product";
import ProductSkeleton from "../Home/partials/ProductSkeleton";
import { Pagination } from "antd";

export default function Category() {
  const location = useLocation();
  const [categories, setCategories] = useState({});
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  // Use URLSearchParams to get query parameters
  const nav = useNavigate();
  const { urlKey, cid } = useParams();
  console.log(urlKey, cid);
  // Get the 'cid' query parameter
  // if (!cid) {
  //   return <Navigate to="/" replace />;
  // }
  const handleCategoryClick = (text, id) => {
    nav(`/category/${text}/${id}`);
    window.location.reload();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, productData] = await Promise.all([
          fetchCategory(cid),
          fetchProduct(urlKey, cid),
        ]);

        setCategories(categoryData);
        setProduct(productData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {console.log(product)}
      <div>
        <div>
          {categories?.data?.map((item, index) => (
            <div className="collapse" key={index}>
              <input type="checkbox" />
              <div className="collapse-title font-semibold">{item.name}</div>
              <div className="collapse-content text-sm">
                {item.children?.map((child, index) => (
                  <p
                    className="link link-hover"
                    onClick={() => handleCategoryClick(child.url_key, child.id)}
                    key={index}
                  >
                    {child.name}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          {isLoading ? (
            <div className="w-[100%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 rounded-lg">
              <ProductSkeleton />
            </div>
          ) : (
            <Product productsList={product.data} />
          )}
        </div>
        {/* Pagination */}
        {/* <div className="w-[100%] justify-center flex">
          <Pagination
            current={1}
            pageSize={product.paging?.per_page} // Adjust based on your product list per page
            total={product.paging?.total} // Total products
            onChange={handlePageChange} // Page change handler
            showSizeChanger={false} // Optionally hide page size changer
            showQuickJumper={true} // Allows jumping to a specific page
            className="flex !mt-5" // Custom class for styling
          />
        </div> */}
      </div>
    </>
  );
}
