import { Entity, UniqueEntityID, type IEntityProps } from "@/backend/core/entities"

export interface IUserProps extends IEntityProps {
  userId: string
  username: string
  email: string
  passwordHash: string
  deletedAt: Date | undefined
}

export class User extends Entity<IUserProps> {
  get userId(): string {
    return this.userId
  }

  set userId(value: string) {
    this.props.userId = value
  }

  get username(): string {
    return this.props.username
  }

  set username(value: string) {
    this.props.username = value
  }

  get email(): string {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
  }

  get passwordHash(): string {
    return this.props.passwordHash
  }

  set passwordHash(value: string) {
    this.props.passwordHash = value
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt
  }

  set deletedAt(value: Date) {
    this.props.deletedAt = value
  }

  public static create(props: Omit<IUserProps, "userId">, userId?: string) {
    return new User({ ...props, userId: new UniqueEntityID(userId).toString() })
  }
}
