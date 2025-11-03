"use client";
import { Form } from "@/components/form/form";
import { TouchButton } from "@/components/ui/touch-button";
import { RiArrowRightLine } from "react-icons/ri";
import { GoKey, GoMail, GoTag } from "react-icons/go";

import Img from "next/image";
import { Field, Flex, Heading, Input, InputGroup, Separator, Stack, Text } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import { Options, passwordStrength } from "check-password-strength";
import { useMemo } from "react";
import { ColorModeButton } from "@/components/ui/color-mode";
import NextLink from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IAuthSignUpDto } from "@/backend/domain/dtos";
import { authSignUpValidation } from "@/shared";

const strengthOptions: Options<string> = [
  { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
];

export interface SignUpFormProps {
  isLoading: boolean;
  onSubmit: (data: IAuthSignUpDto) => void;
  onGoogleSignUp: () => void;
}
export function SignUpForm({ onSubmit, onGoogleSignUp }: SignUpFormProps) {
  const form = useForm({
    resolver: zodResolver(authSignUpValidation),
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
  });

  const password = form.watch("password");

  const strength = useMemo(() => {
    if (!password) return 0;
    const result = passwordStrength(password, strengthOptions);
    return result.id;
  }, [password]);

  return (
    <Flex justifyContent="center" alignItems="center" h="100vh">
      <Flex flexDir="column" gap="4" maxW="sm" p="2">
        <Flex flexDir="column" gap="2">
          <Flex justifyContent="space-between">
            <Img src="/tenant-logo-full.svg" alt="TenantLogo.svg" width={200} height={35} />
            <ColorModeButton />
          </Flex>

          <Flex flexDir="column">
            <Heading size="3xl">Create account</Heading>
            <Text fontSize="lg" color="gray.400">
              Create your account and enjoy all the features available in the free plan.
            </Text>
          </Flex>
        </Flex>

        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <Flex flexDir="column" gap="4">
            <Flex flexDir="column" gap="2">
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Field.Root invalid={Boolean(form.formState.errors.name)}>
                    <Field.Label fontSize="md">Full Name</Field.Label>
                    <InputGroup startAddon={<GoTag className="w-5 h-5" />}>
                      <Input size="md" fontSize="md" placeholder="Jonh Doe" {...field} />
                    </InputGroup>
                    <Field.ErrorText color={"red.500"} fontSize="sm">
                      {form.formState.errors.name?.message}
                    </Field.ErrorText>
                  </Field.Root>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Field.Root invalid={Boolean(form.formState.errors.email)}>
                    <Field.Label fontSize="md">E-mail</Field.Label>
                    <InputGroup startAddon={<GoMail className="w-5 h-5" />}>
                      <Input size="md" fontSize="md" placeholder="jonh.doe@email.com" autoComplete="off" {...field} />
                    </InputGroup>
                    <Field.ErrorText color={"red.500"} fontSize="sm">
                      {form.formState.errors.email?.message}
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
                  <PasswordStrengthMeter value={strength} fontSize="lg" />
                </Stack>

                <Controller
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <Field.Root invalid={Boolean(form.formState.errors.confirmPassword)}>
                      <Field.Label fontSize="md">Confirm Password</Field.Label>
                      <InputGroup startAddon={<GoKey className="w-5 h-5" />}>
                        <PasswordInput size="md" fontSize="md" placeholder="******" autoComplete="new-password" {...field} />
                      </InputGroup>
                      <Field.ErrorText color={"red.500"} fontSize="sm">
                        {form.formState.errors.confirmPassword?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  )}
                />
              </Flex>
            </Flex>

            <Flex flexDir="column">
              <TouchButton w="full" hoverFilled="backFromRight" justifyContent="space-between" type="submit">
                <Separator />
                <Text fontWeight="normal" fontSize="md">
                  Create Account
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

              <TouchButton w="full" hoverFilled="fromLeft" justifyContent="space-between" onClick={onGoogleSignUp}>
                <Separator />
                <Text fontWeight="normal" fontSize="md">
                  Sign Up with Google
                </Text>
                <RiArrowRightLine />
              </TouchButton>

              <Flex py="2" justifyContent="center" w="full" fontWeight="medium" gap="1">
                <Text fontSize="md">Already have an account?</Text>
                <NextLink href="/login">
                  <Text fontSize="md" color="primary">
                    Sign In.
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
