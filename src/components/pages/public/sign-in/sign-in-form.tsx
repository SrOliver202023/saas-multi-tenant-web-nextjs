"use client";
import { Form } from "@/components/form/form";
import { TouchButton } from "@/components/ui/touch-button";
import { RiArrowRightLine } from "react-icons/ri";
import { GoKey, GoMail } from "react-icons/go";
import Img from "next/image";
import { Field, Flex, Heading, Input, InputGroup, Separator, Stack, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { ColorModeButton } from "@/components/ui/color-mode";
import NextLink from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IAuthSignInDto } from "@/backend/domain/dtos";
import { authSignInZodSchema } from "@/shared";
import { signIn } from "next-auth/react";

export interface SignInFormProps {
  isLoading?: boolean;
  onSubmit: (data: IAuthSignInDto) => void;
}
export function SignInForm({ onSubmit }: SignInFormProps) {
  const form = useForm({
    resolver: zodResolver(authSignInZodSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <Flex justifyContent="center" alignItems="center" h="100vh">
      <Flex flexDir="column" gap="4" maxW="sm" p="2">
        <Flex flexDir="column" gap="2">
          <Flex justifyContent="space-between">
            <Img src="/tenant-logo-full.svg" alt="TenantLogo.svg" width={200} height={35} />
            <ColorModeButton />
          </Flex>

          <Flex flexDir="column">
            <Heading size="3xl">Login</Heading>
            <Text fontSize="lg" color="gray.400">
              Access your account and continue enjoying all the features available in the free plan.
            </Text>
          </Flex>
        </Flex>

        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <Flex flexDir="column" gap="4">
            <Flex flexDir="column" gap="2">
              <Controller
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <Field.Root invalid={Boolean(form.formState.errors.identifier)}>
                    <Field.Label fontSize="md">E-mail</Field.Label>
                    <InputGroup startAddon={<GoMail className="w-5 h-5" />}>
                      <Input id="identifier" size="md" fontSize="md" placeholder="jonh.doe@email.com" autoComplete="off" {...field} />
                    </InputGroup>
                    <Field.ErrorText color={"red.500"} fontSize="sm">
                      {form.formState.errors.identifier?.message}
                    </Field.ErrorText>
                  </Field.Root>
                )}
              />

              <Flex flexDir="column" gap="0">
                <Stack>
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <Field.Root invalid={Boolean(form.formState.errors.password)}>
                        <Field.Label fontSize="md">Password</Field.Label>
                        <InputGroup startAddon={<GoKey className="w-5 h-5" />}>
                          <PasswordInput size="md" fontSize="md" placeholder="******" autoComplete="new-password" {...field} />
                        </InputGroup>
                        <Field.ErrorText color={"red.500"} fontSize="sm">
                          {form.formState.errors.password?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    )}
                  />
                </Stack>
              </Flex>
            </Flex>

            <Flex flexDir="column">
              <TouchButton w="full" hoverFilled="backFromRight" justifyContent="space-between" type="submit">
                <Separator />
                <Text fontWeight="normal" fontSize="md">
                  Sign In Account
                </Text>
                <RiArrowRightLine />
              </TouchButton>

              <Flex gap="4" alignItems="center" px="4" py="2">
                <Flex h="0.5" w="full" bg="gray.200" />
                <Text fontSize="md" color="fg.subtle" fontWeight="semibold">
                  Or
                </Text>
                <Flex h="0.5" w="full" bg="gray.200" />
              </Flex>

              <TouchButton
                w="full"
                hoverFilled="fromLeft"
                justifyContent="space-between"
                type="button"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/home",
                    mode: "signIn",
                  })
                }
              >
                <Separator />
                <Text fontWeight="normal" fontSize="md">
                  Sign In with Google
                </Text>
                <RiArrowRightLine />
              </TouchButton>

              <Flex py="2" justifyContent="center" w="full" fontWeight="medium" gap="1">
                <Text fontSize="md">{`Don't have an account yet?`}</Text>
                <NextLink href="/register">
                  <Text fontSize="md" color="primary">
                    Sign up.
                  </Text>
                </NextLink>
              </Flex>
            </Flex>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  );
}
