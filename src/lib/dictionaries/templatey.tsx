"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Храним и pathname, и детей в одном объекте стейта
  const [{ renderedPathname, renderedChildren }, setRendered] = useState({
    renderedPathname: pathname,
    renderedChildren: children,
  });

  // Паттерн React: если pathname изменился во время рендера, 
  // мы СРАЗУ обновляем стейт. React перерисует компонент мгновенно,
  // до того как старый (уже неактуальный) контент попадет на экран.
  if (pathname !== renderedPathname) {
    setRendered({
      renderedPathname: pathname,
      renderedChildren: children, // Здесь все еще старые дети, которые зафиксировал React на смене роута
    });
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname} // Позволяет Framer Motion отличать страницы
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {renderedChildren}
      </motion.div>
    </AnimatePresence>
  );
}