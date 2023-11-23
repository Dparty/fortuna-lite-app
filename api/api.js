import { Http } from '../utils/http';

class API {
  static async getVerifyCode(params) {
   const res =  await Http.request({
      url: `/verification`,
      data: params,
      method: 'POST'
    })
    if(res.data.code === '80001'){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请勿频繁请求验证码'
      });
    }
    return res;
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

   static async getAccountInfo() {
    const res =  await Http.request({
       url: `/me`,
       method: 'GET'
     })
     return res.data
   }
   
}

export {
  API
}