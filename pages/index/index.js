//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello wxapp',
    loginBtnBgBgColor: "#F8D585",
    registerBtnBgBgColor: "#F8D585",
    userInfo: {},
    loginBtnTxt: '会员登录',
    registerBtnTxt: '立即加入'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toLoginView:function(){
     wx.navigateTo({
      url: '../login/index'
    })
  },
  toRegisterView:function(){
    wx.navigateTo({
     url: '../regist/index'
   })
 },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
