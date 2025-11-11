import axiosClient from '../../plugins/axiosClient'

export default class Account {
  /**
   * Account Create
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
   * Account Update
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
   * Account Delete
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
   * Account Transfer
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
   * Account Copy
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
   * Account Search
   * @param {{ accountType: number, accountFamily: number, leafAccounts: boolean, text: string, id: string }} params
   * @returns {{ value: Array<{ id: string, parentId: string, code: string, name: string, hierarchicalCode: string, hierarchicalName: string, maximumChildCodeLength: number, children: Array<string> }>, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static search(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/accounts/', {
          params: {
            accountType: params.accountType,
            accountFamily: params.accountFamily,
            leafAccounts: params.leafAccounts || null,
            text: params.text || ''
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
   * Account AdvancedSearch
   * @param {{ "entity": { "searchType": 0, "detailedAccountId": "guid", "accountId": "guid" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "accountId": "guid", "detailedAccountId": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static advancedSearch(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/accounts/list', {
          params: {
            page: params.page || 1,
            size: params.size || 100,
            accountType: params.accountType ?? 0,
            accountFamily: params.accountFamily ?? null,
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
   * Account GetSettings
   * @param {string} name
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": 0, "name": "string", "value": "string" } ] }}
   */
  static getSettings(name) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/account/getSettings', { params: { name } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Account getAccountGroups
   * @param {string} name
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": 0, "name": "string", "value": "string" } ] }}
   */
  static getAccountGroups(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/groups', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Account getAccountGroupById
   * @param {string} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": 0, "name": "string", "value": "string" } ] }}
   */
  static getAccountGroupById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/accounting/groups/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Account GetById
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
   * Account GetDetailedAccounts
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "code": "string", "fCode": "string", "name": "string", "fName": "string", "isActive": true, "isBanned": true, "openingDateTime": "2023-09-17T06:12:30.496Z", "type": 0, "separator": "string", "subLevelAccountCodeCount": 0, "children": [ "string" ] } ] }}
   */
  // static getDetailedAccounts(id) {
  //   return new Promise((resolve, reject) => {
  //     axiosClient
  //       .get('/accounting/accounts/detailedAccounts', { params: { id } })
  //       .then((res) => {
  //         resolve(res.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  /**
   * Account GetAll
   * @param {{ accountType: number, accountFamily: number, leafAccounts: boolean, text: string, id: string }} params
   * @returns {{ value: Array<{ id: string, parentId: string, code: string, name: string, hierarchicalCode: string, hierarchicalName: string, maximumChildCodeLength: number, children: Array<string> }>, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static getAll(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/accounts', {
          params: {
            page: params.page || 1,
            size: params.size || 100,
            accountType: params.accountType,
            accountFamily: params.accountFamily,
            leafAccounts: params.leafAccounts,
            text: params.text || '',
            id: params.id || null
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
