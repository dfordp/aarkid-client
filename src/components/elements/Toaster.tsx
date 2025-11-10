import { Toaster, ToastBar } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "12px",
          fontFamily: "'Inter', sans-serif",
          padding: "10px 16px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
        },
        success: {
          duration: 1800,
          iconTheme: {
            primary: "#16a34a", // Tailwind green-600
            secondary: "#f0fdf4", // light green background
          },
          style: {
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#14532d",
          },
        },
        error: {
          duration: 1800,
          iconTheme: {
            primary: "#dc2626", // Tailwind red-600
            secondary: "#fef2f2",
          },
          style: {
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#7f1d1d",
          },
        },
      }}
    >
      {(t) => (
        <AnimatePresence>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <ToastBar
              toast={t}
              style={{
                ...t.style,
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "14px",
                backdropFilter: "blur(6px)",
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </Toaster>
  );
};
