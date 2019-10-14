<template>
  <div class="home">
    <van-nav-bar title="首页" />
    <!-- <van-tabs v-model="active">
      <van-tab :title="item.name" v-for="item in channelsList" :key="item.id">

        <van-list v-model="item.loading" :finished="item.finished" finished-text="没有更多了" @load="onLoad">

          <van-cell v-for="a in item.article" :key="a" :title="a" />
        </van-list>
      </van-tab>
    </van-tabs> -->
       <van-tabs v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channelsList"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <!--
          loading  控制上拉加载更多的 loading 效果
          finished 控制是否已加载结束
          finished-text 加载结束的提示文本
          @load="onLoad" 上拉加载更多触发的事件

          列表组件会在初始化的时候自动触发 load 事件调用 onLoad 方法
         -->
        <van-list
          v-model="channel.loading"
          :finished="channel.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- 列表内容 -->
          <van-cell
            v-for="item in channel.article"
            :key="item"
            :title="item"
          />
          <!-- /列表内容 -->
        </van-list>
        <!-- /文章列表 -->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getChannels } from '@/api/channels'
export default {
  name: 'Home',
  data () {
    return {
      active: 0,

      channelsList: [] // [{article/loading/id/name/finished},{}]

    }
  },

  methods: {
    onLoad () {
      const activeChannel = this.channelsList[this.active]
      // 1. 请求获取数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          // 2. 将数据添加到 当前频道.articles 中
          activeChannel.article.push(activeChannel.article.length + 1)
        }

        // 3. 结束本次 loading
        activeChannel.loading = false

        // 4. 判断数据是否已全部加载结束，如果没有数据了，将 finish 设置为 true
        if (activeChannel.article.length >= 40) {
          activeChannel.finished = true
        }
      }, 500)
    },
    async Channels () {
      const { data } = await getChannels()

      var a = data.data.channels
      a.forEach(item => {
        item.article = []
        item.loading = false
        item.finished = false
      })
      this.channelsList = a

      // console.log(this.channelsList)
    }
    // async Channels () {
    //   const { data } = await getChannels()
    //   this.channelsList = data.data.channels
    //   var a = this.channelsList
    //   a.forEach(item => {
    //     item.article = []
    //     item.loading = false
    //     item.finished = false
    //   })
    //   console.log(this.channelsList)
    // }
  },
  created () {
    this.Channels()
  }
}
</script>

<style>
</style>
