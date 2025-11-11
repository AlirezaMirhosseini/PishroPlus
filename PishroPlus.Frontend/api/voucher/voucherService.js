import axiosClient from '../../plugins/axiosClient'

export default class Voucher {
  /** TODO: Add description
   *Voucher Create
   * @param {{ "entity": { "desc": "string", "code": "string", "referenceNumber": "string", "date": "2023-08-26T06:54:20.949Z", "isDraft": true, "items": [ { "accountId": "guid", "firstDetailedAccountId": "guid", "secondDetailedAccountId": "guid", "thirdDetailedAccountId": "guid", "desc": "string", "debtAmount": 0, "creditAmount": 0 } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "desc": "string", "code": "string", "referenceNumber": "string", "date": "2023-08-26T06:54:20.952Z", "items": [ { "accountId": "guid", "firstDetailedAccountId": "guid", "secondDetailedAccountId": "guid", "thirdDetailedAccountId": "guid", "desc": "string", "debtAmount": 0, "creditAmount": 0 } ] } }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/accounting/vouchers', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Voucher Update
   * @param {{ "entity": { "id": "guid", "desc": "string", "code": "string", "referenceNumber": "string", "date": "2023-08-26T06:56:07.671Z", "detailedAccounts": [ "guid" ], "items": [ { "id": "guid", "accountId": "guid", "firstDetailedAccountId": "guid", "secondDetailedAccountId": "guid", "thirdDetailedAccountId": "guid", "desc": "string", "debtAmount": 0, "creditAmount": 0 } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": {} }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/accounting/vouchers', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Voucher Delete
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/accounting/vouchers/${id}`)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  // static delete(id) {
  //   return new Promise((resolve, reject) => {
  //     axiosClient
  //       .post('/Voucher/delete', null, { params: { id } })
  //       .then((res) => {
  //         resolve(res.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  /**
   *Voucher MakeOperational
   * @param {{ "entity": { "voucherIds": [ "display: none !important" ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static makeOperational(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/accounting/vouchers/operational/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Voucher Confirm
   * @param {{ "entity": { "items": [ "display: none !important" ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static confirm(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/accounting/vouchers/confirm/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Voucher Finalize
   * @param {{ "entity": { "items": [ "display: none !important" ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  // static finalize(id) {
  //   return new Promise((resolve, reject) => {
  //     axiosClient
  //       .get(`/vouchers/finalize/${id}`)
  //       .then((res) => {
  //         resolve(res.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  /**
   *Voucher SearchDesc
   * @param {{ "entity": { "searchText": "string" },"searchInVoucherItems": true }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ "string" ] }}
   */
  static searchDesc(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/vouchers/search-descriptions', {
          params: {
            text: request.text,
            searchType: request.searchType,
            count: request.count
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
   * Voucher GetById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "desc": "string", "code": "string", "referenceNumber": "string", "date": "2023-08-26T06:56:37.108Z", "status": 0, "items": [ { "id": "guid", "accountId": "guid", "desc": "string", "debtAmount": 0, "creditAmount": 0 } ] } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/accounting/vouchers/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Voucher GetAll
   * @param {{ page: number, size: number }} params
   * @returns {{ value: { result: Array<{ id: string, description: string, code: string, referenceNumber: string, date: string, status: number, items: Array<{ id: string, accountId: string, description: string, debtAmount: number, creditAmount: number }> }>, page: number, size: number, totalPages: number, totalCount: number, pagination: { page: number, size: number, pagination: string } }, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
   */
  static getAll(page, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/vouchers', { 
          params: { 
            page: page || 1, 
            size: size || 10 
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


  // static getAll(index, size) {
  //   return new Promise((resolve, reject) => {
  //     axiosClient
  //       .get('/voucher/GetAll', { params: { index: index || 0, size: size || 1000 } })
  //       .then((res) => {
  //         resolve(res.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  /**
   *Voucher CreateTemplate
   * @param {{ "entity": { "title": "string", "sourceType": 0, "debtorDesc": "string", "creditorDesc": "string", "voucherDesc": "string", "commissionCreditorDesc": "string", "commissionFormula": "string", "commissionCreditorAccountId": "guid", "creditorAccountId": "guid", "debtorAccountId": "guid", "isDefault": true } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static createTemplate(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/accounting/vouchers/templates', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

    /**
   *Voucher UpdateTemplate
   * @param {{ "entity": { "title": "string", "sourceType": 0, "debtorDesc": "string", "creditorDesc": "string", "voucherDesc": "string", "commissionCreditorDesc": "string", "commissionFormula": "string", "commissionCreditorAccountId": "guid", "creditorAccountId": "guid", "debtorAccountId": "guid", "isDefault": true } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
   static updateTemplate(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/accounting/vouchers/templates', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  
  /**
   *Voucher Template Delete
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static deleteTemplate(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/accounting/vouchers/templates/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }


  /**
   *Voucher GetAllTemplates
   * @param {{ "entity": { "sourceTypes": [ 0 ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "title": "string", "sourceType": 0, "debtorDesc": "string", "creditorDesc": "string", "voucherDesc": "string", "commissionCreditorDesc": "string", "commissionFormula": "string", "commissionCreditorAccountId": "guid", "creditorAccountId": "guid", "debtorAccountId": "guid", "isDefault": true } ] }}
   */
  static getAllTemplates(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/accounting/vouchers/templates', { params })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
