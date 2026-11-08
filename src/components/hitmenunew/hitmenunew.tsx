import SliderTsx from "@/components/animation/slidertsx/slidertsx";
import styles from "./hitmenunew.module.css";

import type { Product } from "@/types/index";
import MagnetCardMenu from "../polaroidcardmenu/polaroidcardmenu";

type Props = {
  listmenu: Product[];
};

export default async function HitMenu({ listmenu }: Props) {
  return (
    <main className={styles.main}>
      <SliderTsx size={300} gap={0}>
        {listmenu.map((src, i) => (
          <div key={i} className={styles.box}>
            <div  className={styles.box}>
              <MagnetCardMenu product={src}></MagnetCardMenu>
            </div>
          </div>
        ))}
      </SliderTsx>
    </main>
  );
}
