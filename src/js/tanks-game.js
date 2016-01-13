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
		
		var tankA = new Tank({
			x: 300,
			y: 300,
			color: 4
		});

		tankA.setRotation( 1 );
		tankA.setPosition( 200, 200 );
		tankA.aimAt( 400, 500 );

		this._world.add( tankA );

		var tankB = new Tank({
			x: 300,
			y: 300,
			color: 0
		});

		tankB.setRotation( 2 );
		tankB.setPosition( 400, 500 );
		tankB.aimAt( 0, 0 );
		tankB.explode();
		//tankB.aimAt( tankA.getPosition().x, tankA.getPosition().y );
		this._world.add( tankB );

		this._settings.container.onmousemove = function( e ) {
			tankA.lookAt( e.offsetX, e.offsetY );
		};
	};


	return TanksGame;
});