import Vue from 'vue'
import Vuex from 'vuex'
import { createUUID } from '@/common/utils/funcStore'
import axios from '@/common/network/request'
import { Message } from 'element-ui'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spinning: false, // 加载loading的状态
    cacheData: [], // 当前页面剩余的数据
    userData: {},
    trackId: createUUID(),
    permissionsCode: '',
    userPower: []
  },
  getters: {
    getCacheData: state => state.cacheData,
    getUserData (state) {
      const userData = state.userData || {}
      if (Object.keys(userData).length <= 0) {
        state.userData = JSON.parse(sessionStorage.getItem('userData'))
      }
      return state.userData || {}
    }

  },
  mutations: {
    // 突变配置加载loading的状态
    SETSPINNING (state, payload) {
      state.spinning = payload
    },
    SAVECACHEDATA (state, payload) {
      state.cacheData = []
      state.cacheData = payload
    },
    SAVEUSERINFO (state, payload) {
      state.userData = payload
    },
    SAVEPERMISSIONSCODE (state, payload) {
      state.permissionsCode = payload
    },
    SAVEUSERPOWER (state, payload) {
      state.userPower = payload
    }
  },
  // 配置异步提交状态
  actions: {
    getUserInfo ({ commit }, form) {
      return new Promise((resolve, reject) => {
        axios.post('/login', form).then(res => {
          const { data } = res
          if (res.errorCode === 1) {
            // 将用户信息保存在session中
            sessionStorage.setItem('userData', JSON.stringify({
              staffId: data.userName
            }))
            commit('SAVEPERMISSIONSCODE', data.permissionsCode)
            commit('SAVEUSERPOWER', data.permissions)
            resolve(true)
          } else if (res.errorCode === 1000) {
            Message.warning('用户名或密码有误，请核对用户名或密码')
          } else if (res.errorCode === 1001) {
            Message.error('当前账号无访问权限，请联系管理员')
          }
        })
      })
    }
  },
  // 配置store模块
  modules: {
    // menu
  }
})
