import { Entity } from "@/backend/core/entities";
import { IExternalAuthProviderEnumType } from "../enums";

export interface IExternalAuthProps {
  externalAuthId?: string; // gerado pelo DB
  provider: IExternalAuthProviderEnumType;
  providerUserId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  userId: string;
}

export class ExternalAuth extends Entity<IExternalAuthProps> {
  get externalAuthId() {
    return this.props.externalAuthId!;
  }

  set externalAuthId(value: string) {
    this.props.externalAuthId = value;
  }

  get provider(): IExternalAuthProviderEnumType {
    return this.props.provider;
  }

  get providerUserId() {
    return this.props.providerUserId;
  }

  get accessToken() {
    return this.props.accessToken;
  }

  get refreshToken() {
    return this.props.refreshToken;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get userId() {
    return this.props.userId;
  }

  static create(props: Omit<IExternalAuthProps, "externalAuthId">, id?: string) {
    return new ExternalAuth({ ...props, externalAuthId: id });
  }
}
