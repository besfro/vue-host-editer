# vue-host-editer
vue host 编辑器
将输入内容转化成JSON对象


![image](https://raw.githubusercontent.com/besfro/vue-host-editer/master/public/preview.jpg)


# Install

```
npm i --save vue-host-editer
```

# Use
```html
<template>
  <div>
    <HostEditer :content="content" @change="change"></HostEditer>
  </div>
</template>

<script>
import VueHostEditer from "vue-host-editer"

export default {
  name: 'app',
  data() {
    return {
      content: `# vue host editer \n127.0.0.1 localhost\n127.0.0.1:8100 yourhost.com # comments`
    }
  },
  components: {
    HostEditer
  },
  methods: {
    change(hosts, parserData, editerText) {
      console.log(hosts, parserData, editerText)
    }
  }
}
</script>
```




