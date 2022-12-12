import MockUtils from '@src/app/infrastructure/database/mocks'
import { Router } from 'express'
import { makeMockDBOperations } from '../database'
import { getClientRestrictionsRoute } from './restrictions'

export const routes = (router: Router, mockClient: MockUtils) => {
  const databaseOperations = makeMockDBOperations(mockClient)
  return [getClientRestrictionsRoute(router, databaseOperations)]
}
