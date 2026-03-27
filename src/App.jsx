import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { Toaster } from "react-hot-toast";
import { healthService } from "./services/auth.service";

export default function App() {
  useEffect(() => {
    // Run health check every 5 minutes (300,000 ms) in the background
    const intervalId = setInterval(async () => {
      try {
        await healthService();
      } catch (error) {
        console.error("Background health check failed:", error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthProvider>
      <UIProvider>
          <Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />
      </UIProvider>
    </AuthProvider>
  );
}
