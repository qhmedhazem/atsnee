// Page content width for routes whose wrapper shrinks to its content (main centers its children): 72rem, or the
// screen minus a 1rem gutter each side (2rem also covers a desktop scrollbar). max-w-full: never wider than a parent
// that has its own cap (e.g. the home page's `container`), which in RTL would spill off the left edge.
export const FRAME = "w-[min(72rem,calc(100vw-2rem))] max-w-full";
