"use client";
import styles from "./languageswitcher.module.css";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
];

export function LanguageDropdown() {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  //const current = languages.find((l) => l.code === pathname);

  const currentLang = pathname.split("/")[1] || "pt";

  const current = languages.find((l) => l.code === currentLang) || languages[0];

  // смена языка
  const changeLang = (lang: string) => {
    const segments = pathname.split("/");

    // если языка нет в url
    if (!["pt", "en"].includes(segments[1])) {
      segments.splice(1, 0, lang);
    } else {
      segments[1] = lang;
    }

    const newPath = segments.join("/") || `/${lang}`;

    router.push(newPath);

    setOpen(false);
  };

  // закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={styles.main}
      animate={open ? "open" : "closed"}
    >
      <button onClick={() => setOpen((v) => !v)} className={styles.buttonl}>
        {current.label}
      </button>

      <motion.div
        className={styles.list}
        variants={{
          open: {
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 24,
              delayChildren: 0.1,
              staggerChildren: 0.05,
            },
          },
          closed: {
            opacity: 0,
            scale: 0.9,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }}
        style={{
          pointerEvents: open ? "auto" : "none",
          transformOrigin: "top right", // раскрытие "из точки" кнопки, а не из центра
        }}
      >
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => changeLang(lang.code)}
            className={styles.item}
            whileHover={{ scale: 1.2 }}
          >
            {lang.label}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
