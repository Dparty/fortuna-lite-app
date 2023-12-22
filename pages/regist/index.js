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
    genderFlag: "visibility: hidden;",

    phoneFocus: false,
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
          if (res.token) {
            // 登錄成功設置token
            wx.setStorage({
              key: "token",
              data: res.token
            });
            wx.reLaunch({
              url: '../index/index'
            })
          }
        }
      }else{
        Modal.confirm({
          message: '登录失败',
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

      this.setData({
        phoneFocus: true
      })

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

  showAgreement: function(){
    Modal.confirm({
      style:" height: 1000rpx !important;  width: 600rpx !important; overflow-y:scroll;display: flex; justify-content: start; text-align: left !important; padding: 20px 10px 20px 10px;",
      textStyle: "text-align: left !important; width: 95%",
      message: '《“財神薈” 移動裝置應用程式及微信小程序：收集使用者個人資料用戶同意聲明》\n\n 本人同意及允許天福集團有限公司： \n\n•	根據澳門特別行政區現行法規及《隱私政策》收集、儲存、處理及使用“財神薈”用戶或使用者的個人資料；\n\n •	在具法定義務之情況下，向澳門特別行政區具權限監管機構、司法機構和執法機構披露及轉移有關資料，以便他們履行其法定職能；及 •	為市場研究及其他載於《隱私政策》中之目的而使用有關資料進行分析。\n\n 本人清楚明白上述個人身份資料的收集目的及《隱私政策》，自願、完全且無保留地同意有關使用目的及《隱私政策》之內容，並理解如對本聲明內容、本地區之個人資料保護法規或《隱私政策》有任何疑問，應自行尋求法律意見。',
      selector: '#cus-dialog',
      confirmCallback: function () {
      }
    });
  },

  showPolicy: function(){
    Modal.confirm({
      style:" height: 1000rpx !important;  width: 600rpx !important; overflow-y:scroll;display: flex; justify-content: start; text-align: left !important; padding: 20px 10px 20px 10px;",
      textStyle: "text-align: left !important; width: 95%",
      message: 'Cookies及隱私政策 \n\n------------------------------ \n\n〝財神薈〞移動裝置應用程式及微信小程序 Cookies 使用政策 天福集團有限公司〝財神薈〞移動裝置應用程式及微信小程序（下稱〝財神薈〞或〝應用程式〞）使用 Cookies 來令 閣下獲得最佳的瀏覽體驗。若繼續瀏覽財神薈小程序，即表示 閣下同意天福集團有限公司使用 閣下的 Cookies。詳情請見天福集團有限公司的 Cookies 使用政策。 \n\n------------------------------\n\n非常歡迎 閣下瀏覽財神薈，為了讓 閣下能夠安心的使用本應用程式之的各項服務與資訊，特此向 閣下說明財神薈的隱私權保護政策，以保障 閣下的權益。在本政策中，“個人資料”指可以識別 閣下作為一名個自然人的任何信息，它包括由 閣下向天福集團有限公司（下稱“天福公司”）提供的資料，或者天福公司通過下述方式及從不同的來源所收集得來的資料。個人資料可包括但不限於 閣下的姓名、年齡、性別以及電話號碼。 請務必仔細閱讀本政策，以便了解天福公司如何以及為何使用 閣下的個人資料，並明瞭天福公司在此方面的政策和操作。\n\n 1. 隱私權保護政策的適用範圍 隱私權保護政策覆蓋天福公司在線上及線下如何收集、存儲、使用 閣下的個人資料，本政策包括天福公司通過自身的不同渠道所收集的個人資料，包括但不限於其移動裝置應用程式。請注意，天福公司可能會把透過官方渠道（如移動裝置應用程式等）所收集得來的個人資料與天福公司透過其他渠道（如天福公司社交媒體、第三方調研公司等）所收集得來的個人資料相結合。 隱私權保護政策內容，包括天福公司如何處理在 閣下使用財神薈服務時收集到的個人資料。隱私權保護政策不適用於財神薈以外的相關連結網站，也不適用於非天福公司應用程式所委託或參與管理的人員。 \n\n2. 非個人資料的蒐集及其處理 當 閣下造訪財神薈或由財神薈下載資料，天福公司所用的電腦系統有可能會透過第三方的Google Analytics、Matomo等分析工具自動記錄以下的技術資料： 閣下所在的互聯網域名、IP 地址及所在地區； 閣下開始瀏覽的日期及時間； 閣下所瀏覽的應用程式頁面；UID（裝置識別碼）及所瀏覽的內容；以及閣下由其他網站的超連結進入財神薈時該網站的域名等。 一般情況下，收集這些訊息的目的是作統計記錄用途。除非發現該等訪問對天福公司進行敵意攻擊，否則不會通過這些資料去追查瀏覽者。\n\n 3. 個人資料的蒐集及其處理 當閣下造訪財神薈或使用財神薈所提供之特別功能服務時，有可能需要提供個人資料，而需提供的資料項目則視乎於所申請服務的要求，如下：\n\t (i) 讓天福公司與閣下聯絡的資料，例如閣下的姓名或電話號碼。\n\t (ii) 讓 閣下登入特定帳戶時所需的資料，例如電話號碼。 \n\t(iii) 閣下的行為特徵的統計資料，包括出生日期、年齡、性別、地理位置等資料。\n\t (iv) 基於 閣下使用天福公司服務的經驗而自願與天福公司分享的資料。\n\t (v) 閣下在社交媒體或應用程序上創建並與天福公司分享的內容，又或上傳至財神薈的內容，當中包括使用社交網絡應用程式。\n\t (vi) 閣下在社交媒體或應用程序上公開分享的信息，或者 閣下在第三方社交媒體或應用程序上的個人資料，並允許第三方社交網絡與天福公司分享的資料。\n\t (vii) 天福公司可能會與第三方合作提供用戶相關的資料，在此情況下，如該第三方同意承擔與天福公司同等的保護用戶隱私的責任，則天福公司可將用戶的註冊資料等提供給該第三方。\n\t (viii) 根據適用的法律， 閣下與天福公司的對話可能會因應營運所需（包括用於質量監控或培訓目的）而被錄音。天福公司會在對話開始時告知 閣下有關錄音的信息。 財神薈的工作人員在處理有關資料時，均會遵守澳門特別行政區第8/2005號法律《個人資料保護法》之規定。閣下所提供的個人資料之處理會受到保密措施規範，並得到妥善保存。所收集的個人資料會保存至該等資料無須再被用於收集時所作的用途，或到達政府規定的保存期限，屆時該等資料將按有關規定銷毀。 閣下須注意在網絡上傳送資料時，有關的資料（包括個人資料）在公開網絡上傳送存在一定風險，有可能被未經許可的第三人讀取或使用，故在使用電子或數碼方式向天福公司提供任何資料（包括個人資料）時，亦會存在上述風險。財神薈的使用者須要自負有關風險，倘閣下對有關風險感到不安，請使用財神薈以外的其他方式向天福公司提供資料。\n\n 4. 資料之保護 財神薈均設有適當的安全設備及必要的安全防護措施，加以保護應用程式，且對個人資料採用嚴格的保護措施，只由經過授權的人員才能接觸 閣下的個人資料。使用者有權向天福公司查閱及修改保存於財神薈上的使用者個人資料。\n\n 5. 網站對外的相關連結 財神薈提供其他網站的網路連結，閣下也可經由財神薈所提供的連結，點選進入其他網站。按下這些連結去到其他網站時，表示你已經離開財神薈。這些網站的隱私方針很可能有別於財神薈，天福公司對這些網站之內容及其隱私方針不負任何責任，同時建議 閣下於有需要時先了解這些網站的隱私方針。\n\n 6. Cookie之使用 當閣下瀏覽〝財神薈〞時，天福公司有可能會使用〝cookies〞技術記錄使用者的使用情況，資料主要用於對〝財神薈〞進行設定，以提供個人化的瀏覽體驗。如果閣下的瀏覽器啟動了偵測 cookies設置，則每次存儲 cookies 的時候均可能收到警告訊息。 \n\n7. 隱私權保護政策之修正 財神薈隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於應用程式上並註明生效日期，不作另行公佈。 8. 保留權利 天福公司保留對隱私政策的所有解釋權。 \n\n 9. 相關法律及管轄權 本隱私政策受澳門特別行政區法律的管轄，引起的一切爭議應以澳門特別行政區法律為根據，使用者同意接受澳門特別行政區法院的專屬管轄。 生效日期 本隱私政策由2023年12月21日起生效。',
      selector: '#cus-dialog',
      confirmCallback: function () {
      }
    });
    // wx.showModal({
    //   title: '“財神薈” 移動裝置應用程式及微信小程序：收集使用者個人資料用戶同意聲明',
    //   showCancel: true,
    //   content: '本人同意及允許天福集團有限公司：\r\n•	根據澳門特別行政區現行法規及《隱私政策》收集、儲存、處理及使用“財神薈”用戶或使用者的個人資料；\r\n•	在具法定義務之情況下，向澳門特別行政區具權限監管機構、司法機構和執法機構披露及轉移有關資料，以便他們履行其法定職能；及 \r\n •	為市場研究及其他載於《隱私政策》中之目的而使用有關資料進行分析。 □ 本人清楚明白上述個人身份資料的收集目的及《隱私政策》，自願、完全且無保留地同意有關使用目的及《隱私政策》之內容，並理解如對本聲明內容、本地區之個人資料保護法規或《隱私政策》有任何疑問，應自行尋求法律意見。'
    // });
  }

})