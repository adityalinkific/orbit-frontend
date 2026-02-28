import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/theme.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
import "./styles/scrollbar.css"



ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <Theme appearance="light" accentColor="blue">
    <App />
  </Theme>
  </BrowserRouter>
);
