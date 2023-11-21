import { Http } from '../utils/http';

class API {
  static async getVerifyCode(params) {
   const res =  await Http.request({
      url: `/verification`,
      data: params,
      method: 'POST'
    })
    return res.data
  }

  static async login(params) {
    const res =  await Http.request({
       url: `/sessions`,
       data: params,
       method: 'POST'
     })
     return res.data
   }

   static async register(params) {
    const res =  await Http.request({
       url: `/accounts`,
       data: params,
       method: 'POST'
     })
     return res.data
   }

   static async getAccountInfo(params) {
    const res =  await Http.request({
       url: `/me`,
       data: params,
       method: 'GET'
     })
     return res.data
   }
   
}

export {
  API
}