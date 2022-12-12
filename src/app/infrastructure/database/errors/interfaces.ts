type BaseError<TCode extends string> = {
  readonly type: 'InfrastructureFailure'
  readonly code: TCode
  readonly message?: string
}

type GetUserRestrictionsError = BaseError<'GetUserRestrictionsError'>
type UserRestrictionsNotFound = BaseError<'UserRestrictionsNotFound'>

export type DatabaseOperationError = GetUserRestrictionsError | UserRestrictionsNotFound
