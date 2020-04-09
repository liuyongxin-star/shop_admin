import Vue from "vue";
import Vuex from "vuex";
import navBar from "./modules/navBar";
import getters from "./getters"
import user from "./modules/user"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {},
  modules: {
    navBar,
    user
  },
  getters,
  actions: {
    changeData(context,data){
      ////////console.log(context,data)
      context.commit("changeData",data)
    }
  }
});
