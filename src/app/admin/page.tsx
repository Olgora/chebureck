import Link from "next/link";
import styles from "./page.module.css";

export default function AdminPage() {
  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>

      <Link
        href="/admin/orders"
        className="block bg-black text-white p-3 rounded text-center"
      >
        Перейти к заказам
      </Link>
      <Link
        href="/admin/products"
        className="block bg-black text-white p-3 rounded text-center"
      >
        Перейти к товарам
      </Link>
      <Link
        href="/admin/promo"
        className="block bg-black text-white p-3 rounded text-center"
      >
        Перейти к промоакциям
      </Link>
       
    </div>
  );
}
