<template>
  <div id="app">
    <h1 class="title">Vue Host Editer</h1>
    <div id="container">
      <HostEditer :content="content" @change="change"></HostEditer>
      <pre>{{parserData}}</pre>
    </div>
  </div>
</template>

<script>
import HostEditer from '@/components/HostEditer.vue'

export default {
  name: 'app',
  data() {
    return {
      content: `# vue host editer \n127.0.0.1 localhost`,
      parserData: ''
    }
  },
  components: {
    HostEditer
  },
  methods: {
    change(hosts, parserData, editerText) {
      const arr = []
      parserData.forEach(item => {
        const {input, matches} = item
        arr.push({input, matches})
      })
      this.parserData = JSON.stringify(arr, null, 4)
    }
  }
}
</script>

<style>
body {
  background: #f5f5f5
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  font-weight: lighter;
}
.title {
  font-size: 60px;
  text-align: center;
  font-weight: 300;
  font-style: italic;
  color: #1890ff;
}
#container {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
pre {
  width: 500px;
  height: 600px;
  display: inline-block;
  overflow-y: scroll
}

pre::-webkit-scrollbar {
  width: 4px;
  height: 14px;
  background: rgba(0, 0, 0, 0);
}

pre::-webkit-scrollbar-thumb {
  border-radius: 60px;
  background: rgba(0, 0, 0, .3)
}
</style>
