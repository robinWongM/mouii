import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    post: null,
    count: null,
    comments: []
  },
  mutations: {
    update (state, [post, count, comments]) {
      state.post = post
      state.count = count
      state.comments = comments
      console.log(state.count)
    }
  },
  actions: {
    fetchComments (context) {
      Vue.http.get(
        'http://localhost:3000/mouii/list',
        {
          params: {
            url: document.location.pathname
          }
        })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        context.commit('update', [
          res.message.post,
          res.message.count,
          res.message.comments
        ])
      })
      .catch((error) => {
        console.error(error)
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'/* ,
  plugins: [
    createPersistedState({
      key: 'mouii_0_1_0'
    })
  ] */
})
