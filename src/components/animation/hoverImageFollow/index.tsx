"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import Image from "next/image"

type HoverImageFollowProps = {
  image: string // путь к изображению
  children: React.ReactNode // контент внутри блока
  offsetX?: number // сдвиг по X от курсора
  offsetY?: number // сдвиг по Y от
  wimg?: number // размер картинки
}

export default function HoverImageFollow({
  image,
  children,
  offsetX = 30,
  offsetY = 30,
  wimg = 100,
}: HoverImageFollowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const img = imageRef.current
    if (!container || !img) return

    const moveImage = (e: MouseEvent) => {
      gsap.to(img, {
        x: e.clientX + offsetX,
        y: e.clientY + offsetY,
        duration: 0.4,
        ease: "power2.out",
      })
    }

    const showImage = () => {
      gsap.to(img, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      })
      window.addEventListener("mousemove", moveImage)
    }

    const hideImage = () => {
      gsap.to(img, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in",
      })
      window.removeEventListener("mousemove", moveImage)
    }

    container.addEventListener("mouseenter", showImage)
    container.addEventListener("mouseleave", hideImage)

    return () => {
      container.removeEventListener("mouseenter", showImage)
      container.removeEventListener("mouseleave", hideImage)
      window.removeEventListener("mousemove", moveImage)
    }
  }, [offsetX, offsetY])

  return (
    <div ref={containerRef} className="relative inline-block cursor-pointer">
      {children}
      <Image
        width={wimg}
        height={wimg}
        ref={imageRef}
        src={image}
        alt="hover preview"
        className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 scale-75 rounded-full"
        style={{ transformOrigin: "center center" }}
      />
    </div>
  )
}
