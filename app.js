const {
  API
} = require('/api/api.js');

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

    if (wx.getStorageSync('token')) {
      console.log('已登录 value=' + wx.getStorageSync('token'));
      this.globalData.token = wx.getStorageSync('token');
    }else{
      console.log('未登录');
    }
  },
  globalData: {
    isTraditional: false,
    userInfo: null,
    systeminfo: '',
    tabbar: [{
      icon: "/images/home-hl.png",
      selectedIcon: "/images/home.png",
      title: "首页",
    },
    {
      icon: "/images/person-hl.png",
      selectedIcon: "/images/person.png",
      title: "我的",
    }]
  },
  getUserInfo: async function(cb){
    if (!wx.getStorageSync('token')) {
      console.log("无法获取用户信息")
    }
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      try {
        const res = await API.getAccountInfo();
        console.log(res)
        this.globalData.userInfo = res;
      } catch (e) {}
    }
  },
  getUser: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
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