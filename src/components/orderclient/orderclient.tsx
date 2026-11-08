"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Order } from "@/types/order"; // 👈 ВОТ ЭТО ПРАВИЛЬНО
import { useI18n } from "@/context/diccontext";
import { formatPriceEUR } from "../utils/func";
import Image from "next/image";
import styles from "./ordercliernt.module.css";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import TwoPanelScroll from "@/components/animation/twoPanelScroll/twoPanelScroll";

function formatScheduledAt(date: Date | string) {
  const d = new Date(date);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hours}:${minutes}`,
  };
}

export default function OrderClient({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false);
  const { language, dictionary } = useI18n();
  const params = useSearchParams();
  const paid = params.get("paid");
  const canceled = params.get("canceled");

  let delOr: string = dictionary.order.pickup;
  let payOr: string = dictionary.order.cash_payment;
  const { date, time } = formatScheduledAt(order.scheduledAt);
  let pikapp = true;

  async function pay() {
    const res = await fetch("/api/orders/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order.id,
      }),
    });

    const data = await res.json();

    window.location.href = data.url;
  }

  if (order.payment?.method !== "CASH") {
    payOr = dictionary.order.payment_card;
  } else {
    payOr = dictionary.order.cash_payment;
  }

  if (order.delivery?.method !== "PICKUP") {
    delOr = `${dictionary.order.delivery_address} ${order.delivery?.address}`;
    pikapp = false;
  } else {
    delOr = `${dictionary.order.pickup}`;
  }
  return (
    <div className={styles.main}>
      <TwoPanelScroll
        fixed="right"
        hstick="50px"
        right={
          <div className={styles.box}>
            <h1 className="text-2xl font-bold ">
              {dictionary.order.order} C_{order.id.slice(-6)}
            </h1>
            <div className={styles.name}>
              <p>
                {order.customer?.name}:{order.customer?.phone}
              </p>

              <p>{`${dictionary.order.order_confirmed} ${date} ${time} `}</p>
              <p>{delOr}</p>
              <p>{payOr}</p>
            </div>
            <div className={styles.pagar}>
              <div className="text-xl font-bold">
                {dictionary.checkout.total}: {formatPriceEUR(order.totalPrice)}
              </div>

              {/* PAY BUTTON */}
              {order.payment?.method !== "CASH" && (
                <FancyButtonXL
                  baseColor="rgba(10, 10, 10, 0)"
                  hoverColor="rgba(167, 224, 162,1)"
                  wsize="250px"
                  hsize="60px"
                  onClick={pay}
                  name={
                    loading ? dictionary.order.processing : dictionary.order.pay
                  }
                  borderradius="0px"
                  disabled={paid === "1" || loading}
                />
              )}
            </div>
            {paid && (
              <div className=" text-green-800 p-3 rounded">
                {dictionary.order.payment_success}
                {pikapp && (
                  <div>{dictionary.order.line_2}</div>
                )}
                 {!pikapp && (
                  <div>{dictionary.order.line_1}</div>
                )}
                 
              </div>
            )}
            {canceled && (
              <div className="  text-red-800 p-3 rounded">
                {dictionary.order.payment_failed}
              </div>
            )}
          </div>
        }
        left={
          <div className={styles.box}>
            <h2 className="text-2xl font-bold ">
              {dictionary.order.order_details}
            </h2>

            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.imageWrap}>
                  <Image
                    src={item.imageThumbnail}
                    alt={item.productName}
                    fill
                    sizes="50vw"
                  />
                </div>
                <div className={styles.name}>
                  {item.productName} × {item.quantity} ×{" "}
                  {formatPriceEUR(item.price)} ={" "}
                  {formatPriceEUR(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}
