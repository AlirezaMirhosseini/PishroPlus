import axiosClient from '../../plugins/axiosClient'

export default class receipt {
  /**
   * receipt GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": {"warehouseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","deliveryDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","invoiceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","destinationWarehouseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","type": 0,"dateTime": "2024-06-01T09:04:23.006Z","code": "string","desc": "string","carrier": "string","items": [  { "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","desc": "string","amount": 0, "unit": "string","subunit": "string","conversionFactor": 0, "useSubunit": true,"price": 0,"totalPrice": 0} ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}}
   */
  static getAll(index, size, remittanceOrReceipt, byUpdateDate, descending) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/warehouses/receipts', {
          params: {
            page: index || 0,
            size: size || 1000,
            type: remittanceOrReceipt,
            byUpdateDate: byUpdateDate,
            descending: descending
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
   * receipt GetById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "firstName": "string", "lastName": "string", "phoneNumber": "string", "nationalCode": "string", "jobPositions": [ { "id": "guid", "name": "string", "parentId": "guid" } ] } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/warehouses/receipts/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   *receipt Create
   * @param {{"entity": {"name": "string","parentId": "guid"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","name": "string","routeId": 0,"parentId": "guid"}}}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/warehouses/receipts', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * receipt Update
   * @param {{"entity": {"id": "guid","parentId": "guid","name": "string"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","name": "string","parentId": "guid"}} }
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/warehouses/receipts', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
