import { v7 } from "uuid"

export class Uuid {
  static generate() {
    return v7()
  }
}
