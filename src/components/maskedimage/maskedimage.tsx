"use client"

import Image from "next/image"
import clsx from "clsx"
import styles from "./maskedimage.module.css"

type SmartImageProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}


export const SmartImage = ({
  src,
  alt,
  className,
  priority = false,
}: SmartImageProps) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {/* BASE IMAGE */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={clsx(styles.image, styles.base)}
      />

      {/* HOVER IMAGE */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={clsx(styles.image, styles.hover)}
      />
    </div>
  )
}