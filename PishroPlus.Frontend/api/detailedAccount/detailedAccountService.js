import axiosClient from '../../plugins/axiosClient'

export default class DetailedAccount {
  /**
   * DetailedAccount Create
   * @param {{ code: string, name: string, nature: number, type: number, family: number, separator: string, maximumCredit: number, maximumDebit: number, debitAmount: number, creditAmount: number, isActive: boolean, isBanned: boolean, description: string, maximumChildCodeLength: number, parentId: string, children: Array<{ code: string, name: string, hierarchicalCodes: string, hierarchicalNames: string, type: number, id: string, action: number }> }} request
   * @returns {{ value: string, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/accounting/accounts', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * DetailedAccount Update
   * @param {{ id: string, userProfileId: string, parentId: string, code: string, name: string, type: number, separator: string, isActive: boolean, isBanned: boolean, maximumChildCodeLength: number, family: number, hasVoucher: boolean, hierarchyCodes: string, hierarchyNames: string, establishDateTime: string, nature: number, level: number, maximumCredit: number, maximumDebit: number, debitAmount: number, creditAmount: number, children: Array<{ code: string, name: string, hierarchicalCodes: string, hierarchicalNames: string, type: number, id: string, action: number }>, description: string }} request
   * @returns {{ isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/accounting/accounts', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * DetailedAccount Delete
   * @param {string} id - Account ID to delete
   * @returns {void} Returns 204 on success
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/accounting/accounts/${id}`)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * DetailedAccount Transfer
   * @param {{ id: string, newParentId: string, generateNewCode: boolean }} request
   * @returns {{ isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static transfer(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/accounting/accounts/change-parent', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * DetailedAccount Copy
   * @param {{ "entity": { "id": "guid", "newName": "string", "newCode": "string", "generateNewCode": true, "destAccountId": "guid" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static copy(id, request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post(`/client/accounting/accounts/duplicate/${id}`, request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * DetailedAccount Search
   * @param {{ accountType: number, accountFamily: number, leafAccounts: boolean, text: string, id: string }} params
   * @returns {{ value: Array<{ id: string, parentId: string, code: string, name: string, hierarchicalCode: string, hierarchicalName: string, maximumChildCodeLength: number, children: Array<string> }>, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static search(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/accounts/', { params })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * DetailedAccount GetById
   * @param {string} id
   * @returns {{ value: { id: string, userProfileId: string, parentId: string, code: string, name: string, type: number, separator: string, isActive: boolean, isBanned: boolean, maximumChildCodeLength: number, family: number, hasVoucher: boolean, hierarchyCodes: string, hierarchyNames: string, establishDateTime: string, nature: number, level: number, maximumCredit: number, maximumDebit: number, debitAmount: number, creditAmount: number, children: Array<{ code: string, name: string, hierarchicalCodes: string, hierarchicalNames: string, type: number, id: string, action: number }>, description: string }, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/accounting/accounts/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * DetailedAccount GetAll
   * @param {{ accountType: number, accountFamily: number, leafAccounts: boolean, text: string, id: string }} params
   * @returns {{ value: Array<{ id: string, parentId: string, code: string, name: string, hierarchicalCode: string, hierarchicalName: string, maximumChildCodeLength: number, children: Array<string> }>, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static getAll(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/accounts', {
          params: {
            accountType: 3,
            accountFamily: params?.accountFamily ?? null,
            leafAccounts: params?.leafAccounts ?? null,
            page: params?.page || 1,
            size: params?.size || 1000
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
   * DetailedAccount GetByFamily
   * @param {Int16Array} family
   * @param {Boolean} onlyParents
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "openingDateTime": "2023-08-12T07:37:05.006Z", "type": 0, "separator": "string", "maximumCredit": 0, "maximumDebt": 0, "debtAmount": 0, "creditAmount": 0, "isActive": true, "isBanned": true, "subLevelAccountCodeCount": 0, "children": [ "string" ] } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getByFamily(family, onlyParents) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/accounts/list', {
          params: {
            accountFamily: family,
            leafAccounts: onlyParents ? false : true
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
}
