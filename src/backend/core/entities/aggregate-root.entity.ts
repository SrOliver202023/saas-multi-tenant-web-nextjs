import { Entity } from "./entity";

export abstract class AggregateRoot<Props extends Record<string, unknown>> extends Entity<Props> {}
