"use client";

import { useCart } from "@/context/cartcontext";
import MagnetCard from "@/components/polaroidcard/polaroidcard";
import { FancyButton } from "@/components/animation/hoverbutton/hoverbutton";
import Eye from "@/components/animation/icons/eye";
import Cart from "@/components/animation/icons/cart";
import styles from "./productcardmenu.module.css";
import { useState, useEffect } from "react";
import { Product } from "@/types/index";
import { createPortal } from "react-dom";
import { useI18n } from "@/context/diccontext";

import { ProductImage } from "@/types/index";
import ProductCardMOdal from "@/components/productcardmodal/productcardmodal";

export default function ProductCardMenu({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

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

  const mainImage =
    product.images.find((img: ProductImage) => img.isMain) || product.images[0];

  const { language, dictionary } = useI18n();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className={styles.main}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <MagnetCard
        image={mainImage.url}
        title={product[`name_${language}`] || ""}
        price={product.price}
        id={product.id}
        promo={currentPromoText}
        promo_price={product.currentPrice}
        has_discount={product.hasDiscount}
      ></MagnetCard>

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
              price: product.price,
              image: mainImage.url,
            })
          }
        />
      </div>

      {open &&
        createPortal(
          <div className={styles.overlay} onClick={() => setOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <ProductCardMOdal
                product={product}
                setOpen={setOpen}
                 col={1}
              ></ProductCardMOdal>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/* <div>{` X  ${formatPriceEUR(product.price)} = ${formatPriceEUR(product.price *qty )}`}</div>*/
