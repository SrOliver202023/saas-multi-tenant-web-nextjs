import { Either } from "../either";

export abstract class HttpValidation<Payload> {
  abstract validate(payload: Payload): Either<Error, boolean>;
}
