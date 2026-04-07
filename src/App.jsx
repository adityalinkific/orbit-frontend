import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { UIProvider } from "./context/UIContext";
import { Toaster } from "react-hot-toast";
import { healthService } from "./services/auth.service";
import { bootstrapAuth } from "./store/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());

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
    <>
      {/* 🔥 MOVE TOASTER HERE */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
        containerStyle={{
          zIndex: 999999,
        }}
      />

      <UIProvider>
        <AppRoutes />
      </UIProvider>
    </>
  );
}
