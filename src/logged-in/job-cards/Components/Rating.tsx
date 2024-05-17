// Rating.js or Rating.jsx or Rating.tsx
import React from "react";
import "./Rating.css"; // Import the CSS file

const Rating = ({ value, onChange }) => {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={star <= value ? "on" : "off"}
          onClick={() => onChange(star)}>
          <span className="star">&#9733;</span>
        </button>
      ))}
    </div>
  );
};

export default Rating;
