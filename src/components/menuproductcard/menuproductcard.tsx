"use client";

import { Product, ProductImage } from "@/types/index";
import { useI18n } from "@/context/diccontext";
import styles from "./menuproductcard.module.css";
import MagnetCard from "@/components/polaroidcard/polaroidcard";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import { useCart } from "@/context/cartcontext";
import { useState } from "react";

export default function MenuProductCard({
  product,
}: {
  product: Product;
  rotationClass: number;
}) {
  const mainImage =
    product.images.find((img: ProductImage) => img.isMain) || product.images[0];

  const { language, dictionary } = useI18n();
  const [qty, setQty] = useState(1);
  const { addToCart, items } = useCart();

  // 🔎 Находим текущий товар в глобальной корзине
  const cartItem = items.find((item) => item.id === product.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  // 📝 Формируем двухстрочный контент для главной кнопки добавления
  const getButtonContent = () => {
    const inCartText = dictionary.menu.already_in_cart;
    const addText = dictionary.menu.add;
    const toCartText = dictionary.menu.to_cart;

    if (inCartQuantity > 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center leading-none py-1">
          <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold mb-0.5 text-inherit">
            {inCartText} {inCartQuantity}
          </span>
          <span className="text-xs font-black uppercase tracking-wide text-inherit">
            {addText} {qty} {toCartText}
          </span>
        </div>
      );
    }

    return `${addText} ${qty} ${toCartText}`;
  };

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

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        {/* Левая часть: Полароидный снимок с ценником */}
        <div className={styles.image}>
          <MagnetCard
            image={mainImage.url}
            title={product[`name_${language}`] || ""}
            price={product.price} // 🌟 Передаем цену со скидкой на сам Полароид!
            id={product.id}
            promo={currentPromoText}
            promo_price={product.currentPrice}
            has_discount={product.hasDiscount}
          />
        </div>

        {/* Правая часть: Название, описание и панель управления */}
        <div className={styles.desc}>
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className={styles.desctitle}>{product[`name_${language}`]}</h2>

            {/* 🌟 Если есть скидка, рисуем сочную мятную плашку рядом с названием */}
            {product.hasDiscount && (
              <span className={styles.promoBadge}>{currentPromoText}</span>
            )}
          </div>

          {/* 🌟 Блок отображения цен для маркетинга */}

          <div className={styles.priceRow}>
            {product.hasDiscount ? (
              <>
                <span className={styles.oldPrice}>
                  {product.price.toFixed(2)}€
                </span>
                <span className={styles.newPrice}>
                  {product.currentPrice.toFixed(2)}€
                </span>
              </>
            ) : (
              <span className={styles.normalPrice}>
                {product.price.toFixed(2)}€
              </span>
            )}
          </div>

          <div className="mt-2">
            <p className="text-stone-100 font-medium tracking-wide">
              {product[`description_${language}`] || ""}
            </p>
          </div>

          {/* Блок изменения количества [- 1 +] и кнопка заказа */}
          <div className={styles.qty}>
            {/* Кнопка Уменьшить */}
            <FancyButtonXL
              baseColor="rgba(10, 10, 10, 0)"
              hoverColor="rgba(167, 224, 162, 1)"
              wsize="55px"
              hsize="55px"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              name="-"
              borderradius="0px"
              borderColor="white"
              borderColorhover="black"
              colorFont="white"
            />

            <span>{qty}</span>

            {/* Кнопка Увеличить */}
            <FancyButtonXL
              baseColor="rgba(10, 10, 10, 0)"
              hoverColor="rgba(167, 224, 162, 1)"
              wsize="55px"
              hsize="55px"
              onClick={() => setQty((q) => q + 1)}
              name="+"
              borderradius="0px"
              borderColor="white"
              borderColorhover="black"
              colorFont="white"
            />

            {/* Главная интерактивная кнопка добавления / статуса */}
            <FancyButtonXL
              baseColor={
                inCartQuantity > 0
                  ? "rgba(167, 224, 162, 1)"
                  : "rgba(10, 10, 10, 0)"
              }
              hoverColor="rgba(167, 224, 162, 1)"
              wsize="350px"
              hsize="55px"
              borderColor={inCartQuantity > 0 ? "black" : "white"}
              borderColorhover="black"
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product[`name_${language}`] || "",
                  price: product.currentPrice, // 🌟 В корзину отправляем актуальную цену со скидкой!
                  quantity: qty,
                  image: mainImage.url,
                });

                setQty(1);
              }}
              name={getButtonContent()}
              borderradius="0px"
              colorFont="white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
