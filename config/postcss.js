let config = require("../helpers/package-config");

let compileOptions = {
	map: true,
	processors: [
		require('postcss-import')({
			extension: 'pcss',
			plugins : [
				require( 'postcss-modules' )( {
					generateScopedName : '[name]_[local]__[hash:base64:4]',
					globalModulePaths : [
						new RegExp( '.*?' + config.theme_path.replace( /\//g, '\\\\' ) + 'pcss', "i" ), new RegExp( '.*?' + config.theme_path + 'pcss', "i" ),
					],
                    /**
                     * Custom output of css modules JSON file to specified location
                     * Also excludes json files from the global pcss files
                     */
                    getJSON: function(cssFileName, json) {
                        const path          = require('path');
                        const fse = require('fs-extra');
                        let directory = path.relative( config.theme_path.replace( /\//g, '\\\\' ), cssFileName ).replace( /\\/g, '/' ) + '/';
                        //exclude global pcss
                        if ( directory.substr(0,4) === 'pcss' ){
                            return;
                        }
                        let cssName       = path.basename(cssFileName, '.css');
                        let jsonFileName  = config.theme_path.replace( /\\/g, '/' ) + '_css-modules-json/' + directory.replace( cssName + '/','') + cssName + '.json';
	                    /**
	                     * We use the Sync method here to fix issues where JSON is not
	                     * being generated.
	                     *
	                     * @since 2019-01-22
	                     */
	                    fse.outputJsonSync(jsonFileName, json);
                    }
				} ),
			],
		}),
        require('postcss-custom-media'),
        require('postcss-nested'),
        //@link https://preset-env.cssdb.org/features
        //By default all stage 2 features work unless specified otherwise
        require('postcss-preset-env'),
        require('postcss-color-mod-function'),
        require('@lipemat/css-mqpacker'),
	],
	parser: require('postcss-scss'),
};

let minOptions = {
	map: false,
	processors: [
		require('postcss-clean')({
            level: 2
        }),
	],
};

module.exports = {
	toCSS : {
		options : compileOptions,
		files : {
			'<%= pkg.theme_path %><%= pkg.css_folder %><%= pkg.file_name %>.css': '<%= pkg.theme_path %>pcss/<%= pkg.file_name %>.pcss'
		},
	},

	min: {
		options: minOptions,
		files: {
			'<%= pkg.theme_path %><%= pkg.css_folder %><%= pkg.file_name %>.min.css': '<%= pkg.theme_path %><%= pkg.css_folder %><%= pkg.file_name %>.css'
		},
	},
};
