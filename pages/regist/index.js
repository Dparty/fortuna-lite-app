var util = require("../../utils/util.js");
// 获取应用实例
const app = getApp()
const convertChs = require('../../utils/simp_trad_chs.js');
const {
  API
} = require('../../api/api.js');


Page({
  data: {
    registBtnTxt: "立即入会",
    registBtnBgBgColor: "#F8D585",
    getSmsCodeBtnTxt: "获取验证码",
    // getSmsCodeBtnColor:"#ff9900",
    // getSmsCodeBtnTime:60,
    btnLoading: false,
    registDisabled: false,
    smsCodeDisabled: false,

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
    // 页面切换
    isToggled: false,

    // 日期筛选
    currentDate: util.getNowDate(new Date()),
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
    currentChoose: 0,

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
    stUserName: 0,
  },


  /* 文本框聚焦时更改状态*/
  userNameFocus: function (e) {
    console.log(e)
    this.setData({
      stUserName: 1
    })
  },
  /* 文本框失焦时更改状态*/
  userNameBlur: function (e) {

    this.setData({
      stUserName: 0
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      areaCode: this.data.areaCodeArray[e.detail.value].id
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
    console.log('value值为：', e.detail.value);
    this.setData({
      gender: e.detail.value
    })
  },


  bindUserNameChange: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  bindDateChange: function (e) {
    console.log(e);
    this.setData({
      birthday: e.detail.value
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
    this.configTitle();
  },
  // 修改标题
  configTitle() {
    wx.setNavigationBarTitle({
      title: convertChs.convert("笔记", app.globalData.isTraditional)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const that = this
    that.setData({
      isTraditional: app.globalData.isTraditional || false
    })
    that.configTitle()
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

  formSubmit: async function (e) {
    var param = e.detail.value;

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
      birthday: Date.parse(new Date(this.data.birthday))
    };

    console.log(data);

    const res = await API.register(data);

    console.log(res);

    wx.setStorage({
      key: "token",
      data: res.token
    });

    // this.mysubmit(param);
  },

  verificationCodeChange: function (e) {
    this.setData({
      verificationCode: e.detail.value
    })
  },

  // mysubmit: function (param) {
  //   var flag = this.checkPhone(param.username) && this.checkPassword(param) && this.checkSmsCode(param)
  //   var that = this;
  //   if (flag) {
  //     this.setregistData1();
  //     setTimeout(function () {
  //       wx.showToast({
  //         title: '成功',
  //         icon: 'success',
  //         duration: 1500
  //       });
  //       that.setregistData2();
  //       that.redirectTo(param);
  //     }, 2000);
  //   }
  // },

  // phone number
  getPhoneNum: function (e) {
    const number = e.detail.value;
    this.setData({
      number
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
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的手机号码'
      });
      return false;
    }
  },
  // checkPassword:function(param){
  //   var userName = param.username.trim();
  //   var password = param.password.trim();
  //   if(password.length<=0){
  //     wx.showModal({
  //       title: '提示',
  //       showCancel:false,
  //       content: '请设置密码'
  //     });
  //     return false;
  //   }else if(password.length<6||password.length>20){
  //     wx.showModal({
  //       title: '提示',
  //       showCancel:false,
  //       content: '密码长度为6-20位字符'
  //     });
  //     return false;
  //   }else{
  //     return true;
  //   }
  // },
  getSmsCode: async function () {
    var number = this.data.number;
    var that = this;
    var count = 60;
    if (this.checkPhone(number)) {
      var si = setInterval(function () {
        if (count > 0) {
          count--;
          that.setData({
            getSmsCodeBtnTxt: count + ' s',
            getSmsCodeBtnColor: "#999",
            smsCodeDisabled: true
          });

        } else {
          that.setData({
            getSmsCodeBtnTxt: "获取验证码",
            // getSmsCodeBtnColor:"#ff9900",
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
        }
      });

    }

  },
  // checkSmsCode: function (param) {
  //   var smsCode = param.smsCode.trim();
  //   var tempSmsCode = '000000'; //演示效果临时变量，正式开发需要通过wx.request获取
  //   if (smsCode != tempSmsCode) {
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '请输入正确的短信验证码'
  //     });
  //     return false;
  //   } else {
  //     return true;
  //   }
  // },
  redirectTo: function (param) {
    //需要将param转换为字符串
    param = JSON.stringify(param);
    wx.redirectTo({
      url: '../main/index?param=' + param //参数只能是字符串形式，不能为json对象
    })
  }

})