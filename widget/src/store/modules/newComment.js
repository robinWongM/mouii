const state = {
  name: '',
  email: '',
  website: ''
}

const mutations = {
  update (type, value) {
    this.state[type] = value
  }
}

export default {
  state,
  mutations
}
