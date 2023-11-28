var util = require("../../utils/util.js");
// 获取应用实例
const app = getApp()
const convertChs = require('../../utils/simp_trad_chs.js');
const {
  API
} = require('../../api/api.js');

import drawQrcode from '../../utils/weapp.qrcode.esm.js'
import Modal from '../../component/modal/modal';

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

    renderHeight: 180,

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
    const renderHeight = app.globalData.systeminfo.windowWidth / 2;
    this.setData({renderHeight: renderHeight});

    if(userInfo){
      this.setData({userInfo: userInfo});
      drawQrcode({
        width: renderHeight,
        height: renderHeight,
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
    Modal.confirm({
      message: '积分/卡券系统即将开启，敬请期待',
      selector: '#cus-dialog',
      confirmCallback: function() {}
  });
    // wx.showModal({
    //   title: '提示',
    //   showCancel: false,
    //   content: '积分/卡券系统即将开启，敬请期待'
    // });
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
    this.setData({
      isTraditional: e.detail
    });
  },

  returnToAccount: function (e) {
    this.setData({
      ifShowInfo: false
    });

    drawQrcode({
      width: this.data.renderHeight,
      height: this.data.renderHeight,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: app.globalData.userInfo.id,
    })
  }

})