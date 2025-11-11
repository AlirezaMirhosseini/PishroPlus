import axiosClient from '../../plugins/axiosClient'

export default class CustomerService {
  /**
   * CustomerService getList
   * @param {{ "entity": { "leafAccounts": boolean, "text": String, "id": String } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getList(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/customers/list', {
          params: {
            page: params.page || 1,
            size: params.size || 100,
            leafAccounts:
              params.leafAccounts === true ? true : params.leafAccounts === false ? false : null,
            text: params.text || '',
            id: params.id ?? null
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
   * CustomerService getById
   * @param {{ "id": String }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/accounting/customers/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
