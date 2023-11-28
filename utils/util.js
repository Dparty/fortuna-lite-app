function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function regexConfig() {
  var reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: {
      '86': /^1(3|4|5|7|8)\d{9}$/,
      '852': /^([4|5|6|7|8|9])\d{7}$/,
      '853': /^[6]\d{7}/,
    },
  }
  return reg;
}

function promisic(func) {
  return function (params = {}) {
    return new Promise((resolve, reject) => {
      const args = Object.assign(params, {
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
      func(args);
    })
  }
}

const getNowDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}


//参数为格式化日期
var unixtime = function (strtime = false) { //不传入日期默认今日
  strtime = strtime.replace(/-/g, '/') //解决低版本解释new Date('yyyy-mm-dd')这个对象出现NaN
  if (strtime) {
    var date = new Date(strtime);
  } else {
    var date = new Date();
  }
  var time1 = date.getTime(); //会精确到毫秒---长度为13位
  var time2 = date.valueOf(); //会精确到毫秒---长度为13位
  var time3 = Date.parse(date) / 1000; //只能精确到秒，毫秒将用0来代替---长度为10位
  return time3;
}

var formatDate = function (time) { //时间戳转日期
  let date = new Date(parseInt(time) * 1000);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return y + '年' + MM + '月' + d + '日';
  // return y + '-' + MM + '-' + d;
}


module.exports = {
  formatTime: formatTime,
  regexConfig: regexConfig,
  promisic: promisic,
  getNowDate: getNowDate,
  unixtime: unixtime,
  formatDate: formatDate,
}