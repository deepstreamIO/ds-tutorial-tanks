var deepstream = require( 'deepstream.io-client-js' );
var World = require( './world' );

var ds = deepstream( 'localhost:6021' );
ds.login( { username: 'server' }, function() {
	new World( {
		width: 1600,
		height: 900,
		deepstream: ds
	} );
} );

ds.on( 'error', function() {
	console.log( 'error' )
});