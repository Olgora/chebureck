"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageAnimatePresence({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // ВАЖНО: Никаких position: absolute и overflow: hidden на родительском уровне!
    // Даем страницам течь в естественном HTML-потоке.
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.5, // Делаем переход быстрым и отзывчивым
          ease: "easeInOut" 
        }}
        style={{
          width: "100%",
          minHeight: "100vh",
          // НЕ добавляем сюда transform, absolute или display: flex
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
