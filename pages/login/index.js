var util = require("../../utils/util.js");
// 获取应用实例
const app = getApp()
const convertChs = require('../../utils/simp_trad_chs.js');
const {
  API
} = require('../../api/api.js');

Page({
  data: {
    welcomeText: "请登录会员",
    getSmsCodeBtnTxt: "获取验证码",
    smsCodeDisabled: false,
    loginBtnTxt: "登录",
    loginBtnBgBgColor: "#F8D585",
    btnLoading: false,
    disabled: false,
    selectedTabbarIdx: 1,
    isTraditional: 'false',
    phonePH: '电话号码',
    codePH: '验证码',
    areaCodeArray: [{
      id: 86,
      name: '86',
      label: '中国大陆 +86',
      value: '86',
    },
    {
      id: 853,
      name: '853',
      label: '澳门 +853',
      value: '853',
    },
    {
      id: 852,
      name: '852',
      label: '香港 +852',
      value: '852',
    },
  ],
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
    codeFlag: "visibility: hidden;",
  },
  onLoad: function (options) {
    if (wx.getStorageSync('token')) {
      console.log("onLoad", wx.getStorageSync('token'))
      wx.switchTab({
        url: '../account/index'
      });
    }

      // 配置tabbar
      var tabbarData = getApp().globalData.tabbar;
      var item_menu_selected = tabbarData[1];
      var tabbarKey = item_menu_selected.title;
      var selectedTabbarIdx = this.get_tabar_idx_from_name(tabbarData, tabbarKey);
      this.setData({
        dataForTabbar: tabbarData,
        selectedTabbarKey: tabbarKey,
        selectedTabbarIdx: selectedTabbarIdx,
        scroll_top: 0,
      });
  
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    this.setData({
      isTraditional: app.globalData.isTraditional || false
    });
    this.transData();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

    // 点击tabbar item
    onTabbarItemTap: function (res) {
      console.log(res);
      var tabItem = res.detail;
      var dataForTabbar = this.data.dataForTabbar;
      var idx = this.get_tabar_idx_from_name(dataForTabbar, tabItem.title);
      if (tabItem.title.indexOf(this.data.selectedTabbarKey) != -1) { // 点击已经选中的tab，不做处理
        return;
      }

      if(idx == 0){
        wx.reLaunch({
          url: '../index/index',
        })
      }

      this.setData({
        selectedTabbarKey: tabItem.title,
        selectedTabbarIdx: idx,
        scroll_top: 2,
      });

    },

  // 根据名称获取tabbar的选中idx
  get_tabar_idx_from_name: function (dataForTabbar, tabbar_name) {
    try {
      for (var i = 0; i < dataForTabbar.length; i++) {
        var name = dataForTabbar[i].title;
        if (name.indexOf(tabbar_name) != -1) {
          return i;
        }
      }
      return 0;

    } catch (e) {
      return 0;
    }
  },
  codeFocus: function (e) {
    this.setData({
      stCode: 1
    })
  },
  /* 文本框失焦时更改状态*/
  codeBlur: function (e) {
    if (!e.detail.value) {
      this.setData({
        stCode: 0
      })
    }
  },

  numberFocus: function (e) {
    this.setData({
      stNumber: 1
    })
  },
  /* 文本框失焦时更改状态*/
  numberBlur: function (e) {
    if (!e.detail.value) {
      this.setData({
        stNumber: 0
      })
    }
  },

  // phone number
  getPhoneNum: function (e) {
    this.setData({
      number: e.detail.value,
      phoneFlag: "visibility: hidden;",
    })
  },

  checkPhone: function (param) {
    var phone = util.regexConfig().phone[this.data.areaCode];
    var inputNumber = param.trim();
    if (phone.test(inputNumber)) {
      return true;
    } else {
      this.setData({
        phoneFlag: ""
      });

      return false;
    }
  },

  bindPickerChange: function (e) {
    this.setData({
      areaCode: this.data.areaCodeArray[e.detail.value].value
    })
  },

  
  bindPickerChange: function (e) {
    console.log( this.data.areaCodeArray[e.detail.value].value)
    this.setData({
      areaCode: this.data.areaCodeArray[e.detail.value].value
    })
  },

  verificationCodeChange: function (e) {
    const value = e.detail.value;
    if (!value) {
      this.setData({
        codeFlag: ""
      });
    } else {
      this.setData({
        verificationCode: e.detail.value,
        codeFlag: "visibility: hidden;"
      });
    }
  },
  getSmsCode: async function () {
    var number = this.data.number;
    var that = this;
    var count = 60;
    if (this.checkPhone(number)) {
      var si = setInterval(function () {
        if (count > 0) {
          count--;
          that.setData({
            getSmsCodeBtnTxt: count + ' s 后重试',
            smsCodeDisabled: true
          });

        } else {
          that.setData({
            getSmsCodeBtnTxt: "获取验证码",
            smsCodeDisabled: false
          });
          count = 60;
          clearInterval(si);
        }
      }, 1000);

      try {
        const res = await API.getVerifyCode({
          phoneNumber: {
            areaCode: this.data.areaCode,
            number: this.data.number,
          }
        });
        console.log(res);
        if (res.data.code === '80001') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请勿频繁请求验证码'
          });
        }
      } catch (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '验证码获取失败'
        });
      }

    }
  },

  validateForm: function () {
    var valid = true;

    if (!this.checkPhone(this.data.number)) {
      this.setData({
        phoneFlag: ''
      });
      valid = false;
    }

    if (!this.data.verificationCode) {
      this.setData({
        codeFlag: ''
      });
      valid = false;
    }

    return valid;
  },


  formSubmit: async function (e) {
    if (!this.validateForm()) return;


    const data = {
      phoneNumber: {
        areaCode: this.data.areaCode,
        number: this.data.number,
      },
      verificationCode: this.data.verificationCode,
    };

    try {
      const res = await API.login(data);
      if (res) {
        // authentication failed
        if (res.code === '40001') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '手机号或验证码错误',
            success: function (res) {
              if (res.confirm) {}
            }
          });
        } // account not found
        else if (res.code === '40002') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '手机号不存在，请先注册',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../regist/index'
                })
              }
            }
          });
        } 
        else if(res.token) {
          // 登錄成功設置token
          wx.setStorage({
            key: "token",
            data: res.token
          });

          wx.reLaunch({
            url: '../index/index'
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '登录失败'
        });
      }

    } catch (e) {

    }

  },

  trans: function (e) {
    console.log("trans", e)
    this.setData({
      isTraditional: e.detail
    });
    this.transData();
  },

  transData: function () {
    
    this.setData({
      phonePH: convertChs.convert(this.data.phonePH, app.globalData.isTraditional),
      codePH: convertChs.convert(this.data.codePH, app.globalData.isTraditional),
    });
  },

})