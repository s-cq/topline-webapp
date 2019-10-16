<template>
  <div class="home">
    <van-nav-bar  fixed>
      <van-button class="searchBtn" size="small"  round  type="info" slot="title">搜索</van-button>
    </van-nav-bar>

    <van-tabs v-model="active" swipeable>
      <!-- 面包菜单 -->
      <div slot="nav-right" @click="isChannelShow=true" class="wap-nav">
         <van-icon name="wap-nav" />
      </div>
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
         <!-- 下拉更新数据 -->
        <van-pull-refresh v-model="channel.isLoading" @refresh="onRefresh">
         <!-- 列表内容 -->
            <van-list
                v-model="channel.loading"
                :finished="channel.finished"
                finished-text="没有更多了"
                @load="onLoad"
              >

                <van-cell
                  v-for="item in channel.article"
                  :key="item.art_id.toString()"
                  :title="item.title"
                >
                <!-- /文章列表 -->
                <div slot="label">
                  <van-grid :column-num="3">
                    <van-grid-item
                    v-for="(img,index) in item.cover.images"
                    :key="index"
                    >
                    <van-image
                    width="100"
                    height="100"
                    lazy-load
                    :src="img"
                  />
                    </van-grid-item >
                  </van-grid>
                  <div>
                    <div class="article-info">
                      <div class="meta">
                      <span> 作者：{{ item.aut_name }} </span>
                      <span> 评论数：{{ item.comm_count }} </span>
                      <span> {{ item.pubdate}} </span>
                      </div>

                    </div>
                  </div>
                </div>
                </van-cell>

            </van-list>
         <!-- /列表内容 -->
         </van-pull-refresh>
          <!-- 下拉更新数据 -->
         </van-tab>
    </van-tabs>
<!-- 弹出层 -->
      <van-popup
        v-model="isChannelShow"
        round
        position="bottom"
        :style="{ height: '90%' }"
      >
      <div class="box">
      <van-cell title="我的频道" >
          <van-button @click="isEdit=!isEdit" type="primary" size="small">
            {{ isEdit? '编辑':'编辑' }}</van-button>
      </van-cell>

       <van-grid :gutter="10" :column-num="5">
          <van-grid-item text="推荐" @click="myRecommend(0)"/>
              <!-- slice返回新数组不对原数组操作 -->
              <van-grid-item
                 v-for="(channel,index) in channelsList.slice(1)"
                :key="index"
                :text="channel.name"
                @click ='removeChannel(index)'
              >
              <van-icon v-show="isEdit" class="close-ico" slot="icon" name="close" />
              <!-- {{ channel.name }} -->
              </van-grid-item>
       </van-grid>
        <van-cell title="推荐频道" />
         <van-grid :gutter="10" :column-num="4">
              <van-grid-item
                v-for="(item,index) in getRecommendChnnel"
                :key="index"
                :text="item.name"
                @click="addChannel(item)"
              />
       </van-grid>
      </div>
      </van-popup>
  </div>

</template>

<script>

import { getChannels, getAllChannels } from '@/api/channels' // 获取频道列表//获取全部频道
import { getArticles } from '@/api/article' // 获取文章信息
import { setItem, getItem } from '@/utils/storage' // 获取文章信息

export default {
  name: 'HomIndex',
  data () {
    return {
      isEdit: false,
      isChannelShow: false, // 是否显示碳层
      active: 0,
      channelsList: [], // [{article/loading/id/name/finished},{}]
      allChannels: [] // 所有频道
    }
  },
  watch: {
    channelsList (newVal) {
      setItem('aaa', newVal)
    }
  },
  computed: {
    // 获取推荐频道
    getRecommendChnnel () {
      var arr = []
      this.allChannels.forEach(channel => {
        let aaa = this.channelsList.find(item => item.id === channel.id)
        if (!aaa) {
          arr.push(channel)
        }
      })
      return arr
    }

  },
  methods: {
    // =============================上拉更新===========
    async onLoad () {
      const activeChannel = this.channelsList[this.active]

      let params = {
        channel_id: activeChannel.id,
        with_top: 1,
        timestamp: activeChannel.pre_timestamp || Date.now()
      }
      let { data } = await getArticles(params) // 频道新闻推荐
      // console.log(data.data.results)

      // 文章信息放到article数组中
      activeChannel.article.push(...data.data.results)

      activeChannel.loading = false
      // 判断先一个时间戳 给出finished
      if (data.data.pre_timestamp) {
        activeChannel.pre_timestamp = data.data.pre_timestamp
      } else {
        activeChannel.finished = true
      }
    },
    // ===================获取频道============
    async Channels () {
      var ischannelhave = getItem('aaa')
      if (!ischannelhave) {
        const { data } = await getChannels()
        const activeChannel = data.data.channels
        // activeChannel.forEach(item => {
        //   item.article = [] // 存储频道的文章列表
        //   item.loading = false // 上拉更新结束
        //   item.finished = false // 加载完成
        //   item.pre_timestamp = null // 请求前一页历史数据的时间戳
        //   item.isLoading = false // 下拉设置为 false，表示加载完成。
        // })
        this.bianli(activeChannel)
        this.channelsList = activeChannel
      } else {
        this.channelsList = ischannelhave
      }
    },
    // =============================下拉更新===========
    async onRefresh () {
      const activeChannel = this.channelsList[this.active]
      // console.log(activeChannel)
      let { data } = await getArticles({
        channel_id: activeChannel.id,
        with_top: 1,
        timestamp: Date.now()
      })
      activeChannel.article.unshift(...data.data.results)
      activeChannel.isLoading = false
      this.$toast('刷新成功')
    },
    // =================获取所有频道=============
    async getAll () {
      const { data } = await getAllChannels() // 获取全部频道
      // console.log(data)
      const activeChannel = data.data.channels
      this.bianli(activeChannel)
      this.allChannels = data.data.channels
    },
    // =============点击==》》 加入我的频道===========
    addChannel (channel) {
      this.channelsList.push(channel)
    },
    // =============点击==》》 移出我的频道===========
    removeChannel (index) {
      if (this.isEdit) {
        this.channelsList.splice(index, 1)
      } else {
        this.active = index
        this.isChannelShow = false
      }
    },
    myRecommend (index) {
      this.active = index
      this.isChannelShow = false
    },
    // 遍历选中的频道
    bianli (channel) {
      channel.forEach(item => {
        item.article = [] // 存储频道的文章列表
        item.loading = false // 上拉更新结束
        item.finished = false // 加载完成
        item.pre_timestamp = null // 请求前一页历史数据的时间戳
        item.isLoading = false // 下拉设置为 false，表示加载完成。
      })
    }
  },
  created () {
    this.Channels() // 获取用户频道列表s
    this.getAll() // 获取全部频道列表s
  }

}
</script>

<style lang="less" scoped>
.searchBtn{
  width: 100%;
  background-color: #5babfb;
}
// 面包菜单
  .wap-nav {
    font-size: 25px;
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }
.home {
  // 作者、评论、
  .article-info{
    display: flex;
    align-items: center;
    justify-content:space-around ;
    .meta span {
      margin-right: 10px;
    }
  }
  .van-tabs{
    // 首页频道推荐
   /deep/  .van-tabs__wrap{
          position: fixed;
        top:46px;
        z-index: 2;
        left: 0;
        right: 15px;
    }
    // 推荐内容
    /deep/  .van-tabs__content{
        margin-top: 90px;
        margin-bottom: 50px;
    }
  }
  // 我的频道
  .box{
    margin-top: 20px;
    .close-ico{
      position: absolute;
      top: -8px;
      right: -5px;
    }

  }

}
</style>
