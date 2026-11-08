"use client";

import styles from "./inputphone.module.css";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IMaskInput } from "react-imask";

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

function InputPhone({
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
  
  // Типизируем реф без explicit any
  const inp = useRef<HTMLInputElement | null>(null);

  // Синхронизация внешнего значения без useEffect
  const [prevValor, setPrevValor] = useState(valor);
  if (valor !== prevValor) {
    setPrevValor(valor);
    setText(valor);
  }

  // Функция для обработки ввода в маску
  const handleAccept = (value: string) => {
    setText(value);
    func(value);

    if (impotant) {
      setError(value.trim() === "");
    }
  };

  // Клик по лейблу принудительно фокусит инпут
  const handleClick = () => {
    inp.current?.focus();
  };

  const handleBlur = () => {
    if (impotant) {
      setError(text.trim() === "");
    }
  };

  // Определяем, должен ли лейбл быть сразу наверху (если уже есть текст)
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
        motion.label отвечает ТОЛЬКО за красивое "опускание" сверху вниз при монтировании.
        Анимация подъема при клике, вводе или автозаполнении теперь ложится на CSS.
      */}
      <motion.label
        className={styles.label}
        onClick={handleClick}
        htmlFor="phone-input"
        style={{ color: color }}
        
        // Начальный "влет" лейбла на место при появлении формы
        initial={{ 
          opacity: 0, 
          y: isInitiallyActive ? 0 : -35 
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

      <div style={{ width: "100%" }}>
        <IMaskInput
          id="phone-input"
          name="phone"
          autoComplete="tel"
          inputRef={inp} // Прямая передача типизированного рефа
          mask="+351 000 000 000"
          definitions={{
            "0": /[0-9]/,
          }}
          lazy={true}
          inputMode="tel"
          value={text}
          onAccept={handleAccept}
          onBlur={handleBlur}
          placeholder=" " // Пробел обязателен для работы селектора :placeholder-shown
          className={styles.input}
          style={{
            padding: "12px 0 2px 0",
            width: "100%",
            borderRadius: "0px",
            border: "none",
            fontSize: "16px",
            outline: "none",
            background: "transparent",
            color: color,
          }}
        />
      </div>

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

export default InputPhone;