define(function( require ){

	var World = require( 'objects/world' );
	var Tank = require( 'objects/tank' );



	function TanksGame( settings ) {
		this._settings = settings;
		this._loader = new PIXI.loaders.Loader();
		this._loader.add( 'src/img/sprite-sheet.json' );
		//this._loader.add( 'src/img/sprite-sheet.png' );
		this._loader.once( 'complete', this._init.bind( this ) );
		this._loader.load();
		
	}

	TanksGame.prototype._init = function() {
		this._world = new World( this._settings );
		
		var myTank = new Tank({
			x: 300,
			y: 300,
			color: 0
		});

		myTank.setRotation( 2 );
		myTank.setPosition( 400, 500 );
		myTank.aimAt( 0, 0 );

		this._world.add( myTank );

		// this._settings.container.onmousemove = function( e ) {
		// 	myTank.lookAt( e.offsetX, e.offsetY );
		// };
	};


	return TanksGame;
});