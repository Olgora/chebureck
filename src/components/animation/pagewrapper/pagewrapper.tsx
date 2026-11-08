"use client";

import {  motion } from "framer-motion";
import React from "react";
 

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  

  return (
    
      <motion.div        
        // 1. Начальное состояние (где страница находится ДО появления)
        initial={{ x: "-100%", opacity: 0 }}
        // 2. Состояние анимации (куда она встает при загрузке)
        animate={{ x: "0%", opacity: 1 }}
        // 3. Состояние при уходе (куда улетает старая страница при смене роута)
        exit={{ x: "100%", opacity: 0 }}
        // Настройка плавности (пружина или плавный переход)
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.5,
        }}
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "absolute", // Важно, чтобы во время анимации страницы не прыгали друг под друга
          top: 0,
          left: 0,
        }}
      >
        {children}
      </motion.div>
 
  );
};
