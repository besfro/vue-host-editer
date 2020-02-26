/*
 * @Description: 常用JS工具
 * @Author: clc
 * @Date: 2019-08-27 12:00:17
 * @LastEditors: clc
 * @LastEditTime: 2019-12-10 11:02:21
 */

/**
 * @description: 返回参数的数据类型
 * @param {Any} 
 * @return {String}  
 */ 
const _type = o => {
  const str = Object.prototype.toString.call(o)
  return str.replace(/\[object (.)(.+)\]/, (match, first, sec) => `${first.toLocaleLowerCase()}${sec}`)
}

// 是否为数组
const isArray = o => _type(o) === 'array'

// 是否为 Object
const isObject = o => _type(o) === 'object'

// 是否为 Number
const isNumber = o => _type(o) === 'number'

// 是否为 String
const isString = o => _type(o) === 'string'

// 是否为 Function
const isFunction = o => _type(o) === 'function'

// 是否为 isPromise
const isPromise = o => _type(o) === 'promise'

// 是否为 Blob
const isBlob = o => _type(o) === 'blob'

// 是否为 Blob
const isRegexp = o => _type(o) === 'regexp'

const type = {
  isArray, isNumber, isString, isRegexp,
  isObject, isFunction, isBlob, isPromise
} 

/** 
 * @description: 四舍五入算法 
 * @param {Number} num - 需要四舍五入的数据
 * @param {Number} decimal - 要保留小数位 def - 2 
 * @return {Number} 计算后的结果
 */
const toFixed = (num = 0, decimal = 2) => {
  const pow = Math.pow(10, decimal)
  return Math.round(num * pow) / pow
}

/**
 * @description: 查询参数解析方法 
 * @param {String} query - 查询参数字符串 ( .e.g. ?institueName=第三新&age=20 )
 * @return {Object} 返回键值对象 ( .e.g. {institueName: 第三新, age: 20} )
 */
const queryParser = str => {
  const fn = queryParser
  // 有缓存 返回缓存
  if(fn.cache && fn.cache[str]) {
    return fn.cache[str]
  }
  // 
  const obj = {}
  const reg = /(?:\?|&)?(\w+)=([%\w\u4e00-\u9fa5]+)/ig
  // 只处理字符串
  if(isString(str)) {
    str.replace(reg, (input, key, val) => {
      obj[key] = val
    })
    // 添加到缓存
    fn.cache = {
      ...fn.cache,
      [str]: obj
    }
  }
  return obj
}

const delay = (fn, time = 500) => {
  return (...args) => {
    return setTimeout(() => fn && fn(...args), time)
  }
}

/**
 * @description: 防抖动
 * @param {Function} fn - 需要防抖的方法 
 * @param {Number} delay - 多少秒的防抖
 * @return {Function}
 */
const debounce = (fn, duration = 1000) => {
  let timeout
  let newFn = delay(fn, duration)
  if(isFunction(fn)) {
    return (...args) => {
      clearTimeout(timeout)
      timeout = newFn(...args)
    }
  }
}

/**
 * @description: 在数组指定位置插值  
 * @param {Array} arr - 需要插值的数组
 * @param {Number} index - 插值的位置
 * @param {Array} insertArr - 需要插入的值 
 * @return {Array} 返回新数组
 */
const arrInsert = (arr, index, insertArr) => {
  const newArr = [...arr]
  newArr.splice(index, 0, ...insertArr)
  return newArr
}

const deepCopy = o => {
  let reValue
  if(isObject(o)) {
    reValue = {}
    Object.keys(o).forEach(key => {
      reValue[key] = deepCopy(o[key])
    })
  } else if(isArray(o)) {
    reValue = []
    o.forEach(item => reValue.push(deepCopy(item)))
  } else {
    reValue = o
  }
  return reValue
}

const trim = str => {
  if(!isString(str)) {
    return str
  }
  return str.replace(/^\s*|\s*$/g, '')
}

export {
  type,
  toFixed,
  queryParser,
  debounce,
  arrInsert,
  delay,
  deepCopy,
  trim
}