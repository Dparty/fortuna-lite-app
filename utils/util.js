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

function regexConfig(){
  var reg = {
    email:/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone:{
      '86': /^1(3|4|5|7|8)\d{9}$/,
      '852': /^([4|5|6|7|8|9])d{7}$/,
      '853': /^[6]\d{7}/,
    },
  }
  return reg;
}

function promisic (func) {
  return function(params= {}) { 
      return new Promise((resolve,reject)=> {
          const args = Object.assign(params,{
              success:res=>{
                  resolve(res)
              },
              fail:err=>{
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
  return [year, month,day].map(formatNumber).join('-')
}


module.exports = {
  formatTime: formatTime,
  regexConfig:regexConfig,
  promisic: promisic,
  getNowDate: getNowDate
}
