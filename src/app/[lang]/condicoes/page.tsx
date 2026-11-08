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
      <h1 className={styles.title}>{dict.condocoes.title}</h1>
      <p>{dict.condocoes.intro}</p>

      <div>
        <div>
          <h2 className={styles.titlesmall}>1. {dict.condocoes.title_1}</h2>
          <p   className={styles.text}>
            {dict.condocoes.text_1}
          </p>
        </div>

        <div>
          <h2 className={styles.titlesmall}>2. {dict.condocoes.title_2}</h2>
          <p className={styles.text}>{dict.condocoes.text_2}</p>
        </div>

        <div>
          <h2 className={styles.titlesmall}>3. {dict.condocoes.title_3}</h2>
          <p className={styles.text}>{dict.condocoes.text_3}</p>
        </div>

        <div>
          <h2 className={styles.titlesmall}>4. {dict.condocoes.title_4}</h2>
          <p className={styles.text}>{dict.condocoes.text_4}</p>
        </div>
      </div>
    </div>
  );
}
