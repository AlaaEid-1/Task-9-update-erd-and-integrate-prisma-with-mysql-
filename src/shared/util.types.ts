export enum HttpErrorStatus {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500
}

export type StringObject = Record<string, unknown>;
