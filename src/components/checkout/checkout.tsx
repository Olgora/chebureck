"use client";

import { useState } from "react";
import { useCart } from "@/context/cartcontext";
import { useRouter } from "next/navigation";
import styles from "./checkout.module.css";
import InputText from "@/components/inputеxt/inputеxt";
import IName from "../iconsvg/iname";
import IPhone from "../iconsvg/iphone";
import IPin from "../iconsvg/ipin";
import { useI18n } from "@/context/diccontext";
import { formatPriceEUR } from "../utils/func";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import InputPhone from "../inputphone/inputphone";

type DeliveryMethod = "DELIVERY" | "PICKUP";
type PaymentMethod = "CASH" | "CARD";

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const { language, dictionary } = useI18n();
  const router = useRouter();
  const WORK_START = 10;
  const WORK_END = 22;

  const now = new Date().getHours();
  const isWorkingTime = now >= WORK_START && now < WORK_END;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🚚 / 💳 methods
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("PICKUP");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");

  // 🔄 states
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function generateSlots(selectedDate: string) {
    const slots = [];

    const now = new Date();
    const isToday = selectedDate === now.toISOString().split("T")[0];

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let h = WORK_START; h < WORK_END; h++) {
      for (const m of [0, 30]) {
        // ⛔ если сегодня — убираем прошлое время
        if (isToday) {
          if (h < currentHour) continue;
          if (h === currentHour && m <= currentMinute) continue;
        }

        slots.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
      }
    }

    return slots;
  }

  function getNextAvailableTime() {
    const now = new Date();

    const result = new Date();

    // если сейчас до открытия — ставим старт + 1 час
    if (now.getHours() < WORK_START) {
      result.setHours(WORK_START + 1, 0, 0, 0);
      return result;
    }

    // если после закрытия — на следующий день
    if (now.getHours() >= WORK_END) {
      result.setDate(result.getDate() + 1);
      result.setHours(WORK_START + 1, 0, 0, 0);
      return result;
    }

    // в рабочее время → +1 час
    result.setHours(now.getHours() + 1, 0, 0, 0);

    // если вышли за пределы работы
    if (result.getHours() >= WORK_END) {
      result.setDate(result.getDate() + 1);
      result.setHours(WORK_START + 1, 0, 0, 0);
    }

    return result;
  }

  function buildScheduledAt(date: string, time: string) {
    if (!date || !time) return getNextAvailableTime();
    const [hour, minute] = time.split(":").map(Number);

    const result = new Date(date);

    result.setHours(hour, minute, 0, 0);

    return result;
  }

  async function handleSubmit() {
    // корзина
    if (items.length === 0) {
      setError(dictionary.checkout.empty_cart);
      return;
    }

    // имя
    if (!name.trim()) {
      setError(dictionary.checkout.enter_name);
      return;
    }

    // телефон
    if (!phone.trim()) {
      setError(dictionary.checkout.enter_phone);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: null,
          items,
          paymentMethod,
          deliveryMethod,
          address,
          name,
          phone,
          scheduledAt: buildScheduledAt(date, time),
          lang: language,
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();
      clearCart();
      router.replace(`/${language}/order/${order.id}`);
    } catch (e) {
      console.error(e);
      alert(dictionary.checkout.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.main}>
      {/* 👤 USER INFO */}
      <div className={styles.block}>
        <div className={styles.box}>
          <InputText
            name={dictionary.checkout.name}
            func={setName}
            impotant={true}
            valor={name}
            icon={IName}
            size="16"
            color="black"
            backcolor="transparent"
          ></InputText>
        </div>
        <div className={styles.box}>
          <InputPhone
            name={dictionary.checkout.phone}
            func={setPhone}
            impotant={true}
            valor={phone}
            icon={IPhone}
            size="16"
            color="black"
            backcolor="transparent"
          ></InputPhone>
        </div>
      </div>
      <h3 className="font-semibold">{dictionary.checkout.time}</h3>
      <div className={styles.block}>
        <div className={styles.box}>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <select
            className="w-full border p-2.5 rounded mb-3"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">{dictionary.checkout.logo}</option>

            {generateSlots(date).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        {!isWorkingTime && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            {dictionary.checkout.closed_message}
          </div>
        )}
      </div>

      {/* 🛒 SUMMARY */}
      <div className={styles.box}>
        <div className="mt-2 font-bold">
          {dictionary.checkout.total}: {formatPriceEUR(total)}
        </div>
      </div>

      {/* 🚀 SUBMIT */}

      <FancyButtonXL
        baseColor="rgba(10, 10, 10, 0)"
        hoverColor="rgba(167, 224, 162, 0.98)"
        wsize="350px"
        hsize="60px"
        onClick={handleSubmit}
        name={
          loading ? dictionary.checkout.final_1 : dictionary.checkout.final_2
        }
        borderradius="0px"
        disabled={loading || items.length === 0}
      />
      <p className={styles.error}>{error}</p>
    </div>
  );
}

/*"use client";

import { useState  } from "react";
import { useCart } from "@/context/cartcontext";
import { useRouter } from "next/navigation";
import styles from "./checkout.module.css";
import InputText from "@/components/inputеxt/inputеxt";
import IName from "../iconsvg/iname";
import IPhone from "../iconsvg/iphone";
import IPin from "../iconsvg/ipin";
import { useI18n } from "@/context/diccontext";
import { formatPriceEUR } from "../utils/func";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import InputPhone from "../inputphone/inputphone";
 

type DeliveryMethod = "DELIVERY" | "PICKUP";
type PaymentMethod = "CASH" | "CARD";

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const { language, dictionary } = useI18n();
  const router = useRouter();
  const WORK_START = 10;
  const WORK_END = 22;

  const now = new Date().getHours();
  const isWorkingTime = now >= WORK_START && now < WORK_END;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🚚 / 💳 methods
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("DELIVERY");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  // 🔄 states
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function generateSlots(selectedDate: string) {
    const slots = [];

    const now = new Date();
    const isToday = selectedDate === now.toISOString().split("T")[0];

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let h = WORK_START; h < WORK_END; h++) {
      for (const m of [0, 30]) {
        // ⛔ если сегодня — убираем прошлое время
        if (isToday) {
          if (h < currentHour) continue;
          if (h === currentHour && m <= currentMinute) continue;
        }

        slots.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
      }
    }

    return slots;
  }
 

  function getNextAvailableTime() {
    const now = new Date();

    const result = new Date();

    // если сейчас до открытия — ставим старт + 1 час
    if (now.getHours() < WORK_START) {
      result.setHours(WORK_START + 1, 0, 0, 0);
      return result;
    }

    // если после закрытия — на следующий день
    if (now.getHours() >= WORK_END) {
      result.setDate(result.getDate() + 1);
      result.setHours(WORK_START + 1, 0, 0, 0);
      return result;
    }

    // в рабочее время → +1 час
    result.setHours(now.getHours() + 1, 0, 0, 0);

    // если вышли за пределы работы
    if (result.getHours() >= WORK_END) {
      result.setDate(result.getDate() + 1);
      result.setHours(WORK_START + 1, 0, 0, 0);
    }

    return result;
  }

  function buildScheduledAt(date: string, time: string) {
    if (!date || !time) return getNextAvailableTime();
    const [hour, minute] = time.split(":").map(Number);

    const result = new Date(date);

    result.setHours(hour, minute, 0, 0);

    return result;
  }

  async function handleSubmit() {
    // корзина
    if (items.length === 0) {
      setError(dictionary.checkout.empty_cart);
      return;
    }

    // имя
    if (!name.trim()) {
      setError(dictionary.checkout.enter_name);
      return;
    }

    // телефон
    if (!phone.trim()) {
      setError(dictionary.checkout.enter_phone);
      return;
    }

    // адрес только для доставки
    if (deliveryMethod === "DELIVERY" && !address.trim()) {
      setError(dictionary.checkout.enter_address);
      return;
    }

    if (deliveryMethod === "DELIVERY" && !date.trim()) {
      setError(dictionary.checkout.enter_delivery_date);
      return;
    }

    if (deliveryMethod === "DELIVERY" && !time.trim()) {
      setError(dictionary.checkout.enter_delivery_date);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: null,
          items,
          paymentMethod,
          deliveryMethod,
          address,
          name,
          phone,
          scheduledAt: buildScheduledAt(date, time),
          lang: language,
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();
      clearCart();
      router.replace(`/${language}/order/${order.id}`);
    } catch (e) {
      console.error(e);
      alert(dictionary.checkout.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.main}>
   
      <div className={styles.block}>
        <div className={styles.box}>
          <InputText
            name={dictionary.checkout.name}
            func={setName}
            impotant={true}
            valor={name}
            icon={IName}
            size="16"
            color="black"
            backcolor="transparent"
          ></InputText>
        </div>
        <div className={styles.box}>
          <InputPhone
            name={dictionary.checkout.phone}
            func={setPhone}
            impotant={true}
            valor={phone}
            icon={IPhone}
            size="16"
            color="black"
            backcolor="transparent"
          ></InputPhone>
        </div>
      </div>
      <h3 className="font-semibold">{dictionary.checkout.time}</h3>
      <div className={styles.block}>
        <div className={styles.box}>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
        </div>
        <select
          className="w-full border p-2.5 rounded mb-3"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="">{dictionary.checkout.logo}</option>

          {generateSlots(date).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {!isWorkingTime && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            {dictionary.checkout.closed_message}
          </div>
        )}
      </div>
 
      <h3 className="font-semibold"> {dictionary.checkout.entrega}</h3>
      <div className={styles.block}>
        <div className={styles.box}>
          <label className="flex gap-2">
            <input
              type="radio"
              checked={deliveryMethod === "DELIVERY"}
              onChange={() => setDeliveryMethod("DELIVERY")}
              style={{ accentColor: "rgba(167, 224, 162,1)" }}
              className={styles.radio}
            />
            {dictionary.checkout.entrega_1}
          </label>
        </div>
        <div className={styles.box}>
          <label className="flex gap-2">
            <input
              type="radio"
              checked={deliveryMethod === "PICKUP"}
              onChange={() => setDeliveryMethod("PICKUP")}
              style={{ accentColor: "rgba(167, 224, 162,1)" }}
              className={styles.radio}
            />
            {dictionary.checkout.entrega_2}
          </label>
        </div>
      </div>

 
      <h3 className="font-semibold">{dictionary.checkout.pagar}</h3>
      <div className={styles.block}>
        <div className={styles.box}>
          <label className="flex gap-2">
            <input
              type="radio"
              checked={paymentMethod === "CASH"}
              onChange={() => setPaymentMethod("CASH")}
              style={{ accentColor: "rgba(167, 224, 162,1)" }}
              className={styles.radio}
            />
            {dictionary.checkout.pagar_1}
          </label>
        </div>
        <div className={styles.box}>
          <label className="flex gap-2">
            <input
              type="radio"
              checked={paymentMethod === "CARD"}
              onChange={() => setPaymentMethod("CARD")}
              style={{ accentColor: "rgba(167, 224, 162,1)" }}
              className={styles.radio}
            />
            {dictionary.checkout.pagar_2}
          </label>
        </div>
      </div>
 
      {deliveryMethod === "DELIVERY" && (
        <InputText
          name={dictionary.checkout.adres}
          func={setAddress}
          impotant={true}
          valor={address}
          icon={IPin}
          size="16"
          color="black"
          backcolor="transparent"
        ></InputText>
      )}
 
      <div className={styles.box}>
        <div className="mt-2 font-bold">
          {dictionary.checkout.total}: {formatPriceEUR(total)}
        </div>
      </div>

    

      <FancyButtonXL
        baseColor="rgba(10, 10, 10, 0)"
        hoverColor="rgba(167, 224, 162, 0.98)"
        wsize="350px"
        hsize="60px"
        onClick={handleSubmit}
        name={
          loading ? dictionary.checkout.final_1 : dictionary.checkout.final_2
        }
        borderradius="0px"
        disabled={loading || items.length === 0}
      />
      <p className={styles.error}>{error}</p>
    </div>
  );
}*/
