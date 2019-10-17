<template>
  <div class="serchResult">
      <van-nav-bar
      :title="'有关'+$route.params.p+'的搜索结果'"
      fixed
      left-arrow
      @click-left="$router.back()"
      />
      <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"

>
  <van-cell
    v-for="(item,index) in list"
    :key="index"
    :title="item.title"
  />
</van-list>
  </div>
</template>

<script>
import { searchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1

    }
  },
  methods: {

    async onLoad () {
      // 一
      let { data } = await searchResult({
        page: this.page,
        q: this.$route.params.p
      })
      console.log(data)

      // 二
      this.list.push(...data.data.results)

      // 三
      this.loading = false
      //   四
      if (data.data.page) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }

}

</script>

<style lang="less" scoped>
.van-nav-bar{
.van-icon-arrow-left{
    color: #fff
}
}
</style>
