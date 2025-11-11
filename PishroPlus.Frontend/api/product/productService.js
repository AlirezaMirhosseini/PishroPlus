import axiosClient from '../../plugins/axiosClient'

export default class Product {
  /**
   *Product Create
   * @param {{ "parentDetailedAccountId": Guid, "description": "string", "images": [ { "name": "string", "displayName": "string", "data": "string", "extension": "string", "type": 0, "size": 0 } ], "features": [ "string" ], "title": "string", "code": "string", "salesTax": 0, "purchaseTax": 0, "minOrder": 0, "reorderPoint": 0, "salesPrice": 0, "purchasePrice": 0, "lowAmountAlert": true, "status": 0, "type": 0, "onlineShopPosition": 0, "stocks": [ { "amount": 0, "balance": 0, "productId": Guid, "warehouseId": Guid, "dateTime": "2024-12-29T07:29:13.496Z" } ], "prices": [ { "title": "string", "productId": Guid, "price": 0, "dateTime": "2024-12-29T07:29:13.496Z", "type": 0 } ], "units": [ { "barcode": "string", "title": "string", "conversionFactor": 0, "isDefault": true } ] }} request
   * @returns {{ "value": Guid, "isSuccess": boolean, "isFailure": boolean, "isNotFound": boolean, "isInvalidInput": boolean, "errors": [ { "message": "string", "type": number } ] }}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/Products', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Product Delete
   * @param {{ "productId": Guid }} request
   * @returns {{ "value": Guid, "isSuccess": boolean, "isFailure": boolean, "isNotFound": boolean, "isInvalidInput": boolean, "errors": [ { "message": "string", "type": number } ] }}
   */
  static delete(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .delete(`Products/${request.id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Product Update
   * @param {{ "parentDetailedAccountId": Guid, "description": "string", "imageBase64": "string", "title": "string", "code": "string", "salesTax": 0, "purchaseTax": 0, "minOrder": 0, "reorderPoint": 0, "salesPrice": 0, "purchasePrice": 0, "lowAmountAlert": true, "status": 0, "type": 0, "onlineShopPosition": 0, "id": Guid }} request
   * @returns {{  }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/Products', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Product Change Status
   * @param {{ "ids": [ "3fa85f64-5717-4562-b3fc-2c963f66afa6" ], "status": 0 }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static changeStatus(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .patch('/client/products/status', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Product Search
   * @param {{"entity": {"code": "string","barcode": "string","title": "string", "favoriteListId": Guid}}} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": Guid, "categoryId": Guid, "categoryTitle": "string", "desc": "string", "imageUrl": "string", "title": "string", "code": "string", "salesTax": 0, "purchaseTax": 0, "salesPrice": 0, "purchasePrice": 0, "status": 0, "type": 0 } ]}}
   */
  static search(params) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/Products', { params })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Product addToFavoriteList
   * @param {{"entity": {"id": Guid,"listTitle": "string","productIds": [ Guid ]}}} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static addOrUpdateFavoriteList(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/product/AddOrUpdateFavoriteList', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Product deleteFavoriteList
   * @param {{"entity": {"id": Guid}}} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static deleteFavoriteList(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/product/DeleteFavoriteList', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Product GetAll
   * @param {Int16Array} type
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @param {Int16Array} parentDetailedAccountId
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": Guid, "categoryId": Guid, "categoryTitle": "string", "desc": "string", "imageUrl": "string", "title": "string", "code": "string", "salesTax": 0, "purchaseTax": 0, "salesPrice": 0, "purchasePrice": 0, "status": 0, "type": 0 } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(type, id, index, size, parentDetailedAccountId) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/client/Products', {
          params: {
            type: type,
            warehouseId: id,
            page: index || 1,
            size: size || 1000,
            parentDetailedAccountId: parentDetailedAccountId || null
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
   * Product GetById
   * @param {Guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": Guid, "title": "string", "code": "string", "barcode": "string", "salesTax": 0, "purchaseTax": 0, "minOrder": 0, "reorderPoint": 0, "purchasePrice": 0, "salesPrice": 0, "imageUrl": "string", "detailedAccount": { "id": Guid, "parentId": Guid, "code": "string", "fCode": "string", "name": "string", "fName": "string", "parentCode": "string", "parentName": "string", "openingDateTime": "2024-02-28T10:20:24.739Z", "type": 0, "family": 0, "separator": "string", "maximumCredit": 0, "maximumDebt": 0, "debtAmount": 0, "creditAmount": 0, "isActive": true, "isBanned": true, "subLevelAccountCodeCount": 0, "extraAttributes": "string", "desc": "string", "children": [ { "id": Guid, "code": "string", "fCode": "string", "name": "string", "fName": "string", "isActive": true, "isBanned": true, "parentId": Guid, "openingDateTime": "2024-02-28T10:20:24.739Z", "type": 0, "family": 0, "subLevelAccountCodeCount": 0, "children": [ "string" ] } ] }, "otherPrices": [ { "type": 0, "title": "string", "price": 0 } ], "priceHistory": [ { "dateTime": "2024-02-28T10:20:24.739Z", "purchasePrice": 0, "salesPrice": 0, "desc": "string", "productId": Guid, "otherPrices": [ { "type": 0, "title": "string", "price": 0 } ] } ], "category": { "id": Guid, "title": "string", "parent": "string" } } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/Products/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Product GetFavoriteList
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": { "id": Guid, "title": "string", "productIds": [ Guid ] } }}
   */
  static getFavoriteList() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/product/GetFavoriteList')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Product GetDetails
   * @param {Guid} id
   * @param {Guid} warehouseId
   * @param {DateTime} fromDateTime
   * @param {DateTime} toDateTime
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": Guid, "title": "string", "code": "string", "barcode": "string", "salesTax": 0, "purchaseTax": 0, "minOrder": 0, "reorderPoint": 0, "imageUrl": "string", "stockBalance": 0, "detailedAccount": { "id": Guid, "parentId": Guid, "code": "string", "fCode": "string", "name": "string", "fName": "string", "parentCode": "string", "parentName": "string", "openingDateTime": "2024-02-28T10:53:34.871Z", "type": 0, "family": 0, "separator": "string", "maximumCredit": 0, "maximumDebt": 0, "debtAmount": 0, "creditAmount": 0, "isActive": true, "isBanned": true, "subLevelAccountCodeCount": 0, "extraAttributes": "string", "desc": "string", "children": [ { "id": Guid, "code": "string", "fCode": "string", "name": "string", "fName": "string", "isActive": true, "isBanned": true, "parentId": Guid, "openingDateTime": "2024-02-28T10:53:34.871Z", "type": 0, "family": 0, "subLevelAccountCodeCount": 0, "children": [ "string" ] } ] }, "priceHistory": [ { "dateTime": "2024-02-28T10:53:34.871Z", "purchasePrice": 0, "salesPrice": 0, "desc": "string", "productId": Guid, "otherPrices": [ { "type": 0, "title": "string", "price": 0 } ] } ], "stockHistory": [ { "amount": 0, "balance": 0, "dateTime": "2024-02-28T10:53:34.871Z", "type": 0 } ], "category": { "id": Guid, "title": "string", "parent": "string" } } }}
   */
  static getDetails(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/Products/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
