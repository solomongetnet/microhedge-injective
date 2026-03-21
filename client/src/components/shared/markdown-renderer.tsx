"use client";

// MarkdownShower.tsx
import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownShowerProps {
  markdown: string;
  textColor?: string; // CSS color string like "#333" or "red"
}

const MarkdownShower: React.FC<MarkdownShowerProps> = ({
  markdown,
  textColor = "#000", // default black color
}) => {
  return (
    <div
      style={{
        color: textColor,
        whiteSpace: "pre-wrap", // preserve line breaks
        fontSize: "15px",
        lineHeight: 1.5,
      }}
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MarkdownShower;
