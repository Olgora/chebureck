"use client";

import { useCart } from "@/context/cartcontext";
import { useI18n } from "@/context/diccontext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { freeshipping } from "@/lib/adminka";
import { formatPriceEUR } from "../utils/func";
import FreeShippingSection from "../animation/freeshipingbar/freeshipingbar";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";

type Props = {
  // Передаем модульные стили (они у вас одинаковые по структуре классов)
  styles: {
    readonly [key: string]: string;
  };
  check: boolean;
};

export default function CartContent({ styles, check }: Props) {
  const { items, increaseQty, decreaseQty, removeItem, closeCart } = useCart();
  const router = useRouter();
  const { language, dictionary } = useI18n();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function goToCheckout() {
    closeCart();
    router.push(`/${language}/checkout`);
  }

  return (
    <div className={styles.main}>
      {check && (
        <div className={styles.block}>
          <h2 className={styles.title}>{dictionary.cartdrawer.title}</h2>
        </div>
      )}
      {items.length === 0 ? (
        <p className={styles.empty || "text-gray-500"}>
          {dictionary.cartdrawer.cart}
        </p>
      ) : (
        <div className={styles.list}>
          {items.map((item) => {
            // Ключ и идентификатор для операций (productId + допы)
            const itemKey = item.cartItemId || item.id;

            return (
              <div key={itemKey} className={styles.item}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span className={styles.itemtitle}>{item.name}</span>

                  {/* 🧀 Вывод выбранных ингредиентов (допов) к чебуреку */}
                  {item.ingredients && item.ingredients.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        paddingLeft: "4px",
                        margin: "3px 0",
                      }}
                    >
                      {item.ingredients.map((ing) => (
                        <span
                          key={ing.id}
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{ color: "#9ca3af", fontWeight: "bold" }}
                          >
                            +
                          </span>
                          <span>{ing.name}</span>
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                            ({formatPriceEUR(ing.price)})
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

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
                        hoverColor="rgba(167, 224, 162, 1)"
                        wsize="50px"
                        hsize="50px"
                        onClick={() => decreaseQty(itemKey)}
                        name="-"
                        borderradius="0px"
                      />

                      <div className={styles.itemcol}>{item.quantity}</div>

                      <FancyButtonXL
                        baseColor="rgba(10, 10, 10, 0)"
                        hoverColor="rgba(167, 224, 162, 1)"
                        wsize="50px"
                        hsize="50px"
                        onClick={() => increaseQty(itemKey)}
                        name="+"
                        borderradius="0px"
                      />

                      <div className={styles.itemcol}>
                        = {formatPriceEUR(item.quantity * item.price)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(itemKey)}
                      className={styles.removeBtn}
                      style={{ textTransform: "uppercase", cursor: "pointer" }}
                    >
                      {dictionary.cartdrawer.remove}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && check && (
        <div className={styles.footer || ""}>
          <div className={styles.total}>
            <div>{dictionary.cartdrawer.total}</div>
            <div>{formatPriceEUR(total)}</div>
          </div>
          <FancyButtonXL
            baseColor="rgba(10, 10, 10, 0)"
            hoverColor="rgba(167, 224, 162, 1)"
            wsize="350px"
            hsize="60px"
            onClick={goToCheckout}
            name={dictionary.cartdrawer.checkout}
            borderradius="0px"
          />
        </div>
      )}
    </div>
  );
}
