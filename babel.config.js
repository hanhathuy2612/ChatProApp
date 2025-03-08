/* eslint-env node */
/** @type {import("@babel/core").TransformOptions["plugins"]} */
const plugins = [
  /** react-native-reanimated web support @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#web */
  "@babel/plugin-proposal-export-namespace-from",
  ["@babel/plugin-proposal-decorators", { legacy: true }],
  "react-native-reanimated/plugin",
  "react-native-paper/babel",
]

/** @type {import("@babel/core").TransformOptions} */
// eslint-disable-next-line no-undef
module.exports = function(api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
    plugins,
  }
}
