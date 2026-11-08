import ContactsBlock from "@/components/contactblock/contactblock";
import ScrollVert from "@/components/animation/scrollvertnew/scrollvert";
import ScrollMarqueeSmooth from "@/components/modulefun/runstring/index";
import HitMenunew from "@/components/hitmenunew/hitmenunew";
import { getDictionary } from "@/lib/dictionaries";
import styles from "./page.module.css";
import ReviewsSection from "@/components/reviews/reviewssection";
import { Marquee } from "@/components/animation/runline/runline";
import Link from "next/link";
import { CurveMarquee } from "@/components/animation/runlinecurve/runlinecurve";
import { CategoryService } from "@/services/category/service";
import { getReviews } from "@/services/reviews/service";
import Vibes from "@/components/vibes/vibes";
import TextRunRound from "@/components/animation/textrunround/textrunround";
import WhyUsBlock from "@/components/saborblock/saborblock";
//import InstructionsBlock from "@/components/instructionblock/instructionblock";
import InstructionsBlock from "@/components/typewriter/typewriter";
import FadeInCenter from "@/components/animation/incenter/incenter";
import Insta from "@/components/insta/insta";
import { Rotate } from "@/components/rotateblock/rotateblock";
import ContactsBlockNew from "@/components/contacrt/contacrt";
import { CurveMarqueeBlock } from "@/components/animation/runcurveblock/runcurveblock";
import { BannerService } from "@/services/promo/bannerservice";
import PromoBanners from "@/components/promobanner/promobanner";
import FloatingCheburekBg from "@/components/animation/floatimage/floatimage";
import cheburekSilhouette from "../../../public/checkfon_01.png"; //
import chalkboardBg from "../../../public/empty-blackboard.png";
import Image from "next/image";
import { Category } from "@/types/index";

type PageProps = {
  params: {
    lang: string;
  };
};

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  const listc = [
    { name: dict.title.line_1, image: "/checkimg_1_3.webp" },
    { name: dict.title.line_2, image: "/checkimg_55_6.jpg" },
    { name: dict.title.line_3, image: "/checkimg_1_3.webp" },
  ];
  const [menu, reviews] = await Promise.all([
    CategoryService.getMenu(),
    getReviews(),
  ]);
  //---------------------------------------------------
  const banners = await BannerService.getActiveBanners();
  let list_1 = dict.home.line_1;
  let list_2 = dict.home.line_2;

  let language: "pt" | "en";

  if (lang === "pt") {
    language = "pt";
  } else {
    language = "en";
  }

  if (banners.length !== 0) {
    list_1 = `${banners[0][`title_${language}`]}  ${banners[0][`subtitle_${language}`]}`;
  }
  if (banners.length === 2) {
    list_2 = `${banners[1][`title_${language}`]}  ${banners[1][`subtitle_${language}`]}`;
  }

  const result = menu.find((item:Category) => item.name_pt === "CHEBUREKS") || menu[0];

  const list = result.products;
  

  return (
    <main className={styles.main}>
      <section className={styles.blockv}>
        <ScrollVert list={listc}></ScrollVert>
      </section>
      <section className={styles.mainFon}>
        <FloatingCheburekBg image={cheburekSilhouette} count={25} />

        <div className={styles.menu}>
          <Link href={`/${lang}/menu`} style={{ cursor: "pointer" }}>
            <TextRunRound
              text={`${dict.promo.text_1} - - - -  ${dict.promo.text_1}  - - - `}
              logoSrc="/logo.png"
              size={180}
              sizeMobile={120}
              fontsizeMobile={20}
              rotate={true}
              colort="white"
              grad={10}
              fontsize={20}
              mobileBreakpoint={640}
            />
          </Link>
        </div>
        <div className={styles.mainBlock}>
          <div className={styles.bgWrapper}>
            <Image
              src={chalkboardBg}
              alt="Chalkboard background"
              placeholder="blur"
              fill
              className="object-cover object-center"
              priority // 🌟 Укажет браузеру, что этот элемент критически важен для первого кадра
              quality={80} // Чуть снизим качество для уменьшения веса файла (80 — золотая середина)
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className={styles.containerhit}>
            <HitMenunew listmenu={list}></HitMenunew>
          </div>

          <div className={styles.container}>
            <WhyUsBlock></WhyUsBlock>
          </div>
          <div className={styles.linetop}></div>

          <div className={styles.container}>
            <ReviewsSection reviews={reviews} listprod={list} />
          </div>

          <div className={styles.container}>
            <InstructionsBlock></InstructionsBlock>
          </div>

          <div className={styles.linetop}></div>
          <div className={styles.container}>
            <Insta></Insta>
          </div>

          <div className={styles.linetop}></div>
          <div className={styles.container}>
            <ContactsBlock />
          </div>
        </div>
      </section>
    </main>
  );
}
/*import ContactsBlock from "@/components/contactblock/contactblock";
import ScrollVert from "@/components/animation/scrollvertnew/scrollvert";
import ScrollMarqueeSmooth from "@/components/modulefun/runstring/index";
import HitMenunew from "@/components/hitmenunew/hitmenunew";
import { getDictionary } from "@/lib/dictionaries";
import styles from "./page.module.css";
import ReviewsSection from "@/components/reviews/reviewssection";
import { Marquee } from "@/components/animation/runline/runline";
import Link from "next/link";
import { CurveMarquee } from "@/components/animation/runlinecurve/runlinecurve";
import { CategoryService } from "@/services/category/service";
import { getReviews } from "@/services/reviews/service";
import Vibes from "@/components/vibes/vibes";
import TextRunRound from "@/components/animation/textrunround/textrunround";
import WhyUsBlock from "@/components/saborblock/saborblock";
//import InstructionsBlock from "@/components/instructionblock/instructionblock";
import InstructionsBlock from "@/components/typewriter/typewriter";
import FadeInCenter from "@/components/animation/incenter/incenter";
import Insta from "@/components/insta/insta";
import { Rotate } from "@/components/rotateblock/rotateblock";
import ContactsBlockNew from "@/components/contacrt/contacrt";
import { CurveMarqueeBlock } from "@/components/animation/runcurveblock/runcurveblock";
import { BannerService } from "@/services/promo/bannerservice";
import PromoBanners from "@/components/promobanner/promobanner";
import FloatingCheburekBg from "@/components/animation/floatimage/floatimage";
import cheburekSilhouette from "../../../public/checkfon_01.png"; //
import chalkboardBg from "../../../public/empty-blackboard.png";
import Image from "next/image";

type PageProps = {
  params: {
    lang: string;
  };
};

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  const listc = [
    { name: dict.title.line_1, image: "/checkimg_1.webp" },
    { name: dict.title.line_2, image: "/checkimg_1_1.webp" },
    { name: dict.title.line_3, image: "/checkimg_1_3.webp" },
  ];
  const [menu, reviews] = await Promise.all([
    CategoryService.getMenu(),
    getReviews(),
  ]);
  //---------------------------------------------------
  const banners = await BannerService.getActiveBanners();
  let list_1 = dict.home.line_1;
  let list_2 = dict.home.line_2;

  let language: "pt" | "en";

  if (lang === "pt") {
    language = "pt";
  } else {
    language = "en";
  }

  if (banners.length !== 0) {
    list_1 = `${banners[0][`title_${language}`]}  ${banners[0][`subtitle_${language}`]}`;
  }
  if (banners.length === 2) {
    list_2 = `${banners[1][`title_${language}`]}  ${banners[1][`subtitle_${language}`]}`;
  }

  const result = menu.find((item) => item.name_pt === "CHEBUREKS") || menu[0];

  const list = result.products;

  return (
    <main className={styles.main}>
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

      <section className={styles.block}>
        <ScrollVert list={listc}></ScrollVert>
      </section>
      <section className={styles.mainFon}>
        <FloatingCheburekBg image={cheburekSilhouette} count={25} />

        <div className={styles.menu}>
          <Link href={`/${lang}/menu`} style={{ cursor: "pointer" }}>
            <TextRunRound
              text={`${dict.promo.text_1} - - - -  ${dict.promo.text_1}  - - - `}
              logoSrc="/logo.png"
              size={180}
              sizeMobile={120}
              fontsizeMobile={20}
              rotate={true}
              colort="white"
              grad={10}
              fontsize={20}
              mobileBreakpoint={640}
            />
          </Link>
        </div>
        <div className={styles.blockl}>
          <ScrollMarqueeSmooth
            childrenRow1={
              <div className={styles.line}>
                <p className={styles.scrollstring}>{list_1}</p>
                <p className={styles.scrollstring}>{list_1}</p>
                <p className={styles.scrollstring}>{list_1}</p>
                <p className={styles.scrollstring}>{list_1}</p>
                <p className={styles.scrollstring}>{list_1}</p>
                <p className={styles.scrollstring}>{list_1}</p>
              </div>
            }
            childrenRow2={
              <div className={styles.line}>
                <p className={styles.scrollstring}>{list_2}</p>
                <p className={styles.scrollstring}>{list_2}</p>
                <p className={styles.scrollstring}>{list_2}</p>
                <p className={styles.scrollstring}>{list_2}</p>
                <p className={styles.scrollstring}>{list_2}</p>
                <p className={styles.scrollstring}>{list_2}</p>
              </div>
            }
            gap={3}
          ></ScrollMarqueeSmooth>
        </div>

        <div className={styles.containerhit}>
          <HitMenunew listmenu={list}></HitMenunew>
        </div>
        <div className={styles.container}>
          <Vibes></Vibes>
        </div>

        <div className={styles.linetext}>
          <CurveMarqueeBlock
            text={`${dict.titleline.line_1}   *   ${dict.titleline.line_2}  *  ${dict.titleline.line_3}  *  ${dict.titleline.line_1}   *   ${dict.titleline.line_2}  *  ${dict.titleline.line_3}  *`}
            speed={20}
            amplitude={40}
            frequency={3}
            direction="right"
            fontsize="1.5rem"
            color="white"
            bgColor="rgb(236, 142, 54)"
            bgWidth={60}
            letterspacing={2}
          ></CurveMarqueeBlock>
        </div>

        <div className={styles.container}>
          <WhyUsBlock></WhyUsBlock>
        </div>
        <div className={styles.linetop}></div>

        <div className={styles.container}>
          <div className={styles.bgStrip} />

          <ReviewsSection reviews={reviews} listprod={list} />
        </div>

        <div className={styles.strip}>
          <Rotate angle={5} shiftY={-20}>
            <Marquee speed={100} repeatCount={1} gap={0} direction="right">
              <div className={styles.linerun}><div style={{ paddingRight: "20px" }}>{dict.contact.text}</div></div>
            </Marquee>
          </Rotate>
        </div>

        <div className={styles.container}>
          <ContactsBlockNew></ContactsBlockNew>
        </div>

        <div style={{ zIndex: "5" }}>
          <Rotate angle={-5} shiftY={-20}>
            <Marquee speed={100} repeatCount={1} gap={0} direction="right">
              <div className={styles.linerun}>
                <div style={{ paddingRight: "20px" }}>{list_1}</div>
                <div style={{ paddingRight: "20px" }}>{list_2}</div>
              </div>
            </Marquee>
          </Rotate>
        </div>
        <div className={styles.linetop}></div>

        <div className={styles.container}>
          <div className={styles.bgStrip} />
          <div className={styles.content}>
            <InstructionsBlock></InstructionsBlock>
          </div>
        </div>

        <div className={styles.linetop}></div>
        <div className={styles.container}>
          <Insta></Insta>
        </div>

        <div className={styles.linetop}></div>
      </section>
      <ContactsBlock />
    </main>
  );
}
*/
