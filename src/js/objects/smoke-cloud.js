define(function( require ){
	var PIXI = require( 'pixi' );

	function SmokeCloud( x, y ) {
		this._sprite = PIXI.Sprite.fromFrame( 'smokeWhite5.png' );
		this._sprite.pivot.x = x;
		this._sprite.pivot.y = y;
	}

	SmokeCloud.prototype.setPhase = function( f ) {
		this._sprite.scale.x = f;
		this._sprite.scale.y = f;
		this._sprite.alpha = 1 - f;
		this._sprite.rotation = Math.PI * 0.3 * f;
	};

	SmokeCloud.prototype.getPixiObject = function() {
		return this._sprite;
	};

	return SmokeCloud;

});