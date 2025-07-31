import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ExternalWrapper from "./Hocs/ExternalWrapper/index.tsx";
import NxtwatchMachineWrapper from "./Hocs/NxtwatchMachineWrapper/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NxtwatchMachineWrapper>
      <ExternalWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ExternalWrapper>
    </NxtwatchMachineWrapper>
  </StrictMode>
);
