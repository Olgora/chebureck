"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import styles from "./polaroidcardmenu.module.css";
import { formatPriceEUR } from "../utils/func";
import { FancyButton } from "@/components/animation/hoverbutton/hoverbutton";
import Eye from "@/components/animation/icons/eye";
import Cart from "@/components/animation/icons/cart";
import { useCart } from "@/context/cartcontext";
import { createPortal } from "react-dom";
import { Product } from "@/types/index";
import { useI18n } from "@/context/diccontext";
import { ProductImage } from "@/types/index";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import ProductCardMOdal from "@/components/productcardmodal/productcardmodal";
import { useLockBodyScroll } from "../skrollblocked/skrollblocked";

type Props = {
  product: Product;
};

// Замените на реальную ссылку вашего ресторана в Uber Eats
const UBER_EATS_URL = "https://www.ubereats.com";

function getRotate(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const values = [-5, -3, -2.5, 2.5, 3, 5];
  return values[hash % values.length];
}

export default function MagnetCardMenu({ product }: Props) {
  const { language, dictionary } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart, items } = useCart();
  const [open, setOpen] = useState(false);

  // Состояние для диалога выбора типа заказа
  const [orderTypeModalOpen, setOrderTypeModalOpen] = useState(false);

  const getPromoText = () => {
    if (!product.discountText) return null;

    if (product.discountText === "day_0") return dictionary.days.day_0;
    if (product.discountText === "day_1") return dictionary.days.day_1;
    if (product.discountText === "day_2") return dictionary.days.day_2;
    if (product.discountText === "day_3") return dictionary.days.day_3;
    if (product.discountText === "day_4") return dictionary.days.day_4;
    if (product.discountText === "day_5") return dictionary.days.day_5;
    if (product.discountText === "day_6") return dictionary.days.day_6;

    if (product.discountText === "Promo") {
      return dictionary.promo.promoday;
    }
    return product.discountText;
  };

  const currentPromoText = getPromoText();

  const mainImage =
    product.images.find((img: ProductImage) => img.isMain) || product.images[0];
  const rotate = useMemo(() => getRotate(product.id), [product.id]);

  const resetTransform = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `rotate(${rotate}deg)`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (open || orderTypeModalOpen) return;

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

  useLockBodyScroll(open || orderTypeModalOpen);

  const handleMouseLeave = () => {
    resetTransform();
  };

  const handleOpenModal = () => {
    resetTransform();
    setOpen(true);
  };

  const executeAddToCart = () => {
    addToCart({
      id: product.id,
      name: product[`name_${language}`] || "",
      price: product.currentPrice,
      image: mainImage.url,
    });
  };

  // Проверка: первое добавление или корзина уже наполнена
  const handleCartClick = () => {
    if (items.length === 0) {
      resetTransform();
      setOrderTypeModalOpen(true);
    } else {
      executeAddToCart();
    }
  };

  const handleSelectPickup = () => {
    setOrderTypeModalOpen(false);
    executeAddToCart();
  };

  const handleSelectDelivery = () => {
    setOrderTypeModalOpen(false);
    window.open(UBER_EATS_URL, "_blank"); // Либо window.location.href = UBER_EATS_URL для перехода в той же вкладке
  };

  const cartItem = items.find((item) => item.id === product.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `rotate(${rotate}deg)`,
        pointerEvents: open || orderTypeModalOpen ? "none" : "auto",
      }}
    >
      <div className={styles.imageWrap}>
        <Image
          src={mainImage.url}
          alt={product[`name_${language}`] || ""}
          fill
          sizes="50vw"
          className={styles.image}
        />
      </div>
      <div className={styles.metablock}>
        <div className={styles.meta}>
          <div className={styles.title}>
            {product[`name_${language}`] || ""}
            {product.hasDiscount && (
              <div className={styles.promoline}>{currentPromoText}</div>
            )}
          </div>
          {product.hasDiscount ? (
            <div className={styles.priceRow}>
              <div className={styles.saldo}>
                <div className={styles.saldoold}>
                  {formatPriceEUR(product.price)}
                </div>
                <div className={styles.saldonew}>
                  {formatPriceEUR(product.currentPrice)}
                </div>
              </div>
            </div>
          ) : (
            <span className={styles.priceRow}>
              {formatPriceEUR(product.price)}
            </span>
          )}
        </div>
        <div className={styles.buttonV}>
          <FancyButton
            tooltip="olhada rápida"
            Icon={<Eye color="black" size={30} />}
            baseColor="transparent"
            hoverColor="rgba(167, 224, 162, 1)"
            wsize="50px"
            hsize="50px"
            onClick={handleOpenModal}
          />
          <div className={styles.buttonVV}>
            <div style={{ zIndex: 50 }}>
              <FancyButton
                tooltip="adicionar ao carrinho"
                Icon={<Cart color="black" size="30" name={inCartQuantity} />}
                baseColor="rgba(167, 224, 162, 1)"
                hoverColor="white"
                wsize="50px"
                hsize="50px"
                onClick={handleCartClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Быстрый просмотр товара */}
      {open &&
        createPortal(
          <div className={styles.overlay} onClick={() => setOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <ProductCardMOdal
                product={product}
                setOpen={setOpen}
                col={inCartQuantity}
              />
            </div>
          </div>,
          document.body,
        )}

      {/* Модальное окно выбора: Доставка / Самовывоз */}
      {orderTypeModalOpen &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={() => setOrderTypeModalOpen(false)}
          >
            <div
              className={styles.deliveryModalBox || styles.modal}
              onClick={(e) => e.stopPropagation()}
              
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                {dictionary.orderType.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                {dictionary.orderType.subtitle}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <FancyButtonXL
                  baseColor="rgba(10, 10, 10, 0)"
                  hoverColor="rgba(167, 224, 162,1)"
                  wsize="250px"
                  hsize="55px"
                  onClick={handleSelectDelivery}
                  name={dictionary.orderType.delivery}
                  borderradius="0px"
                />

                <FancyButtonXL
                  baseColor="rgba(10, 10, 10, 0)"
                  hoverColor="rgba(167, 224, 162,1)"
                  wsize="250px"
                  hsize="55px"
                  onClick={handleSelectPickup}
                  name={dictionary.orderType.pickup}
                  borderradius="0px"
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/*


*/
