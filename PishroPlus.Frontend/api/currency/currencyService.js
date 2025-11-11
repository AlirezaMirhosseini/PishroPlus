import axiosClient from '../../plugins/axiosClient'
export default class currencyService {
  /**
   *currencyService Create
   * @param {{ "code": "string", "name": "string", "setDefault": true }} request
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "firstErrorTypeCode": 0 }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/financials/currencies', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   *currencyService Update
   * @param {{ "code": "string", "name": "string", "setDefault": true, "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "action": 0 }} request
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "firstErrorTypeCode": 0 }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/financials/currencies', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * currencyService GetById
   * @param {guid} id
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": { "code": "string", "name": "string", "setDefault": true, "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "action": 0 }, "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "firstErrorTypeCode": 0 }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/financials/currencies/${id}`, { params: { id: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * currencyService SetDefault
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "firstName": "string", "lastName": "string", "phoneNumber": "string", "nationalCode": "string", "jobPositions": [ { "id": "guid", "name": "string", "parentId": "guid" } ] } }}
   */
  static setDefault(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post(`/client/financials/currencies/default/${id}`, null, { params: { id: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *currencyService Delete
   * @param {guid} id
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "firstErrorTypeCode": 0 }}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/financials/currencies/${id}`, { id: id })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * currencyService GetAll
   * @param {Int16Array} page
   * @param {Int16Array} size
   * @param {Int16Array} text
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": { "result": [ { "code": "string", "name": "string", "setDefault": true, "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "action": 0 } ], "page": 0, "size": 0, "totalPages": 0, "totalCount": 0, "pagination": { "page": 0, "size": 0, "pagination": "string" } }, "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "firstErrorTypeCode": 0 }}
   */
  static getAll(page, size, text) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/financials/currencies', {
          params: { text: text, page: page || 1, size: size || 1000 }
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
