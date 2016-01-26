var deepstream = require( 'deepstream.io-client-js' );

var config = require( './config' );
var Tanks = require( './tanks' );
var Bullets = require( './bullets' );
var tanks, bullets;

function start() {
	var ds = deepstream( 'localhost:6021' );
	ds.login( { username: config.gameServerName, password: config.gameServerPassword }, function() {
		tanks = new Tanks( ds );
		bullets = new Bullets( ds, tanks );
		updateState();
	} );

	ds.on( 'error', function() {
		console.log( 'error', arguments )
	});
}

function updateState() {
	tanks.updateState();
	bullets.updateState();
	setTimeout( updateState, 15 );
};

start();