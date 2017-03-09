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

	if ( 'params' in options ) {

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

Screendoor.prototype.getSiteProjects = function( site_id, params, callback ) {

	var self 	= this,
		url 	= self.url( {

		path : '/sites/' + site_id + '/projects',
		params: params || {}

	} );

	self.request( 'GET', url, null, function( err, result, httpResponse ) {

		if ( err ) {
			return callback( err, null, httpResponse );
		}

		return callback( null, result, httpResponse );

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

	self.request( 'GET', url, null, function ( err, result, httpResponse ) {

		if ( err ) {
			return callback( err, null, httpResponse );
		}

		return callback( null, result, httpResponse );

	} );

};

/**
 * Get Form Fields by Project
 *
 * @param mixed { string|int } project_id
 */

Screendoor.prototype.getProjectFields = function( project_id, params, callback ) {

	var self 	= this,
		url 	= self.url({

		path : '/projects/' + project_id + '/response_fields',
		params: params || {}

	} );

	self.request( 'GET', url, null, function ( err, result, httpResponse ) {

		if ( err ) {
			return callback( err, null, httpResponse );
		}

		return callback( null, result, httpResponse );

	} );

};

/**
 * Get Responses by Project
 *
 * @param mixed { string|int } project_id
 * @param mixed { null|object } params
 *		sort: string
 *		direction: string
 * 		page: int
 * 		per_page: int
 */

Screendoor.prototype.getProjectResponses = function ( project_id, params, callback ) {

	var self = this,
		url = self.url( {

			path : '/projects/' + project_id + '/responses',
			params: params || {}

		} );

	self.request( 'GET', url, null, function ( err, result, httpResponse ) {

		if ( err ) {
			return callback( err, null, httpResponse );
		}

		return callback( null, result, httpResponse );

	} );

};

/**
 * Get All Data
 *
 * @param function fn
 * @param mixed { string|int } id
 * @param mixed { null|object } params
 *		sort: string
 *		direction: string
 * 		page: int
 * 		per_page: int
 */
Screendoor.prototype.getAll = function ( fn, id, params, callback ) {
	var self = this;
	var allData = [];
	var linkHeader = null;

	var getAllData = function ( page ) {
		params.page = page ? page : 1;

		fn.call( self, id, params, function (err, results, httpResponse ) {
			
			linkHeader = parse( httpResponse.headers.link );

			if ( err ) {
				return callback( err, null, httpResponse );
			}

			results.forEach( function ( result ) {	
				allData.push( result );
			} );

			if ( linkHeader && linkHeader.next ) {
				return getAllData( linkHeader.next.page );
			}

			callback( null, allData );
		});
	};

	getAllData();
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


	self.request( 'GET', url, null, function ( err, result, httpResponse ) {

		if ( err ) {

			return callback( err, null, httpResponse );

		}

		return callback( null, result, httpResponse );

	} );

};

/**
 * Set Response by Project
 *
 * @param mixed { string|int } project_id
 * @param mixed { null|object } response_fields
 * @param mixed { null|object } options
 */

Screendoor.prototype.setProjectResponse = function( project_id, response_fields, options, callback ) {

	var self 	= this,
		url 	= self.url({

		path : '/projects/' + project_id + '/responses'

	});

	/**
	 * @todo add labels
	 */

	var data = {

		'response_fields' : response_fields || {},
		'skip_email_confirmation': true,
		'skip_notifications': true,
		'skip_validation': true

	};

	if ( 'object' === typeof options ) {
		for ( i in options ) {
			if ( i in data ) {
				data[i] = options[i];
			}
		}
	}

	self.request( 'POST', url, data, function ( err, result, httpResponse ) {

		if ( err ) {
			return callback( err, null, httpResponse );
		}

		return callback( null, result, httpResponse );

	} );

};

/**
 * Update Project Response
 *
 * @param mixed { string|int } project_id
 * @param mixed { string|int } response_id
 * @param mixed { null|object } response_fields
 * @param mixed { null|object } options
 */

 Screendoor.prototype.updateProjectResponse = function( project_id, response_id, response_fields, options, callback ) {

 	var self 	= this,
		url 	= self.url({

		path : '/projects/' + project_id + '/responses/' + response_id

	});

	var data = {

		response_fields : response_fields || {},
		force_validation : false,
		labels : [],
		status : []

	};

	if ( 'object' === typeof options ) {
		for ( i in options ) {
			if ( i in data ) {
				data[i] = options[i];
			}
		}
	}

 	self.request( 'PUT', url, data, function ( err, result, httpResponse ) {

		if ( err ) {
			return callback( err, null, httpResponse );
		}

		return callback( null, result, httpResponse );

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

    self.request( 'POST', url, data, function( err, result, httpResponse ) {

		if ( err ) {

			return callback( err, null );

		}

		if ( ! 'ok' in result || true !== result.ok ) {

			return callback( new Error( 'File Upload Error' ), null );

		}

		return callback( null, result, httpResponse );

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

		// Use formData to POST a file.

		if ( 'POST' === method ) {

			var key = ( 'file' in data ? 'formData' : 'form' );

			options[key] = data;

		}

		// Use JSON body for PUT.

		else if( 'PUT' === method ) {

			options['headers'] 	= { 'Content-Type' : 'application/json' };
			options['body'] 	= JSON.stringify( data );

		}

	}

	request( options, function( err, httpResponse, body ){

    	if ( 'statusCode' in httpResponse && 200 !== httpResponse.statusCode ){

    		return callback( new Error( 'Unusable status in response.' ), null, httpResponse );

    	}

    	var result = JSON.parse( body );

    	if ( 'errors' in result ){

    		return callback( new Error( result.errors ), null, httpResponse );

    	}

    	return callback( null, result, httpResponse );

	} );

};

module.exports = Screendoor;