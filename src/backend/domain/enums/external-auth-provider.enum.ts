export const ExternalAuthProviderEnum = {
  GOOGLE: "google",
  GITHUB: "github",
  FACEBOOK: "facebook",
  APPLE: "apple",
  MICROSOFT: "microsoft",
  LINKEDIN: "linkedin",
} as const;

export type IExternalAuthProviderEnumType = (typeof ExternalAuthProviderEnum)[keyof typeof ExternalAuthProviderEnum];
