"use client";

import { useState } from "react";

type Review = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export default function ReviewsClient({
  reviews: initial,
}: {
  reviews: Review[];
}) {
  const [reviews, setReviews] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function deleteReview(id: string) {
    setLoadingId(id);

    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      alert("Ошибка удаления");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="border rounded p-4 flex justify-between gap-4"
        >
          {/* LEFT */}
          <div className="space-y-1">
            <div className="font-semibold">
              {r.name} ⭐ {r.rating}
            </div>

            <div className="text-sm text-gray-500">
              {r.phone}
            </div>

            {r.comment && (
              <div className="text-sm mt-1">{r.comment}</div>
            )}

            <div className="text-xs text-gray-400">
              {new Date(r.createdAt).toLocaleString()}
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => deleteReview(r.id)}
            disabled={loadingId === r.id}
            className="text-red-500 hover:text-red-900" style={{fontSize:"30px"}}
          >
            {loadingId === r.id ? "..." : "X"}
          </button>
        </div>
      ))}
    </div>
  );
}