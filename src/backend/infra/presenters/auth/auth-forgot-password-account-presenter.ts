interface AuthForgotPasswordProps {
  status: string;
}

type IAuthForgotPasswordPresenterRaw = {
  status: string;
};

export class AuthForgotPasswordPresenter {
  static toHttp(raw: IAuthForgotPasswordPresenterRaw): AuthForgotPasswordProps {
    return {
      status: raw.status,
    };
  }
}
