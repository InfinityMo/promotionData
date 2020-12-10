// 深拷贝
export function deepClone (obj) {
  const target = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object') {
        target[key] = deepClone(obj[key])
      } else {
        target[key] = obj[key]
      }
    }
  }
  return target
}
// 滚动条返回顶部
export function backTop () {
  const timer = setInterval(function () {
    const top = document.body.scrollTop || document.documentElement.scrollTop
    const speed = top / 4
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop -= speed
    } else {
      document.documentElement.scrollTop -= speed
    }
    if (top === 0) {
      clearInterval(timer)
    }
  }, 30)
}
// 时间格式化
export function dateFormat (fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}
