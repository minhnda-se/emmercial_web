import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as farStar,
} from "@fortawesome/free-solid-svg-icons"; // Full, Half and Empty star icons

export const RatingStar = ({ rating }) => {
  const totalStars = 5; // Maximum stars, usually 5

  // Create an array of stars based on the rating
  const stars = [];
  for (let i = 0; i < totalStars; i++) {
    if (rating >= i + 1) {
      stars.push(faStar); // Full star
    } else if (rating >= i + 0.5) {
      stars.push(faStarHalfAlt); // Half star
    } else {
      stars.push(farStar); // Empty star
    }
  }
  return (
    <div className="rating-stars">
      {stars.map((star, index) => (
        <FontAwesomeIcon key={index} icon={star} />
      ))}
    </div>
  );
};
