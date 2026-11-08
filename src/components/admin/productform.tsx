"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ product }: any) {
  const router = useRouter();

  const [name_pt, setNamePt] = useState(product?.name_pt || "");
  const [name_en, setNameEn] = useState(product?.name_en || "");
  const [desc_pt, setDescPt] = useState(product?.description_pt || "");
  const [desc_en, setDescEn] = useState(product?.description_en || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);

  async function save() {
    await fetch("/api/admin/products/save", {
      method: "POST",
      body: JSON.stringify({
        id: product?.id,
        name_pt,
        name_en,
        description_pt: desc_pt,
        description_en: desc_en,
        price: Number(price),
        isAvailable,
      }),
    });

    router.push("/admin/products");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h1>{product ? "Edit product" : "New product"}</h1>

      <input value={name_pt} onChange={(e) => setNamePt(e.target.value)} placeholder="Name PT" />
      <input value={name_en} onChange={(e) => setNameEn(e.target.value)} placeholder="Name EN" />

      <textarea value={desc_pt} onChange={(e) => setDescPt(e.target.value)} placeholder="Desc PT" />
      <textarea value={desc_en} onChange={(e) => setDescEn(e.target.value)} placeholder="Desc EN" />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />

      <label>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
        Available
      </label>

      <button onClick={save}>
        Save
      </button>
    </div>
  );
}