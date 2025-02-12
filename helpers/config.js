const packageConfig = require( './package-config' );
const path = require( 'path' );
const once = require( 'lodash/once' );
const browserslist = require( 'browserslist' );


/**
 * Get a config for our /config directory merged with any
 * matching configuration from the project directory.
 *
 * For instance if we have a file named config/babel.config.js in our project
 * we will merge the contents with our config/babel.config.js in favor of whatever
 * is specified with the project's file.
 *
 * @param {String} fileName
 * @returns {object}
 */
function getConfig( fileName ) {
	let config = require( '../config/' + fileName );
	try {
		let localConfig = require( path.resolve( packageConfig.workingDirectory + '/config', fileName ) );
		config = {...config, ...localConfig};
	} catch ( e ) {
	}
	return config;
}

/**
 * If browserslist is not specified, we fallback to WordPress defaults.
 *
 * Return false if a browserslist is specified in the current project.
 *
 * @link https://github.com/browserslist/browserslist#config-file
 *
 * @return {false | string[]}
 */
const getDefaultBrowsersList = once( () => {
	if ( browserslist( browserslist.defaults ) === browserslist() ) {
		return require( '@wordpress/browserslist-config' );
	}
	return false;
} );

module.exports = {
	getDefaultBrowsersList,
	getConfig,
};
