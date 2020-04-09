import { doLogin,doLogout } from '@/api/login'
import {
  removeMobile,
  getSessionToken,
  setSessionToken,
  removeSessionToken
} from '@/utils/auth'

const user = {
  state: {
    token: getSessionToken() 
  },
  mutations: {
    set_userToken: (state, token) => {
      state.token = token
    }
  },
  actions: {
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        doLogin(userInfo)
          .then(response => {
            const resp = response.data
            if(resp.ret===0){
             setSessionToken(resp.data.token)
            }
            resolve(resp) 
          })
          .catch(error => {
            reject(error)
          })
      })
    },
     //登出
     logout({ commit }) {
      return new Promise((resolve, reject) => {
        doLogout()
          .then(response => {
            const resp = response.data
            removeSessionToken()
            removeMobile()
            resolve(resp)
          })
          .catch(error => {
            removeSessionToken()
            removeMobile()
            reject(error)
          })
      })
    },
  }
}
export default user
