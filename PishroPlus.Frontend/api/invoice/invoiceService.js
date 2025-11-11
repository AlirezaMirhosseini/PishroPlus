import axiosClient from '../../plugins/axiosClient'

export default class Invoice {
  /**
   *Invoice Create
   * @param {
   * {"entity": {"sellerAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","sellerDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","customerDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","customerAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationCost": 0,"code": "string","dateTime": "2024-04-16T07:21:24.091Z","title": "string","type": 0,"totalPrice": 0,"discount": 0,"desc": "string","otherPriceFactors": [{"title": "string","amount": 0}],"items": [{"productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","warehouseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","amount": 0,"price": 0,"unit": "string","useSubunit": true,"subunitTitle": "string","subunitConversionFactor": 0,"discount": 0,"performTaxAmount": true,"desc": "string"}]}}} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/financials/invoices', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Invoice update
   * @param {
   * {"entity": {"sellerAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","sellerDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","customerDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","customerAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationCost": 0,"code": "string","dateTime": "2024-04-16T07:21:24.091Z","title": "string","type": 0,"totalPrice": 0,"discount": 0,"desc": "string","otherPriceFactors": [{"title": "string","amount": 0}],"items": [{"productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","warehouseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","amount": 0,"price": 0,"unit": "string","useSubunit": true,"subunitTitle": "string","subunitConversionFactor": 0,"discount": 0,"performTaxAmount": true,"desc": "string"}]}}} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/financials/invoices', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Invoice update
   * @param {
   * {"entity": {"sellerAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","sellerDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","customerDetailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","customerAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationCost": 0,"code": "string","dateTime": "2024-04-16T07:21:24.091Z","title": "string","type": 0,"totalPrice": 0,"discount": 0,"desc": "string","otherPriceFactors": [{"title": "string","amount": 0}],"items": [{"productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","warehouseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","amount": 0,"price": 0,"unit": "string","useSubunit": true,"subunitTitle": "string","subunitConversionFactor": 0,"discount": 0,"performTaxAmount": true,"desc": "string"}]}}} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static refund(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/financials/invoices/refund', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Invoice GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @param {Int16Array} type
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [{"id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transportationCost": 0,"code": "string","dateTime": "2024-04-21T08:20:22.981Z","title": "string","type": 0,"totalAmount": 0,"discount": 0,"customer": {"accountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","detailedAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6","accountName": "string","detailedAccountName": "string","accountCode": "string","detailedAccountCode": "string"}} ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(
    index,
    size,
    type = null,
    searchText = null,
    includeDrafts = null,
    startDate,
    endDate
  ) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/financials/invoices', {
          params: {
            page: index || 1,
            size: size || 1000,
            type: type,
            searchText: searchText,
            includeDrafts: includeDrafts,
            startDate: startDate || null,
            endDate: endDate || null
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
   * Invoice GetById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": Object  } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/financials/invoices/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Invoice GetByCode
   * @param {guid} id
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "firstErrorTypeCode": 0 }}
   */
  static GetByCode(code) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/financials/invoices/get-id/${code}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Invoice getLatestPrices
   * @param {guid} productId
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": [{"price": 0, "dateTime": "2024-04-16T07:21:24.091Z"}]  } }}
   */
  static getLatestPrices(productId) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/invoice/GetLatestPrices', { params: { productId: productId } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Invoice ChangeDraftToInvoice
   * @param {guid} id
   *@returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static changeDraftToInvoice(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/financials/invoices/confirm/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Invoice ChangeDraftToInvoice
   * @param {guid} id
   * @param {boolean} confirm
   *@returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static changeRefundDraftToInvoice(id, confirm) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/financials/invoices/refund/${id}/${confirm}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Invoice SetSettlement
   * @param {{"entity": {"id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","transferId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}}} request
   *@returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static setSettlement(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/invoice/setSettlement', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
