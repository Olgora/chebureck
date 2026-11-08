"use client";

import { useCart } from "@/context/cartcontext";
import styles from "./productcardmodal.module.css";
import { useState, Dispatch, SetStateAction } from "react";
import { formatPriceEUR } from "../utils/func";
import Image from "next/image";

import { Product, ProductImage } from "@/types/index";
import { useI18n } from "@/context/diccontext";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import CloseButton from "../animation/closebutton/closebutton";

// Тип для выбранного ингредиента
type SelectedIngredient = {
  id: string;
  name: string;
  price: number;
};

export default function ProductCardMOdal({
  product,
  setOpen,
  col,
}: {
  product: Product;
  setOpen: Dispatch<SetStateAction<boolean>>;
  col: number;
}) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  // 🧀 Стейт для выбранных ингредиентов
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);

  const mainImage =
    product.images.find((img: ProductImage) => img.isMain) || product.images[0];

  const { language, dictionary } = useI18n();

  // Доступные ингредиенты товара
  const availableIngredients = product.availableIngredients || [];
  console.log(availableIngredients);


  // Переключение выбора ингредиента
  const toggleIngredient = (ing: any) => {
    const isSelected = selectedIngredients.some((i) => i.id === ing.id);
    if (isSelected) {
      setSelectedIngredients((prev) => prev.filter((i) => i.id !== ing.id));
    } else {
      const name = ing[`name_${language}`] || ing.name_pt;
      setSelectedIngredients((prev) => [
        ...prev,
        { id: ing.id, name, price: Number(ing.price) },
      ]);
    }
  };

  // 💰 Расчет цен: базовая + выбранные допы
  const basePrice = Number(product.currentPrice ?? product.price);
  const toppingsPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
  const singlePrice = basePrice + toppingsPrice;

  // 🌟 Функция-переводчик для маркетингового текста
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

  // 📝 Текст для главной кнопки с учетом итоговой цены
  const getButtonContent = () => {
    const inCartText = dictionary.menu.already_in_cart;
    const addText = dictionary.menu.add;
    const toCartText = dictionary.menu.to_cart;

    if (col > 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center leading-none py-1">
          <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold mb-0.5 text-inherit">
            {inCartText} {col}
          </span>
          <span className="text-xs font-black uppercase tracking-wide text-inherit">
            {addText} {qty} {toCartText} ({formatPriceEUR(singlePrice * qty)})
          </span>
        </div>
      );
    }

    return `${addText} ${qty} ${toCartText} (${formatPriceEUR(singlePrice * qty)})`;
  };

  return (
    <div className={styles.mainbox}>
      <div className={styles.namebox}>
        <div className={styles.imageBox}>
          {product.hasDiscount && (
            <div className={styles.promoline}>{currentPromoText}</div>
          )}
          <Image
            src={mainImage.url}
            alt={product[`name_${language}`] || ""}
            width={300}
            height={200}
            className={styles.imgbox}
          />
        </div>

        {/* Управление количеством и кнопка добавления */}
        <div className={styles.qty}>
          <div className={styles.qtycol}>
            <FancyButtonXL
              baseColor="rgba(10, 10, 10, 0)"
              hoverColor="rgba(167, 224, 162, 1)"
              wsize="55px"
              hsize="55px"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              name="-"
              borderradius="0px"
            />

            <span>{qty}</span>

            <FancyButtonXL
              baseColor="rgba(10, 10, 10, 0)"
              hoverColor="rgba(167, 224, 162, 1)"
              wsize="55px"
              hsize="55px"
              onClick={() => setQty((q) => q + 1)}
              name="+"
              borderradius="0px"
            />
          </div>

          <FancyButtonXL
            baseColor="rgba(10, 10, 10, 0)"
            hoverColor="rgba(167, 224, 162, 1)"
            wsize="250px"
            hsize="55px"
            onClick={() => {
              addToCart({
                id: product.id,
                name: product[`name_${language}`] || "",
                price: singlePrice, // цена чебурека с выбранными допами
                quantity: qty,
                image: mainImage.url,
                ingredients: selectedIngredients, // 👈 передаем массив выбранных ингредиентов
              });

              setOpen(false);
              setQty(1);
              setSelectedIngredients([]);
            }}
            name={getButtonContent()}
            borderradius="0px"
          />
        </div>
      </div>

      <div className={styles.descbox}>
        <div className={styles.name}>
          <h2>{product[`name_${language}`]}</h2>
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

        {/* Описание чебурека */}
        <div className="text-sm text-gray-700 leading-relaxed mb-4">
          {product[`description_${language}`]}
        </div>
 
        {/* 🧀 Секция дополнительных ингредиентов (топпингов) */}
        {availableIngredients.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
               
                Extra ingredients
                 
            </h4>

            <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
              {availableIngredients.map((ing: any) => {
                const isSelected = selectedIngredients.some((i) => i.id === ing.id);
                const title = ing[`name_${language}`] || ing.name_pt;

                return (
                  <label
                    key={ing.id}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer select-none text-xs transition-colors ${
                      isSelected
                        ? "border-black bg-zinc-50 font-medium"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleIngredient(ing)}
                        className="w-3.5 h-3.5 accent-black rounded cursor-pointer"
                      />
                      <span>{title}</span>
                    </div>

                    <span className="font-semibold text-gray-900">
                      +{formatPriceEUR(Number(ing.price))}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className={styles.close}>
        <CloseButton onClick={() => setOpen(false)} />
      </div>
    </div>
  );
}



/*"use client";

import { useCart } from "@/context/cartcontext";

import styles from "./productcardmodal.module.css";
import { useState, Dispatch, SetStateAction } from "react";
import { formatPriceEUR } from "../utils/func";
import Image from "next/image";

import { Product } from "@/types/index";
import { useI18n } from "@/context/diccontext";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import CloseButton from "../animation/closebutton/closebutton";
import { ProductImage } from "@/types/index";
 
export default function ProductCardMOdal({
  product,
  setOpen,
  col,
}: {
  product: Product;
  setOpen: Dispatch<SetStateAction<boolean>>;
  col: number;
}) {
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
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

  // 📝 Формируем двухстрочный контент для главной кнопки добавления
  const getButtonContent = () => {
    const inCartText = dictionary.menu.already_in_cart;
    const addText = dictionary.menu.add;
    const toCartText = dictionary.menu.to_cart;

    if (col > 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center leading-none py-1">
          <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold mb-0.5 text-inherit">
            {inCartText} {col}
          </span>
          <span className="text-xs font-black uppercase tracking-wide text-inherit">
            {addText} {qty} {toCartText}
          </span>
        </div>
      );
    }

    return `${addText} ${qty} ${toCartText}`;
  };

  return (
    <div className={styles.mainbox}>
      <div className={styles.namebox}>
        <div className={styles.imageBox}>
          {product.hasDiscount && (
            <div className={styles.promoline}>{currentPromoText}</div>
          )}
          <Image
            src={mainImage.url}
            alt={product[`name_${language}`] || ""}
            width={300}
            height={200}
            className={styles.imgbox}
          />
        </div>
        <div className={styles.qty}>
          <div className={styles.qtycol}>
            <FancyButtonXL
              baseColor="rgba(10, 10, 10, 0)"
              hoverColor="rgba(167, 224, 162,1)"
              wsize="55px"
              hsize="55px"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              name="-"
              borderradius="0px"
            />

            <span>{qty}</span>

            <FancyButtonXL
              baseColor="rgba(10, 10, 10, 0)"
              hoverColor="rgba(167, 224, 162,1)"
              wsize="55px"
              hsize="55px"
              onClick={() => setQty((q) => q + 1)}
              name="+"
              borderradius="0px"
            />
          </div>

          <FancyButtonXL
            baseColor="rgba(10, 10, 10, 0)"
            hoverColor="rgba(167, 224, 162,1)"
            wsize="250px"
            hsize="55px"
            onClick={() => {
              addToCart({
                id: product.id,
                name: product[`name_${language}`] || "",
                price: product.currentPrice,
                quantity: qty, // 👈 ВАЖНО
                image: mainImage.url,
              });

              setOpen(false); // optional: закрыть после добавления
              setQty(1); // reset
            }}
            name={getButtonContent()}
            borderradius="0px"
          />
        </div>
      </div>
      <div className={styles.descbox}>
        <div className={styles.name}>
          <h2>{product[`name_${language}`]}</h2>
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
        <>{product[`description_${language}`]}</>
      </div>

      <div className={styles.close}>
        <CloseButton onClick={() => setOpen(false)}></CloseButton>
      </div>
    </div>
  );
}
*/