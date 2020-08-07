// import Vue from 'vue'
import Vuex from 'vuex'
import Vue from 'vue';
import { CategoryCollection } from '../resource';
import { isEmpty } from 'lodash';
Vue.use(Vuex)

const categoryCollection = CategoryCollection.getInstance();

const store = () => new Vuex.Store({
  state: {
    categoryCollection: {}

  },
  mutations: {
    updateCategoryCollection (state, payload) {
      state.categoryCollection = payload;
    },

  },
  actions: {
    'category/fetchList': async context => {
      if (isEmpty(context.state.categoryCollection)) {
        await categoryCollection.fetchList()
        context.commit('updateCategoryCollection', categoryCollection)
      }
    }
  },
  getters: {
  }
})

export default store;