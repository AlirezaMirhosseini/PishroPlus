import axiosClient from '../../plugins/axiosClient'

export default class services {
  /**
   * Person GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "firstName": "string", "lastName": "string", "phoneNumber": "string", "nationalCode": "string", "jobPositions": [ { "id": "guid", "name": "string", "parentId": "guid" } ] } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/person/getAll', { params: { index: index || 0, size: size || 1000 } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Person GetById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "firstName": "string", "lastName": "string", "phoneNumber": "string", "nationalCode": "string", "jobPositions": [ { "id": "guid", "name": "string", "parentId": "guid" } ] } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/services/getById', { params: {personId: id  } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   *Permission Create
   * @param {{"entity": {"name": "string","parentId": "guid"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","name": "string","routeId": 0,"parentId": "guid"}}}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/remittanceOrReceipt/create', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Permission Update
   * @param {{"entity": {"id": "guid","parentId": "guid","name": "string"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","name": "string","parentId": "guid"}} }
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/remittanceOrReceipt/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
