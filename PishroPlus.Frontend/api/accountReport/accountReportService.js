import axiosClient from '../../plugins/axiosClient'

export default class AccountReport {
  /**
   *AccountReport GetAccountsReviewJournal
   * @param {{ "entity": { "accountId": "guid", "detailedAccountId": "guid", "filterAccountLevel": 0, "filter": { "fromDate": "2023-09-17T07:51:31.446Z", "toDate": "2023-09-17T07:51:31.446Z", "voucherType": 0, "rules": [ { "fieldName": "string", "value": "string", "rule": 0, "ruleComparerType": 0 } ] } } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "items": [ { "id": "guid", "code": "string", "name": "string", "debtAmount": 0, "creditAmount": 0, "sum": 0, "type": 0 } ], "creditAmount": 0, "debtAmount": 0, "sum": 0, "type": 0 } }}
   */
  static getAccountsReviewJournal(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/accountReport/getAccountsReviewJournal', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *AccountReport GetDetailedAccountsReviewJournal
   * @param {{ "entity": { "detailedAccountId": "guid", "accountId": "guid", "applyFiltersOnVouchers": true, "filter": { "fromDate": "2023-09-26T09:54:37.429Z", "toDate": "2023-09-26T09:54:37.429Z", "voucherType": 0, "conditions": [ { "fieldName": "string", "value": "string", "condition": 0, "conditionOperatorType": 0 } ] } } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "items": [ { "id": "guid", "code": "string", "name": "string", "debtAmount": 0, "creditAmount": 0, "sum": 0, "type": 0 } ], "creditAmount": 0, "debtAmount": 0, "sum": 0, "type": 0 } }}
   */
  static getDetailedAccountsReviewJournal(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/accountReport/getDetailedAccountsReviewJournal', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *AccountReport GetJournal
   * @param {{ "entity": { "orderByProperty": "string", "descendingOrder": true, "fromDate": "2023-09-26T05:07:33.576Z", "toDate": "2023-09-26T05:07:33.576Z", "fromVoucherCode": "string", "toVoucherCode": "string", "voucherFromDate": "2023-09-26T05:07:33.576Z", "voucherToDate": "2023-09-26T05:07:33.576Z" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "voucherId": "guid", "accountId": "guid", "accountName": "string", "accountCode": "string", "voucherCode": "string", "voucherBaseCode": "string", "debtAmount": 0, "creditAmount": 0, "date": "2023-09-26T05:07:33.580Z", "voucherDate": "2023-09-26T05:07:33.580Z" } ] }}
   */
  static getJournal(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/accountReport/getJournal', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *AccountReport SetPLComponents
   * @param {{ "entity": { "orderByProperty": "string", "descendingOrder": true, "fromDate": "2023-09-26T05:07:33.576Z", "toDate": "2023-09-26T05:07:33.576Z", "fromVoucherCode": "string", "toVoucherCode": "string", "voucherFromDate": "2023-09-26T05:07:33.576Z", "voucherToDate": "2023-09-26T05:07:33.576Z" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "voucherId": "guid", "accountId": "guid", "accountName": "string", "accountCode": "string", "voucherCode": "string", "voucherBaseCode": "string", "debtAmount": 0, "creditAmount": 0, "date": "2023-09-26T05:07:33.580Z", "voucherDate": "2023-09-26T05:07:33.580Z" } ] }}
   */
  static setPLComponents(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/accountReport/setPLComponents', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *AccountReport GetPLComponents
   * @param {{ "entity": { "orderByProperty": "string", "descendingOrder": true, "fromDate": "2023-09-26T05:07:33.576Z", "toDate": "2023-09-26T05:07:33.576Z", "fromVoucherCode": "string", "toVoucherCode": "string", "voucherFromDate": "2023-09-26T05:07:33.576Z", "voucherToDate": "2023-09-26T05:07:33.576Z" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "voucherId": "guid", "accountId": "guid", "accountName": "string", "accountCode": "string", "voucherCode": "string", "voucherBaseCode": "string", "debtAmount": 0, "creditAmount": 0, "date": "2023-09-26T05:07:33.580Z", "voucherDate": "2023-09-26T05:07:33.580Z" } ] }}
   */
  static getPLComponents() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/accountReport/getPLComponents')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *AccountReport getPLReport
   * @param {{ "entity": { "orderByProperty": "string", "descendingOrder": true, "fromDate": "2023-09-26T05:07:33.576Z", "toDate": "2023-09-26T05:07:33.576Z", "fromVoucherCode": "string", "toVoucherCode": "string", "voucherFromDate": "2023-09-26T05:07:33.576Z", "voucherToDate": "2023-09-26T05:07:33.576Z" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "voucherId": "guid", "accountId": "guid", "accountName": "string", "accountCode": "string", "voucherCode": "string", "voucherBaseCode": "string", "debtAmount": 0, "creditAmount": 0, "date": "2023-09-26T05:07:33.580Z", "voucherDate": "2023-09-26T05:07:33.580Z" } ] }}
   */
   static getPLReport() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/AccountReport/getPLReport')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
