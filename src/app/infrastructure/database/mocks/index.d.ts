import { RestrictionModel } from '../../input/restrictions/interfaces'

export default class MockUtils {
  private _readJSON(
    jsonFile: Record<string, any>,
    parameter: string | null,
    timeout: number,
    notFoundErrorMessage: string
  ): Promise<any>
  getUserRestrictions(userId: string): Promise<RestrictionModel[]>
}
