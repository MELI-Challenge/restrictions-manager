import joi from '@hapi/joi'
import { RestrictionModel } from './interfaces'

export const restrictionValidateSchema = joi.object<RestrictionModel>({
  tipo: joi.string().required(),
  mensaje: joi.string().required()
})
