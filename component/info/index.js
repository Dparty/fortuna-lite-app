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

