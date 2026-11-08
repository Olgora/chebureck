"use client"; // Только эта маленькая навигация будет клиентской!

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navadmin.module.css"; // Импортируем ваши стили

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link 
        href="/admin/orders" 
        className={pathname === "/admin/orders" ? styles.active : ""}
      >
        Orders
      </Link>
      
      <Link 
        href="/admin/products" 
        className={pathname === "/admin/products" ? styles.active : ""}
      >
        Products
      </Link>
       <Link 
        href="/admin/ingredients" 
        className={pathname === "/admin/products" ? styles.active : ""}
      >
         Ingredients
      </Link>
      
      <Link 
        href="/admin/reviews" 
        className={pathname === "/admin/reviews" ? styles.active : ""}
      >
        Reviews
      </Link>
      
      <Link 
        href="/admin/promo" 
        className={pathname === "/admin/promo" ? styles.active : ""}
      >
        Promo
      </Link>
      
      <Link 
        href="/admin" 
        className={pathname === "/admin" ? styles.active : ""}
      >
        Home
      </Link>
    </nav>
  );
}