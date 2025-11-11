import axiosClient from '../../plugins/axiosClient'

export default class Transfer {
  /**
   *Transfer CreateCheckBook
   * @param {{ "entity": { "bankId": "guid", "title": "string", "iBan": "string", "bankAccountNumber": "string", "paperCount": 0, "serialNumber": "string", "checkPapers": [ { "id": "guid", "serialCode": "string", "sayadNumber": "string", "status": 0, "desc": "string" } ] }}} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static createCheckBook(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/createCheckBook', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Transfer CreateCheckPaper
   * @param {{ "entity": { "checkBookId": "guid", "checkPapers": [ { "id": "guid", "serialCode": "string", "sayadNumber": "string", "status": 0, "desc": "string" } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static createCheckPaper(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/createCheckPaper', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Transfer DeleteCheckBook
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static deleteCheckBook(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/deleteCheckBook', null, { params: { id: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Transfer DeleteCheckPaper
   * @param {{ "id": "guid" }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static deleteCheckPaper(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/deleteCheckPaper', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Transfer GetCheckBookById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "bankId": "guid", "bankName": "string", "bankCode": "string", "title": "string", "iBan": "string", "bankAccountNumber": "string", "paperCount": 0, "desc": "string", "checkPapers": [ { "id": "guid", "serialCode": "string", "sayadNumber": "string", "status": 0, "desc": "string" } ] } }}
   */
  static getCheckBookById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/transfer/getCheckBookById', {
          params: { id: id }
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
   * Transfer GetAll
   * @param {Int16Array} type
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "totalAmount": 0, "desc": "string", "receiverAccount": { "id": "guid", "code": "string", "name": "string" }, "payerAccount": { "id": "guid", "code": "string", "name": "string" }, "firstPayerDetailed": { "id": "guid", "code": "string", "name": "string" }, "firstReceiverDetailed": { "id": "guid", "code": "string", "name": "string" }, "date": "2023-11-19T08:46:14.804Z", "type": 0 } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAll(type, index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/transfer/getAll', {
          params: { type: type || 0, index: index || 0, size: size || 1000 }
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
   * Transfer GetAllCheckBooks
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "bankId": "guid", "title": "string", "iBan": "string", "bankAccountNumber": "string", "paperCount": 0, "desc": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getAllCheckBooks(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/transfer/getAllCheckBooks', {
          params: { index: index || 0, size: size || 1000 }
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
   * Transfer GetCheckPapers
   * @param {Guid} checkBookId
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "serialCode": "string", "sayadNumber": "string", "status": 0, "desc": "string" } ] }}
   */
  static getCheckPapers(checkBookId) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/transfer/getCheckPapers', {
          params: { checkBookId: checkBookId }
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
   *Transfer PayOrReceive
   * @param {{ "entity": { "routineId": "guid", "payerAccountId": "guid", "firstPayerDetailedAccountId": "guid", "secondPayerDetailedAccountId": "guid", "thirdPayerDetailedAccountId": "guid", "receiverAccountId": "guid", "firstReceiverDetailedAccountId": "guid", "secondReceiverDetailedAccountId": "guid", "thirdReceiverDetailedAccountId": "guid", "totalAmount": 0, "desc": "string", "receiveDate": "2023-11-12T06:50:33.491Z", "type": 0, "documents": [ { "type": 0, "bankName": "string", "branchName": "string", "branchCode": "string", "serialCode": "string", "serialNumber": "string", "sayadNumber": "string", "amount": 0, "desc": "string", "attachmentFile": "string", "date": "2023-11-12T06:50:33.491Z", "checkBookId": "guid", "checkPaperId": "guid" } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": {} }}
   */
  static payOrReceive(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/payOrReceive', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Transfer UpdateCheckBook
   * @param {{ "entity": { "id": "guid", "bankId": "guid", "title": "string", "iBan": "string", "bankAccountNumber": "string", "startSerialNumber": 0, "paperCount": 0, "checkPapers": [ { "checkBookId": "guid", "checkPapers": [ { "id": "guid", "serialCode": "string", "sayadNumber": "string", "status": 0, "desc": "string" } ] } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static updateCheckBook(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/updateCheckBook', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Transfer UpdateCheckPaper
   * @param {{ "entity": { "id": "guid", "checkPapers": [ { "id": "guid", "serialCode": "string", "sayadNumber": "string", "status": 0, "desc": "string" } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static updateCheckPaper(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/updateCheckPaper', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Transfer CreateRoutine
   * @param {{ "entity": { "desc": "string", "code": "string", "title": "string", "type": 0, "receiverAccountId": "guid", "payerAccountId": "guid" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static createRoutine(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/createRoutine', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Transfer DeleteRoutine
   * @param {{ "id": "guid" }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static deleteRoutine(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/transfer/deleteRoutine', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Transfer GetAllRoutines
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "desc": "string", "code": "string", "title": "string", "type": 0, "receiver": { "id": "guid", "name": "string", "code": "string" }, "payer": { "id": "guid", "name": "string", "code": "string" } } ] }}
   */
  static getAllRoutines() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/transfer/getAllRoutines')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
