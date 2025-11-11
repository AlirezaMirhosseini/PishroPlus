import axiosClient from '../../plugins/axiosClient'

export default class Help {
  /**
   *Help Add
   * @param {{ "entity": { "title": "string", "content": "string", "route": "string", "target": "string", "order": 0, "video": "string" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "title": "string", "content": "string" } }}
   */
  static add(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/help/add', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Help Remove
   * @param {{ "id": "guid" }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static remove(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/help/remove', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * help GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "title": "string", "content": "string", "route": "string", "target": "string", "order": 0, "video": { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true } } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/help/getAll', { params: { index: index || 0, size: size || 1000 } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * help GetByRoute
   * @param {string} route
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "title": "string", "content": "string", "route": "string", "target": "string", "order": 0, "video": { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true } } ] }}
   */
  static getByRoute(route) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/help/getByRoute', { params: { route: route } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * help GetById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "title": "string", "content": "string", "route": "string", "target": "string", "order": 0, "video": { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true } } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/help/getById', { params: { id: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *help Update
   * @param {{ "entity": { "id": "guid", "title": "string", "content": "string", "route": "string", "target": "string", "order": 0, "video": "string" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "title": "string", "content": "string" } }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/help/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
