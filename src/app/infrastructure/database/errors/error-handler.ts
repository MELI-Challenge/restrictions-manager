import { DatabaseOperationError } from './interfaces'

export const databaseOperationErrorHandler = {
  onUserRestrictionsNotFound: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] UserRestrictionsNotFound')
    return {
      type: 'InfrastructureFailure',
      code: 'UserRestrictionsNotFound'
    }
  },
  onGetUserRestrictionsError: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] GetUserRestrictionsError')
    return {
      type: 'InfrastructureFailure',
      code: 'GetUserRestrictionsError'
    }
  }
}
