import { getDictionary } from "@/lib/dictionaries";
import styles from "./page.module.css";

export default async function PrivacyPage({
  params,
}: {
  params: { lang: "pt" | "en" };
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>{dict.politica.title}</h1>
      <p>{dict.politica.intro}</p>

      <div>
        <div>
          <h2 className={styles.titlesmall}>1. {dict.politica.title_1}</h2>
          <p   className={styles.text}>
            {dict.politica.text_1}
          </p>
        </div>

        <div>
          <h2 className={styles.titlesmall}>2. {dict.politica.title_2}</h2>
          <p className={styles.text}>{dict.politica.text_2}</p>
        </div>

        <div>
          <h2 className={styles.titlesmall}>3. {dict.politica.title_3}</h2>
          <p className={styles.text}>{dict.politica.text_3}</p>
        </div>

        <div>
          <h2 className={styles.titlesmall}>4. {dict.politica.title_4}</h2>
          <p className={styles.text}>{dict.politica.text_4}</p>
        </div>
      </div>
    </div>
  );
}
