import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { DesaProvider } from "@/contexts/DesaContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((err) => {
      console.error("ServiceWorker registration failed: ", err);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DesaProvider>
          <App />
        </DesaProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
