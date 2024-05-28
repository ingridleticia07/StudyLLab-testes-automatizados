const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    health_touch: "./src/health_touch.test.ts",
    registrations: "./src/registrations.test.ts",
    user_profile: "./src/user_profile.test.ts",
  },
  output: {
    path: path.resolve(__dirname, "out"),
    libraryTarget: "commonjs",
    filename: "[name].test.bundle.js",
  },
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader" },
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }, // Modified rule to only target .ts files
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Modified resolve property to only include .ts and .js files
  },
  externals: /k6(\/.*)?/,
  watch: true,
};
