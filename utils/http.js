import { config } from './config'
import { promisic } from './util'


class Http {
    static async request({url, data,  method = 'GET'}){
        return await promisic(wx.request)({
            url: `${config.apiBaseUrl}${url}`,
            data,
            method,
            header: {
                appkey: config.appkey, 
                Authorization: `Bearer ${wx.getStorageSync('token')}`,
            },
        })
    }
}

export {
  Http
}