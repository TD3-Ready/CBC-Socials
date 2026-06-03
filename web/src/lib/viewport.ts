import { useEffect, useState } from "react";

interface VisibleRegion {
  /** y-position in iframe where the user's visible area starts */
  top: number;
  /** height of the visible iframe area on the user's screen */
  height: number;
}

/**
 * Talks to the parent Squarespace page to know which part of this iframe
 * the user can actually see. Without this, fixed-positioned UI inside the
 * iframe lands in the middle of the iframe (which may be off-screen on a
 * tall page).
 */
export function useVisibleRegion(): VisibleRegion {
  const [region, setRegion] = useState<VisibleRegion>(() => ({
    top: 0,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  }));

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d !== "object" || d.type !== "cbc-cal-viewport") return;
      const iframeTop = Number(d.iframeTop);
      const viewportHeight = Number(d.viewportHeight);
      if (!isFinite(iframeTop) || !isFinite(viewportHeight)) return;
      const iframeHeight = window.innerHeight;
      const visTop = Math.max(0, -iframeTop);
      const visBottom = Math.min(iframeHeight, viewportHeight - iframeTop);
      const visHeight = Math.max(0, visBottom - visTop);
      if (visHeight > 0) setRegion({ top: visTop, height: visHeight });
    };
    window.addEventListener("message", handler);
    // Ask parent for the current viewport (in case we missed earlier broadcasts)
    window.parent?.postMessage({ type: "cbc-cal-request-viewport" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  return region;
}

/**
 * Compute a stable top-position for a modal centered within the user's visible
 * iframe area. Always lands in the same spot relative to what they're looking at.
 */
export function modalTopFor(region: VisibleRegion, estModalHeight: number): number {
  const desired = region.top + region.height / 2 - estModalHeight / 2;
  const min = region.top + 16;
  const max = region.top + region.height - estModalHeight - 16;
  if (max <= min) return min;
  return Math.max(min, Math.min(desired, max));
}
