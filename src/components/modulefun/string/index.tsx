"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./string.module.css"

gsap.registerPlugin(ScrollTrigger)

type Tlist = {
  sentens: string[]
}

export default function SequentialScrollText({ sentens }: Tlist) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const lines = container.querySelectorAll(".scroll-line")

    // Общий timeline для всех строк — всё идёт строго последовательно
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 2, // плавная инерция при скролле
       
      },
    })

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

      // Для каждой строки создаём внутренний timeline
      const lineTl = gsap.timeline({
        defaults: { duration: 0.45, ease: "power1.out" },
      })

      letters.forEach((letter) => {
        // Каждая буква ждёт завершения предыдущей
        lineTl.to(letter, { clipPath: "inset(0% 0% 0% 0%)" })
      })

      // Добавляем линию в общий timeline, чтобы строки шли по очереди
      masterTl.add(lineTl)
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
 