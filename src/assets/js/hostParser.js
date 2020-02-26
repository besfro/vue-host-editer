/*
 * @Description: 
 * @Author: clc
 * @Date: 2019-12-05 14:54:48
 * @LastEditors: clc
 * @LastEditTime: 2019-12-13 17:17:31
 */

import Logger from '@/assets/js/logger' 
import Matcher from '@/assets/js/matcher' 

class HostParser {
  constructor(options = {}, context = document) {
    this.text = ''
    this.context = context
    this.tagName = options.tagName || 'p'
    // 锚文本
    // 匹配的文本会被替换成 <span class="anchor"></span>
    this.anchorText = options.anchorText || '{|}'
    this.style = options.styles || this._getDefaultStyle()
    this.rules = options.rules || this._getDefaultRules()
    this.initial()
  }

  initial() {
    this.matcher = new Matcher(this.rules)
    this.logger = new Logger()
    this.clean()
  }

  addRule(rule) {
    this.rules.push(rule)
    this.matcher = new Matcher(this.rules)
  }
  
  parse(text) {
    this.text = text
    this.clean()
    // 拆分行
    const lines = this._formatArray(
      text.split(/\n/)
    )

    lines.forEach(item => {
      // 如果是空行
      if(!item || item === ' ') {
        item = '&nbsp;'
      }

      if(item === this.anchorText) {
        item = `&nbsp;${this.anchorText}`
      }

      console.log(item)

      const parseInfo = {}
      // 锚文本
      const anchorText = this.anchorText
      const findAnchorIndex = item.indexOf(anchorText)
      if(findAnchorIndex !== -1) {
        item = item.replace(anchorText, '')
        parseInfo.anchorIndex = findAnchorIndex
      }

      Object.assign(
        parseInfo,
        this.matcher.match(item)
      )
      
      this._replace(parseInfo)
      this._addLine(parseInfo)
    })
    
    // 记录解析结果 用户回退
    this.logger.addRecord(this.linesParseData)
  }

  back() {
    const record = this.logger.prevRecord()
    this._setHistory(record)
    return record
  }

  forward() {
    const record = this.logger.nextRecord()
    this._setHistory(record)
    return record
  }

  find(text) {
    const matches = this.matches = this.matches || []
    if(matches.length <= 0) {
      this.linesParseData.filter(item => {
        Object.keys(item.matches).forEach(key => {
          const matchesItem = item.matches[key]
          matchesItem.forEach(matchItem => matches.push(matchItem))
        })
      }) 
    }
    
    return matches.filter(item => item.match === text)
  }

  // 获取代码片段
  getFragment() {
    const linesParseData = this.linesParseData
    const fragment = this.context.createDocumentFragment()
    if(linesParseData.length > 0) {
      this.linesParseData.forEach(item => fragment.appendChild(item.el)) 
    }
    return fragment
  }

  toString() {
    const arr = []
    this.linesParseData.forEach((item, index) => arr.push(`${index > 0 ? '\n' : ''}${item.replace}`))
    return arr.join('')
  }

  clean() {
    this.linesParseData = []
    this.matches = []
  }

  _setHistory(lineData) {
    lineData && lineData.forEach(item => this._createLineElement(item))
    this.linesParseData = lineData || []
  }

  // 添加解析数据
  _addLine(options) {
    const id = `h-parser-l-${this.linesParseData.length}`
    const lineInfo = Object.assign({
      id,           // id
      input: '',    // 127.0.0.1 yourdomain.com # 测试环境host
      replace: '',  // <span class="ip">127.0.0.1</span> yourdomain.com # 测试环境host
      el: null,
    }, options)

    // 创建 element
    this._createLineElement(lineInfo)
    this.linesParseData.push(lineInfo)
  }

  _replace(parseInfo) {
    const text = parseInfo.input
    const textArr = this._string2Array(text)
    const matches = parseInfo.matches
    
    Object.keys(matches).forEach(key => {
      const capture = matches[key]
      const rule = this.rules.filter(item => item.key === key)[0] 
      capture.forEach((info, index) => {
        const {start, end, match, id} = info
        let style = '', className = ''
        rule.onCapture && rule.onCapture({
          setStyle: v => style += v,
          setClass: v => className += v,
          captureIndex: index,
          style: this.style,
          match
        })
        this._insertTagString({
          textArr,
          start, 
          end, 
          id,
          style, 
          className
        })
      })
    })

    // 插入空锚
    const anchorIndex = parseInfo.anchorIndex
    if(anchorIndex || anchorIndex === 0) {
      textArr.splice(anchorIndex, 0, this._createTagString({className: 'anchor'}))
    }

    parseInfo.replace = textArr.join('')
  }

  _createLineElement(lineInfo) {
    // 创建 element
    const el = this.context.createElement(this.tagName)
    el.id = lineInfo.id
    el.hpLine = true
    el.innerHTML = lineInfo.replace
    el.style.cssText = 'margin: 0; padding: 0 0 5px 0; letter-spacing: 1px;'
    lineInfo.el = el
    // 创建 match element
    const matches = lineInfo.matches
    Object.keys(matches).forEach(key => {
      const item = matches[key]
      item.forEach(matchItem => {
        matchItem.el = el.querySelector(`#${matchItem.id}`)
      })
    })
  }

  _insertTagString({
    textArr, 
    start, 
    end, 
    id,
    style,
    className
  }) {
    if(start === end) {
      const text = this._formatValue(textArr[start])
      textArr.splice(start, 1, this._createTagString({id, style, className, text}))
    } else {
      const startText = this._formatValue(textArr[start])
      const endText = this._formatValue(textArr[end])
      textArr.splice(start, 1, this._createTagString({id, style, className, text: startText, type: 'left'}))
      textArr.splice(end, 1, this._createTagString({text: endText, type: 'right'}))
    }
  }

  _createTagString({
    id,
    style, 
    className, 
    text = '', 
    tagName = 'span', 
    // all - 创建闭合标签
    // left - 创建开始标签
    // right - 创建结束标签
    type = 'all'
  }) {
    
    const idString = id ? `id="${id}" ` : ''
    const classString = className ? `class="${className}" ` : ''
    const attrString = `${idString}${classString}style="display: inline; ${style || ''}"`
    
    if(type === 'all') {
      return `<${tagName} ${attrString}>${text}</${tagName}>`      
    } else if(type === 'left') {
      return `<${tagName} ${attrString}>${text}`
    } else if(type === 'right') {
      return `${text}</${tagName}>`
    }
  }

  _formatValue(value = '') {
    return value.replace(/\s/g, '&nbsp;')
  }

  _string2Array(str = '') {
    const arr = str.split('')
    return this._formatArray(arr, text => this._formatValue(text))
  }

  _formatArray(arr, process) {
    const formatArr = []
    arr.forEach(item => {
      // 数组处理
      // 去掉多余空行
      // 将空格符转义
      item && formatArr.push(
        process ? process(item) : item
      ) 
    })
    return formatArr
  }

  _getDefaultStyle() {
    return {
      ip: 'color: red',
      domain: 'color: green',
      comments: 'color: #ccc'
    }
  }

  _getDefaultRules() {
    const startRegexpStr = '^\\s*'
    const hostRegexpStr = '((?:\\d{1,3}\\.){3}\\d{1,3}(?:\\:\\d+)*)(?:\\s+)([a-z]+(?:\\.[a-z]+)*)'
    const commentsRegexpStr = '(#+.*)'
    return [
      {
        key: 'comments',
        regexp: commentsRegexpStr,
        onCapture({setStyle, setClass, style}) {
          setStyle(style.comments)
          setClass('comments')
        }
      },
      {
        key: 'host',
        test: `${startRegexpStr}${hostRegexpStr}`,
        regexp: hostRegexpStr,
        onCapture({setStyle, setClass, style, captureIndex}) {
          if(captureIndex === 0) {
            setStyle(style.ip)
            setClass('ip')
          } else if(captureIndex === 1) {
            setStyle(style.domain)
            setClass('domain')
          }
        }
      }
    ]
  }

  //
  _getDefaultLineData() {
    return {
      textArr: [],
      el: null,
    }
  }

}

export default HostParser