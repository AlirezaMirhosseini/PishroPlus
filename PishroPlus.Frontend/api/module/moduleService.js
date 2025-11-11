import axiosClient from '../../plugins/axiosClient'

export default class Module {
  /**
   * Module Create
   * @param {{entity:{name:string}}} request
   * @returns {{isSuccess: boolean,message: string,resultType: Int16Array,errors: [string],entity: {id: guid,name: string}}}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/module/create', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Module Update
   * @param {{entity:{id:guid,name:string}}} request
   * @returns {{isSuccess: boolean,message: string,resultType: Int16Array,errors: [string],entity: {id: guid,name: string}}}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/module/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Module GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entities": [{"id": "guid","name": "string"}],"index": 0,"size": 0,"total": 0,"pageCount": 0,"start": 0,"end": 0}}
   */
  static getAll(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/module/getAll', { params: { index: index || 0, size: size || 1000 } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Module GetById
   * @param {string} id
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","name": "string"}}}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/module/getById', { params: { id: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
