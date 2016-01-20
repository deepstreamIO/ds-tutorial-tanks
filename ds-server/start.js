var Deepstream = require( 'deepstream.io' );

var deepstream = new Deepstream();

deepstream.set( 'host', '0.0.0.0' );
deepstream.set( 'port', 6020 );

deepstream.set( 'tcpHost', '0.0.0.0' );
deepstream.set( 'tcpPort', 6021 );

deepstream.set( 'permissionHandler', {
	isValidUser: function( handshakeData, authData, callback ) {
		callback( null, authData.username );
	},
	canPerformAction: function( username, message, callback ) {
		callback( null, true );
	}
});

deepstream.set( 'dataTransforms', [] );

deepstream.start();