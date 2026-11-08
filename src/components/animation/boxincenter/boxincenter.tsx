import Image from "next/image";
import styles from "./boxincenter.module.css";

interface HoverOverlayCardProps {
  imageUrl: string;
  title: string;
  altText?: string;
}

export default function HoverOverlayCard({ imageUrl, title, altText = "Cheburek photo" }: HoverOverlayCardProps) {
  return (
    <div className={styles.container}>
      {/* Сама фотография */}
      <div className="w-full h-full relative aspect-square">
        <Image 
          src={imageUrl} 
          alt={altText} 
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Вылетающий из центра оверлей */}
      <div className={styles.overlay}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
}