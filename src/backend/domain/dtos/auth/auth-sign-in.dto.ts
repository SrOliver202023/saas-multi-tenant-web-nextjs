export interface IAuthSignInDto {
  identifier: string;
  password: string;
}

export interface IAuthSignInWithGoogleDto {
  email: string;
  name: string;
  googleId: string;
}
