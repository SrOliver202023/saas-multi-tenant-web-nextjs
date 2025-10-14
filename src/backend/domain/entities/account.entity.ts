import { Entity, UniqueEntityID, type IEntityProps } from "@/backend/core/entities";

export interface IAccountProps extends IEntityProps {
  accountId: string;
  name: string;
  email: string;
  password: string;
}

export class Account extends Entity<IAccountProps> {
  get accountId(): string {
    return this.props.accountId;
  }

  set accountId(value: string) {
    this.props.accountId = value;
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
  }

  get password(): string {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
  }

  public static create(props: Omit<IAccountProps, "accountId">, accountId?: string) {
    return new Account({ ...props, accountId: new UniqueEntityID(accountId).toString() });
  }
}
