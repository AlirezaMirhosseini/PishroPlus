import axiosClient from '../../plugins/axiosClient'

export default class FinancialPeriod {
  /**
   *FinancialPeriod Create
   * @param {{ "entity": { "title": "string", "startDateTime": "2023-07-17T10:58:49.549Z", "desc": "string" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "title": "string", "startDateTime": "2023-07-17T10:58:49.552Z" } }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/FinancialPeriod/create', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *FinancialPeriod Delete
   * @param {{ "id": "guid" }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static delete(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/FinancialPeriod/delete', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * FinancialPeriod GetAll
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "title": "string", "startDateTime": "2023-07-17T11:02:05.966Z" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/FinancialPeriod/getAll')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *FinancialPeriod Update
   * @param {{ "entity": { "id": "guid", "title": "string", "startDateTime": "2023-07-17T11:00:59.481Z" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "title": "string", "startDateTime": "2023-07-17T11:00:59.483Z" } }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/FinancialPeriod/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
