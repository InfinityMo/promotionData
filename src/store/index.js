import Vue from 'vue'
import Vuex from 'vuex'
// import axios from './common/network/request'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spinning: false, // 加载loading的状态
    cacheData: [], // 当前页面剩余的数据
    userData: {}
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
      state.cacheData = payload
    },
    SAVEUSERINFO (state, payload) {
      state.userData = payload
    }
  },
  // 配置异步提交状态
  actions: {
    getUserInfo ({ commit }, form) {
      return new Promise((resolve, reject) => {
        // axios.post('/getUser').then(res=>{

        // })
        commit('SAVEUSERINFO', {
          userID: 'TL-0001',
          userName: 'TEST',
          userImg: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1694681277,1453280371&fm=26&gp=0.jpg',
          userId: 'rewr31254fadsagrssda'
        })
        sessionStorage.setItem('userData', JSON.stringify({
          userID: 'TL-0001',
          userName: 'TEST',
          userImg: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1694681277,1453280371&fm=26&gp=0.jpg',
          userId: 'rewr31254fadsagrssda'
        }))
        resolve(true)
        // setTimeout(() => {
        //   resolve({
        //     userName: 'TL-0001',
        //     userImg: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1694681277,1453280371&fm=26&gp=0.jpg',
        //     userId: 'rewr31254fadsagrssda'
        //   })
        // }, 500)
      })
    }
  },
  // 配置store模块
  modules: {
    // menu
  }
})
