<template>
  <div class="login">
    <van-nav-bar class="delu" title="登陆"></van-nav-bar>

    <van-cell-group>
      <ValidationObserver ref="loginForm">
        <ValidationProvider name="手机号" rules="required|phone" v-slot="{ errors }">
          <van-icon class="phone" name="phone-o" />
          <van-field
            v-model="user.mobile"
            clearable
            label
            placeholder="请输入手机号"
            :error-message="errors[0]"
          ></van-field>
        </ValidationProvider>

         <ValidationProvider name="验证码" rules="required|max:6" v-slot="{ errors }">
          <van-icon class="co" name="user-o" />
          <van-field
            v-model="user.code"
            type="password"
            label=""
            placeholder="请输入验证码"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </ValidationObserver>

      <van-button class="yuan" round size="mini">获取验证码</van-button>
      <div class="btn-box">
        <van-button @click="loginUser" class="btn" type="info">登陆</van-button>
      </div>
    </van-cell-group>

  </div>
</template>

<script>
// import request from '@/utils/request'
import { login } from '@/api/user'
import { setItem } from '@/utils/storage'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        code: '246810',
        mobile: '13911111111'
      }
    }
  },
  methods: {
    async loginUser () {
      const isValid = await this.$refs.loginForm.validate()
      if (!isValid) {
        return
      }
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: ''
      })
      try {
        const { data } = await login(this.user)
        console.log(data.data)
        // 存token到仓库
        this.$store.commit('setUser', data.data)
        // 存储到本地
        setItem('user', data.data)
        this.$toast.success('成功')
        this.$router.push('/')
      } catch (error) {
        this.$toast.fail('手机号或验证码错误')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .co,
  .phone {
    font-size: 20px;
    position: absolute;
    top: 12px;
    left: 38px;
    z-index: 1;
  }
  .co {
    top: 56px;
  }
  .yuan {
    position: absolute;
    z-index: 1;
    top: 59px;
    right: 30px;
    color: #666;
    padding: 0px 6px;
    background-color: #ccc;
  }
  .btn-box {
    padding: 20px;

    .btn {
      width: 100%;
      background-color: #6db4fb;
      color: #fff;
    }
  }
}
</style>
