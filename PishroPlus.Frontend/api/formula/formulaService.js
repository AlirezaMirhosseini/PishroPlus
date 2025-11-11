import axiosClient from '../../plugins/axiosClient'

export default class FormulaService {
  /**
   *Formula Create
   * @param {{ "name": "string", "formula": "string" }} request
   * @returns {{ "value": "string", "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "errors": [ { "message": "string", "type": 400 } ] }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/reports/formulas', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Formula Update
   * @param {{ "id": 0, "name": "string", "formula": "string" }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": {} }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/reports/formulas', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Formula Delete
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/reports/formulas/${id}`)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Formula getById
   * @param {guid} id
   * @returns {{ "value": { "id": 0, "name": "string", "formula": "string" }, "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "errors": [ { "message": "string", "type": 400 } ] }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/reports/formulas/${id}`)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Formula GetAll
   * @param {number} size
   * @param {number} page
   * @returns {{ "value": { "result": [ { "id": 0, "name": "string", "formula": "string" } ], "page": 0, "size": 0, "totalPages": 0, "totalCount": 0, "pagination": { "page": 0, "size": 0, "pagination": "string" } }, "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "errors": [ { "message": "string", "type": 400 } ] }}
   */
  static getAll(page, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/reports/formulas', { page: page || 1, size: size || 300 })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
