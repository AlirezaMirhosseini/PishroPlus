import axiosClient from '../../plugins/axiosClient'
export default class pos {
  /**
  *POSService Create
  * @param {{  "entity": {"serialNumber": "string","terminalNumber": "string","receiverNumber": "string","name": "string","port": 0,"model": "string","launchDate": "2024-06-08T10:38:29.229Z","desc": "string","type": 0,"isActive": true,"bankAccountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}}} request
  * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
  */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/pos/create', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error) 
        })
    })
  }
  /**
   *POSService Update
   * @param {{ "entity": { "id": "guid", "desc": "string", "code": "string", "referenceNumber": "string", "date": "2023-08-26T06:56:07.671Z", "detailedAccounts": [ "guid" ], "items": [ { "id": "guid", "accountId": "guid", "firstDetailedAccountId": "guid", "secondDetailedAccountId": "guid", "thirdDetailedAccountId": "guid", "desc": "string", "debtAmount": 0, "creditAmount": 0 } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": {} }}
   */
  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/pos/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  
  /**
   * POSService GetById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "firstName": "string", "lastName": "string", "phoneNumber": "string", "nationalCode": "string", "jobPositions": [ { "id": "guid", "name": "string", "parentId": "guid" } ] } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/pos/getById', { params: { personId: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   *POSService Delete
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/pos/delete',{id:id})
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
 
  /**
   * POSService GetAll
   * @param {Int16Array} type
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": Guid, "categoryId": Guid, "categoryTitle": "string", "desc": "string", "imageUrl": "string", "title": "string", "code": "string", "salesTax": 0, "purchaseTax": 0, "salesPrice": 0, "purchasePrice": 0, "status": 0, "type": 0 } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(type, index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/pos/getAll', {
          params: { type: type, index: index || 0, size: size || 1000 }
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
   * POS send transaction
   * @param {{"entity": {"id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","amount": 0}}} entity
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static sendTransaction(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/pos/sendTransaction', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
