<!--
 * @Description: 
 * @Author: clc
 * @Date: 2019-12-05 10:36:49
 * @LastEditors: clc
 * @LastEditTime: 2019-12-13 11:52:50
 -->
<template>
  <div class="container" :style="{height: height, width: width}">
    <div class="editer" spellcheck="false" contenteditable ref="editer" @keydown.ctrl.90="back" @keydown.ctrl.89="forward"></div>
    <div class="tool">
    
    </div>  
  </div>
</template>

<script>
import {debounce} from '@/utils/utils'
import HostParser from '@/assets/js/hostParser'

class CharacterMutation {
  
  constructor(options) {
    const {el, config, handler} = options
    this.el = el
    this.handler = handler
    this.config = Object.assign({
      childList: true,
      characterData: true,
      subtree: true
    }, config)
    this.initial()
  }

  initial() {
    const observer = this.observer = new MutationObserver(this.handler)
    this.connect()
  }

  connect() {
    const {el, config} = this
    this.observer.observe(el, config)
  }

  disconnect() {
    this.observer.disconnect()
  }

}

const getLastChild = el => {
  if(!el || !el.nodeType) {
    return el
  }
  
  const lastChild = el.lastChild
  
  if(lastChild) {
    return getLastChild(lastChild)
  } else {
    return el
  }
}

export default {
  data() {
    return {
      // 光标占位符
      rangePlaceholder: '{|}',
      // 编辑器文本内容
      editerText: '',
      // 解析器
      parser: null,
      // 是否正在输入
      // 主要用来处理中文输入的问题
      inputing: false
    }
  },
  props: {
    width: {
      type: String,
      default: '580px'
    },
    height: {
      type: String,
      default: '600px'
    },
    ipStylt: {
      type: String,
      default: 'color: #1890ff'
    },
    domainStylt: {
      type: String,
      default: 'color: green'
    },
    commentsStylt: {
      type: String,
      default: 'color: #ccc'
    },
    content: {
      type: String,
      default: '# switch hosts'
    }
  },
  computed: {
    editer() {
      return this.$refs.editer
    }
  },
  mounted() {
    this.emiter = debounce(this.emiter, 1000)
    this.editerText = this.content
    this.mutationObserver = new CharacterMutation({
      handler: this.textParser,
      el: this.editer
    })
    this.listenComposition()
    this.initialParser()
    this.doParser()
  },
  destory() {
    this.mutationObserver.disconnect()
    this.mutationObserver = null
  },
  methods: {
    // 初始化解析器
    initialParser() {
      window.parser = this.parser = new HostParser({
        styles: {
          ip: 'color: #1890ff',
          domain: 'color: green',
          comments: 'color: #ccc'
        }
      })
    },
    textParser() {     
      // 是否输入完成
      // 中文输入需要判断
      if(this.inputing) {
        return
      }
      // 插入光标描述符
      // 用文本记录当前光标位置
      document.execCommand('insertText', true, this.rangePlaceholder)
      this.editerText = this.editer.innerText 
      this.doParser()
      // 删除光标标记
      this.editerText = this.editerText.replace(this.rangePlaceholder, '')
    },
    doParser() {
      // 解析文本
      this.parser.parse(this.editerText)
      // 渲染编辑器
      this.editerRender()
      // 通知
      this.emiter()
    },
    editerRender() {
      const el = this.editer
      // 关闭监听
      this.mutationObserver.disconnect()
      // 插入新 HTML
      el.innerHTML = ''
      el.appendChild(this.parser.getFragment())
      // 设置光标
      this.setRange()
      // 重新开启监听
      this.mutationObserver.connect()
    },
    getParserHost() {
      const hosts = []
      this.parser.linesParseData.forEach(item => {
        const matches = item.matches
        if(matches.host) {
          const [ip, host] = matches.host
          hosts.push({
            ip: ip.match,
            host: host.match
          })
        }
      })
      return hosts
    },
    setRange() {
      const anchor = this.editer.querySelector('.anchor')
      if(anchor) {
        let startContainer = anchor.previousSibling || anchor.nextSibling || anchor
        let lastChild = getLastChild(startContainer)
        let flag = !!anchor.previousSibling
        let startOffset = flag ? (lastChild.length || 0) : 0
        let selection = document.getSelection()
        let range = document.createRange()
        range.setStart(lastChild, startOffset)
        selection.removeAllRanges()
        selection.addRange(range)
        anchor.remove()
      }
    },
    listenComposition() {
      const editer = this.editer
      // 监听连串输入, 主要是中文输入法
      // https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionstart
      editer.addEventListener('compositionstart', () => this.inputing = true)
      editer.addEventListener('compositionend', () => {
        this.inputing = false
        this.textParser()
      })
    },
    back() {
      if(this.parser.back()) {
        this.editerRender()
      }
    },
    forward() {
      if(this.parser.forward()) {
        this.editerRender() 
      }
    },
    emiter() {
      const hosts = this.getParserHost()
      this.$emit('change', hosts, this.editerText)
    }
  },
  watch: {
    content: {
      deep: true,
      handler() {
        if(this.editerText !== this.content) {
          this.editerText = this.content 
          this.doParser()
        }
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
.editer {
  flex-grow: 1;
  padding: 15px 20px;
  outline: 0;
  overflow-y: scroll;
  letter-spacing: .8px;
  height: 100%;
}
.tool {
  min-width: 40px;
  height: 100%;
}
.editer p {
  padding: 0 0 5px;
}
</style>