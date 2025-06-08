import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import LoaderPage from "./components/common/Loaders/LoaderPage.component";
import router from "./shared/routes";
import queryClient from "./shared/queryClient";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => (
  <StrictMode>
    <ThemeProvider>
      <Suspense fallback={<LoaderPage />}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </QueryClientProvider>
      </Suspense>
    </ThemeProvider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<App />);
