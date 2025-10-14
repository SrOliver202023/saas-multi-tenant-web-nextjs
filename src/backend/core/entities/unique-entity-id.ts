import { Uuid } from "./uuid"

type IUniqueEntityId = string | number

export class UniqueEntityID {
  private _id: IUniqueEntityId

  constructor(value?: IUniqueEntityId) {
    this._id = value ?? Uuid.generate()
  }

  toString(): string {
    return this._id?.toString()
  }

  toValue() {
    return this._id
  }
}