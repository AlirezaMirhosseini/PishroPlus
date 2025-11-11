import axiosClient from '../../plugins/axiosClient'

export default class Company {
  /**
   *Company Register
   * @param {{"entity": {"name": "string"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","name": "string","code": "string"}}}
   */
  static register(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/company/register', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Company AddModule
   * @param {{"entity": {"companyId": "guid","moduleId": "guid"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static addModule(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/company/addModule', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Company AddModule
   * @param {{"entity": {"companyId": "guid","moduleId": "guid"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static addModule(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/company/addModule', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Company RemoveModule
   * @param {{"entity": {"companyId": "guid","moduleId": "guid"}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static removeModule(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/company/removeModule', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Company GetModules
   * @param {guid} companyId
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entities": [{"moduleId": "guid","moduleName": "string"}],"index": 0,"size": 0,"total": 0,"pageCount": 0,"start": 0,"end": 0}}
   */
  static getModules(companyId, index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/company/getModules', {
          params: { companyId, index: index || 0, size: size || 1000 }
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
   * Company GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entities": [{"id": "guid","name": "string","code": "string"}],"index": 0,"size": 0,"total": 0,"pageCount": 0,"start": 0,"end": 0}}
   */
  static getAll(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/company/getAll', {
          params: { index: index || 0, size: size || 1000 }
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
   *Company Update
   * @param {{ "entity": { "id": Guid, "code": "string", "title": "string", "keeperFullName": "string", "tel": "string", "address": "string", "postalCode": "string", "desc": "string", "isDefault": true, "isActive": true, "accountId": Guid } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/company/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   * Company GetById
   * @param {Guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": Guid, "code": "string", "title": "string", "keeperFullName": "string", "tel": "string", "address": "string", "postalCode": "string", "isDefault": true, "isActive": true, "accountId": Guid } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/Company/getById', { params: { id: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
