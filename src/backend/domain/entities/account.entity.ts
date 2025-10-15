import { Entity, UniqueEntityID, type IEntityProps } from "@/backend/core/entities";

export interface IAccountProps extends IEntityProps {
  accountId: string;
  email: string;
  ownerUserId?: string;
}

export class Account extends Entity<IAccountProps> {
  get accountId(): string {
    return this.props.accountId;
  }

  set accountId(value: string) {
    this.props.accountId = value;
  }

  get email(): string {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
  }

  get ownerUserId(): string | undefined {
    return this.props.ownerUserId;
  }

  set ownerUserId(value: string) {
    this.props.ownerUserId = value;
  }

  public static create(props: Omit<IAccountProps, "accountId">, accountId?: string) {
    return new Account({ ...props, accountId: new UniqueEntityID(accountId).toString() });
  }
}
