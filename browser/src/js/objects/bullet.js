define(function( require ){
	var PIXI = require( 'pixi' );
	var COLORS = [
		'Beige',
		'Black',
		'Blue',
		'Green',
		'Red'
	];

	function Bullet( settings ) {
		this._color = COLORS[ settings.color ];
		this._sprite = PIXI.Sprite.fromFrame( 'bulletSilver.png' );
		this._sprite.position.x = settings.position.x;
		this._sprite.position.y = settings.position.y;
		this._sprite.rotation = settings.rotation;
	}

	Bullet.prototype.setPosition = function( x, y ) {
		this._sprite.position.x = x;
		this._sprite.position.y = y;
	};

	Bullet.prototype.getPixiObject = function() {
		return this._sprite;
	};

	return Bullet;
});