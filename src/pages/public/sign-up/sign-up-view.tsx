"use client";
import { ColorModeButton } from "@/components/ui/color-mode";
import { TouchButton } from "@/components/ui/touch-button";
// import { TouchButton } from "@/components/ui/touch-button";
// import { TouchButton } from "@/components/ui/touch-button";
import { Button, Flex } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";

export function SignUpView() {
  return (
    <Flex>
      <Flex>
        <ColorModeButton />
      </Flex>

      <Button colorPalette="primary" variant={"outline"} gap={2}>
        <span>Create Account</span>
        <RiArrowRightLine />
      </Button>

      {/* <Ripple> */}
      <TouchButton colorPalette="primary" alignItems="center" variant="outline" gap={2}>
        <span>Create Account</span>
        <RiArrowRightLine />
      </TouchButton>
      {/* </Ripple> */}
    </Flex>
  );
}
