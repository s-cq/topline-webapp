<template>
  <div class="search">
<van-search

  v-model="searchInput"
  placeholder="请输入搜索关键词"
  show-action
  shape="round"
  @search="onSearch(searchInput)"
  @input="onSearchInput"
>
  <div slot="action" @click="onSearch(searchInput)">搜索</div>
</van-search>
<!-- 联想建议 -->
<van-cell-group v-if="searchInput">

         <van-cell
         v-for="(item,index) in searchSuggestionList"
         :key="index"
        @click="onSearch(item)"

        >
             <div v-html="heightlight(item)" slot="title">
                 <van-icon  name="search" />
             </div>
         </van-cell>

</van-cell-group>
<!-- 历史记录 -->
<van-cell-group v-else>
         <van-cell
         title="历史记录"
        >
          <!-- <template >
            <span @click="searchHistory=[]">全部删除</span>&nbsp;
        <span @click=" isDshow = false">完成</span>
        </template>

        <van-icon  name="delete" /> -->
        <template v-if="isDshow">
            <span @click="searchHistory=[]">全部删除</span>&nbsp;
        <span @click=" isDshow = false">完成</span>
        </template>

        <van-icon v-else @click=" isDshow = true"  name="delete" size="20px"/>
         </van-cell>
          <van-cell
          v-for="(item,index) in searchHistory"
          :key="index"
          :title="item"
          @click="onSearch(item)"
        >
        <van-icon v-show="isDshow"  @click.stop="searchHistory.splice(index,1)" name="close" />
        <!-- <div slot="title">{{item}}</div> -->
         </van-cell>

</van-cell-group>

  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/storage'
import { searchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'Search',
  data () {
    return {
      searchInput: '', // 搜索框
      searchSuggestionList: [], // 联想搜素哦
      searchHistory: getItem('History') || [], // 历史记录
      isDshow: false // 历史记录出现

    }
  },
  watch: {
    searchHistory (newVal) {
      setItem('History', newVal)
    }
  },
  methods: {
    // =========================  获取联想建议（自动补全）=============
    // 鼠标在输入框中时/
    onSearchInput: debounce(async function () {
      let searchInput = this.searchInput.trim()
      if (!searchInput) {
        this.searchSuggestionList = []
        return
      }
      let { data } = await searchSuggestion({
        q: this.searchInput })
      this.searchSuggestionList = data.data.options
    }, 300),
    // 点击搜索后才有历史记录
    onSearch (str) {
      // 不能出现重复
      let same = this.searchHistory.indexOf(str)
      if (same) {
        this.searchHistory.splice(same, 1)
      }
      this.searchHistory.unshift(str)
      setItem('History', this.searchHistory)
      this.$router.push(`/search/${str}`)
    },
    // 关键字高亮
    heightlight (str) {
      let reg = new RegExp(this.searchInput, 'g')
      return str.replace(reg, `<span style="color:red">${this.searchInput}</span>`)
    }
  }
}
</script>

<style>

</style>
