import React from "react";

interface ScrollToBottomOptionsRef {
  elementRef: React.RefObject<HTMLElement>;
  shouldScroll?: boolean;
  behavior?: "smooth" | "instant";
}

interface ScrollToBottomOptionsId {
  elementId: string;
  shouldScroll?: boolean;
  behavior?: "smooth" | "instant";
}

type ScrollToBottomOptions = ScrollToBottomOptionsRef | ScrollToBottomOptionsId;

export const scrollToBottom = (options: ScrollToBottomOptions): void => {
  const { shouldScroll = true, behavior = "smooth" } = options;

  if (!shouldScroll) return;

  let element: HTMLElement | null = null;

  if ("elementRef" in options) {
    element = options.elementRef.current;
  } else if ("elementId" in options) {
    element = document.getElementById(options.elementId);
  }

  if (!element || !(element instanceof HTMLElement)) return;

  // Ensure the element is scrollable
  const isScrollable = element.scrollHeight > element.clientHeight;
  if (!isScrollable) return;

  // Defer the scroll to ensure DOM is updated
  requestAnimationFrame(() => {
    try {
      element.scroll({
        top: element.scrollHeight,
        behavior: behavior,
      });
    } catch (e) {
      // Fallback for browsers that don't support `scroll` with options
      element.scrollTop = element.scrollHeight;
    }
  });
};
