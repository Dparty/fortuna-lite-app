var util = require("../../utils/util.js");
// 获取应用实例
const app = getApp()
const convertChs = require('../../utils/simp_trad_chs.js');
const {
  API
} = require('../../api/api.js');

Page({
  data: {
    getSmsCodeBtnTxt: "获取验证码",
    smsCodeDisabled: false,
    loginBtnTxt: "登录",
    loginBtnBgBgColor: "#F8D585",
    btnLoading: false,
    disabled: false,
    inputUserName: '',
    inputPassword: '',

    areaCodeArray: [{
        id: 86,
        name: '86',
        label: '中国大陆 +86'
      },
      {
        id: 853,
        name: '853',
        label: '澳门 +853',
      },
      {
        id: 852,
        name: '852',
        label: '香港 +852',
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
  },
  onReady: function () {},
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

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
        } else if(res.token) {
          // 登錄成功設置token
          wx.setStorage({
            key: "token",
            data: res.token
          });

          wx.switchTab({
            url: '../account/index'
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '注册失败'
        });
      }



    } catch (e) {

    }

  },


  mysubmit: function (param) {
    var flag = this.checkUserName(param) && this.checkPassword(param)
    if (flag) {
      this.setLoginData1();
      this.checkUserInfo(param);
    }
  },
  setLoginData1: function () {
    this.setData({
      loginBtnTxt: "登录中",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setLoginData2: function () {
    this.setData({
      loginBtnTxt: "登录",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#ff9900",
      btnLoading: !this.data.btnLoading
    });
  },
  checkUserName: function (param) {
    var email = util.regexConfig().email;
    var phone = util.regexConfig().phone;
    var inputUserName = param.username.trim();
    if (email.test(inputUserName) || phone.test(inputUserName)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的邮箱或者手机号码'
      });
      return false;
    }
  },
  checkPassword: function (param) {
    var userName = param.username.trim();
    var password = param.password.trim();
    if (password.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入密码'
      });
      return false;
    } else {
      return true;
    }
  },
  checkUserInfo: function (param) {
    var username = param.username.trim();
    var password = param.password.trim();
    var that = this;
    if ((username == 'admin@163.com' || username == '18500334462') && password == '000000') {
      setTimeout(function () {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1500
        });
        that.setLoginData2();
        that.redirectTo(param);
      }, 2000);
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户名或密码有误，请重新输入'
      });
      this.setLoginData2();
    }
  },
  redirectTo: function (param) {
    //需要将param转换为字符串
    param = JSON.stringify(param);
    wx.redirectTo({
      url: '../main/index?param=' + param //参数只能是字符串形式，不能为json对象
    })
  }

})