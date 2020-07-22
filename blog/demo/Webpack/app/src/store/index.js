import Vuex from 'vuex';

const childModule = {
  state: {
    childCount: 0
  },
  mutations: {
    childIncrement (state) {
      state.childCount++
    }
  }
}


const store =  {
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  modules: {
    childModule
  }
}

export default store