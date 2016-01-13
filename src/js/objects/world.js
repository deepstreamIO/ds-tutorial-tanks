define(function( require ){

	var PIXI = require( 'pixi' );

	function World( settings ) {
		this._settings = settings;
		this._stage = new PIXI.Container();
		this._renderer = this._getRenderer();
		this._renderer.transparent = true;
		this._settings.container.appendChild( this._renderer.view );
		this._objects = [];
		this._render();
	}

	World.prototype.add = function( object ) {
		this._objects.push( object );
		this._stage.addChild( object.getPixiObject() );
	};

	World.prototype._getRenderer = function() {
		var options = {
			transparent: true
		};
		return PIXI.autoDetectRenderer( this._settings.width, this._settings.height, options );
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