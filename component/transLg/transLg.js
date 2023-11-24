const app = getApp()

Component({
  properties: {
    isTraditional: {
      type: Boolean,
    },
  },


  data: {
    // isTraditional: false,
    // isShow: false, // 初始option不显示
    // arrowAnimation: {} // 箭头的动画
  },


  methods: {
    // 切换简繁
    switchTab: function (e) {

      const index = e.currentTarget.dataset.index;
      const isTraditional = app.globalData.isTraditional;
      if ((index === 0 && !isTraditional) || (index === 1 && isTraditional)) {
        return;
      }

      app.globalData.isTraditional = !isTraditional;
      wx.setStorageSync('isTraditional', app.globalData.isTraditional);
      // this.setData({
      //   isTraditional: app.globalData.isTraditional
      // });
      this.triggerEvent('trans', app.globalData.isTraditional);
    },
  }
})