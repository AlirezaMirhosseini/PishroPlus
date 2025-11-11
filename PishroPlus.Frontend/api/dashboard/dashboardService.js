import axiosClient from '../../plugins/axiosClient'

export default class DetailedAccount {
  /**
   * Dashboard GetData
   * @returns {{ "isSuccess": true, "message": "string", "resultType": 0, "errors": [ "string" ], "entity": { "profitAndLoss": { "purchase": 0, "sale": 0, "incomes": 0, "expenses": 0 }, "defaultFinancialPeriod": { "id": "guid", "title": "string", "startDateTime": "2023-10-23T09:43:01.306Z" } } }}
   */
  static getData() {
    return new Promise((resolve, reject) => {
      axiosClient
        .get('/dashboard/getData')
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
