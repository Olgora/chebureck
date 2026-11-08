"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { formatPriceEUR } from "@/components/utils/func";

type Category = {
  id: string;
  name_pt: string;
  name_en?: string | null;
};

type Ingredient = {
  id: string;
  name_pt: string;
  name_en?: string | null;
  price: number;
};

type Product = {
  id: string;
  name_pt: string;
  name_en?: string | null;
  description_pt?: string | null;
  description_en?: string | null;
  price: number;
  categoryId: string;
  category: Category;
  images: { url: string }[];
  isAvailable: boolean;
  availableIngredients?: Ingredient[]; // привязанные ингредиенты
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // form state
  const [name_pt, setNamePt] = useState("");
  const [name_en, setNameEn] = useState("");
  const [description_pt, setDescriptionPt] = useState("");
  const [description_en, setDescriptionEn] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([""]);

  // состояние выбранных ингредиентов для формы
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);

  // =====================
  // LOAD
  // =====================
  useEffect(() => {
    (async () => {
      const [p, c, ing] = await Promise.all([
        fetch("/api/products?admin=true").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
        fetch("/api/ingredients").then((r) => (r.ok ? r.json() : [])),
      ]);

      setProducts(p);
      setCategories(c);
      setAllIngredients(ing);
    })();
  }, []);

  // =====================
  // MODAL OPEN
  // =====================
  function openCreate() {
    resetForm();
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);

    setNamePt(p.name_pt);
    setNameEn(p.name_en || "");
    setDescriptionPt(p.description_pt || "");
    setDescriptionEn(p.description_en || "");
    setPrice(String(p.price));
    setCategoryId(p.categoryId);
    setImages(p.images.length ? p.images.map((i) => i.url) : [""]);

    // Инициализируем выбранные чекбоксы
    setSelectedIngredientIds(
      p.availableIngredients ? p.availableIngredients.map((i) => i.id) : []
    );

    setModalOpen(true);
  }

  function resetForm() {
    setNamePt("");
    setNameEn("");
    setDescriptionPt("");
    setDescriptionEn("");
    setPrice("");
    setCategoryId("");
    setImages([""]);
    setSelectedIngredientIds([]);
  }

  // =====================
  // TOGGLE INGREDIENT
  // =====================
  function toggleIngredient(id: string) {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  // =====================
  // IMAGES
  // =====================
  function updateImage(i: number, value: string) {
    const copy = [...images];
    copy[i] = value;
    setImages(copy);
  }

  function addImage() {
    setImages([...images, ""]);
  }

  function removeImage(i: number) {
    setImages(images.filter((_, idx) => idx !== i));
  }

  // =====================
  // SAVE
  // =====================
  async function save() {
    const payload = {
      name_pt,
      name_en,
      description_pt,
      description_en,
      price: Number(price),
      categoryId,
      images: images.filter((i) => i.trim() !== ""),
      ingredientIds: selectedIngredientIds, // передаем массив ID ингредиентов
    };

    await fetch("/api/products", {
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
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setProducts(products.filter((p) => p.id !== id));
  }

  async function reload() {
    const data = await fetch("/api/products?admin=true").then((r) => r.json());
    setProducts(data);
  }

  // =====================
  // UI
  // =====================
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Products</h1>

        <button onClick={openCreate} className="bg-black text-white px-4 py-2 rounded">
          + Create
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-3 flex justify-between items-center rounded bg-white shadow-sm"
          >
            <div>
              <div className="font-semibold">{p.name_pt}</div>
              <div>{formatPriceEUR(p.price)}</div>
              <div className="text-sm text-gray-500">{p.category?.name_pt}</div>

              {/* Список привязанных топпингов */}
              {p.availableIngredients && p.availableIngredients.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {p.availableIngredients.map((ing) => (
                    <span
                      key={ing.id}
                      className="text-[11px] bg-gray-100 border text-gray-700 px-2 py-0.5 rounded"
                    >
                      +{ing.name_pt} ({formatPriceEUR(ing.price)})
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="p-2 hover:bg-gray-100 rounded text-lg">
                ✏️
              </button>
              <button onClick={() => remove(p.id)} className="p-2 hover:bg-gray-100 rounded text-lg">
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[520px] max-h-[90vh] overflow-y-auto p-6 rounded-lg space-y-4 shadow-xl">
            <h2 className="text-xl font-bold border-b pb-2">
              {editing ? "Edit product" : "Create product"}
            </h2>

            {/* NAME PT */}
            <div className="flex flex-col gap-1">
              <label htmlFor="NamePT" className="text-xs font-semibold text-gray-600">
                Name (PT)
              </label>
              <input
                id="NamePT"
                placeholder="Name PT"
                value={name_pt}
                onChange={(e) => setNamePt(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* NAME EN */}
            <div className="flex flex-col gap-1">
              <label htmlFor="NameEN" className="text-xs font-semibold text-gray-600">
                Name (EN)
              </label>
              <input
                id="NameEN"
                placeholder="Name EN"
                value={name_en}
                onChange={(e) => setNameEn(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* DESCRIPTION PT */}
            <div className="flex flex-col gap-1">
              <label htmlFor="DescPT" className="text-xs font-semibold text-gray-600">
                Description (PT)
              </label>
              <textarea
                id="DescPT"
                placeholder="Description PT"
                value={description_pt}
                onChange={(e) => setDescriptionPt(e.target.value)}
                className="border p-2 w-full rounded h-20 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* DESCRIPTION EN */}
            <div className="flex flex-col gap-1">
              <label htmlFor="DescEN" className="text-xs font-semibold text-gray-600">
                Description (EN)
              </label>
              <textarea
                id="DescEN"
                placeholder="Description EN"
                value={description_en}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="border p-2 w-full rounded h-20 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* PRICE */}
            <div className="flex flex-col gap-1">
              <label htmlFor="Price" className="text-xs font-semibold text-gray-600">
                Price (€)
              </label>
              <input
                id="Price"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col gap-1">
              <label htmlFor="Category" className="text-xs font-semibold text-gray-600">
                Category
              </label>
              <select
                id="Category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_pt}
                  </option>
                ))}
              </select>
            </div>

            {/* ВЫБОР ДОСТУПНЫХ ИНГРЕДИЕНТОВ */}
            <div className="space-y-2 border-t pt-3">
              <p className="text-xs font-semibold text-gray-600">
                Доступные топпинги к этому товару:
              </p>

              {allIngredients.length === 0 ? (
                <div className="text-xs text-gray-400">
                  Ингредиенты пока не созданы. Добавьте их в разделе Ingredients.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border rounded bg-gray-50">
                  {allIngredients.map((ing) => {
                    const isChecked = selectedIngredientIds.includes(ing.id);
                    return (
                      <label
                        key={ing.id}
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer text-xs transition-colors bg-white ${
                          isChecked ? "border-black font-semibold bg-zinc-100" : "border-gray-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIngredient(ing.id)}
                          className="rounded"
                        />
                        <span className="truncate">{ing.name_pt}</span>
                        <span className="text-gray-500 ml-auto whitespace-nowrap">
                          +{formatPriceEUR(ing.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* IMAGES */}
            <div className="space-y-2 border-t pt-2">
              <p className="text-xs font-semibold text-gray-600">Images (URL)</p>

              {images.map((img, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <label htmlFor={`Image-${i}`} className="text-[10px] text-gray-400">
                    Image #{i + 1}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`Image-${i}`}
                      value={img}
                      onChange={(e) => updateImage(i, e.target.value)}
                      className="border p-2 flex-1 rounded focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="https://..."
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="hover:bg-gray-100 p-2 rounded transition-colors"
                      type="button"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addImage}
                className="text-xs text-black font-semibold hover:underline block pt-1"
                type="button"
              >
                + add image
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 border-t pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 w-full rounded font-semibold transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-black hover:bg-zinc-800 text-white px-4 py-2 w-full rounded font-semibold transition-colors"
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




/*"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { formatPriceEUR } from "@/components/utils/func";

type Category = {
  id: string;
  name_pt: string;
  name_en?: string | null;
};

type Product = {
  id: string;
  name_pt: string;
  name_en?: string | null;
  description_pt?: string | null;
  description_en?: string | null;
  price: number;
  categoryId: string;
  category: Category;
  images: { url: string }[];
  isAvailable: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // form state
  const [name_pt, setNamePt] = useState("");
  const [name_en, setNameEn] = useState("");
  const [description_pt, setDescriptionPt] = useState("");
  const [description_en, setDescriptionEn] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([""]);

  // =====================
  // LOAD
  // =====================
  useEffect(() => {
    (async () => {
      const [p, c] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);

      setProducts(p);
      setCategories(c);
    })();
  }, []);

  // =====================
  // MODAL OPEN
  // =====================
  function openCreate() {
    resetForm();
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);

    setNamePt(p.name_pt);
    setNameEn(p.name_en || "");
    setDescriptionPt(p.description_pt || "");
    setDescriptionEn(p.description_en || "");
    setPrice(String(p.price));
    setCategoryId(p.categoryId);
    setImages(p.images.length ? p.images.map((i) => i.url) : [""]);

    setModalOpen(true);
  }

  function resetForm() {
    setNamePt("");
    setNameEn("");
    setDescriptionPt("");
    setDescriptionEn("");
    setPrice("");
    setCategoryId("");
    setImages([""]);
  }

  // =====================
  // IMAGES
  // =====================
  function updateImage(i: number, value: string) {
    const copy = [...images];
    copy[i] = value;
    setImages(copy);
  }

  function addImage() {
    setImages([...images, ""]);
  }

  function removeImage(i: number) {
    setImages(images.filter((_, idx) => idx !== i));
  }

  // =====================
  // SAVE
  // =====================
  async function save() {
    const payload = {
      name_pt,
      name_en,
      description_pt,
      description_en,
      price: Number(price),
      categoryId,
      images: images.filter((i) => i.trim() !== ""),
    };

    await fetch("/api/products", {
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
    await fetch("/api/products", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    setProducts(products.filter((p) => p.id !== id));
  }

  async function reload() {
    const data = await fetch("/api/products").then((r) => r.json());
    setProducts(data);
  }

  // =====================
  // UI
  // =====================
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Products</h1>

        <button onClick={openCreate} className="bg-black text-white px-4 py-2">
          + Create
        </button>
      </div>

      
      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-3 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{p.name_pt}</div>
              <div>{formatPriceEUR(p.price)} </div>
              <div className="text-sm text-gray-500">{p.category?.name_pt}</div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => openEdit(p)}>✏️</button>
              <button onClick={() => remove(p.id)}>❌</button>
            </div>
          </div>
        ))}
      </div>

 
     {modalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    
    <div className="bg-white w-[500px] max-h-[90vh] overflow-y-auto p-6 rounded-lg space-y-4 shadow-xl">
      <h2 className="text-xl font-bold border-b pb-2">
        {editing ? "Edit product" : "Create product"}
      </h2>
 
      <div className="flex flex-col gap-1">
        <label htmlFor="NamePT" className="text-xs font-semibold text-gray-600">
          Name (PT)
        </label>
        <input
          id="NamePT"
          placeholder="Name PT"
          value={name_pt}
          onChange={(e) => setNamePt(e.target.value)}
          className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

   
      <div className="flex flex-col gap-1">
        <label htmlFor="NameEN" className="text-xs font-semibold text-gray-600">
          Name (EN)
        </label>
        <input
          id="NameEN"
          placeholder="Name EN"
          value={name_en}
          onChange={(e) => setNameEn(e.target.value)}
          className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
 
      <div className="flex flex-col gap-1">
        <label htmlFor="DescPT" className="text-xs font-semibold text-gray-600">
          Description (PT)
        </label>
        <textarea
          id="DescPT"
          placeholder="Description PT"
          value={description_pt}
          onChange={(e) => setDescriptionPt(e.target.value)}
          className="border p-2 w-full rounded h-20 focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

    
      <div className="flex flex-col gap-1">
        <label htmlFor="DescEN" className="text-xs font-semibold text-gray-600">
          Description (EN)
        </label>
        <textarea
          id="DescEN"
          placeholder="Description EN"
          value={description_en}
          onChange={(e) => setDescriptionEn(e.target.value)}
          className="border p-2 w-full rounded h-20 focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

 
      <div className="flex flex-col gap-1">
        <label htmlFor="Price" className="text-xs font-semibold text-gray-600">
          Price (€)
        </label>
        <input
          id="Price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

 
      <div className="flex flex-col gap-1">
        <label htmlFor="Category" className="text-xs font-semibold text-gray-600">
          Category
        </label>
        <select
          id="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_pt}
            </option>
          ))}
        </select>
      </div>
 
      <div className="space-y-2 border-t pt-2">
        <p className="text-xs font-semibold text-gray-600">Images (URL)</p>

        {images.map((img, i) => (
          <div key={i} className="flex flex-col gap-1">
 
            <label htmlFor={`Image-${i}`} className="text-[10px] text-gray-400">
              Image #{i + 1}
            </label>
            <div className="flex gap-2">
              <input
                id={`Image-${i}`}
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                className="border p-2 flex-1 rounded focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="https://..."
              />
              <button 
                onClick={() => removeImage(i)}
                className="hover:bg-gray-100 p-2 rounded transition-colors"
                type="button"
              >
                ❌
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={addImage} 
          className="text-xs text-black font-semibold hover:underline block pt-1"
          type="button"
        >
          + add image
        </button>
      </div>
 
      <div className="flex gap-3 border-t pt-4">
        <button
          onClick={() => setModalOpen(false)}
          className="border border-gray-300 hover:bg-gray-50 px-4 py-2 w-full rounded font-semibold transition-colors"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={save}
          className="bg-black hover:bg-zinc-800 text-white px-4 py-2 w-full rounded font-semibold transition-colors"
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
}*/
