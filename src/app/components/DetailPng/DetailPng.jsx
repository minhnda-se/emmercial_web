import React, { useState, useRef, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./DetailPng.scss";
import Loading from "../Loading";

// Fix props destructuring - change from {data}, spid to {data, spid}
export default function ImageGallery({ data, spid }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [highlightItems, setHighlightItems] = useState([]);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const thumbnailsRef = useRef(null);
  const thumbWidth = 80;
  const visibleThumbs = 6;
  const containerWidth = thumbWidth * visibleThumbs;

  // Fetch product images from API
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        console.log(data);

        // Extract highlights based on the provided data structure
        if (data.highlight) {
          if (data.highlight.items && Array.isArray(data.highlight.items)) {
            setHighlightItems(data.highlight.items);
          }
          if (data.highlight.title) {
            setHighlightTitle(data.highlight.title);
          }
        } else if (data.hightlight == null) {
          setHighlightItems([]);
          setHighlightTitle("");
        }

        // Extract images from configurable_products.images
        let productImages = [];
        if (
          data.configurable_products &&
          Array.isArray(data.configurable_products)
        ) {
          // Find the specific configurable product that matches the spid
          const configurableProduct = data.configurable_products.find(
            (product) => product.id.toString() === spid.toString()
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
          // Show/hide arrows based on image count
          setShowRightArrow(productImages.length > visibleThumbs);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductImages();
  }, [data, spid]); // Add spid to dependency array to re-run when spid changes

  // Remaining functions and return statement remain the same
  // ...

  // Handle selecting an image
  const handleSelectImage = (url, index) => {
    setSelectedImage(url);
    setSelectedIndex(index);
    ensureVisible(index);
  };

  // Add scroll event listener to update arrow visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!thumbnailsRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;

      // Show left arrow if not at the start
      setShowLeftArrow(scrollLeft > 0);

      // Show right arrow if not at the end
      const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
      setShowRightArrow(!isAtEnd);
    };

    const thumbnailsElement = thumbnailsRef.current;
    if (thumbnailsElement) {
      thumbnailsElement.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (thumbnailsElement) {
        thumbnailsElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [images]);

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
    return <Loading />;
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
        {/* Previous button - only show if we can scroll left */}
        {images.length > visibleThumbs && showLeftArrow && (
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

        {/* Next button - only show if we can scroll right */}
        {images.length > visibleThumbs && showRightArrow && (
          <button
            className="image-gallery__nav-button image-gallery__nav-button--next"
            onClick={handleNext}
          >
            <RightOutlined />
          </button>
        )}
      </div>

      {/* Product Highlights Section */}
      {highlightItems.length > 0 && (
        <div className="product-highlights">
          <h3 className="product-highlights__title">{highlightTitle}</h3>
          <ul className="product-highlights__list">
            {highlightItems.map((item, index) => (
              <li key={index} className="product-highlights__item">
                <span className="product-highlights__check-icon">✓</span>
                <span className="product-highlights__text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
