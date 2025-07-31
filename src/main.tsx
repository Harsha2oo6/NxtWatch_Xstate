import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ExternalWrapper from "./Components/ExternalWrapper/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExternalWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ExternalWrapper>
  </StrictMode>
);
