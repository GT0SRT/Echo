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


import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/app", element: <App /> }, // Your dashboard / Shell
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TracksProvider>
      <RouterProvider router={router} />
    </TracksProvider>
  </React.StrictMode>
);