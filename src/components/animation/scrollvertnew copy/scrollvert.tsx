"use client";
import styles from "./scrollvert.module.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

/*const robotoc = Cormorant({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
});*/

gsap.registerPlugin(Observer);

type ListItem = {
  name: string;
  image: string;
};

const ScrollVert = ({ list }: { list: ListItem[] }) => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const innerRef = useRef<HTMLDivElement[]>([]);
  const outerRef = useRef<HTMLDivElement[]>([]);
  const imageRef = useRef<HTMLDivElement[]>([]);
  const letterRefs = useRef<HTMLSpanElement[][]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  //const containerRef = useRef<HTMLDivElement>(null);

  const wrap = gsap.utils.wrap(0, list.length);

  const gotoSection = (index: number, direction: number) => {
    index = wrap(index);
    //console.log(index);
    if (animatingRef.current) return;
    animatingRef.current = true;
    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    // Анимация перехода
    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    if (currentIndex >= 0) {
      // The first time this function runs, current is -1
      gsap.set(sectionsRef.current[currentIndex], { zIndex: 0 });
      tl.to(imageRef.current[currentIndex], { yPercent: -15 * dFactor }).set(
        sectionsRef.current[currentIndex],
        { autoAlpha: 0 },
      );
    }
    gsap.set(sectionsRef.current[index], { autoAlpha: 1, zIndex: 1 });

    tl.fromTo(
      [outerRef.current[index], innerRef.current[index]],
      {
        yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
      },
      {
        yPercent: 0,
      },
      0,
    )
      .fromTo(
        imageRef.current[index],
        { yPercent: 15 * dFactor },
        { yPercent: 0 },
        0,
      )
      .fromTo(
        letterRefs.current[index],
        {
          autoAlpha: 0,
          yPercent: 150 * dFactor,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2",
          stagger: {
            each: 0.02,
            from: "random",
          },
        },
        0.2,
      );

    setCurrentIndex(index);
  };

  useEffect(() => {
    gsap.set(sectionsRef.current[currentIndex], { autoAlpha: 1, zIndex: 1 });
  }, []);

  useEffect(() => {
    const isFirst = currentIndex === 0;
    const isEdge = currentIndex === list.length - 1;
    const isLast = currentIndex === list.length - 1;
    const observer = Observer.create({
      type: "wheel,touch,pointer",
      //preventDefault: true,
      wheelSpeed: -1,

      preventDefault: !isEdge,

      onUp: () => {
        if (isLast) return; // можно дать странице скроллиться вверх
        gotoSection(currentIndex + 1, +1);
      },

      onDown: () => {
        gotoSection(currentIndex - 1, -1);
      },
      tolerance: 20,
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "ArrowLeft") {
        gotoSection(currentIndex - 1, -1);
      }
      if (["ArrowDown", "ArrowRight", "Space", "Enter"].includes(e.code)) {
        gotoSection(currentIndex + 1, 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      observer.kill();
      window.removeEventListener("keydown", handleKeyDown); // Удаляем Observer при размонтировании
    };
  }, [currentIndex]);

  const renderLetters = (nametitle: string, iny: number) => {
    return nametitle.split("").map((letter, index) => (
      <span
        key={index}
        className={styles.letter}
        ref={(el) => {
          if (!letterRefs.current[iny]) letterRefs.current[iny] = [];
          if (el) letterRefs.current[iny][index] = el;
        }}
      >
        {letter === " " ? "\u00A0" : letter}
      </span>
    ));
  };

  return (
    <div className={` ${styles.main}`}>
      {list.map((text, i) => (
        <div
          className={styles.slidesection}
          key={i}
          ref={(el) => {
            sectionsRef.current[i] = el!;
          }}
        >
          <div
            className={styles.outer}
            ref={(el) => {
              outerRef.current[i] = el!;
            }}
          >
            <div
              className={styles.inner}
              ref={(el) => {
                innerRef.current[i] = el!;
              }}
            >
              <div
                className={styles.bgslide}
                ref={(el) => {
                  imageRef.current[i] = el!;
                }}
                style={{
                  background: `linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%), url(${text.image}) `,
                  backgroundSize: "cover",
                }}
              >
                <div className={styles.slide__content}>
                  <div className={styles.box}>
                    <h2 ref={titleRef} className={styles.textbox}>
                      {renderLetters(list[i].name, i)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollVert;
