// import Vue from 'vue'
import Vuex from 'vuex'
import Vue from 'vue';
import { CategoryCollection } from '../resource';
import { isEmpty } from 'lodash';

const categoryCollection = CategoryCollection.getInstance();

export default {
  state: () => ({
    categoryCollection: {}
  }),
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
}
