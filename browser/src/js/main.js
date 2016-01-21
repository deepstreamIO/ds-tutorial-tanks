requirejs.config({
    baseUrl: 'src/js',
    paths: {
    	'pixi': '../../bower_components/pixi.js/bin/pixi',
    	'deepstream': '../../bower_components/deepstream.io-client-js/dist/deepstream.min'
    }
});

require( ['tanks-game', 'deepstream' ], function( TanksGame, deepstream ){
	var name = getQueryParams( window.location.search ).tankName;
	var ds = deepstream( 'localhost:6020' ).login( { username: name }, function( valid ) {
		if( valid ) {
			new TanksGame({
				container: document.getElementById( 'pixi-container' ),
				width: 1600,
				height: 900,
				deepstream: ds,
				tankName: name
			});
		} else {
			console.log( arguments, name );
		}
	} )
});

function getQueryParams( qs ) {
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while ( tokens = re.exec(qs) ) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}