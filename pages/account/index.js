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

    userInfo: {},
    ifShowInfo: false,

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

    isTraditional: false,

  },
  onLoad: function (options) {
    if(!wx.getStorageSync('token')){
      wx.redirectTo({
        url: '../login/index' //参数只能是字符串形式，不能为json对象
      });
      return;
    }
  },
  onReady: function () {
    // 页面渲染完成
   
  },
  onShow: async function () {
    const userInfo = app.globalData.userInfo;
    if(userInfo){
      this.setData({userInfo: userInfo});
      drawQrcode({
        width: 180,
        height: 180,
        canvasId: 'myQrcode',
        // ctx: wx.createCanvasContext('myQrcode'),
        text: userInfo.id,
      })
    }
    if(!wx.getStorageSync('token')){
      wx.redirectTo({
        url: '../login/index' //参数只能是字符串形式，不能为json对象
      });
      return;
    }
    this.setData({
      isTraditional: app.globalData.isTraditional || false
    })
    

    // try {
    //   const res = await API.getAccountInfo();
    //   console.log(res)

    //   this.setData({userInfo: res, userName: res.name, userId: res.id});


    // } catch (e) {}
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },


  logout: function(){
    wx.setStorage({
      key: "token",
      data: ''
    });
    app.globalData.userInfo = null;

    wx.reLaunch({
      url: '../index/index' // 回到首页
    })
  },



  showInfo: function () {
    this.setData({ifShowInfo: true});
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

  trans: function (e) {
    console.log("trans", e)
    this.setData({
      isTraditional: e.detail
    });
  },

  returnToAccount: function (e) {
    console.log("returnToAccount", e)
    this.setData({
      ifShowInfo: false
    });
    drawQrcode({
      width: 180,
      height: 180,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: app.globalData.userInfo.id,
    })
  }

})