export interface IAuthSignUpDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthSignUpInWithGoogleDto {
  email: string;
  name: string;
  googleId: string;
  password?: string;
  confirmPassword?: string;
}
