import createUniStore from 'unistore'
import devtools from 'unistore/devtools'

const initialState = {
  tab: 0
}

const createStore = (s = {}) => {
  const state = { ...initialState, ...s }
  return process.env.NODE_ENV === 'production'
    ? createUniStore(state)
    : devtools(createUniStore(state))
}

export default createStore

export const actions = () => ({
  changeTab: (store, event, tab) => {
    return {
      tab
    }
  }
})
