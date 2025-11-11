import Auth from '../../plugins/auth';
import axiosClient from '../../plugins/axiosClient';
import axiosSystem from '../../plugins/axiosSystem';

export default class User {
  // /**
  //  * User Login
  //  * @param {{"entity": {"userName": "string","password": "string","companyCode": "string"}}} request
  //  * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","userName": "string","password": "string","token": "string"},"enterCompanyCode": true,"companies": [{"id": "guid","name": "string","code": "string"}]}}
  //  */
  // static login(request) {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .post('/users/login', request)
  //       .then((res) => {
  //         console.log('res login in service: ', res);
  //         if (res.data.isSuccess) Auth.logIn(res.data.entity.token, 30)
  //         resolve(res.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  /**
 * User Login
 * @param {{ userName: string, password: string }} request
 * @returns {Promise<{ value: { token: string, permissions: any[], companyProfiles: Array<{ companyId: string, profileId: string, displayName: string, companyName: string }>, systemProfileId: string, tokenForProfileSelectionStep: string }, isSuccess: boolean, isFailure: boolean, isNotFound: boolean, isInvalidInput: boolean, errors: Array<{ message: string, type: number }> }>}
 */
  static login(request) {
    return axiosSystem
      .post('/auth/login', request)
      .then(res => res.data)
      .catch(error => {
        throw error;
      });
  }

  
  /**
   * User CheckUser (Login Api)
   * @param {{ userName: string, password: string }} request
   */
  static checkUserName(request) {
    return axiosSystem
      .post('/auth/login', request)
      .then(res => {
        const data = res.data;
        if (data.isSuccess && data.value.token) {
          Auth.logIn(data.value.token, 30);
        }
        return {
          isSuccess: data.isSuccess,
          enterCompanyCode: data.value.companyProfiles?.length > 1,
          companies: data.value.companyProfiles?.map(profile => ({
            companyId: profile.companyId,
            companyCode: profile.companyCode,
            profileId: profile.profileId,
            displayName: profile.displayName,
            companyName: profile.companyName
          })) || [],
          permissions: data.value.permissions,
          tokenForProfileSelection: data.value.tokenForProfileSelectionStep
        };
      })
      .catch(error => {
        throw error;
      });
  }

  // /**
  //  * User CheckUser (Login Api)
  //  * @param {{"entity": {"userName": "string","password": "string","companyCode": "string"}}} request
  //  * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"id": "guid","userName": "string","password": "string","token": "string"},"enterCompanyCode": true,"companies": [{"id": "guid","name": "string","code": "string"}]}}
  //  */
  // static checkUserName(request) {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .post('/users/login', request)
  //       .then((res) => {
  //         console.log('res checkUserName in service: ', res);
  //         if (res.data.isSuccess && !res.data.enterCompanyCode)
  //           Auth.logIn(res.data.entity.token, 30)
  //         resolve({
  //           ...res.data
  //         })
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // }

  /**
   * User AddPermission
   * @param {{"entity": {"userId": guid,"permissions": [guid]}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static addPermission(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/user/addPermission', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * User RemovePermission
   * @param {{"entity": {"userId": guid,"permissions": [guid]}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"]}}
   */
  static removePermission(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/user/removePermission', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * User UpdatePermission
   * @param {{"entity": {"userId": guid,"permissions": [guid]}}} request
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entity": {"userId": "guid","permissions": ["guid"]}}}
   */
  static updatePermissions(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/user/updatePermissions', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * User GetAllPermissions
   * @param {guid} userId
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entities": [{"id": "guid","name": "string","parentId": "guid"}],"index": 0,"size": 0,"total": 0,"pageCount": 0,"start": 0,"end": 0}}
   */
  static getAllPermissions(userId) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/user/getAllPermissions', { params: { userId } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * User GetAll
   * @param {Int16Array} index
   * @param {Int16Array} size
   * @returns {{"isSuccess": true,"message": "string","resultType": 0,"errors": ["string"],"entities": [{"id": "guid","userName": "string","nationalCode": "string","phoneNumber": "string"}],"index": 0,"size": 0,"total": 0,"pageCount": 0,"start": 0,"end": 0}}
   */
  static getAll(index, size) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/user/getAll', { params: { index, size } })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * User GetAllByCompany
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entities": [ { "id": "guid", "userName": "string", "firstName": "string", "lastName": "string", "displayName": "string", "phoneNumber": "string", "nationalCode": "string", "postalCode": "string", "address": "string", "tel": "string", "confirmCode": "string", "gender": 0, "extraAttributes": "string", "lastLoginDateTime": "2023-10-23T10:23:20.485Z" } ] }}
   */
  static getAllByCompany() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/user/getAllByCompany')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static update(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/user/update', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static add(request) {
    return new Promise((resolve, reject) => {
      axiosClient
        .post('/user/add', request)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

}
