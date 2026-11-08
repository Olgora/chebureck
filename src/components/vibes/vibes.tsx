"use client";

import styles from "./vibes.module.css";
import ITrack from "@/components/iconsvg/itrack";
import ICard from "@/components/iconsvg/icard";
import IClock from "@/components/iconsvg/iclock";
import ICheb from "@/components/iconsvg/icheb";
import FadeInCenter from "@/components/animation/incenter/incenter";
import BlobIcon from "@/components/animation/iconspringcolor/iconspringcolor";
import TextRunRound from "@/components/animation/textrunround/textrunround";
import PromoCard from "@/components/promoblock/promoblock";
import { useI18n } from "@/context/diccontext";

export default function Vibes() {
  const { dictionary } = useI18n();

  const colorbais = "black";
  return (
    <div className={styles.main}>
      <div className={styles.logo}>
        <FadeInCenter key={1}>
          <TextRunRound
            text={`${dictionary.vibes.hotFreshTasty}.${dictionary.vibes.hotFreshTasty}. ${dictionary.vibes.hotFreshTasty}`}
            logoSrc="/logo.png"
            size={400}
            rotate={true}
            colort={colorbais}
            grad={10}
            sizeMobile={300}
            fontsizeMobile={12}
            fontsize={16}
            mobileBreakpoint = {1000}
          ></TextRunRound>
        </FadeInCenter>
      </div>

      <div className={styles.title}>
        <h2 className="title" style={{ textAlign: "end" }}>
          {dictionary.vibes.title_1}
        </h2>
        <h2 className="title" style={{ textAlign: "end" }}>
          {dictionary.vibes.title_2}
        </h2>
      </div>
      <div className={styles.mainbox}>
        <PromoCard
          icon={
            <BlobIcon
              icon={<ICheb color={colorbais} />}
              size={70}
              blobColor="rgba(226, 177, 14, 0.8)"
            />
          }
          title={dictionary.vibes.premiumIngredientsTitle}
          description={dictionary.vibes.premiumIngredientsText}
          linecolor={colorbais}
          textcolor={colorbais}
        ></PromoCard>
        <PromoCard
          icon={
            <BlobIcon
              icon={<ITrack color={colorbais} />}
              size={70}
              blobColor="rgba(226, 177, 14, 0.8)"
            />
          }
          title={dictionary.vibes.fastDeliveryTitle}
          description={dictionary.vibes.fastDeliveryText}
          linecolor={colorbais}
          textcolor={colorbais}
        ></PromoCard>
        <PromoCard
          icon={
            <BlobIcon
              icon={<IClock color={colorbais} />}
              size={70}
              blobColor="rgba(226, 177, 14, 0.8)"
            />
          }
          title={dictionary.vibes.onTimeServiceTitle}
          description={dictionary.vibes.onTimeServiceText}
          linecolor={colorbais}
          textcolor={colorbais}
        ></PromoCard>
        <PromoCard
          icon={
            <BlobIcon
              icon={<ICard color={colorbais} />}
              size={70}
              blobColor="rgba(226, 177, 14, 0.8)"
            />
          }
          title={dictionary.vibes.securePaymentsTitle}
          description={dictionary.vibes.securePaymentsText}
          linecolor={colorbais}
          textcolor={colorbais}
        ></PromoCard>
      </div>
    </div>
  );
}
