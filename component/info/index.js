const app = getApp()

Component({
  properties: {
    userInfo: {
      type: Object,
    },
    isShow: {
      type: Boolean,
    },
    isTraditional: {
      type: Boolean,
    },
  },


  data: {
    isShow: true,
    welcomeText: "个人信息",
    isTraditional: false,
  },

  attached: function () {
    console.log("ready")
    this.setData({
      isTraditional: app.globalData.isTraditional || false
    })
  },
  methods: {


    _iconLeftTap: function (e) {
      this.setData({
        isShow: false
      });
      this.triggerEvent('returnToAccount', e);
    },

    trans: function (e) {
      console.log("trans", e)
      this.setData({
        isTraditional: e.detail
      });
    }


  }
})


// var util = require("../../utils/util.js");
// // 获取应用实例
// const app = getApp()
// const convertChs = require('../../utils/simp_trad_chs.js');
// const {
//   API
// } = require('../../api/api.js');

// Page({
//   data: {
//     welcomeText: "个人信息",

//     btnLoading: false,
//     disabled: false,
//     selectedTabbarIdx: 1,
//     isTraditional: 'false',

//     userInfo: {},

//   },
//   onLoad: function (options) {
//     if (wx.getStorageSync('token')) {
//       console.log("onLoad", wx.getStorageSync('token'))
//       wx.switchTab({
//         url: '../account/index'
//       });
//     }  
//   },

//   _iconLeftTap: function(e) {

//   },

//   onReady: function () {},
//   onShow: function () {
//     // 页面显示
//     this.setData({
//       isTraditional: app.globalData.isTraditional || false
//     })
//   },

//   trans: function (e) {
//     console.log("trans", e)
//     this.setData({
//       isTraditional: e.detail
//     });
//   }

// })