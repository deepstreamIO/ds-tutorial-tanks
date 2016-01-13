requirejs.config({
    baseUrl: 'src/js',
    paths: {
    	'pixi': '../../bower_components/pixi.js/bin/pixi'
    }
});

require( ['tanks-game'], function( TanksGame ){
	new TanksGame({
		container: document.getElementById( 'wrapper' ),
		width: 1600,
		height: 900
	});
});
