// helpers/debounce.js

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 *
 * 📌 Example:
 * const handleSearch = debounce((text) => {
 *   fetchResults(text);
 * }, 500);
 *
 * // Only runs 500ms after user stops typing
 * handleSearch("bmw");
 */
export const debounce = (fn, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function to limit execution rate
 * @param {Function} fn - The function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 *
 * 📌 Example:
 * const handleScroll = throttle(() => {
 *   console.log('Scrolled');
 * }, 200);
 *
 * // Runs at most once every 200ms
 * window.addEventListener('scroll', handleScroll);
 */
export const throttle = (fn, delay = 200) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};
