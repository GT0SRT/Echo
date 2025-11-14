import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TracksProvider } from "./context/TracksContext";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TracksProvider>
      <App />
    </TracksProvider>
  </React.StrictMode>
);
