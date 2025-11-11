import axiosClient from '../../plugins/axiosClient'

export default class mediaService {
  /**
   *Media getMedia
   * @param {string} name
   * @returns {}
   */
  static getMedia(name) {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`/client/media/${name}`)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
