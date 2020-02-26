/*
 * @Description: 
 * @Author: clc
 * @Date: 2019-12-12 18:38:00
 * @LastEditors: clc
 * @LastEditTime: 2019-12-13 11:32:57
 */

import {debounce} from '@/utils/utils'
 
class Logger {
  constructor() {
    this.max = 1000
    this.min = -1
    this.addRecord = debounce(this.addRecord.bind(this))
    this.clean() 
  }

  clean() {
    this.index = this.min
    this.records = []
  }

  jump(index) {
    if(!index || index < this.min || index > this.max) {
      return false
    } else {
      this.index = index
      return this.getCurrentRecord()
    }
  }

  addRecord(record) {
    if(this.index >= this.max) {
      this.records.shift()
      this.index--
    }
    this.records.length = this.index + 1
    this.records.push(record)
    this.index++
  }

  getCurrentRecord() {
    return this.records[this.index] || ''
  }

  prevRecord() {
    if(this.index <= this.min) {
      return false
    }
    this.index--
    return this.getCurrentRecord()
  }

  nextRecord() {
    if(this.index >= this.records.length - 1) {
      return false
    }
    this.index++
    return this.getCurrentRecord()
  }
}

export default Logger