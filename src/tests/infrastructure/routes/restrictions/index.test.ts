import { loadApp } from '@src/app'
import express from 'express'
import supertest from 'supertest'
import { mock } from 'jest-mock-extended'
import MockUtils from '@src/app/infrastructure/database/mocks'
import { RestrictionModel } from '@src/app/infrastructure/input/restrictions/interfaces'
import { Restriction } from '@src/app/domain/entities/restriction'
import { cloneDeep, set } from 'lodash'
import { HttpStatusCode } from '@src/utils/httpStatusCodes'

const dummyRestrictionsModel: RestrictionModel[] = [
  {
    tipo: 'warning',
    mensaje: 'Tu cuenta no ha sido verificada aún. Revisa tu mail'
  }
]
const dummyRestrictionsDomain: Restriction[] = [
  {
    type: 'warning',
    message: 'Tu cuenta no ha sido verificada aún. Revisa tu mail'
  }
]

const setAPIRoute = (userId: string) => `/api/v1/user/${userId}/restrictions`

describe('Client route', () => {
  const app = express()
  const router = express.Router()
  const mockClient = mock<MockUtils>()
  const server = loadApp(app, router, mockClient)

  beforeEach(() => {})

  afterEach(() => {})
  it('Should return payment data and status 200', async () => {
    const apiRoute = setAPIRoute('1')
    mockClient.getUserRestrictions.mockImplementation(() => Promise.resolve(dummyRestrictionsModel))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(dummyRestrictionsDomain)
      })
  })
  it('Should return an error and 404 if no payment found', async () => {
    const apiRoute = setAPIRoute('1')
    mockClient.getUserRestrictions.mockImplementation(() => Promise.resolve({} as any))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(404)
      .then((response) => {
        expect(response.body.code).toBe('UserRestrictionsNotFound')
      })
  })
  it('Should return an error and 500 if error is thrown and no status is set', async () => {
    const apiRoute = setAPIRoute('1')
    let error = new Error()
    mockClient.getUserRestrictions.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(500)
      .then((response) => {
        expect(response.body.code).toBe('GetUserRestrictionsError')
      })
  })

  it('Should return an error and 500 if schema validation fails', async () => {
    const apiRoute = setAPIRoute('1')
    const dummyShipmentBadFormat = cloneDeep(dummyRestrictionsModel)
    dummyShipmentBadFormat[0].mensaje = undefined as any
    mockClient.getUserRestrictions.mockImplementation(() => Promise.resolve(dummyShipmentBadFormat))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.BadRequest)
      .then((response) => {
        expect(response.body.code).toBe('ValidateSchemaError')
      })
  })

  it('Should return the error code if not found', async () => {
    const apiRoute = setAPIRoute('1')
    let error = new Error('Not found')
    set(error, 'status', 404)
    mockClient.getUserRestrictions.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.NotFound)
      .then((response) => {
        expect(response.body.code).toBe('UserRestrictionsNotFound')
      })
  })
})
