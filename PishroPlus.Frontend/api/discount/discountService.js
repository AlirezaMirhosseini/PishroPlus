import axiosClient from '../../plugins/axiosClient'

export default class DiscountService {
  /**
   * DiscountService getAll
   * @param {{ "entity": { "leafAccounts": boolean, "text": String, "id": String } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/discounts', {
          params: {
            page: params.page || 1,
            size: params.size || 100,
          }
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   * DiscountService create
   * @param {{ "entity": { "leafAccounts": boolean, "text": String, "id": String } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/discounts', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   * DiscountService getById
   * @param {{ "id": String }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/discounts/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   * DiscountService update
   * @param {{ "entity": { "leafAccounts": boolean, "text": String, "id": String } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/discounts', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   * DiscountService delete
   * @param {{ "id": String }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/discounts/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
