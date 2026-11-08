import React from "react"
import styles from "./card.module.css"

import Image from "next/image"

type Tprops = {
  name: string
  icon: string
  price: number
  roc: string
  desc: string
}

const Card = ({ name, icon, price, roc, desc }: Tprops) => {
  return (
    <div className={styles.card}>
      <Image
        className={styles.image}
        src={icon}
        alt={name}
        width={300}
        height={220}
      />
      <div className={styles.title}>{name}</div>
      <div className={styles.name}>{price}</div>
    </div>
  )
}

export default Card
