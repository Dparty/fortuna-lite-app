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
    points: 0,

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
    canvasImg: "",

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
    var userInfo = app.globalData.userInfo;
    const renderHeight = app.globalData.systeminfo.windowWidth / 2;
    this.setData({renderHeight: renderHeight});

    if(userInfo){
      this.setData({userInfo: userInfo, userName: userInfo.name});
      if(userInfo.points){
        this.setData({points: userInfo.points});
      }
      drawQrcode({
        width: renderHeight,
        height: renderHeight,
        canvasId: 'myQrcode',
        text: "This service has not been activated yet",
      })
    }else{
      wx.reLaunch({
        url: '../index/index',
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
    this.handleCanvarToImg();
    var that = this;
    Modal.confirm({
      showCancel: true,
      cancelButtonText: '否',
      confirmButtonText: '是',
      message: '是否确认退出登录？',
      selector: '#cus-dialog',
      confirmCallback: function() {
        wx.setStorage({
          key: "token",
          data: ''
        });
        app.globalData.userInfo = null;
    
        wx.reLaunch({
          url: '../index/index' // 回到首页
        })
      },
      cancelCallback: function(){
        that.setData({
          canvasImg: ''
        });
        drawQrcode({
          width: that.data.renderHeight,
          height:  that.data.renderHeight,
          canvasId: 'myQrcode',
          text: "This service has not been activated yet",
        })
      }
  });
    
   
  },

  handleCanvarToImg(){
    wx.canvasToTempFilePath({
      // x: 0,
      // y: 0,
      width: this.data.renderHeight,
      height: this.data.renderHeight,
      canvasId: 'myQrcode',
      success: (res) => {
        console.log(res)
         
        this.setData({
          canvasImg : res.tempFilePath
        });
         this.canvasImg = res.tempFilePath
      }
    });
 },

  showInfo: function () {
    console.log(this.data.userInfo)
    if(this.data.userInfo){
      this.setData({ifShowInfo: true});
    }
  },

  notfinsh: function () {
    this.handleCanvarToImg();
    var that = this;
    Modal.confirm({
      message: '积分/卡券系统即将开启，\n敬请期待 !',
      selector: '#cus-dialog',
      confirmCallback: function() {
        that.setData({
          canvasImg: ''
        });
        drawQrcode({
          width: that.data.renderHeight,
          height:  that.data.renderHeight,
          canvasId: 'myQrcode',
          text: "This service has not been activated yet",
        })
      }
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
      text: "This service has not been activated yet",
    })
  }

})