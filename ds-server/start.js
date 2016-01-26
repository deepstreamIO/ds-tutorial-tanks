var Deepstream = require( 'deepstream.io' );
var PermissionHandler = require( './permission-handler' );
var dataTransforms = require( './data-transforms' );

var config = require( './config.json' );
var deepstream = new Deepstream();

deepstream.set( 'host', config.httpHost );
deepstream.set( 'port', config.httpPort );

deepstream.set( 'tcpHost', config.tcpHost );
deepstream.set( 'tcpPort', config.tcpPort );

deepstream.set( 'permissionHandler', new PermissionHandler() );
deepstream.set( 'dataTransforms', dataTransforms );

deepstream.start();