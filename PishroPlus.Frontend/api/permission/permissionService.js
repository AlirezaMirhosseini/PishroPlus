import axiosClient from '../../plugins/axiosClient'

export default class Permission {
  /**
   *Permission Create
   * @param {{"entity": {"name": "string","parentId": "guid"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","name": "string","routeId": 0,"parentId": "guid"}}}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/permission/create', request)
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
        .post('/permission/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Permission GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entities": [{"id": "guid","name": "string","parentId": "guid"}],"index": 0,"size": 0,"total": 0,"pageCount": 0,"start": 0,"end": 0}}
   */
  static getAll(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/permission/getAll', { params: { index: index || 0, size: size || 1000 } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
