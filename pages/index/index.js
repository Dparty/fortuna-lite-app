//index.js
//获取应用实例
var app = getApp();
const {
  API
} = require('../../api/api.js');
Page({
  data: {
    welcomeText: "欢迎加入澳门财神酒店会员 ！",
    loginBtnBgBgColor: "transparent",
    registerBtnBgBgColor: "#F8D585",
    loginBtnTxt: '会员登录',
    registerBtnTxt: '立即加入',
    isTraditional: 'false',
    name: '',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toLoginView: function () {
    wx.reLaunch({
      url: '../login/index'
    })
  },
  toRegisterView: function () {
    wx.reLaunch({
      url: '../regist/index'
    })
  },

  trans: function (e) {
    console.log("trans", e)
    this.setData({
      isTraditional: e.detail
    });
  },
  onShow: async function () {

    // if(wx.getStorageSync('token')){
    //   try {
    //     console.log(wx.getStorageSync('token'));
    //     const res = await API.getAccountInfo();
    //     if(res){
    //       this.setData({welcomeText: "欢迎您，", name: res.name});
    //     }

    //   } catch (e) {}

    // }
  },

  onLoad: async function () {
    console.log("index-onload")

    this.setData({
      isTraditional: app.globalData.isTraditional || false
    });

    // if(app.globalData.userInfo){
    //   this.setData({welcomeText: "欢迎您，", name: app.globalData.userInfo.name});
    // }

    if (wx.getStorageSync('token')) {
      var that = this;
      //调用应用实例的方法获取全局数据
      await app.getUserInfo(function (userInfo) {
        //更新数据
        console.log("userInfo", userInfo)
        that.setData({
          userInfo: userInfo,
        })
      });
      that.setData({
        userInfo: app.globalData.userInfo,
        welcomeText: "欢迎您，",
        name: app.globalData.userInfo.name
      })
    }

  }
})