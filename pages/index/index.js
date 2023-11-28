//index.js
//获取应用实例
var app = getApp();
var util = require("../../utils/util.js");
const {
  API
} = require('../../api/api.js');
const convertChs = require('../../utils/simp_trad_chs.js');
Page({
  data: {
    welcomeText: "欢迎加入澳门财神酒店会员 ！",
    loginBtnBgBgColor: "transparent",
    registerBtnBgBgColor: "#F8D585",
    loginBtnTxt: '会员登录',
    registerBtnTxt: '立即加入',
    isTraditional: 'false',
    name: '',
    list2: [{
      id: 1,
      label: "酒店介绍",
      title: "酒店介绍",
      subTitle: "财神酒店位于澳门最繁盛的新口岸区",
      img: "https://static-1318552943.cos.ap-singapore.myqcloud.com/gow/images/hotel-crop.jpg",
      url: "../outer-hotel/intro",
    }, {
      id: 2,
      label: "餐饮新品",
      title: "餐饮新品",
      subTitle: "由专业厨艺团队为您调理中西式佳肴美食",
      img: "https://static-1318552943.cos.ap-singapore.myqcloud.com/gow/images/menu-crop.jpg",
      url: "../outer-menu/menu",
    }]
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

  getopendetail: function (e) {
    const id = e.detail;
    wx.navigateTo({
      url: this.data.list2[id-1].url, //
      success: function () {}, //成功后的回调；

      fail: function () {}, //失败后的回调；
      complete: function () {}
    }) //结束后的
  },

  trans: function (e) {
    this.setData({
      isTraditional: e.detail
    });
    this.transList();
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

  transList: function () {
    const newList2 = this.data.list2.map((item) => {
      return {
        ...item,
        title: convertChs.convert(item.title, app.globalData.isTraditional),
        subTitle: convertChs.convert(item.subTitle, app.globalData.isTraditional),
      }
    })
    this.setData({
      list2: newList2
    });
  },

  onLoad: async function () {
    this.transList();
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
        that.setData({
          welcomeText: "欢迎您，",
          name: app.globalData.userInfo.name,
          userInfo: {...userInfo, birthday: util.formatDate(userInfo.birthday)},
        })
      });
    }

  }
})