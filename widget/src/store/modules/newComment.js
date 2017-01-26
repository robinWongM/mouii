const state = {
  name: '',
  email: '',
  website: ''
}

const mutations = {
  newComment_update (state, obj) {
    state[obj.field] = obj.value
  }
}

export default {
  state,
  mutations
}
