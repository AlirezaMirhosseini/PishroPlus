import axiosClient from '../../plugins/axiosClient'

export default class Report {
  static getProcedures() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/reports/procedures')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * receipt GetAll
   * @param {{ "schema": "string", "procedureName": "string", "parameters": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } }} request
   * @returns {{ "value": { "result": [ { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } ], "metaData": [ { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } ] }, "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "errors": [ { "message": "string", "type": 400 } ] }}
   */
  static execute(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/reports/procedures/execute', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
