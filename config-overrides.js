const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const rewireStyledComponents = require('react-app-rewire-styled-components')
const path = require('path')

module.exports = function override(config, env) {
  config = rewireStyledComponents(config, env)
  config = rewireReactHotLoader(config, env)

  if (process.env.ANALYZE) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      })
    )
  }
  if (env === 'production') {
    config.resolve.alias['react'] = path.resolve(__dirname, './src/helpers/preact-compat')
    config.resolve.alias['react-dom'] = path.resolve(__dirname, './src/helpers/preact-compat')
  }
  return config
}
