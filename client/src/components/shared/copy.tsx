// src/components/ui/CopyButton.tsx
"use client";

import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    setError(null); // Clear previous errors
    try {
      // Check if Clipboard API is available and supported
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
      } else {
        // Fallback for older browsers or insecure contexts (http)
        // This is a less reliable method but can be a last resort.
        // It's generally not recommended for modern applications in secure contexts.
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Avoid scrolling to bottom
        textArea.style.left = '-9999px'; // Move off-screen
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
            setError('Failed to copy (execCommand)');
          }
        } catch (err) {
          setError('Failed to copy (execCommand fallback error)');
          console.error('Fallback copy failed:', err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      setError('Failed to copy (Clipboard API error)');
      console.error('Clipboard API copy failed:', err);
      // Optional: If you want to use the prompt fallback only if navigator.clipboard fails entirely
      // prompt('Copy to clipboard: Ctrl+C, Enter', text);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        absolute top-2 right-2 p-1 rounded
        text-xs font-semibold
        ${copied ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-200'}
        hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
      aria-label={copied ? 'Code Copied!' : error ? 'Copy Error!' : 'Copy Code'}
      title={error || ''} // Show error message on hover if there's an error
    >
      {copied ? 'Copied!' : error ? 'Error!' : 'Copy'}
    </button>
  );
};

export default CopyButton;