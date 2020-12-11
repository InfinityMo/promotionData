import { dateFormat } from './funcStore'
// 最近30天
export function getLastThirtyDay () {
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth() + 1// 0-11表示1-12月
  var day = now.getDate()
  var dateObj = {}
  dateObj.now = year + '-' + month + '-' + day
  var nowMonthDay = new Date(year, month, 0).getDate() // 当前月的总天数
  if (month - 1 <= 0) { // 如果是1月，年数往前推一年<br>
    dateObj.last = (year - 1) + '-' + 12 + '-' + day
  } else {
    var lastMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate()
    if (lastMonthDay < day) { // 1个月前所在月的总天数小于现在的天日期
      if (day < nowMonthDay) { // 当前天日期小于当前月总天数
        dateObj.last = year + '-' + (month - 1) + '-' + (lastMonthDay - (nowMonthDay - day))
      } else {
        dateObj.last = year + '-' + (month - 1) + '-' + lastMonthDay
      }
    } else {
      dateObj.last = year + '-' + (month - 1) + '-' + day
    }
  }
  return dateObj
}

// 最近7天
export function getLastSevenDay () {
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth() + 1// 0-11表示1-12月
  var day = now.getDate()
  var dateObj = {}
  dateObj.now = year + '-' + month + '-' + day
  if (day - 7 <= 0) { // 如果在当月7日之前
    var lastMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate() // 1周前所在月的总天数
    if (month - 1 <= 0) { // 如果在当年的1月份
      dateObj.last = (year - 1) + '-' + 12 + '-' + (31 - (7 - day))
    } else {
      dateObj.last = year + '-' + (month - 1) + '-' + (lastMonthDay - (7 - day))
    }
  } else {
    dateObj.last = year + '-' + month + '-' + (day - 7)
  }
  return dateObj
}
// 上周
export function prevWeek () {
  var now = new Date()
  var nowYear = now.getYear()
  var nowMonth = now.getMonth()
  var nowDay = now.getDate()
  var nowDayOfWeek = now.getDay()
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7)
  var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1)
  console.log(dateFormat('YYYY-mm-dd', weekStartDate))
  console.log(dateFormat('YYYY-mm-dd', weekEndDate))
}
