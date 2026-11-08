// src/app/admin/promos/page.tsx
import { ProductService } from "@/services/product/service";
import { PromoService } from "@/services/promo/promoservice";
import { 
  handleSaveWeeklyPromo, 
  handleCreateCoupon, 
  handleSaveProductPromo,
  handleDeleteWeeklyPromo,
  handleDeleteCoupon,
  handleDeleteProductPromo
} from "@/app/actions/promoaction";
import styles from "./page.module.css";

// Массив дней для красивого отображения в списке
const DAYS_NAMES = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export default async function AdminPromosPage() {
  // Параллельно загружаем всё из базы данных
  const products = await ProductService.getAllAdmin();
  const weeklyPromos = await PromoService.getWeeklyPromos();
  const coupons = await PromoService.getActiveCoupons();
  const productPromos = await PromoService.getProductPromos();

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Marketing & Promos Control</h1>
      
      <div className={styles.grid}>
        
        {/* КАРТОЧКА 1: Дни фиксированных цен */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Настройка дня скидок</h2>
          <form action={handleSaveWeeklyPromo} className={styles.form}>
            <label className={styles.label}>
              День недели:
              <select name="dayOfWeek" className={styles.select} required>
                <option value="1">Понедельник (Segunda-feira)</option>
                <option value="2">Вторник (Terça-feira)</option>
                <option value="3">Среда (Quarta-feira)</option>
                <option value="4">Четверг (Quinta-feira)</option>
                <option value="5">Пятница (Sexta-feira)</option>
                <option value="6">Суббота (Sábado)</option>
                <option value="0">Воскресенье (Domingo)</option>
              </select>
            </label>
            <label className={styles.label}>
              Фиксированная цена (€):
              <input type="number" step="0.01" name="promoPrice" placeholder="3.50" className={styles.input} required />
            </label>
            <label className={styles.label}>
              Статус:
              <select name="isActive" className={styles.select}>
                <option value="true">Включена</option>
                <option value="false">Выключена</option>
              </select>
            </label>
            <button type="submit" className={styles.submitButton}>Применить день</button>
          </form>

          {/* ЖИВОЙ СПИСОК ДНЕЙ */}
          <div className={styles.activeList}>
            <h3 className="text-xs uppercase text-amber-400 font-black mb-2">Действующие акции по дням:</h3>
            {weeklyPromos.map((p:any) => (
              <div key={p.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{DAYS_NAMES[p.dayOfWeek]}</span>
                  <span className={styles.itemSub}>Цена: {Number(p.promoPrice).toFixed(2)}€ | <span className={p.isActive ? styles.badgeActive : styles.badgeInactive}>{p.isActive ? "ON" : "OFF"}</span></span>
                </div>
                <form action={handleDeleteWeeklyPromo.bind(null, p.id)}>
                  <button type="submit" className={styles.deleteButton}>Удалить</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* КАРТОЧКА 2: Купоны */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Создать новый Купон</h2>
          <form action={handleCreateCoupon} className={styles.form}>
            <input type="text" name="code" placeholder="CRUNCH10" className={styles.input} required />
            <select name="type" className={styles.select}>
              <option value="PERCENT">В процентах (%)</option>
              <option value="FIXED">Фиксированная сумма (€)</option>
            </select>
            <input type="number" step="0.01" name="value" placeholder="Размер скидки" className={styles.input} required />
            <input type="date" name="expiryDate" className={styles.input} />
            <button type="submit" className={styles.submitButton}>Выпустить купон</button>
          </form>

          {/* ЖИВОЙ СПИСОК КУПОНОВ */}
          <div className={styles.activeList}>
            <h3 className="text-xs uppercase text-amber-400 font-black mb-2">Активные промокоды:</h3>
            {coupons.map((c:any) => (
              <div key={c.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{c.code}</span>
                  <span className={styles.itemSub}>
                    Скидка: {Number(c.value)}{c.type === "PERCENT" ? "%" : "€"} 
                    {c.expiryDate && ` | До: ${new Date(c.expiryDate).toLocaleDateString()}`}
                  </span>
                </div>
                <form action={handleDeleteCoupon.bind(null, c.id)}>
                  <button type="submit" className={styles.deleteButton}>Удалить</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* КАРТОЧКА 3: Скидки на конкретный товар */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Скидка на один товар</h2>
          <form action={handleSaveProductPromo} className={styles.form}>
            <select name="productId" className={styles.select} required>
              {products.map((product:any) => (
                <option key={product.id} value={product.id}>
                  {product.name_pt} ({product.price.toFixed(2)}€)
                </option>
              ))}
            </select>
            <select name="type" className={styles.select}>
              <option value="PERCENT">Снизить на процент (%)</option>
              <option value="FIXED">Установить спец-цену (€)</option>
            </select>
            <input type="number" step="0.01" name="value" placeholder="20 или 3.90" className={styles.input} required />
            <select name="isActive" className={styles.select}>
              <option value="true">Активировать</option>
              <option value="false">Заморозить</option>
            </select>
            <button type="submit" className={styles.submitButton}>Запустить акцию</button>
          </form>

          {/* ЖИВОЙ СПИСОК СКИДОК НА ТОВАРЫ */}
          <div className={styles.activeList}>
            <h3 className="text-xs uppercase text-amber-400 font-black mb-2">Чебуреки на акции:</h3>
            {productPromos.map((pp:any) => (
              <div key={pp.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{pp.product.name_pt}</span>
                  <span className={styles.itemSub}>
                    Акция: {Number(pp.value)}{pp.type === "PERCENT" ? "%" : "€"} | <span className={pp.isActive ? styles.badgeActive : styles.badgeInactive}>{pp.isActive ? "ON" : "OFF"}</span>
                  </span>
                </div>
                <form action={handleDeleteProductPromo.bind(null, pp.id)}>
                  <button type="submit" className={styles.deleteButton}>Удалить</button>
                </form>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}