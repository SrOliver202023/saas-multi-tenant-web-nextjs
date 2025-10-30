"use client";

import { Button, ButtonProps } from "@chakra-ui/react";
import { RefAttributes, useEffect, useState } from "react";
import { useColorModeValue } from "./color-mode";
import { Ripple } from "./ripple";

export type HoverFilledDirection =
  | "fromLeft"
  | "fromRight"
  | "fromTop"
  | "fromBottom"
  | "backFromLeft"
  | "backFromRight"
  | "backFromTop"
  | "backFromBottom"
  | "none";

export interface TouchButtonProps extends ButtonProps, RefAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  hoverFilled?: HoverFilledDirection;
  fillColor?: string;
  textHoverColor?: string;
  textColor?: string;
  darkFillColor?: string;
  darkTextHoverColor?: string;
  darkTextColor?: string;
}

export function TouchButton(props: TouchButtonProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fill = useColorModeValue(props.fillColor ?? "primary.600", props.darkFillColor ?? props.fillColor ?? "primary.600");

  const hoverText = useColorModeValue(props.textHoverColor ?? "white", props.darkTextHoverColor ?? props.textHoverColor ?? "white");

  const normalText = useColorModeValue(props.textColor ?? fill, props.darkTextColor ?? props.textColor ?? fill);

  if (!mounted) {
    return (
      <Button {...props} color={normalText} borderColor={fill}>
        {props.children}
      </Button>
    );
  }

  const hoverFilled = props.hoverFilled ?? "fromLeft";
  const isBack = hoverFilled.startsWith("back");
  const shouldAnimate = hoverFilled !== "none";

  // define transformações
  const initialTransform =
    hoverFilled === "fromTop" || hoverFilled === "fromBottom" || hoverFilled.includes("backFromTop") || hoverFilled.includes("backFromBottom")
      ? isBack
        ? "scaleY(1)"
        : "scaleY(0)"
      : isBack
      ? "scaleX(1)"
      : "scaleX(0)";

  const hoverTransform =
    hoverFilled === "fromTop" || hoverFilled === "fromBottom" || hoverFilled.includes("backFromTop") || hoverFilled.includes("backFromBottom")
      ? isBack
        ? "scaleY(0)"
        : "scaleY(1)"
      : isBack
      ? "scaleX(0)"
      : "scaleX(1)";

  const transformOrigin = hoverFilled.includes("Left")
    ? "left"
    : hoverFilled.includes("Right")
    ? "right"
    : hoverFilled.includes("Top")
    ? "top"
    : hoverFilled.includes("Bottom")
    ? "bottom"
    : "center";

  // 🧠 aqui está a mágica da inversão de cores
  const currentTextColor = isBack ? hoverText : normalText;
  const currentHoverColor = isBack ? normalText : hoverText;

  return (
    <Ripple color={fill}>
      <Button
        {...props}
        position="relative"
        overflow="hidden"
        border="2px solid"
        borderColor={fill}
        color={currentTextColor}
        fontWeight="bold"
        bg={isBack ? fill : "transparent"}
        transition="color 0.3s ease, background-color 0.3s ease"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          bg: fill,
          transform: shouldAnimate ? initialTransform : undefined,
          transformOrigin: shouldAnimate ? transformOrigin : undefined,
          transition: shouldAnimate ? "transform 0.3s ease" : undefined,
          zIndex: -1,
        }}
        _hover={{
          color: currentHoverColor,
          bg: isBack ? "transparent" : undefined,
          _before: shouldAnimate ? { transform: hoverTransform } : undefined,
        }}
      >
        {props.children}
      </Button>
    </Ripple>
  );
}
