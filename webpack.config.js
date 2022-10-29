const webpack = require("@nativescript/webpack");
const { resolve } = require('path');


module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

  // workaround for gmaps
  webpack.chainWebpack(config => {
	  config.resolve.alias.set('./map-view', resolve(__dirname, 'node_modules/@nativescript/core'));
  })


	return webpack.resolveConfig();
};


