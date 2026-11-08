"use client";

import { useCart } from "@/context/cartcontext";

import { FancyButton } from "@/components/animation/hoverbutton/hoverbutton";
import Eye from "@/components/animation/icons/eye";
import Cart from "@/components/animation/icons/cart";
import styles from "./productcardsmall.module.css";
import { useState, useEffect, useMemo, useRef } from "react";
import { formatPriceEUR } from "../utils/func";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Product } from "@/types/index";
import { useI18n } from "@/context/diccontext";
import ProductCardMOdal from "@/components/productcardmodal/productcardmodal";

import { ProductImage } from "@/types/index";

export default function ProductCardSmall({
  product,
  size,
   
}: {
  product: Product;
  size: number;
   
}) {
  const { addToCart } = useCart();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
 
  const mainImage =
    product.images.find((img: ProductImage) => img.isMain) || product.images[0];

  const { language, dictionary } = useI18n();
  // 🌟 Функция-переводчик для маркетингового текста
  const getPromoText = () => {
    if (!product.discountText) return null;

    // Проверяем, начинается ли текст с инструкции "day:"
    if (product.discountText === "day_0") {
      return dictionary.days.day_0; // Seginda-feira или Monday
    }
    if (product.discountText === "day_1") {
      return dictionary.days.day_1; // Seginda-feira или Monday
    }
    if (product.discountText === "day_2") {
      return dictionary.days.day_2; // Seginda-feira или Monday
    }
    if (product.discountText === "day_3") {
      return dictionary.days.day_3; // Seginda-feira или Monday
    }

    if (product.discountText === "day_4") {
      return dictionary.days.day_4; // Seginda-feira или Monday
    }
    if (product.discountText === "day_5") {
      return dictionary.days.day_5; // Seginda-feira или Monday
    }
    if (product.discountText === "day_6") {
      return dictionary.days.day_6; // Seginda-feira или Monday
    }

    // Если это просто текст типа "Promo", ищем перевод в словаре (напр. dictionary.menu.promo)
    if (product.discountText === "Promo") {
      return dictionary.promo.promoday;
    }
    // В остальных случаях (-20% или -5€) выводим как есть
    return product.discountText;
  };

  const currentPromoText = getPromoText();
  
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function getRotation(id: string) {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }

    return (hash % 5) - 1; // от -2 до +2
  }
  const rotate = getRotation(product.id);

  //const rotateM = useMemo(() => getRotate(product.id), [product.id]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const rotateX = deltaY * -6;
    const rotateY = deltaX * 6;

    el.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotate(${rotate}deg)
      `;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;

    el.style.transform = `rotate(${rotate}deg)`;
  };

  return (
    <div
      className={styles.main}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.hitbox}>
        <div
          className={styles.hit}
          style={{
            transform: `rotate(${rotate}deg)`,
          }}
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={styles.imgboxp}
            style={{ width: `${size + 14}px`, height: `${size + 50}px` }}
          >
            <div
              className={styles.imageWrap}
              style={{ width: size, height: size }}
            >
              <Image
                src={mainImage.url}
                alt={product[`name_${language}`] || ""}
                fill
                sizes={`${size}px`}
              />
              {product.hasDiscount && <div className={styles.promoline}>{currentPromoText}</div>}
            </div>
            <div className={styles.imgnamebox}>
              <p>{product[`name_${language}`] || ""}</p>
            </div>
          </div>
        </div>
        <div className={styles.tape}>
           {product.hasDiscount ? (
            <>
              <span className={styles.oldPrice}>
                {formatPriceEUR(product.price)}
              </span>
              <span className={styles.newPrice}>
                {formatPriceEUR(product.currentPrice)}
              </span>
            </>
          ) : (
            <span className={styles.normalPrice}>
              {formatPriceEUR(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* 🔘 hover actions */}
      <div className={`${styles.actions} ${hover ? styles.show : ""}`}>
        <FancyButton
          tooltip="olhada rápida"
          Icon={<Eye color="black" />}
          baseColor="rgba(247, 244, 244, 0.8)"
          hoverColor="rgba(167, 224, 162, 1)"
          wsize="50px"
          hsize="50px"
          onClick={() => {
            setOpen(true);
          }}
        />

        <FancyButton
          tooltip="adicionar ao carrinho"
          Icon={<Cart color="black" />}
          baseColor="rgba(247, 244, 244, 0.8)"
          hoverColor="rgba(167, 224, 162, 1)"
          wsize="50px"
          hsize="50px"
          onClick={() =>
            addToCart({
              id: product.id,
              name: product[`name_${language}`] || "",
              price: product.currentPrice,
              image: mainImage.url,
            })
          }
        />
      </div>

      {open &&
        createPortal(
          <div className={styles.overlay} onClick={() => setOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <ProductCardMOdal product={product} setOpen={setOpen} col={1}></ProductCardMOdal>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/* <div>{` X  ${formatPriceEUR(product.price)} = ${formatPriceEUR(product.price *qty )}`}</div>*/
