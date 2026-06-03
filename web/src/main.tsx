import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Tell the parent (Squarespace page) how tall we are.
function postHeight() {
  const h = document.documentElement.scrollHeight;
  window.parent?.postMessage({ type: "cbc-cal-resize", height: h }, "*");
}
window.addEventListener("load", postHeight);
new ResizeObserver(postHeight).observe(document.body);
