import { Restriction } from '@src/app/domain/entities/restriction'
import { Result, ResultPromise } from '@src/utils/result'
import { validateSchema, ValidateSchemaError } from '@src/utils/schema'
import { RestrictionModel } from './interfaces'
import { restrictionValidateSchema } from './schemas'

export const tryToMapRestrictions = (
  purchaseModels: RestrictionModel[]
): ResultPromise<Restriction[], ValidateSchemaError> => {
  return ResultPromise.fromResult(
    Result.bindArray(
      purchaseModels.map((purchaseModel) =>
        validateSchema(restrictionValidateSchema, purchaseModel)
          .mapFailure((e) => e)
          .map<Restriction>((r) => ({
            type: r.tipo,
            message: r.mensaje
          }))
      )
    )
  )
}
