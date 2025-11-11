import axiosClient from '../../plugins/axiosClient'

export default class Setting {
  /**
   *Setting setSettings
   * @param {{ "entity": { "items": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static setSettings(setting) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/client/settings/create-or-update', setting)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

/**
 * Setting GetAccountSetting
 * @param {{ page: number, size: number, settingModule: number }} params
 * @returns {{ value: { result: Array<{ id: string, key: string, value: string, module: number }>, page: number, size: number, totalPages: number, totalCount: number, pagination: { page: number, size: number, pagination: string } }, isSuccess: boolean, isFailure: boolean, isAlreadyExist: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }}
 */
static getSetting(params) {
  return new Promise((resolve, reject) => {
    axiosClient
      .get('/client/settings/all', { 
        params: {
          page: params.page || 1,
          size: params.size || 100,
          settingModule: params.settingModule
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
   *Setting GetDashboardSetting
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "cards": "string", "quickAccessCards": "string", "defaultTab": 0, "resizable": true, "movable": true, "removable": true, "canBlur": true, "userId": "guid" } }} */
  static getDashboardSetting() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/setting/getDashboardSetting')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting GetThemeSetting
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "id": "guid", "darkMode": true, "fontName": "string", "fontSize": "string", "fontColor": "string", "primaryColor": "string", "secondaryColor": "string", "userId": "guid" } }}
   */
  static getThemeSetting() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/setting/getThemeSetting')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting SetDashboardSetting
   * @param {{ "entity": { "cards": "string", "quickAccessCards": "string", "defaultTab": 0, "resizable": true, "movable": true, "removable": true, "canBlur": true } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static setDashboardSetting(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/setting/setDashboardSetting', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting SetThemeSetting
   * @param {{ "entity": { "id": "guid", "darkMode": true, "fontName": "string", "fontSize": "string", "fontColor": "string", "primaryColor": "string", "secondaryColor": "string" } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static setThemeSetting(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/setting/setThemeSetting', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting ResetAccountsToDefault
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static resetAccountsToDefault() {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/setting/resetAccountsToDefault', {})
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting SetTransferSetting
   * @param {{ "entity": { "items": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } } } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static setTransferSetting(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/setting/setTransferSetting', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   *Setting GetTransferSetting
   * @param {Int16Array} type
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": 0, "name": "string", "type": 0, "value": "string" } ] }}
   */
  static getTransferSetting(type) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/setting/getTransferSetting', { params: { type: type } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }


  /**
  *Setting SetSalesSetting
  * @param {{ "entity": { "items": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } } } }} request
  * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
  */
  static setSalesSetting(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/setting/setSalesSetting', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }


  /**
 *Setting GetSalesSetting
 * @param {Int16Array} type
 * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": 0, "name": "string", "type": 0, "value": "string" } ] }}
 */
  static getSalesSetting(type = null) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/setting/getSalesSetting', { params: { type: type } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }


  /**
   *Setting SetWarehouseSetting
   * @param {{ "entity": { "items": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } } } }} request
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
   */
  static SetWarehouseSetting(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/setting/SetWarehouseSetting', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

   /**
 *Setting GetWarehouseSetting
 * @param {Int16Array} type
 * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": 0, "name": "string", "type": 0, "value": "string" } ] }}
 */
 static GetWarehouseSetting(type = null) {
  return new Promise((resolve, reject) => {
    axios
      .get('/setting/GetWarehouseSetting', { params: { type: type } })
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
  *Setting setDashboardSetting
  * @param {{ "entity": { "items": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } } } }} request
  * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ] }}
  */
  static setDashboardSetting(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/setting/setDashboardSetting', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}


