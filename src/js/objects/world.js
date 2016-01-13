define(function( require ){

	var PIXI = require( 'pixi' );

	function World( settings ) {
		this._settings = settings;
		this._stage = new PIXI.Stage();
		this._renderer = PIXI.autoDetectRenderer( settings.width, settings.height );
		this._settings.container.appendChild( this._renderer.view );
		this._objects = [];
		this._render();
	}

	World.prototype.add = function( object ) {
		this._objects.push( object );
		this._stage.addChild( object.getPixiObject() );
	};

	World.prototype._render = function() {
		for( var i = 0; i < this._objects.length; i++ ) {
			this._objects[ i ].update();
		}
		this._renderer.render( this._stage );
		requestAnimationFrame( this._render.bind( this ) );
	};

	return World;
});