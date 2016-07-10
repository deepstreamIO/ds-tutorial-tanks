var Deepstream = require( 'deepstream.io' );

var deepstream = new Deepstream();

deepstream.set( 'host', '0.0.0.0' );
deepstream.set( 'port', 6020 );

deepstream.set( 'tcpHost', '0.0.0.0' );
deepstream.set( 'tcpPort', 6021 );

var users = {};
deepstream.set( 'permissionHandler', {
	isReady: true,
	isValidUser: function( handshakeData, authData, callback ) {
		if( !users[ authData.username ] ) {
			users[ authData.username ] = true;
			callback( null, authData.username );
		} else {
			callback( 'User already logged in' );
		}
	},
	canPerformAction: function( username, message, callback ) {
		callback( null, true );
	},
	onClientDisconnect: function( username ) {
		console.log( username )
		delete users[ username ];
	}
});

deepstream.set( 'dataTransforms', [ {
    topic: 'E',
    action: 'EVT',
    transform: function( data, metaData ) {
        return metaData.sender;
    }
}]);

deepstream.start();