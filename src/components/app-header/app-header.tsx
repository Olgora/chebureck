"use client";
import {
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  motion,
} from "framer-motion";
import styles from "./app-header.module.css";
import { useState } from "react";

import Navbar from "../navbar/navbar";

export function AppHeader() {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = scrollY.getPrevious();
    if (prev) {
      const diff = current - prev;
      setScrollDirection(diff > 0 ? false : true);
    }
  });

  return (
    <AnimatePresence>
      {scrollDirection && (
        <motion.div
          className={styles.main}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0,
            duration: 0.8,
          }}
        >
          <Navbar></Navbar>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default AppHeader;
