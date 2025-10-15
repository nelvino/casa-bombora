"use client";

/**
 * Smoothly scrolls to an element with the specified ID
 */
export const smoothScrollTo = (
  elementId: string,
  offset = 0,
  duration = 800
) => {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) return;

  const targetPosition =
    targetElement.getBoundingClientRect().top + window.scrollY - offset;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
};

/**
 * Creates a smooth scroll handler for navigation links
 */
export const createSmoothScrollHandler = (offset = 80) => {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;
    
    const targetId = href.substring(1);
    smoothScrollTo(targetId, offset);

    // Update URL without causing page reload
    window.history.pushState(null, "", href);
  };
};
