import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { syncThemeWithLocal } from "./helpers/theme_helpers";
import { useTranslation } from "react-i18next";
import "./localization/i18n";
import { updateAppLanguage } from "./helpers/language_helpers";
import { router } from "./routes/router";
import { RouterProvider } from "@tanstack/react-router";
import "./styles/cyberpunk.css";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    console.log("App component mounted");
    try {
      syncThemeWithLocal();
      updateAppLanguage(i18n);
      console.log("Theme and language initialized successfully");
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }, [i18n]);

  console.log("App component rendering");
  return <RouterProvider router={router} />;
}

const appElement = document.getElementById("app");
if (!appElement) {
  console.error("Could not find element with id 'app'");
  throw new Error("Could not find element with id 'app'");
}

const root = createRoot(appElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
