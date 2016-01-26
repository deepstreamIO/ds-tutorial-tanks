var config = require( './config.json' );
var Deepstream = require( 'deepstream.io' );

function PermissionHandler() {
	this.users = {};
}

PermissionHandler.prototype.isValidUser =  function( handshakeData, authData, callback ) {
	if( authData.username === config.gameServerName && authData.password !== config.gameServerPassword ) {
		callback( 'Incorrect Username' );
		return;
	}

	if( !this.users[ authData.username ] ) {
		this.users[ authData.username ] = true;
		callback( null, authData.username );
	} else {
		callback( 'User already logged in' );
	}
};

PermissionHandler.prototype.canPerformAction = function( username, message, callback ) {
	var messageMeta = Deepstream.readMessage( message );

	if( messageMeta.isRecord ) {
		if( username !== config.gameServerName && messageMeta.name.indexOf( '-control' ) > -1 ) {
			if( messageMeta.name !== username + '-control' ) {
				callback( 'Only tank owner and game server can operate controls', false );				
			} else {
				callback( null, true );				
			}
			return;
		}

		if( username !== config.gameServerName && messageMeta.isChange ) {
			callback( 'Only game server can update view', false );
			return;
		}
	}

	callback( null, true );
};

PermissionHandler.prototype.onClientDisconnect = function( username ) {
	delete this.users[ username ];
};

module.exports = PermissionHandler;