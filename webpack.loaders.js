
module.exports =  [
	{
		test: /\.jsx?$/,
		exclude: /node_modules/,
		loader:'babel',
		cacheDirectory: true,
		presets: ['es2015-loose', 'stage-0', 'react']
	},
	{
		test: /\.(css|scss|saas)$/,
		loaders: ["style", "css?sourceMap&root=.",'postcss',"sass?sourceMap"]
	},
	{
		test: /\.json$/,
		loader: 'json'
	},
	{
		test: /\.jpg|\.png|\.gif|\.bmp$/,
		loader: 'file',
		query: {
			name: '/img/[name].[ext]'
		}
	},
	{
		test: /\.(woff2?)(\?.*)?$/,
		loader: 'url',
		query: {
			limit: 10000,
			mimetype: 'application/font-woff',
			prefix: 'fonts',
			name: '/fonts/[name].[ext]'
		}
	},
	{
		test: /\.ttf(\?.*)?$/,
		loader: 'url',
		query: {
			limit: 10000,
			mimetype: 'application/octet-stream',
			prefix: 'fonts',
			name: '/fonts/[name].[ext]'
		}
	},
	{
		test: /\.svg(\?.*)?$/,
		loader: 'url',
		query: {
			limit: 10000,
			mimetype: 'image/svg+xml',
			prefix: 'fonts',
			name: './fonts/[name].[ext]'
		}
	}

]
