import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    post: null,
    count: null,
    comments: [],
    loaded: false
  },
  mutations: {
    update (state, [post, count, comments]) {
      state.post = post
      state.count = count
      state.comments = comments
      state.loaded = true
    },
    addComment (state, [comment, index]) {
      state.comments.splice(index + 1, 0, comment)
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
        if (!context.state.loaded) {
          // Inital Load
          console.log(error)
        }
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
