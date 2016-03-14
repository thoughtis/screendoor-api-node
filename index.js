/**
 * Screendoor API interactions
 */

/**
 * Require request module
 */

var request = require( 'request' );

/**
 * Declare Screendoor Class
 *
 * @param string api_key
 */

var Screendoor = function( api_key ){

	this.api = {
		host 	: 'https://screendoor.dobt.co/api',
		v 		: '0',
		key 	: api_key
	};

};

/**
 * Declare Prototype Object
 */

Screendoor.prototype = {};

/**
 * Produce API URL
 *
 * @param object options
 * 			string path
 *			mixed { object | array } params
 *
 * @return string url
 */

Screendoor.prototype.url = function( options ) {

	var url = this.api.host + options.path;
		url += '?v=' + this.api.v;
		url += '&api_key=' + this.api.key;

	if( 'params' in options ) {

		for ( i in options.params ) {

			url += '&' + i.toString() + '=' + options.params[i].toString();

		}

	}

	return url;

}

/**
 * Get Projects by Site
 *
 * @param mixed { string|int } site_id
 */

Screendoor.prototype.getSiteProjects = function( site_id, callback ) {

	var self 	= this,
		url 	= self.url( {

		path : '/sites/' + site_id + '/projects'

	} );

	self.request( 'GET', url, null, function( err, result ) {

		if ( err ) {
			return callback( err, null );
		}

		return callback( null, result );

	} );

};

/**
 * Get Project
 *
 * @param mixed { string|int } site_id
 * @param mixed { string|int } project_id
 */

Screendoor.prototype.getProject = function ( site_id, project_id, callback ) {

	var self 	= this,
		url 	= self.url({

		path : '/sites/' + site_id + '/projects/' + project_id

	} );

	self.request( 'GET', url, null, function ( err, result ) {

		if ( err ) {
			return callback( err, null );
		}

		return callback( null, result );

	} );

};

/**
 * Get Form Fields by Project
 *
 * @param mixed { string|int } project_id
 */

Screendoor.prototype.getProjectFields = function( project_id, callback ) {

	var self 	= this,
		url 	= self.url({

		path : '/projects/' + project_id + '/response_fields'

	} );

	self.request( 'GET', url, null, function ( err, result ) {

		if ( err ) {
			return callback( err, null );
		}

		return callback( null, result );

	} );

};

/**
 * Get Responses by Project
 *
 * @param mixed { string|int } project_id
 */

Screendoor.prototype.getProjectResponses = function ( project_id, params, callback ) {

	var self = this,
		url = self.url( {

			path : '/projects/' + project_id + '/responses',
			params: params

		} );

	self.request( 'GET', url, null, function ( err, result ) {

		if ( err ) {
			return callback( err, null );
		}

		return callback( null, result );

	} );

};

/**
 * Get Single Response
 *
 * @param mixed { string|int } project_id
 * @param mixed { string|int } response_id
 * @param string response_format
 */

Screendoor.prototype.getProjectResponse = function ( project_id, response_id, response_format, callback ) {

	var self = this,
		url = self.url({

			path : '/projects/' + project_id + '/responses/' + response_id,
			params : {
				response_format : response_format || 'raw'
			}

	});


	self.request( 'GET', url, null, function ( err, result ) {

		if ( err ) {

			return callback( err, null );

		}

		return callback( null, result );

	} );

};

/**
 * Set Response by Project
 *
 * @param mixed { string|int } project_id
 */

Screendoor.prototype.setProjectResponse = function( project_id, response_fields, options, callback ) {

	var self 	= this,
		url 	= self.url({

		path : '/projects/' + project_id + '/responses'

	});

	var data = {

		'response_fields' : response_fields || {},
		'skip_email_confirmation': true,
		'skip_notifications': true,
		'skip_validation': true,
		'labels': []

	};

	for ( i in options ) {
		if ( i in data ) {
			data[i] = options[i];
		}
	}

	self.request( 'POST', url, data, function ( err, result ) {

		if ( err ) {
			return callback( err, null );
		}

		return callback( null, result );

	} );

};

/**
 * Update Project Response
 * @todo include other fields!
 */

 Screendoor.prototype.updateProjectResponse = function( project_id, response_id, response_fields, options, callback ) {

 	var self 	= this,
		url 	= self.url({

		path : '/projects/' + project_id + '/responses/' + response_id

	});

	var data = {

		'labels': [],
		'status' : ''

	};

	for ( i in options ) {
		if ( i in data ) {
			data[i] = options[i];
		}
	}

 	self.request( 'PUT', url, data, function ( err, result ) {

		if ( err ) {
			return callback( err, null );
		}

		return callback( null, result );

	} );

 };

/**
 * Upload File
 *
 * @param mixed { string|int } field_id
 * @param string base64 encoded_file
 * @param object file_options
 * 		filename : string
 *		contentType : string
 */


Screendoor.prototype.uploadFile = function( field_id, encoded_file, file_options, callback ){

	var self 	= this,
		url 	= self.url( {

		path : '/form_renderer/file',
		params : {
			response_field_id : field_id
		}

	} );

    var data = {

    	file : {

    		value : new Buffer( encoded_file, 'base64' ),
    		options : file_options

    	}

    };

    self.request( 'POST', url, data, function( err, result ){

		if ( err ) {

			return callback( err, null );

		}

		if ( ! 'ok' in result || true !== result.ok ) {

			return callback( new Error( 'File Upload Error' ), null );

		}

		return callback( null, result );

	} );

};

/**
 * Request
 *
 * @param string method
 * @param string url
 * @param mixed { object | null } data
 */

Screendoor.prototype.request = function( method, url, data, callback ){

	var options = {

		method : method,
		url : url

	};

	if ( null !== data ) {

		var key = ( 'file' in data ? 'formData' : 'form' );

			// Document this!

			key = ( 'PUT' === method ? 'formData' : key );

		options[key] = data;

	}

	request( options, function( err, httpResponse, body ){

    	if ( 'statusCode' in httpResponse && 200 !== httpResponse.statusCode ){

    		return callback( new Error( 'Unusable status in response.' ), null );

    	}

    	var result = JSON.parse( body );

    	if ( 'errors' in result ){

    		return callback( new Error( result.errors ), null );

    	}

    	return callback( null, result );

	} );

};

module.exports = Screendoor;