"use client";

import { useState } from "react";
import { FancyButtonXL } from "@/components/animation/hoverbuttonxl/hoverbuttonxl";
import { useI18n } from "@/context/diccontext";
import InputText from "@/components/inputеxt/inputеxt";
import IName from "../iconsvg/iname";
import IPhone from "../iconsvg/iphone";
import CloseButton from "../animation/closebutton/closebutton";
import styles from "./reviewmodal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ReviewModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const { dictionary } = useI18n();

  const liststar = [
    {
      name: 1,
      star: "⭐",
    },
    {
      name: 2,
      star: "⭐⭐",
    },
    {
      name: 3,
      star: "⭐⭐⭐",
    },
    {
      name: 4,
      star: "⭐⭐⭐⭐",
    },
    {
      name: 5,
      star: "⭐⭐⭐⭐⭐",
    },
  ];

  if (!isOpen) return null;

  const submit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);

      setName("");
      setPhone("");
      setRating(5);
      setComment("");
    } catch (e) {
      alert("Ошибка при отправке отзыва");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={styles.mainmodal}>
        {success ? (
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold mb-2">
              {dictionary.reviews.thank_you}
            </h2>
            <p className="text-gray-600">
              {dictionary.reviews.success_message}
            </p>
            <div className={styles.close}>
              <CloseButton onClick={onClose}></CloseButton>
            </div>
          </div>
        ) : (
          <div className={styles.block}>
            <h2 className="text-xl font-bold mb-4">
              {dictionary.reviews.leave_review}
            </h2>
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
              <InputText
                name={dictionary.checkout.phone}
                func={setPhone}
                impotant={true}
                valor={phone}
                icon={IPhone}
                size="16"
                color="black"
                backcolor="transparent"
              ></InputText>
            </div>
            <div className={styles.box}>
              <select
                className={styles.star}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {liststar.map((r, index) => (
                  <option key={index} value={r.name}>
                    {r.star}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.box}>
              <textarea
                className={styles.text}
                placeholder={dictionary.reviews.comment}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <FancyButtonXL
                baseColor="rgba(10, 10, 10, 0)"
                hoverColor="rgba(167, 224, 162,1)"
                wsize="200px"
                hsize="60px"
                onClick={submit}
                name={
                  loading
                    ? dictionary.reviews.sending
                    : dictionary.reviews.send
                }
                borderradius="0px"
                disabled={loading}
              />
            </div>
            <div className={styles.close}>
              <CloseButton onClick={onClose}></CloseButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
