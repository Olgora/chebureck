import React, { useState } from "react";
import styles from "./imgblock.module.css";

interface ImageBlockProps {
  src: string;
  hgt: string; // например 200px или '30vh'
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ src, hgt = "40vh" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className={styles.imageWrapper}
        style={{ height: hgt  }}
        onClick={openModal}
      >
        <img src={src} alt=" " />
      </div>

      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // чтобы клик по картинке не закрывал
          >
            <button className={styles.closeBtn} onClick={closeModal}>
              ✕
            </button>
            <img src={src} alt="Preview" className={styles.modalImage} />
          </div>
        </div>
      )}
    </>
  );
};
