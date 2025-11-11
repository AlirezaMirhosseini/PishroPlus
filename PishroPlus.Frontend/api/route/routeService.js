import axiosClient from '../../plugins/axiosClient'

export default class Route {
  /**
   *Route AddModule
   * @param {{"entity": {"moduleId": "guid","routeId": 0}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static addModule(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/route/addModule', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Route AddPermission
   * @param {{"entity": {"permissionId": "guid","routeId": 0}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static addPermission(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/route/addPermission', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Route RemovePermission
   * @param {{"entity": {"permissionId": "guid","routeId": 0}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static removePermission(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/route/removePermission', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Route RemoveModule
   * @param {{"entity": {"moduleId": "guid","routeId": 0}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static removeModule(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/route/removeModule', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Route GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entities": [{"id": 0,"controller": "string","action": "string","permissions": [{"id": "guid","name": "string"}],"modules": [{"id": "guid","name": "string"}]}],"index": 0,"size": 0,"total": 0,"pageCount": 0,"start": 0,"end": 0}}
   */
  static getAll(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/Route/getAll', { params: { index: index || 0, size: size || 1000 } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
