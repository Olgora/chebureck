"use client";
import styles from "./logo.module.css";
import Image from "next/image";

type TLogo = {
  width:number,
  height:number

}

export function Logo({width,height}:TLogo) {
 
  return (
    <div className={styles.title}>
     
      <Image
        src={"/images/logo.png"}
        alt="logo"
        width={width}
        height={height}
        className={styles.icon}
        style={{width:width}}
      ></Image>
    </div>
  );
}
export default Logo;

