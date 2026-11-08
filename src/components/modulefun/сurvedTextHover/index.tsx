"use client";

import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

type Props = {
  text: string;
  width?: number;         // ширина svg viewport
  height?: number;        // высота svg viewport
  cx?: number;            // центр окружности x
  cy?: number;            // центр окружности y (хорда будет проходить по cy)
  baseRadius?: number;    // радиус по умолчанию (px)
  hoverRadius?: number;   // радиус при hover (px) — меньше => сильнее изгиб
  spacing?: number;       // фиксированное расстояние между буквами по хорде (px)
  direction?: "up" | "down";
  duration?: number;      // длительность анимации (сек)
  fontSize?: number;
};

export default function SvgArcText({
  text,
  width = 800,
  height = 250,
  cx = 400,
  cy = 120,
  baseRadius = 300,
  hoverRadius = 180,
  spacing = 28,
  direction = "up",
  duration = 0.7,
  fontSize = 28,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // вычисление позиций/углов и применение (анимация) через gsap
  const applyRadius = (rIn: number, animate = true) => {
    if (!svgRef.current) return;
    const letters = Array.from(svgRef.current.querySelectorAll<SVGElement>("[data-arc-letter]"));
    const N = letters.length;
    if (N <= 0) return;

    // хорда = фиксированная длина между буквами
    const chordLength = (N - 1) * spacing;
    const minR = chordLength / 2 + 1e-6;
    let r = Math.max(rIn, minR);

    // центральный угол дуги, соответствующий длине хорды: thetaTotal = 2 * asin((L/2)/r)
    let thetaTotal = 2 * Math.asin((chordLength / 2) / r);

    // ограничение на слишком большую дугу (не нужно делать почти-циркуль)
    const maxAngle = Math.PI * 0.95;
    if (thetaTotal > maxAngle) {
      thetaTotal = maxAngle;
      r = (chordLength / 2) / Math.sin(thetaTotal / 2);
    }

    // начальный угол относительно центра: от -thetaTotal/2 до +thetaTotal/2
    const startAngle = -thetaTotal / 2;
    const sign = direction === "up" ? -1 : 1; // DOM y вниз -> invert for "up"

    // для каждой буквы вычисляем угол phi и положение точки на окружности
    letters.forEach((el, i) => {
      // угол вдоль дуги для буквы i
      const phi = startAngle + (i * (thetaTotal / Math.max(1, N - 1)));
      // координата на окружности относительно центра (cx, cy)
      // стандартная параметризация: x = cx + r * sin(phi), y = cy + sign * (r - r*cos(phi))
      // это размещает хорду горизонтально по уровню cy
      const x = cx + r * Math.sin(phi);
      const y = cy + sign * (r - Math.cos(phi) * r);

      // угол касательной: alpha = asin(x_rel / r)  (или atan2(dy, dx))
      // проще: tangent angle = phi in radians projected; the tangent direction angle = atan2(dx, -dy)? 
      // but we can use alpha = Math.asin( (cx - x)/r ) ... simpler compute derivative:
      // derivative dy/dx = (d/dphi y) / (d/dphi x) with param phi:
      // x(phi) = cx + r*sin(phi) -> dx/dphi = r*cos(phi)
      // y(phi) = cy + sign*(r - r*cos(phi)) -> dy/dphi = sign * r * sin(phi)
      // dy/dx = (dy/dphi)/(dx/dphi) = (sign * r * sin(phi)) / (r * cos(phi)) = sign * tan(phi)
      // угол касательной alpha = atan(dy/dx) = atan(sign * tan(phi)) = sign * phi
      // поэтому поворот буквы = alpha (в градусах) ; для ориентации корректируем знак:
      const alpha = Math.atan(sign * Math.tan(phi)); // безопасный вариант
      const rotationDeg = (alpha * 180) / Math.PI;

      const transform = `translate(${x}, ${y}) rotate(${rotationDeg})`;
      if (animate) {
        gsap.to(el, { attr: { transform }, duration, ease: "power3.out" });
      } else {
        el.setAttribute("transform", transform);
      }
    });
  };

  // initial layout without animation
  useLayoutEffect(() => {
    requestAnimationFrame(() => applyRadius(baseRadius, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", margin: "0 auto", overflow: "visible" }}
      onMouseEnter={() => applyRadius(hoverRadius, true)}
      onMouseLeave={() => applyRadius(baseRadius, true)}
    >
      {/* опциональная подсказочная дуга для отладки — можно убрать */}
      <path
        id="circlePath"
        d={`
          M ${cx - baseRadius}, ${cy}
          a ${baseRadius},${baseRadius} 0 1,0 ${baseRadius * 2},0
          a ${baseRadius},${baseRadius} 0 1,0 ${-baseRadius * 2},0
        `}
        fill="none"
        stroke="transparent"
      />

      {/* Буквы: каждая буква в своей группе, центр текста в 0,0, потом трансформируем группу */}
      <g>
        {text.split("").map((ch, i) => (
          <g key={i} data-arc-letter>
            <text
              x={0}
              y={0}
              textAnchor="middle"
              alignmentBaseline="baseline"
              style={{
                fontSize,
                fontWeight: 900,
                dominantBaseline: "alphabetic",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
