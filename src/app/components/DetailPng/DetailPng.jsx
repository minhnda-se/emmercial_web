import React, { useState, useRef, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./DetailPng.scss";
import Loading from "../Loading";

export default function ImageGallery({
  productId = "10198980",
  spid = "190252114",
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saveData, setSaveData] = useState([]);
  const thumbnailsRef = useRef(null);
  const thumbWidth = 80; // Width of each thumbnail including padding
  const visibleThumbs = 6; // Limit the number of visible thumbnails to 6
  const containerWidth = thumbWidth * visibleThumbs;

  // Fetch product images from API
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://tiki.vn/api/v2/products/${productId}?platform=web&spid=${spid}&version=3#`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }

        const data = await response.json();

        setSaveData(data);

        // Extract images from configurable_products.images
        let productImages = [];
        if (
          data.configurable_products &&
          Array.isArray(data.configurable_products)
        ) {
          // Find the specific configurable product that matches the spid
          const configurableProduct = data.configurable_products.find(
            (product) => product.id.toString() === spid
          );

          if (configurableProduct && configurableProduct.images) {
            productImages = configurableProduct.images.map((image) => ({
              large_url: image.large_url || image.base_url,
              medium_url: image.medium_url || image.base_url,
              small_url:
                image.small_url || image.thumbnail_url || image.base_url,
            }));
          }
        }

        // If no configurable product images found, try using main product images
        if (productImages.length === 0 && data.images) {
          productImages = data.images.map((image) => ({
            large_url: image.large_url || image.base_url,
            medium_url: image.medium_url || image.base_url,
            small_url: image.small_url || image.thumbnail_url || image.base_url,
          }));
        }

        setImages(productImages);

        // Set the first image as selected if available
        if (productImages.length > 0) {
          setSelectedImage(productImages[0].large_url);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductImages();
  }, [productId, spid]);

  // Handle selecting an image
  const handleSelectImage = (url, index) => {
    setSelectedImage(url);
    setSelectedIndex(index);
    ensureVisible(index);
  };

  // Ensure the selected thumbnail is visible in the viewport
  const ensureVisible = (index) => {
    if (!thumbnailsRef.current) return;

    // Calculate the position of the selected thumbnail
    const selectedPosition = index * thumbWidth;
    const containerScrollLeft = thumbnailsRef.current.scrollLeft;
    const containerWidth = thumbnailsRef.current.clientWidth;

    // If the thumbnail is outside the view on the left
    if (selectedPosition < containerScrollLeft) {
      thumbnailsRef.current.scrollTo({
        left: selectedPosition,
        behavior: "smooth",
      });
    }
    // If the thumbnail is outside the view on the right
    else if (
      selectedPosition + thumbWidth >
      containerScrollLeft + containerWidth
    ) {
      thumbnailsRef.current.scrollTo({
        left: selectedPosition - containerWidth + thumbWidth,
        behavior: "smooth",
      });
    }
  };

  // Handle previous button click
  const handlePrev = () => {
    if (!thumbnailsRef.current) return;

    thumbnailsRef.current.scrollBy({
      left: -thumbWidth,
      behavior: "smooth",
    });
  };

  // Handle next button click
  const handleNext = () => {
    if (!thumbnailsRef.current) return;

    thumbnailsRef.current.scrollBy({
      left: thumbWidth,
      behavior: "smooth",
    });
  };
  // If loading, show a loading indicator
  if (loading) {
    return (
      // <div className="image-gallery__loading">Loading product images...</div>
      <Loading />
    );
  }

  // If error, show error message
  if (error) {
    return <div className="image-gallery__error">Error: {error}</div>;
  }

  // If no images found
  if (images.length === 0) {
    return (
      <div className="image-gallery__empty">
        No images available for this product
      </div>
    );
  }

  return (
    <div className="image-gallery">
      {/* Main selected image */}
      <div className="image-gallery__main">
        <img
          src={selectedImage}
          alt="Selected Product"
          className="image-gallery__main-image"
        />
      </div>

      {/* Container for thumbnail carousel */}
      <div
        className="image-gallery__carousel"
        style={{ maxWidth: containerWidth }}
      >
        {/* Previous button - only show if we have more than visibleThumbs images */}
        {images.length > visibleThumbs && (
          <button
            className="image-gallery__nav-button image-gallery__nav-button--prev"
            onClick={handlePrev}
          >
            <LeftOutlined />
          </button>
        )}

        {/* Scrollable thumbnails container */}
        <div className="image-gallery__thumbnails-container">
          <div ref={thumbnailsRef} className="image-gallery__thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => handleSelectImage(image.large_url, index)}
                className={`image-gallery__thumbnail ${
                  selectedIndex === index
                    ? "image-gallery__thumbnail--active"
                    : ""
                }`}
              >
                <img
                  src={image.small_url}
                  alt={`Product Thumbnail ${index + 1}`}
                  className="image-gallery__thumbnail-image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next button - only show if we have more than visibleThumbs images */}
        {images.length > visibleThumbs && (
          <button
            className="image-gallery__nav-button image-gallery__nav-button--next"
            onClick={handleNext}
          >
            <RightOutlined />
          </button>
        )}
      </div>
    </div>
  );
}
