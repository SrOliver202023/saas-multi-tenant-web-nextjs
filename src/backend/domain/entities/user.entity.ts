import { Entity, UniqueEntityID, type IEntityProps } from "@/backend/core/entities";

export interface IUserProps extends IEntityProps {
  userId: string;
  username: string;
  name: string;
  email: string;
  managerAccountId?: string;
  ownedAccountId?: string;
  password: string;
  deletedAt?: Date;
}

export class User extends Entity<IUserProps> {
  get userId(): string {
    return this.props.userId;
  }

  set userId(value: string) {
    this.props.userId = value;
  }

  get username(): string {
    return this.props.username;
  }

  set username(value: string) {
    this.props.username = value;
  }

  get managerAccountId(): string | undefined {
    return this.props.managerAccountId;
  }

  set managerAccountId(value: string | undefined) {
    this.props.managerAccountId = value;
  }

  get ownedAccountId(): string | undefined {
    return this.props.ownedAccountId;
  }

  set ownedAccountId(value: string | undefined) {
    this.props.ownedAccountId = value;
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

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  set deletedAt(value: Date) {
    this.props.deletedAt = value;
  }

  public static create(props: Omit<IUserProps, "userId">, userId?: string) {
    return new User({ ...props, userId: new UniqueEntityID(userId).toString() });
  }
}
