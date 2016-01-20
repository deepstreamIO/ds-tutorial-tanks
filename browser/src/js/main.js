requirejs.config({
    baseUrl: 'src/js',
    paths: {
    	'pixi': '../../bower_components/pixi.js/bin/pixi',
    	'deepstream': '../../bower_components/deepstream.io-client-js/dist/deepstream.min'
    }
});

require( ['tanks-game', 'deepstream' ], function( TanksGame, deepstream ){
	var name = '';
	var ds = deepstream( '52.29.184.11:6020' ).login( { name: name }, function( valid ) {
		if( valid ) {
			new TanksGame({
				container: document.getElementById( 'pixi-container' ),
				width: 1600,
				height: 900,
				name: name, 
				deepstream: ds,
				worldName: getQueryParams( window.location.search ).world || 'test-world',
				tankName: getQueryParams( window.location.search ).tankName || null
			});
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