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

  const fill = useColorModeValue(props.fillColor ?? "primary", props.darkFillColor ?? props.fillColor ?? "primary");
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
  const shouldAnimate = hoverFilled !== "none";

  const initialTransform = hoverFilled.startsWith("back") ? "scale(1)" : hoverFilled === "fromTop" || hoverFilled === "fromBottom" ? "scaleY(0)" : "scaleX(0)";

  const hoverTransform = hoverFilled.startsWith("back")
    ? hoverFilled.includes("Top") || hoverFilled.includes("Bottom")
      ? "scaleY(0)"
      : "scaleX(0)"
    : hoverFilled === "fromTop" || hoverFilled === "fromBottom"
    ? "scaleY(1)"
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

  return (
    <Ripple asChild>
      <Button
        {...props}
        position="relative"
        overflow="hidden"
        border="2px solid"
        borderColor={fill}
        color={normalText}
        fontWeight="bold"
        bg="transparent"
        transition="color 0.3s ease"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          bg: fill,
          transform: shouldAnimate ? initialTransform : undefined,
          transformOrigin: shouldAnimate ? transformOrigin : undefined,
          transition: shouldAnimate ? "transform 0.3s ease" : undefined,
          zIndex: -1, // 👈 fica atrás do conteúdo
        }}
        _hover={{
          color: hoverText,
          _before: shouldAnimate ? { transform: hoverTransform } : undefined,
        }}
      >
        {props.children}
      </Button>
    </Ripple>
  );
}
