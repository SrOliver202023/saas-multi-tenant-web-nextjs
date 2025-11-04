"use client";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import React, { useRef } from "react";

export const Ripple: React.FC<HTMLChakraProps<"div">> = ({ children, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const layer = layerRef.current;
    if (!layer) return;

    const rect = layer.getBoundingClientRect();
    const diameter = Math.max(layer.clientWidth, layer.clientHeight);
    const radius = diameter / 2;

    const span = document.createElement("span");
    span.className = "chakra-ripple";
    span.style.width = `${diameter}px`;
    span.style.height = `${diameter}px`;
    span.style.left = `${e.clientX - rect.left - radius}px`;
    span.style.top = `${e.clientY - rect.top - radius}px`;
    span.style.position = "absolute";
    span.style.borderRadius = "50%";
    span.style.transform = "scale(0)";
    span.style.pointerEvents = "none";
    span.style.opacity = "0.6";
    span.style.zIndex = "0";
    span.style.animation = "chakra-ripple-anim 650ms linear";

    const parentBg = window.getComputedStyle(layer).backgroundColor;
    span.style.backgroundColor = getAdaptiveRippleColor(parentBg);

    // remove previous ripple
    const old = layer.querySelector(".chakra-ripple");
    if (old) old.remove();

    layer.appendChild(span);
    setTimeout(() => span.remove(), 700);
  };

  return (
    <chakra.div
      ref={containerRef}
      position="relative"
      display="inline-block"
      // IMPORTANT: allow overflow so child's box-shadow (ring) can show
      overflow="visible"
      {...props}
      onClick={handleClick}
      tabIndex={-1}
      aria-hidden
      /* no styles that create clipping/stacking weirdness here */
    >
      {/* ripple layer: clipped (ONLY this layer clips ripples) */}
      <chakra.div
        ref={layerRef}
        aria-hidden
        position="absolute"
        inset={0}
        pointerEvents="none"
        overflow="hidden" /* only this layer clips the ripple */
        zIndex={0}
        borderRadius="inherit"
      />

      {/* content wrapper: above ripple, receives pointer events and focus */}
      <chakra.div position="relative" zIndex={2} pointerEvents="auto">
        {children}
      </chakra.div>

      {/* inject keyframes in a Chakra-friendly way */}
      <chakra.style>
        {`
          @keyframes chakra-ripple-anim {
            to { transform: scale(4); opacity: 0; }
          }
        `}
      </chakra.style>
    </chakra.div>
  );
};

function getAdaptiveRippleColor(bgColor: string): string {
  const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return "rgba(255,255,255,0.28)";
  const r = +match[1],
    g = +match[2],
    b = +match[3];
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.5 ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.22)";
}
