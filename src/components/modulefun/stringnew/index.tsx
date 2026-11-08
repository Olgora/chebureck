"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./string.module.css"

gsap.registerPlugin(ScrollTrigger)

type Tlist = {
  sentens: string[]
}

export default function SpringSharpScrollText({ sentens }: Tlist) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const lines = container.querySelectorAll(".scroll-line")

    lines.forEach((line) => {
      const text = line.textContent || ""
      line.textContent = ""

      // Разбиваем строку на буквы
      const letters = text.split("").map((char) => {
        const span = document.createElement("span")
        span.textContent = char === " " ? "\u00A0" : char
        span.classList.add(styles["sharp-letter"])
        line.appendChild(span)
        return span
      })

      // Timeline для конкретной строки
      const lineTl = gsap.timeline({
        defaults: { duration: 0.1, ease: "power1.out" },
        scrollTrigger: {
          trigger: line,
          start: "top 80%", // когда строка почти видна
          end: "bottom top",
          toggleActions: "play reverse play reverse", // вперед/обратно
        },
      })

      letters.forEach((letter) => {
        lineTl.to(letter, { clipPath: "inset(0% 0% 0% 0%)" })
      })
    })
  }, [])

  return (
    <div ref={containerRef} className={styles.main}>
      {sentens.map((text, i) => (
        <p key={i} className={`scroll-line ${styles.str}`}>
          {text}
        </p>
      ))}
      <div className={styles.fixe}>
        {sentens.map((text, i) => (
          <p
            key={i}
            className={styles.str}
            style={{ opacity: 0.3, fontWeight: 700 }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}
