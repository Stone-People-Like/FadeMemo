import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/jetbrains-mono";
import { createRoot } from "react-dom/client";
import App from "./App";
import { resolveInitialTheme } from "./lib/preferences";
import "./styles.css";

document.documentElement.dataset.theme = resolveInitialTheme(
  localStorage.getItem("fadememo-dashboard:theme"),
  window.matchMedia("(prefers-color-scheme: dark)").matches,
);

createRoot(document.getElementById("root")!).render(<App />);
