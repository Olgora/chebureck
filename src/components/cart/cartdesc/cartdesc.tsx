"use client";

import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import { useCart } from "@/context/cartcontext";
import { useI18n } from "@/context/diccontext";
import Image from "next/image";
import { formatPriceEUR } from "../../utils/func";
import styles from "./cartdesc.module.css";
import CartContent from "@/components/cart/cartcontent";

export default function CartDesc() {
  const { items, increaseQty, decreaseQty, removeItem } = useCart();

  const { dictionary } = useI18n();

  //if (!isOpen) return null;

  return (
    <div className={styles.main}>
      {items.length === 0 && (
        <p className="text-gray-500">{dictionary.cartdrawer.cart}</p>
      )}
       <CartContent styles={styles}  check={false}/>
    </div>
  );
}
