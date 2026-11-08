import { CategoryService } from "@/services/category/service";
import styles from "./page.module.css";
import SidebarCart from "@/components/cart/slidebarcart/slidebarcard";
import Image from "next/image";
import chalkboardBg from "../../../../public/empty-blackboard.png";
import MenuTabs from "@/components/menupage/menupage"; // 🌟 1. Импортируем новый компонент закладок
import FadeInUp from "@/components/animation/inupp/inupp";
import ContactsBlock from "@/components/contactblock/contactblock";
import MagnetCardMenu from "@/components/polaroidcardmenu/polaroidcardmenu";
import StickyCartMotion from "@/components/animation/stickycartmotion/stickycartmotion";
import {Category} from "@/types/index";

type PageProps = {
  params: {
    lang: string;
  };
};

export default async function MenuPage({ params }: PageProps) {
  const [categories] = await Promise.all([CategoryService.getMenu()]);
  const { lang } = await params;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgWrapper}>
        <Image
          src={chalkboardBg}
          alt="Chalkboard background"
          placeholder="blur"
          fill
          className="object-cover object-center"
          priority // 🌟 Укажет браузеру, что этот элемент критически важен для первого кадра
          quality={60} // Чуть снизим качество для уменьшения веса файла (80 — золотая середина)
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 🌟 2. Вставляем закладки прямо сюда, они будут липнуть к верху экрана при скролле */}
      <MenuTabs categories={categories} />

      <div className={styles.main}>
        <div className={styles.list}>
          {categories.map((category: Category) => (
            /* 🌟 3. Добавляем id и scroll-mt-36, чтобы при клике на закладку скролл плавно останавливался здесь */
            <div
              key={category.id}
              id={`category-${category.id}`}
              className={styles.grid}
            >
              {category.products.map((product) => (
                <FadeInUp key={product.id}>
                  <MagnetCardMenu product={product}></MagnetCardMenu>
                </FadeInUp>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.cart}>
          <StickyCartMotion
            footerId="site-footer"
            topOffset={80}
            bottomGap={100}
          >
            <SidebarCart></SidebarCart>
          </StickyCartMotion>
        </div>
      </div>
      <div className={styles.footer}>
        <ContactsBlock />
      </div>
    </div>
  );
}
