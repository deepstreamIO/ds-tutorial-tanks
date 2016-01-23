define(function( require ){
	var PIXI = require( 'pixi' );
 
	function Bullet( data ) {
		this._bullet = PIXI.Sprite.fromFrame( 'bulletSilver.png' );
		this._bullet.position.x = data.position.x;
		this._bullet.position.y = data.position.y;
		this._bullet.rotation = data.rotation;
	}

	Bullet.prototype.setPosition = function( x, y ) {
		this._bullet.position.x = x;
		this._bullet.position.y = y;
	};

	Bullet.prototype.getPixiObject = function() {
		return this._bullet;
	};

	return Bullet;
});