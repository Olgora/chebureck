import TwoPanelScroll from "@/components/animation/twoPanelScroll/twoPanelScroll";
import CartDesc from "@/components/cart/cartdesc/cartdesc";
import CheckoutForm from "@/components/checkout/checkout";
import { getDictionary } from "@/lib/dictionaries";
import styles from "./page.module.css";

type PageProps = {
  params: {
    lang: string;
  };
};

export default async function CheckoutPage({ params }: PageProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return (
    <div className={styles.main}>
      <TwoPanelScroll
        fixed="right"
        hstick="50px"
        right={
          <div className={styles.box} >
            <h3 className={styles.title}>{dict.checkout.checkout}</h3>
            <CheckoutForm />
          </div>
        }
        left={
          <div className={styles.box} style={{borderRight:"2px black solid"}} >
            <h3 className={styles.title}>{dict.checkout.your_order}</h3>
            <CartDesc></CartDesc>
          </div>
        }
      />
    </div>
  );
}
