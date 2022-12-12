import { ApiError, ApiResponse } from '@src/utils/interfaces'
import { Request, Response, Router } from 'express'
import { MakeMockDBOperations } from '../../database'
import { tryToMapRestrictions } from '../../input/restrictions'
import {
  handleDatabaseOperationError,
  mappingSuccessHandler,
  mappingErrorHandler
} from '../../input/utils/api-responses-handlers'

const getClientRestrictionsHandler = async (req: Request, res: Response, databaseOperations: MakeMockDBOperations) => {
  const { userId } = req.params
  return databaseOperations
    .getUserRestrictions(userId)
    .thenMapFailure<ApiError>(handleDatabaseOperationError)
    .thenBindAsync<ApiResponse>((foundRestrictions) => {
      return tryToMapRestrictions(foundRestrictions)
        .thenMap<ApiResponse>(mappingSuccessHandler)
        .thenMapFailure(mappingErrorHandler)
    })
    .then((r) =>
      r.either(
        (apiResponse) => {
          return res.status(apiResponse.status).send(apiResponse.payload)
        },
        (e) => {
          return res.status(e.status).send({
            type: e.type,
            code: e.code
          })
        }
      )
    )
}

export const getClientRestrictionsRoute = (router: Router, databaseOperations: MakeMockDBOperations): Router => {
  return router.get('/user/:userId/restrictions', (req, res) =>
    getClientRestrictionsHandler(req, res, databaseOperations)
  )
}
