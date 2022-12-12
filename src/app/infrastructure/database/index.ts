import { Failure, Result, ResultPromise, Success } from '@src/utils/result'
import { get, isEmpty } from 'lodash'
import { RestrictionModel } from '../input/restrictions/interfaces'
import { databaseOperationErrorHandler } from './errors/error-handler'
import { DatabaseOperationError } from './errors/interfaces'
import MockUtils from './mocks'

export interface MakeMockDBOperations {
  getUserRestrictions: (userId: string) => ResultPromise<RestrictionModel[], DatabaseOperationError>
}

export const loadMockDBClient = (): Result<MockUtils, unknown> => {
  const mockUtils = new MockUtils()
  return Success(mockUtils)
}

const handleDatabaseSuccess = <T>(r: any, notFoundHandler: () => DatabaseOperationError) => {
  return isEmpty(r) ? Failure<T, DatabaseOperationError>(notFoundHandler()) : Success<T, DatabaseOperationError>(r)
}

const handleDatabaseError = <T>(
  e: any,
  notFoundHandler: () => DatabaseOperationError,
  errorHandler: () => DatabaseOperationError
) => {
  const status = get(e, 'status')
  const error = status === 404 ? notFoundHandler() : errorHandler()
  return Failure<T, DatabaseOperationError>(error)
}

export const makeMockDBOperations = (mockUtils: MockUtils): MakeMockDBOperations => {
  const getUserRestrictions = (userId: string): ResultPromise<RestrictionModel[], DatabaseOperationError> => {
    return ResultPromise.fromPromise<RestrictionModel[], DatabaseOperationError>(
      Promise.resolve(
        mockUtils
          .getUserRestrictions(userId)
          .then((r) =>
            handleDatabaseSuccess<RestrictionModel[]>(r, databaseOperationErrorHandler.onUserRestrictionsNotFound)
          )
          .catch((e) =>
            handleDatabaseError<RestrictionModel[]>(
              e,
              databaseOperationErrorHandler.onUserRestrictionsNotFound,
              databaseOperationErrorHandler.onGetUserRestrictionsError
            )
          )
      )
    )
  }

  return {
    getUserRestrictions
  }
}
