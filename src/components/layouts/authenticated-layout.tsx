import { useAuth } from "@/hooks/use-auth";
import { Avatar, Flex, Heading, HStack, IconButton, Menu, Portal, Stack, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { FaRegBell, FaUser } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdSettings } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { ColorModeButton, useColorModeValue } from "../ui/color-mode";

export interface AvatarMenuProfileProps {
  name: string;
  email: string;
  avatar?: string;
}

export function AvatarMenuProfile({ user }: { user: AvatarMenuProfileProps }) {
  // Cores dinâmicas conforme o tema
  const hoverBg = useColorModeValue("blue.50", "blue.900");
  const ringColor = useColorModeValue("blue.300", "blue.500");
  const ringOffset = useColorModeValue("white", "gray.900");
  const logoutHoverBg = useColorModeValue("red.50", "red.900");
  const logoutRing = useColorModeValue("red.400", "red.500");

  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger rounded="md" cursor="pointer">
        <HStack key={user.email} gap="2" p="1">
          <Avatar.Root size="xs">
            <Avatar.Fallback name={user.name} />
            <Avatar.Image src={user.avatar} />
          </Avatar.Root>
          <Stack gap="0">
            <Text fontWeight="medium" textStyle="sm" textAlign="left">
              {user.name}
            </Text>
            <Text color="fg.muted" textStyle="xs" textAlign="left">
              {user.email}
            </Text>
          </Stack>
          <IoMdArrowDropdown />
        </HStack>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content shadow="lg" borderRadius="md" py="2" minW="180px" _focusVisible={{ outline: "none" }}>
            <Menu.Item
              value="account"
              cursor="pointer"
              _highlighted={{
                bg: hoverBg,
                ring: 2,
                ringColor: ringColor,
                ringOffset: 2,
                ringOffsetColor: ringOffset,
              }}
            >
              <FaUser />
              <Text ml="2">Account</Text>
            </Menu.Item>

            <Menu.Item
              value="settings"
              cursor="pointer"
              _highlighted={{
                bg: hoverBg,
                ring: 2,
                ringColor: ringColor,
                ringOffset: 2,
                ringOffsetColor: ringOffset,
              }}
            >
              <MdSettings />
              <Text ml="2">Settings</Text>
            </Menu.Item>

            <Menu.Item
              value="logout"
              cursor="pointer"
              onClick={() => signOut()}
              _highlighted={{
                bg: logoutHoverBg,
                ring: 2,
                ringColor: logoutRing,
                ringOffset: 2,
                ringOffsetColor: ringOffset,
              }}
            >
              <FaArrowRightFromBracket />
              <Text ml="2">Logout</Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export function NotificationButton() {
  return (
    <IconButton
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    >
      <FaRegBell />
    </IconButton>
  );
}
export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { isAuthenticated, user, data } = useAuth();

  if ((!isAuthenticated && !user) || !data) return children;

  return (
    <Flex w="full" direction="column" h="100vh">
      <HStack py="2" px="4" justifyContent="space-between" alignItems="center" position="sticky" top={0} borderBottom="xs" borderColor="border">
        <Heading>Logo</Heading>
        <HStack gap="2">
          <ColorModeButton />
          <NotificationButton />
          <AvatarMenuProfile user={user} />
        </HStack>
      </HStack>

      <Flex p="4" h="full">
        {children}
      </Flex>
    </Flex>
  );
}
