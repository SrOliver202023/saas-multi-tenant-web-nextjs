"use client";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import React, { useRef } from "react";

/**
 * Wrapper genérico que adiciona efeito ripple com cor adaptativa.
 * Adapta automaticamente o tom do ripple conforme o fundo do elemento.
 *
 * Exemplo:
 * <Ripple><Button colorScheme="blue">Clique aqui</Button></Ripple>
 */

export const Ripple: React.FC<HTMLChakraProps<"div">> = ({ children, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    // Cria o círculo
    const circle = document.createElement("span");
    const diameter = Math.max(container.clientWidth, container.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - container.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - container.getBoundingClientRect().top - radius}px`;

    // Calcula a cor de fundo para adaptar o ripple
    const bgColor = window.getComputedStyle(container).backgroundColor;
    const rippleColor = getAdaptiveRippleColor(bgColor);
    circle.style.backgroundColor = rippleColor;

    circle.classList.add("ripple");

    // Remove ripple anterior (evita sobreposição)
    const ripple = container.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    container.appendChild(circle);
  };

  return (
    <chakra.div ref={containerRef} position="relative" overflow="hidden" onClick={handleClick} cursor="pointer" {...props}>
      {children}
    </chakra.div>
  );
};

/**
 * Calcula uma cor de ripple adaptativa com base na luminosidade do fundo.
 * Se o fundo for escuro → ripple branco translúcido.
 * Se o fundo for claro → ripple preto translúcido.
 */
function getAdaptiveRippleColor(bgColor: string): string {
  // Tenta capturar os valores RGB
  const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return "rgba(255, 255, 255, 0.3)";

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  // Calcula luminosidade perceptiva (padrão WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Fundo escuro → ripple claro, fundo claro → ripple escuro
  return luminance < 0.5 ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.25)";
}
