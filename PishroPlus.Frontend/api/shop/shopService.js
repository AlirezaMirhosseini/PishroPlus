import axiosClient from '../../plugins/axiosClient'

export default class Shop {
  /**
   *Setting setSettings
   * @param {{ "entity": { "items": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static getData() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/shop/get-data')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting saveShopSettings
   * @param {{ "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "title": "string", "domains": [ "string" ], "aboutContext": "string", "contactContext": "string", "isActive": true, "trustSignature": "string", "features": [ "string" ], "privacyTermsContext": "string", "conditionsContext": "string", "logo": { "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "type": 0, "name": "string", "displayName": "string", "data": "string", "fullPath": "string", "extension": "strin", "size": 0, "action": 0 } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static saveShopSettings(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/shop', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting getBanners
   * @param {Number} page
   * @param {Number} size
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": { "result": [ { "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "name": "string", "data": "string", "size": 0, "title": "string", "descriptions": "string", "link": "string", "order": 0, "startDate": "2025-05-17T07:20:44.759Z", "endDate": "2025-05-17T07:20:44.759Z" } ], "page": 0, "size": 0, "totalPages": 0, "totalCount": 0, "pagination": { "page": 0, "size": 0, "pagination": "string" } }, "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "statusCode": 0 }}
   */
  static getBanners(page, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/shop/banners', {
          params: {
            page: page || 1,
            size: size || 100
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
   *Setting createBanner
   * @param {{ "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "type": 0, "name": "string", "fullPath": "string", "extension": "strin", "size": 0, "action": 0, "displayName": "string", "data": "string", "title": "string", "descriptions": "string", "link": "string", "order": 0, "startDate": "2025-05-17T08:26:37.151Z", "endDate": "2025-05-17T08:26:37.151Z", "displayPosition": 0, "attributes": [ { "key": "string", "value": "string", "type": 0, "validation": "string", "description": "string" } ] } } request
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "statusCode": 0 }}
   */
  static createBanner(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/shop/banners', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting updateBanner
   * @param {{ "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "type": 0, "name": "string", "displayName": "string", "data": "string", "fullPath": "string", "extension": "strin", "size": 0, "action": 0, "title": "string", "descriptions": "string", "link": "string", "order": 0, "startDate": "2025-05-17T10:04:20.480Z", "endDate": "2025-05-17T10:04:20.480Z", "displayPosition": 0 }} request
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "statusCode": 0 }}
   */
  static updateBanner(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/shop/banners', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting deleteBanner
   * @param {string} id
   * @returns {{ "errors": [ { "message": "string", "type": 400 } ], "value": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "isSuccess": true, "isFailure": true, "isAlreadyExist": true, "isNotFound": true, "isInvalidInput": true, "isUnauthorized": true, "statusCode": 0 }}
   */
  static deleteBanner(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`/client/shop/banners/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
