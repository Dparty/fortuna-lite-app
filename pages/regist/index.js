var util = require("../../utils/util.js");
const app = getApp()
const convertChs = require('../../utils/simp_trad_chs.js');
const {
  API
} = require('../../api/api.js');
import Modal from '../../component/modal/modal';


Page({
  data: {
    registBtnTxt: "立即入会",
    registBtnBgBgColor: "#F8D585",
    getSmsCodeBtnTxt: "获取验证码",
    btnLoading: false,
    registDisabled: false,
    smsCodeDisabled: false,
    phonePH: '电话号码',
    codePH: '验证码',
    inputUserName: '',
    inputPassword: '',
    phoneNum: '',
    number: '',
    verificationCode: '',
    areaCode: '86',
    gender: '',
    firstName: '',
    birthday: util.getNowDate(new Date()),
    from: 'WECHAT',
    services: [],
    agreeChecked: false,
    // 页面切换
    isToggled: false,

    // 日期筛选
    minDate: new Date(1920, 1, 1).getTime(),
    maxDate: util.getNowDate(new Date()),
    radioChange: [{
        name: "男",
        // checked: 'true',
        value: "MALE"
      },
      {
        name: "女",
        value: "FEMALE"
      },
    ],

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

    // 复选框
    checkBoxList: [{
        id: 0,
        name: "酒店餐饮",
        value: "F_AND_B"
      },
      {
        id: 1,
        name: "娱乐消费",
        value: "ENTERTAINMENT"
      },
    ],
    services: [],

    // 提示样式相关
    stUserName: 0,
    stCode: 0,
    stNumber: 0,

    // 错误
    nameFlag: "visibility: hidden;",
    phoneFlag: "visibility: hidden;",
    codeFlag: "visibility: hidden;",
    genderFlag: "visibility: hidden;"
  },

  _iconLeftTap: function(e) {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  /* 文本框聚焦时更改状态*/
  userNameFocus: function (e) {
    this.setData({
      stUserName: 1
    })
  },
  /* 文本框失焦时更改状态*/
  userNameBlur: function (e) {
    if (!e.detail.value) {
      this.setData({
        stUserName: 0
      })
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

  bindPickerChange: function (e) {
    this.setData({
      areaCode: this.data.areaCodeArray[e.detail.value].value
    })
  },

  // 复选框的选中事件
  handelItemChange(e) {
    const services = e.detail.value;
    this.setData({
      services
    })
  },
  radioChange: function (e) {
    if(e.detail.value){
      this.setData({
        genderFlag: "visibility: hidden;"
      })
    }
    this.setData({
      gender: e.detail.value
    })
  },


  bindUserNameChange: function (e) {
    const value = e.detail.value;
    if (!value) {
      this.setData({
        username: value,
        nameFlag: ""
      });
    } else {
      this.setData({
        username: value,
        nameFlag: "visibility: hidden;"
      });
    }
  },

  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  checkboxChange: function (e) {
    this.setData({
      agreeChecked: !this.data.agreeChecked
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady: function () {
    // 页面渲染完成

  },
  onUnload: function () {
    // 页面关闭

  },
  // 切换简繁
  switchTab: function (e) {
    const index = e.currentTarget.dataset.index;
    const isTraditional = app.globalData.isTraditional;
    if ((index === 0 && !isTraditional) || (index === 1 && isTraditional)) {
      return;
    }
    app.globalData.isTraditional = !isTraditional;
    wx.setStorageSync('isTraditional', app.globalData.isTraditional);
    this.setData({
      isTraditional: app.globalData.isTraditional
    });
    this.transData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const that = this
    that.setData({
      isTraditional: app.globalData.isTraditional || false
    })
    this.transData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    if (that.data.isToggled) {
      that.onLoad()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isToggled: true
    })
  },
  selectToggle: function (e) {
    this.setData({
      showOptions: !this.data.showOptions
    })
  },
  hideSelect: function (e) {
    this.setData({
      showOptions: false
    })
  },
  selectItem: function (e) {
    let optionList = this.properties.options //外部传进来的数组对象
    let nowIdx = e.currentTarget.dataset.index //当前点击的索引
    let selectItem = optionList[nowIdx] //当前点击的内容
    this.setData({
      showOptions: false,
      value: selectItem[this.properties.showkey]
    });
    let eventOption = {} // 触发事件的选项
    this.triggerEvent("mySelectItem", selectItem) //组件选中回调
  },

  validateForm: function () {
    var valid = true;
    if (!this.data.username) {
      this.setData({
        nameFlag: ''
      });
      valid = false;
    }

    if (!this.data.gender) {
      this.setData({
        genderFlag: ''
      });
      valid = false;
    }

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

    if (!this.data.agreeChecked) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请勾选用户协议'
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
      gender: this.data.gender,
      name: this.data.username,
      services: this.data.services,
      // lastName: values.lastName,
      // birthday: moment.utc(`${values.birthday} ${"00:00"}`).unix(),
      birthday: util.unixtime(this.data.birthday)
    };

    try {
      const res = await API.register(data);

      if(res){
        // account exists
        if(res.code === '40009'){
          Modal.confirm({
            message: '用户已存在，请直接登录',
            selector: '#cus-dialog',
            confirmCallback: function () {
              wx.redirectTo({
                url: '../login/index'
              })
            }
          });
        }else if(res.code === '40006'){
          // verification fault
          Modal.confirm({
            message: '验证码错误',
            selector: '#cus-dialog',
            confirmCallback: function () {
            }
          });
        }
        else{
          wx.reLaunch({
            url: '../index/index'
          })
        }
      }else{
        Modal.confirm({
          message: '提示',
          selector: '#cus-dialog',
          confirmCallback: function () {
          }
        });
      }
    } catch (e) {

    }


  },

  verificationCodeChange: function (e) {
    const value = e.detail.value;
    if (!value) {
      this.setData({
        verificationCode: e.detail.value,
        codeFlag: ""
      });
    } else {
      this.setData({
        verificationCode: e.detail.value,
        codeFlag: "visibility: hidden;"
      });
    }
  },

  // phone number
  getPhoneNum: function (e) {
    this.setData({
      number: e.detail.value,
      phoneFlag: "visibility: hidden;",
    })
  },


  setregistData1: function () {
    this.setData({
      registBtnTxt: "注册中",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setregistData2: function () {
    this.setData({
      registBtnTxt: "注册",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#ff9900",
      btnLoading: !this.data.btnLoading
    });
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
            // getSmsCodeBtnColor: "#999",
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

      const res = await API.getVerifyCode({
        phoneNumber: {
          areaCode: this.data.areaCode,
          number: this.data.number,
        },
        purpose: 'REGISTER'
      });

      if(res.data.code === '80000'){
        Modal.confirm({
          message: '用户已存在，请直接登录',
          selector: '#cus-dialog',
          confirmCallback: function () {
            wx.redirectTo({
              url: '../login/index'
            })
          }
        });

      }
    }

  },
  redirectTo: function (param) {
    //需要将param转换为字符串
    param = JSON.stringify(param);
    wx.redirectTo({
      url: '../main/index?param=' + param //参数只能是字符串形式，不能为json对象
    })
  },

  transData: function () {
    
    this.setData({
      phonePH: convertChs.convert(this.data.phonePH, app.globalData.isTraditional),
      codePH: convertChs.convert(this.data.codePH, app.globalData.isTraditional),
    });
  },

})