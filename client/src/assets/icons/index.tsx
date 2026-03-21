import React from "react";

const HeartIcon = ({
  liked = false,
  size = 24,
  fillColor = "#e0245e",
  strokeColor = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={liked ? "Liked" : "Not liked"}
      style={{
        transition: "transform 0.18s ease",
      }}
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67
           l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06
           L12 21.23l7.78-7.78 1.06-1.06
           a5.5 5.5 0 0 0 0-7.78z"
        fill={liked ? fillColor : "transparent"}
        stroke={liked ? fillColor : strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HeartIcon;
