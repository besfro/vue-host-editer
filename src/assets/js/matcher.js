/*
 * @Description: 
 * @Author: clc
 * @Date: 2019-12-10 10:48:21
 * @LastEditors: clc
 * @LastEditTime: 2019-12-13 15:13:58
 */

import {type} from '@/utils/utils' 

class Matcher {
  // @params {Array.<Object>} rules - array of rules objects
  // @params {String} rules[].key - key of rule
  // @params {RegExp|Function} ruels[].test - test input
  // @params {String|RegEpx} rules[].regexp - regexp to match
  constructor(rules) {
    if(!type.isArray(rules)) {
      console.error(new Error('params must be Array.<Object>'))
      return false
    }
    // match rules
    this.config = {
      rules: rules || this.getDefaultRules()
    }
    // format rules
    this.normalize()
  }

  normalize() {
    this.rules = []
    this.config.rules.forEach((item, index) => {
      const {key, test, regexp} = item
      this.rules.push({
        key: key || index,
        test: this.createTest(test),
        regexp: this.createRegexp(regexp)
      })
    }) 
  }

  getDefaultRules() {
    return [{
      key: 'trim',
      test: () => true,
      regexp: '^\\s*'
    }]
  }

  createTest(test) {
    if(!test) {
      return () => true
    }

    let newTest
    
    if(type.isFunction(test)) {
      newTest = test
    } else if(type.isRegexp(test)) {
      newTest = text => test.test(text)
    } else if(type.isString(test)) {
      let regexp = this.createRegexp(test)
      newTest = text => regexp.test(text)
    } else {
      throw new Error('rules params test must be {Function|Regexp|String}')
    }

    return newTest
  }

  createRegexp(regexp) {
    let newRegexp

    if(type.isString(regexp)) {
      try {
        newRegexp = new RegExp(regexp)
      } catch(e) {
        console.error(e)
      }
    } else if(type.isRegexp(regexp)) {
      newRegexp = regexp
    } else {
      throw new Error('rules params regexp must be {String|Regexp}')
    }
    
    return newRegexp
  }

  // 将字符串解析成host信息
  // return {Object} e.g.
  // {
  //   matches: {Array.<Object>},
  //   input: {String},
  //   plainText: {Boolean}
  // }
  match(text) {
    const parseInfo = {
      input: text,
      plainText: true,
      matches: {}
    }
    this.rules.forEach(item => {
      const {test, regexp, key} = item
      if(test(text)) {
        const matches = this._match(text, regexp)
        if(matches) {
          parseInfo.matches[key] = matches
          parseInfo.plainText = false
        }
      }
    })
    return parseInfo
  }

  // 匹配文本, 返回包含匹配信息的数据
  // return {Object} e.g.
  // {
  //    end: 44
  //    match: "#  127.0.0.1 fdfdf # local host 192.162.2.3"
  //    start: 1
  //  }
  _match(text, regexp) {
    const match = text.match(regexp)
    if(match) {
      const matchInfo = [] 
      let _text = text
      let start = 0
      let end = 0
      match.shift()
      match.forEach(item => {
        start = end + _text.indexOf(item)
        end = start + item.length - 1
        _text = _text.substr(end + 1)
        matchInfo.push({
          id: `m-${matchInfo.length}-${start}-${end}`,
          start,
          end,
          match: item
        })
        start = ++end
      })
      return matchInfo
    } else {
      return false
    }
  }
}

export default Matcher