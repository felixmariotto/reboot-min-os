const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

//

module.exports = env => {

	let mode = "development";
	let devtool = 'eval-source-map';
	let minimize = false;

	const environment = JSON.stringify( env.NODE_ENV );

	// Prod environment
	if ( env.NODE_ENV === 'prod' ) {
		devtool = false;
		// comment these two lines out to keep Webpack from minimizing the code :
		minimize = true;
		mode = 'production';
	};

	return {

		mode: mode,

		entry: {
			'bundle': './src/site/index.js',
			'engine': './src/engine/index.js',
		},

		output: {
			filename: '[name].js',
		}, 

		devServer: {
			contentBase: './dist'
		},

		optimization: {
			minimize: minimize
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: './src/site/index.html',
				inject: false
			}),
			// 'prod' or 'dev', bundled in the modules as the __API__ global variable.
			// We use this to know which domain to connect to with socket.io, among other things.
			new webpack.DefinePlugin({
				__API__: environment
			})
		],

		devtool: devtool,

		module: {

			rules: [

				{
					test: /\.(png|jpg|)$/,
					use: [
						'file-loader',
					],
				},

				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},

			],

		}

	}

};
