"use client";

import { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
  fixed: "left" | "right"; // какая часть закреплена сверху
  height?: number; // высота секции, по умолчанию 200vh
  hstick: string; // где клеится
   
};

export default function TwoPanelScroll({
  left,
  right,
  fixed,
  hstick = "0px",
  height = 100,
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
        boxSizing: "border-box",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          position: isLeftFixed ? "sticky" : "relative",
          top: isLeftFixed ? hstick : "unset",
          height: isLeftFixed ? "100vh" : "auto",
          padding: "20px",
          paddingTop:"40px",
          display: "flex",
          alignItems: "flex-start",
      
          boxSizing: "border-box",
           
        }}
      >
        {left}
      </div>

      {/* RIGHT */}
      <div
        style={{
          position: !isLeftFixed ? "sticky" : "relative",
          top: !isLeftFixed ? hstick : "unset",
          height: !isLeftFixed ? "100vh" : "auto",
          padding: "20px",
          paddingTop:"40px",
          display: "flex",
          alignItems: "flex-start",
          boxSizing: "border-box",
           
        }}
      >
        {right}
      </div>
    </div>
  );
}
