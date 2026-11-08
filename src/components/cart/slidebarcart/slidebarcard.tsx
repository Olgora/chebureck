"use client";

import React from "react";
import { useCart } from "@/context/cartcontext";
import styles from "./slidebarcard.module.css";
import { useI18n } from "@/context/diccontext";
import CartContent from "@/components/cart/cartcontent";

export default function SidebarCart() {
  const { items } = useCart();
  const { dictionary } = useI18n();

  return (
    <div className={styles.cartContainer}>
      {/* Декоративный малярный скотч */}
      <div className={styles.tape} />

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          {dictionary.menu.emptyTitle}
          <br />
          {dictionary.menu.emptyText}
        </div>
      ) : (
        <div className={styles.drawer}>
          <CartContent styles={styles}  check={true}/>
        </div>
      )}
    </div>
  );
}