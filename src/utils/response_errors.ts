import { HttpStatusCode } from './httpStatusCodes'

export enum ErrorsResponseCodes {
  ValidateSchemaError = HttpStatusCode.BadRequest,
  GetUserRestrictionsError = HttpStatusCode.InternalServerError,
  UserRestrictionsNotFound = HttpStatusCode.NotFound,
  Unknown = HttpStatusCode.InternalServerError
}

type ErrorCodes = 'ValidateSchemaError' | 'GetUserRestrictionsError' | 'UserRestrictionsNotFound' | 'Unknown'

export const getErrorStatusCode = (code: ErrorCodes) => {
  return ErrorsResponseCodes[code as keyof typeof ErrorsResponseCodes]
}
