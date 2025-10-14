import { IPaginationParams } from "./pagination-params"

export type ISort<Fields> = {
  orderBy: keyof Fields
  order: "asc" | "desc"
}

export interface IFilterParams<Fields> {
  filters?: Partial<Fields>
  pagination: IPaginationParams
  sort?: ISort<Fields>[]
}
