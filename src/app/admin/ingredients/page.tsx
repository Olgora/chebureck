"use client";

import { useEffect, useState } from "react";
import { formatPriceEUR } from "@/components/utils/func";

type Ingredient = {
  id: string;
  name_pt: string;
  name_en?: string | null;
  price: number;
  isAvailable: boolean;
};

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);

  // form state
  const [name_pt, setNamePt] = useState("");
  const [name_en, setNameEn] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  // =====================
  // LOAD
  // =====================
  useEffect(() => {
    reload();
  }, []);

  async function reload() {
    const res = await fetch("/api/ingredients");
    if (res.ok) {
      const data = await res.json();
      setIngredients(data);
    }
  }

  // =====================
  // MODAL OPEN
  // =====================
  function openCreate() {
    resetForm();
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: Ingredient) {
    setEditing(item);

    setNamePt(item.name_pt);
    setNameEn(item.name_en || "");
    setPrice(String(item.price));
    setIsAvailable(item.isAvailable);

    setModalOpen(true);
  }

  function resetForm() {
    setNamePt("");
    setNameEn("");
    setPrice("");
    setIsAvailable(true);
  }

  // =====================
  // SAVE
  // =====================
  async function save() {
    const payload = {
      name_pt,
      name_en,
      price: Number(price),
      isAvailable,
    };

    await fetch("/api/ingredients", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
    });

    setModalOpen(false);
    resetForm();
    reload();
  }

  // =====================
  // DELETE
  // =====================
  async function remove(id: string) {
    if (!confirm("Удалить этот ингредиент?")) return;

    await fetch("/api/ingredients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setIngredients(ingredients.filter((item) => item.id !== id));
  }

  // =====================
  // UI
  // =====================
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Ingredients</h1>

        <button
          onClick={openCreate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition-colors"
        >
          + Create
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {ingredients.length === 0 ? (
          <div className="text-sm text-gray-500">Ингредиенты пока не добавлены</div>
        ) : (
          ingredients.map((item) => (
            <div
              key={item.id}
              className="border p-3 flex justify-between items-center rounded bg-white shadow-sm"
            >
              <div>
                <div className="font-semibold">{item.name_pt}</div>
                <div>{formatPriceEUR(item.price)}</div>
                <div className="text-sm text-gray-500">
                  {item.name_en ? `EN: ${item.name_en}` : "—"}
                </div>
                <div className="mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      item.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.isAvailable ? "В наличии" : "Недоступен"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="hover:bg-gray-100 p-2 rounded transition-colors text-lg"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="hover:bg-gray-100 p-2 rounded transition-colors text-lg"
                  title="Delete"
                >
                  ❌
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[500px] max-h-[90vh] overflow-y-auto p-6 rounded-lg space-y-4 shadow-xl">
            <h2 className="text-xl font-bold border-b pb-2">
              {editing ? "Edit ingredient" : "Create ingredient"}
            </h2>

            {/* NAME PT */}
            <div className="flex flex-col gap-1">
              <label htmlFor="NamePT" className="text-xs font-semibold text-gray-600">
                Name (PT) *
              </label>
              <input
                id="NamePT"
                placeholder="Queijo Mozzarella"
                value={name_pt}
                onChange={(e) => setNamePt(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            {/* NAME EN */}
            <div className="flex flex-col gap-1">
              <label htmlFor="NameEN" className="text-xs font-semibold text-gray-600">
                Name (EN)
              </label>
              <input
                id="NameEN"
                placeholder="Mozzarella Cheese"
                value={name_en}
                onChange={(e) => setNameEn(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            {/* PRICE */}
            <div className="flex flex-col gap-1">
              <label htmlFor="Price" className="text-xs font-semibold text-gray-600">
                Price (€) *
              </label>
              <input
                id="Price"
                type="number"
                step="0.01"
                placeholder="1.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            {/* IS AVAILABLE */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded cursor-pointer"
              />
              <label htmlFor="isAvailable" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Доступен для заказа
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 border-t pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 w-full rounded font-semibold transition-colors text-sm"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={!name_pt.trim() || !price}
                className="bg-black hover:bg-zinc-800 disabled:opacity-50 text-white px-4 py-2 w-full rounded font-semibold transition-colors text-sm"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}