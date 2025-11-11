import axiosClient from '../../plugins/axiosClient'

export default class Warehouse {
  /**
   *Warehouse Create
   * @param {{ "entity": { "code": "string", "title": "string", "keeperFullName": "string", "tel": "string", "address": "string", "postalCode": "string", "desc": "string", "isDefault": true, "isActive": true, "accountId": Guid } }} request
   * @returns {{ "value": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "isSuccess": true, "isFailure": true, "isNotFound": true, "isInvalidInput": true, "errors": [ { "message": "string", "type": 400 } ] }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/warehouses', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Warehouse Delete
   * @param {{ "id": Guid }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static delete(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/warehouses/${request.id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Warehouse Update
   * @param {{ "entity": { "id": Guid, "code": "string", "title": "string", "keeperFullName": "string", "tel": "string", "address": "string", "postalCode": "string", "desc": "string", "isDefault": true, "isActive": true, "accountId": Guid } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/warehouses', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Warehouse GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": Guid, "code": "string", "title": "string", "keeperFullName": "string", "tel": "string", "address": "string", "postalCode": "string", "isDefault": true, "isActive": true } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(index, size, searchText = null) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/warehouses', {
          params: { page: index || 0, size: size || 1000, searchText: searchText }
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
   * Warehouse GetById
   * @param {Guid} id
   * @returns {{ "value": { "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "code": "string", "description": "string", "title": "string", "keeperFullName": "string", "telephone": "string", "address": "string", "postalCode": "string", "isDefault": true, "isActive": true, "accountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "accountName": "string" }, "isSuccess": true, "isFailure": true, "isNotFound": true, "isInvalidInput": true, "errors": [ { "message": "string", "type": 400 } ] }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/warehouses/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * @param {{ "warehouseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "productIds": [ "3fa85f64-5717-4562-b3fc-2c963f66afa6" ] }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static productLink(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/warehouses/products', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * @param {Guid} warehouseId
   * @return {"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"productIds": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]}}
   */
  static getLinkedProducts(warehouseId) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/warehouse/getLinkedProducts', { params: { warehouseId: warehouseId } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
