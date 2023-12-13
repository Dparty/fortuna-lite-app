const util = require("../../utils/util");
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
    services: '',
    gender: '',
    birthday: '',
    typeMap: {
      "F_AND_B": "酒店餐饮",
      "ENTERTAINMENT": "娱乐消费"
    },
    genderMap: {
      "FEMALE": "女",
      "MALE": "男"
    },
  },

  attached: function () {
    console.log("ready");

    var userInfo = this.properties.userInfo;
    if(!userInfo){
      wx.reLaunch({
        url: '../index/index' // 回到首页
      })
    }
    var services = userInfo.services?.map(e => {
      return this.data.typeMap[e]
    }).join('，');
    this.setData({
      isTraditional: app.globalData.isTraditional || false,
      services: services,
      gender: this.data.genderMap[userInfo.gender],
      birthday: util.formatDate(userInfo.birthday)
    });
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