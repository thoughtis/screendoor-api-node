# screendoor-api-node
NodeJS module for interacting with the Screendoor API via the [Request](https://www.npmjs.com/package/request) module.

http://dobtco.github.io/screendoor-api-docs/

# Available Endpoints

- GET /sites/:site_id/projects
- GET /sites/:site_id/projects/:project_id
- GET /projects/:project_id/response_fields
- POST /projects/:project_id/responses
- POST /form_renderer/

# Example Usage

``` javascript
var ScreendoorAPI 	= require( 'screendoor-api-node' ),
	scrndr			= new ScreendoorAPI( api_key ),
```

## GET /sites/:site_id/projects

[ See Endpoint in API Docs ](http://dobtco.github.io/screendoor-api-docs/#list-a-site's-projects)

``` javascript
scrndr.getSiteProjects( site_id, function( err, projects ){

	if ( null !== err ) {

		return callback( err, null );

	}

	return callback( null, projects );

} );
```

## GET /sites/:site_id/projects/:project_id

[ See Endpoint in API Docs ](http://dobtco.github.io/screendoor-api-docs/#retrieve-a-single-project)

``` javascript
scrndr.getProject( site_id, project_id, function( err, project ){

	if ( null !== err ) {

		return callback( err, null );

	}

	return callback( null, project );

} );

```

## GET /projects/:project_id/response_fields

[ See Endpoint in API Docs ](http://dobtco.github.io/screendoor-api-docs/#list-a-project's-response-fields)

``` javascript
scrndr.getProjectFields( project_id, function( err, fields ){

	if ( null !== err ) {

		return callback( err, null );

	}

	return callback( null, fields );

} );

```

## POST /projects/:project_id/responses

[ See Endpoint in API Docs ](http://dobtco.github.io/screendoor-api-docs/#create-a-response)

``` javascript
var response_fields = {
	"1": "Vivian Cronin",
    "2": "emmanuelle@goyette.co.uk",
    "3": "New application for your job on Startuply"
};

var options = {
	'skip_email_confirmation': true,
	'skip_notifications': true,
	'skip_validation': true,
	'labels': []
};

scrndr.setProjectResponse( project_id, response_fields, options, function( err, result ){

	if ( null !== err ) {

		return callback( err, null );

	}

	return callback( null, result );

} );

```

## POST /form_renderer/

[ See Endpoint in API Docs ](http://dobtco.github.io/screendoor-api-docs/#spec-for-the-response-hash)


``` javascript
scrndr.uploadFile( field_id, encoded_file, file_options, function( err, result ) {

	if ( null !== err ) {

		return callback( err, null );

	}

	return callback( null, result );

} );
```

`encoded_file` should be the Base64 encoded content of the file you want to upload, with everything before the comma removed. Ex:

``` javascript
var encoded_file_parts = uploaded_file.split( ',' ),
	encoded_file = encoded_file_parts[1];
```

`file_options` should be an Object containing the filename and the content-type. You can extract the content-type from the Base64 encoded file. Ex:

``` javascript
var matches 		= encoded_file_parts[0].match( /data:([^;]*);base64/ ),
	file_options 	= {

	contentType: matches[1],
	filename: 'replace_with_your_filename.xxx'

};
```

# Errors

Errors are returned as either null or instances of the [ NodeJS Error Object ](https://nodejs.org/api/errors.html) with a message.

