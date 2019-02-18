

export default function loader() {}

const generateAppFile = function (plugins) {
    const lines = [''];
    let i = 0;
    lines.push("import App from '@pluggable/core/ui/App';")
    for (let plugin of plugins) {
	lines.push('import Plugin_' + i + ' from "' + plugin + '";');
	i = i + 1;
    }
    lines.push('App.addPlugins([' + plugins.map((p, i) => 'Plugin_' + i).join(', ') + ']);');
    lines.push('')
    return lines.join('\n');
}


export function pitch(request) {
    if (!this.webpack)
	throw new Error('Only usable with webpack');
    var callback = this.async();
    var query = this.query; // loaderUtils.parseQuery(this.query);
    const worker = {};

    worker.options = {
	filename: '[hash].sharedapp.js',
	chunkFilename: '[id].[hash].sharedapp.js',
	namedChunkFilename: null
    };

    if (this.options && this.options.app && this.options.app.output) {
	for (var name in this.options.app.output) {
	    worker.options[name] = this.options.app.output[name];
	}
    }

    worker.compiler = this._compilation.createChildCompiler('sharedapp', worker.options);
    const plugins = query.plugins
    worker.compiler.runAsChild(function(err, entries, compilation) {
	const config = generateAppFile(plugins);
	console.log('Injecting app config', config)
	return callback(null, config);
    });
};
