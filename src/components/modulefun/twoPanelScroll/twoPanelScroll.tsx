"use client";

import { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
  fixed: "left" | "right"; // какая часть закреплена сверху
  height?: number; // высота секции, по умолчанию 200vh
};

export default function TwoPanelScroll({
  left,
  right,
  fixed,
  height = 200,
}: Props) {
  const isLeftFixed = fixed === "left";

  return (
    <div
      style={{
        width: "100%",
        minHeight: `${height}vh`,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        position: "relative",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          position: isLeftFixed ? "sticky" : "relative",
          top: isLeftFixed ? 0 : "unset",
          height: isLeftFixed ? "100vh" : "auto",
          padding: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {left}
      </div>

      {/* RIGHT */}
      <div
        style={{
          position: !isLeftFixed ? "sticky" : "relative",
          top: !isLeftFixed ? 0 : "unset",
          height: !isLeftFixed ? "100vh" : "auto",
          padding: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {right}
      </div>
    </div>
  );
}
