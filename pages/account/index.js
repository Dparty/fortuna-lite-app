var util = require("../../utils/util.js");
// 获取应用实例
const app = getApp()
const convertChs = require('../../utils/simp_trad_chs.js');
const {
  API
} = require('../../api/api.js');

// 将 dist 目录下，weapp.qrcode.esm.js 复制到项目目录中
import drawQrcode from '../../utils/weapp.qrcode.esm.js'




Page({
  data: {
    welcomeText: '欢迎您',
    title: '财神荟会员卡',
    userName: '',
    userId: '',
    getSmsCodeBtnTxt: "获取验证码",
    smsCodeDisabled: false,
    loginBtnTxt: "登录",
    loginBtnBgBgColor: "#F8D585",
    btnLoading: false,
    disabled: false,
    inputUserName: '',
    inputPassword: '',

    number: '',
    verificationCode: '',
    areaCode: '86',

    // 提示样式相关
    stUserName: 0,
    stCode: 0,
    stNumber: 0,

    // 错误
    nameFlag: "visibility: hidden;",
    phoneFlag: "visibility: hidden;",

  },
  onLoad: async function (options) {
    if(!wx.getStorageSync('token')){
      wx.redirectTo({
        url: '../login/index' //参数只能是字符串形式，不能为json对象
      });
      return;
    }

    const that = this;
    that.setData({
      isTraditional: app.globalData.isTraditional || false
    })
    // 页面初始化 options为页面跳转所带来的参数
    try {
      const res = await API.getAccountInfo();
      console.log(res)

      this.setData({userName: res.name, userId: res.id});

      drawQrcode({
        width: 180,
        height: 180,
        canvasId: 'myQrcode',
        // ctx: wx.createCanvasContext('myQrcode'),
        text: this.data.userId,
        // v1.0.0+版本支持在二维码上绘制图片
        // image: {
        //   imageResource: '../../images/icon.png',
        //   dx: 70,
        //   dy: 70,
        //   dWidth: 60,
        //   dHeight: 60
        // }
      })
      
    } catch (e) {

    }
  },
  onReady: function () {
    // 页面渲染完成
   
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },


  logout: function(){
    console.log("logout and redirect");
    wx.setStorage({
      key: "token",
      data: ''
    });
    wx.redirectTo({
      url: '../login/index' //参数只能是字符串形式，不能为json对象
    });
  },



  redirectTo: function (param) {
    //需要将param转换为字符串
    param = JSON.stringify(param);
    wx.redirectTo({
      url: '../main/index?param=' + param //参数只能是字符串形式，不能为json对象
    })
  },

  notfinsh: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '积分/卡券系统即将开启，敬请期待'
    });
  },

   // 切换简繁
   switchTab: function (e) {
    const index = e.currentTarget.dataset.index;
    const isTraditional = app.globalData.isTraditional;
    if ((index === 0 && !isTraditional) || (index === 1 && isTraditional)) {
      return;
    }
    app.globalData.isTraditional = !isTraditional;
    wx.setStorageSync('isTraditional', app.globalData.isTraditional);
    this.setData({
      isTraditional: app.globalData.isTraditional
    });
  },

})