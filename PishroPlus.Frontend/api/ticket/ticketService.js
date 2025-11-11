import axiosClient from '../../plugins/axiosClient'

export default class Ticket {
  /**
   *Ticket Create
   * @param {{ "entity": { "id": "guid", "ticketDepartmentId": "guid", "title": "string", "text": "string", "financialPeriodId": "guid", "companyId": "guid", "priority": 0, "files": [ { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true } ] } }} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","ticketDepartmentId": "guid","title": "string","text": "string","files": [{"id": "guid","entityId": "guid","type": 0,"fileName": "string","displayName": "string","fullPath": "string","path": "string","fileBase64": "string","isPrimary": true}]}}}
   */
  static create(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/Ticket/create', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Ticket GetByCompanyId
   * @param {guid} companyId
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "userId": "guid", "pishroAppId": "guid", "title": "string", "code": "string", "financialPeriodTitle": "string", "financialPeriodId": "guid", "userName": "string", "userFullName": "string", "pishroAppTitle": "string", "pishroAppCode": "string", "status": 0, "priority": 0, "createDateTime": "2023-07-17T08:27:05.978Z", "updateDateTime": "2023-07-17T08:27:05.978Z", "ticketDepartment": { "id": "guid", "title": "string", "image": { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true }, "desc": "string", "parentId": "guid", "parent": "string" } } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getByCompanyId(companyId) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/Ticket/getByCompanyId', { params: { companyId: companyId } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Ticket GetById
   * @param {guid} id
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "userId": "guid", "companyId": "guid", "title": "string", "code": "string", "financialPeriodTitle": "string", "financialPeriodId": "guid", "userName": "string", "userFullName": "string", "companyName": "string", "companyCode": "string", "status": 0, "priority": 0, "createDateTime": "2023-07-17T08:27:43.468Z", "updateDateTime": "2023-07-17T08:27:43.468Z", "messages": [ { "id": "guid", "text": "string", "userId": "guid", "userName": "string", "userFullName": "string", "dateTime": "2023-07-17T08:27:43.468Z", "files": [ { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true } ], "type": 0 } ], "ticketDepartment": { "id": "guid", "title": "string", "image": { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true }, "desc": "string", "parentId": "guid", "parent": "string" } } }}
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/Ticket/getById', { params: { id: id } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Ticket GetDepartments
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "title": "string", "image": { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true }, "desc": "string", "parentId": "guid", "parent": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getDepartments() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/Ticket/getDepartments')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Ticket GetFAQs
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "content": "string", "title": "string", "desc": "string", "ticketDepartmentId": "guid", "ticketDepartmentTitle": "string" } ], "index": 0, "size": 0, "total": 0, "pageCount": 0, "start": 0, "end": 0 }}
   */
  static getFAQs() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/Ticket/getFAQs')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Ticket Reply
   * @param {Int16Array} type
   * @param {{ "entity": { "id": "guid", "message": "string", "files": [ { "id": "guid", "entityId": "guid", "type": 0, "fileName": "string", "displayName": "string", "fullPath": "string", "path": "string", "fileBase64": "string", "isPrimary": true } ] } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static reply(type, request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/Ticket/reply', request, { params: { type: type } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

}
