export class InvalidParseCacheError extends Error {
  constructor() {
    super("Error parsing cache data");
  }
}
