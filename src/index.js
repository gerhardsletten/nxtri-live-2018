import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './state/store'
import Root from './Root'

require('jspolyfill-array.prototype.find')

const store = createStore(window.__DATA)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('container')
  )
}

render(Root)

if (module.hot) {
  module.hot.accept('./Root', () => {
    render(Root)
  })
}
