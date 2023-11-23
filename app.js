//app.js
App({
  
  onLaunch: function () {
var that = this;
    this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect()
wx.getSystemInfo({ // iphonex底部适配
	success: res => {
		that.globalData.systeminfo = res
	}
})


    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (wx.getStorageSync('isTraditional')) {
      console.log('已设置繁简 value=' + wx.getStorageSync('isTraditional'));
      this.globalData.isTraditional = wx.getStorageSync('isTraditional');
    } else {
      console.log('未设置繁简');
    }
  },
  globalData: {
    isTraditional: false,
    userInfo:null,
    systeminfo: '',
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

})