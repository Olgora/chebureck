"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cartcontext";
import { useI18n } from "@/context/diccontext";
import { useResize } from "@/components/utils/hook";
import styles from "./cartdrawer.module.css";
import CloseButton from "../../animation/closebutton/closebutton";
import { AnimatePresence, motion } from "framer-motion";
import CartContent from "@/components/cart/cartcontent";

const DRAWER_MAX_WIDTH = 990;

export default function CartDrawer() {
  const { isOpen, closeCart } = useCart();
  const pathname = usePathname();
  const { language } = useI18n();
  const MENU_PATH_SEGMENT = `/${language}/menu`;
  const { width } = useResize();

  const isBelowBreakpoint = width > 0 && width <= DRAWER_MAX_WIDTH;
  const isMenuPage = pathname?.includes(MENU_PATH_SEGMENT) ?? false;
  const shouldRenderDrawer = !isMenuPage || isBelowBreakpoint;

  useEffect(() => {
    if (isMenuPage && !isBelowBreakpoint && isOpen) {
      closeCart();
    }
  }, [isMenuPage, isBelowBreakpoint, isOpen, closeCart]);

  if (!shouldRenderDrawer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.overlay}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "120%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={styles.drawer}
          >
            <div className={styles.close}>
              <CloseButton onClick={closeCart} />
            </div>

            {/* Вся корзина целиком */}
            <CartContent styles={styles} check={true}/>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
/*"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/context/cartcontext";
import { useI18n } from "@/context/diccontext";
import { useResize } from "@/components/utils/hook"; // подставь свой реальный путь к файлу
import styles from "./cartdrawer.module.css";
import { freeshipping } from "@/lib/adminka";
import { formatPriceEUR } from "../utils/func";
import FreeShippingSection from "../animation/freeshipingbar/freeshipingbar";
import CloseButton from "../animation/closebutton/closebutton";
import Image from "next/image";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import { AnimatePresence, motion } from "framer-motion";

// Ширина, ниже которой считаем экран "мобильным/узким" для целей drawer-а.
const DRAWER_MAX_WIDTH = 990;

// Часть пути, по которой определяем, что мы на странице меню —
// там уже есть постоянный sticky-сайдбар корзины на широких экранах,
// поэтому drawer там не нужен, кроме как на узких экранах.
// Подставь свой реальный сегмент пути, если он называется иначе.

export default function CartDrawer() {
  const { items, increaseQty, decreaseQty, removeItem, isOpen, closeCart } =
    useCart();
  const router = useRouter();
  const pathname = usePathname();
  const { language, dictionary } = useI18n();
  const MENU_PATH_SEGMENT = `/${language}/menu`;
  const { width } = useResize();

  // width === 0 значит "ещё не измерено" (до первого кадра внутри useResize) —
  // в этот момент считаем, что порог не пройден, чтобы не мигнуть
  // мобильной логикой на широком экране на долю секунды.
  const isBelowBreakpoint = width > 0 && width <= DRAWER_MAX_WIDTH;

  const isMenuPage = pathname?.includes(MENU_PATH_SEGMENT) ?? false;

  // На странице меню — drawer нужен только на узких экранах (там нет
  // постоянного сайдбара). На любой другой странице (например, главной)
  // drawer работает всегда, независимо от ширины экрана, — там нет
  // альтернативного постоянного представления корзины.
  const shouldRenderDrawer = !isMenuPage || isBelowBreakpoint;

  // Если пользователь на странице меню растянул окно за порог, пока
  // drawer был открыт, — закрываем его, чтобы не остаться в подвешенном
  // состоянии "должен быть скрыт, но всё ещё isOpen: true".
  useEffect(() => {
    if (isMenuPage && !isBelowBreakpoint && isOpen) {
      closeCart();
    }
  }, [isMenuPage, isBelowBreakpoint, isOpen, closeCart]);

  if (!shouldRenderDrawer) return null;

  function goToCheckout() {
    closeCart();
    router.push(`/${language}/checkout`);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.overlay}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "120%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={styles.drawer}
          >
            <div className={styles.main}>
              <div className={styles.close}>
                <CloseButton onClick={closeCart}></CloseButton>
              </div>

              <div className={styles.block}>
                <h2 className={styles.title}>{dictionary.cartdrawer.title}</h2>
                <FreeShippingSection
                  cartTotal={total}
                  threshold={freeshipping}
                ></FreeShippingSection>
              </div>

              {items.length === 0 && (
                <p className={styles.empty}>{dictionary.cartdrawer.cart}</p>
              )}

              <div className={styles.list}>
                {items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <span className={styles.itemtitle}>{item.name}</span>
                    <div className={styles.box}>
                      <div className={styles.imageWrap}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="120px"
                        />
                      </div>
                      <div className={styles.boxs}>
                        <div>{formatPriceEUR(item.price)}</div>
                        <div className={styles.col}>
                          <FancyButtonXL
                            baseColor="rgba(10, 10, 10, 0)"
                            hoverColor="rgba(167, 224, 162,1)"
                            wsize="50px"
                            hsize="50px"
                            onClick={() => decreaseQty(item.id)}
                            name="-"
                            borderradius="0px"
                          />
                          <div className={styles.itemcol}>{item.quantity}</div>
                          <FancyButtonXL
                            baseColor="rgba(10, 10, 10, 0)"
                            hoverColor="rgba(167, 224, 162,1)"
                            wsize="50px"
                            hsize="50px"
                            onClick={() => increaseQty(item.id)}
                            name="+"
                            borderradius="0px"
                          />
                          <div className={styles.itemcol}>
                            {" "}
                            = {formatPriceEUR(item.quantity * item.price)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className={styles.removeBtn}
                        >
                          {dictionary.cartdrawer.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className={styles.footer}>
                  <div className={styles.total}>
                    <div>{dictionary.cartdrawer.total}</div>
                    <div>{formatPriceEUR(total)}</div>
                  </div>
                  <FancyButtonXL
                    baseColor="rgba(10, 10, 10, 0)"
                    hoverColor="rgba(167, 224, 162,1)"
                    wsize="350px"
                    hsize="60px"
                    onClick={goToCheckout}
                    name={dictionary.cartdrawer.checkout}
                    borderradius="0px"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}*/
