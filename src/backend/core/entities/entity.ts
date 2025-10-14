import { Optional } from "../types/optional"
// import { UniqueEntityID } from "./unique-entity-id"

interface IDefaultProps {
  createdAt?: Date
  createdBy?: string | number | null
}

export type IEntityProps = Optional<IDefaultProps, "createdBy" | "createdAt">

export abstract class Entity<Props extends IEntityProps> {
  protected props: Props

  get createdAt(): Date {
    return this.props.createdAt ?? new Date()
  }

  get createdBy() {
    return this.props.createdBy
  }

  protected constructor(props: Props) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      createdBy: props.createdBy ?? null,
    }

    // private _id: UniqueEntityID
    // get id() {
    //   return this._id
    // }
    // this._id = id
  }
}

// interface UserProps {
//   name: string
//   email: string
//   username?: string
// }

// export class User extends Entity<UserProps> {
//   protected static props: UserProps

//   static create(props: UserProps, id?: UniqueEntityID) {
//     const user = new User({ ...props }, id)
//     return user
//   }

//   get name(): string {
//     return this.props.name
//   }

//   set name(value: string) {
//     this.props.name = value
//   }

//   get email(): string {
//     return this.props.email
//   }

//   set email(value: string) {
//     this.props.email = value
//   }

//   get username(): string | undefined {
//     return this.props.username
//   }

//   set username(value: string | undefined) {
//     this.props.username = value
//   }
// }

// const user = User.create({ email: 'email', name: 'name' })


