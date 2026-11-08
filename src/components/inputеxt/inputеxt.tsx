"use client";

import styles from "./inputеxt.module.css";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

type TInput = {
  func: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  impotant: boolean;
  valor: string;

  icon: React.ComponentType<{
    color: string;
    size: number;
    coloract: string;
  }>;

  color: string;
  size: string;
  backcolor: string;
};

function InputText({
  func,
  name,
  impotant = false,
  valor = "",
  icon: Icon,
  size = "16",
  color = "black",
  backcolor = "transparent",
}: TInput) {
  const [text, setText] = useState(valor);
  const [error, setError] = useState(false);
  const inp = useRef<HTMLInputElement | null>(null);

  // Синхронизация внешнего значения
  const [prevValor, setPrevValor] = useState(valor);
  if (valor !== prevValor) {
    setPrevValor(valor);
    setText(valor);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    func(value);
    if (impotant) {
      setError(value.trim() === "");
    }
  };

  const handleClick = () => {
    inp.current?.focus();
  };

  const handleBlur = () => {
    if (impotant) {
      setError(text.trim() === "");
    }
  };

  // Определяем, должен ли лейбл БЫТЬ СРАЗУ НАВЕРХУ при монтировании (если уже есть текст)
  const isInitiallyActive = valor !== "";

  return (
    <motion.div
      className={styles.main}
      style={{
        backgroundColor: `${backcolor}`,
        borderBottom: `1px ${color} solid`,
        position: "relative",
      }}
    >
      {/* 
        Возвращаем motion.label для анимации появления!
        Но позиционирование "top" при фокусе и вводе отдаем на откуп CSS-классам.
      */}
      <motion.label
        className={styles.label}
        onClick={handleClick}
        htmlFor={`input-${name}`}
        style={{ color: color }}
        
        // Эффект "опускания" сверху вниз при первом появлении формы:
        initial={{ 
          opacity: 0, 
          y: isInitiallyActive ? 0 : -35 // Если текст уже есть, не анимируем "падение" внутрь строки
        }}
        animate={{ 
          opacity: 1, 
          y: 0 
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        <Icon color={color} size={20} coloract={color} />
        <div style={{ fontSize: `${size}px` }}>{name}</div>
      </motion.label>

      <input
        id={`input-${name}`}
        className={styles.userBox}
        type="text"
        value={text}
        name={name}
        onChange={handleChange}
        ref={inp}
        onBlur={handleBlur}
        placeholder=" " 
        style={{
          padding: "12px 0 2px 0",
          width: "100%",
          border: "none",
          fontSize: "16px",
          outline: "none",
          background: "transparent",
          color: color,
        }}
      />

      {error && (
        <div
          className={styles.error}
          style={{
            position: "absolute",
            bottom: "-20px",
            fontSize: "12px",
            color: "red",
          }}
        >
          {name}!
        </div>
      )}
    </motion.div>
  );
}

export default InputText;