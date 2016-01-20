define(function( require ){

	var PIXI = require( 'pixi' );
	var Smoke = require( './smoke' );
	var COLORS = [
		'Beige',
		'Black',
		'Blue',
		'Green',
		'Red'
	];

	function Tank( settings ) {
		this._container = new PIXI.Container();
		
		this._container.position.x = settings.position.x;
		this._container.position.y = settings.position.y;

		this._color = COLORS[ settings.color ];
		
		// Body
		this._body = PIXI.Sprite.fromFrame( 'tank' + this._color + '.png' );
		this._body.pivot.x = 37.5;
		this._body.pivot.y = 35;

		this._container.addChild( this._body );
		
		// Turret
		this._turret = PIXI.Sprite.fromFrame( 'barrel' + this._color + '.png' );

		this._turret.pivot.x = 8;
		this._turret.pivot.y = 44;
		this._container.addChild( this._turret );

		// Smoke
		this._smoke = new Smoke( 4, 0 );
	}

	Tank.prototype.aimAt = function( x, y ) {
		this.setTurretRotation( this._toRadians( x, y ) );
	};

	Tank.prototype.lookAt = function( x, y ) {
		this.setRotation( this._toRadians( x, y ) );
	};

	Tank.prototype.getPosition = function() {
		return this._container.position;
	};

	Tank.prototype.setPosition = function( x, y ) {
		this._container.position.x = x;
		this._container.position.y = y;
	};

	Tank.prototype.setTurretRotation = function( rotation ) {
		this._turret.rotation = rotation;
	};

	Tank.prototype.setRotation = function( rotation ) {
		this._body.rotation = rotation;
	};

	Tank.prototype.explode = function() {
		this._container.removeChild( this._turret );
		this._container.addChild( this._smoke.getPixiObject() );
		this._smoke.start();
	};

	Tank.prototype.revive = function() {
		this._container.addChild( this._turret );
		this._container.removeChild( this._smoke.getPixiObject() );
		this._smoke.stop();
	};

	Tank.prototype.getPixiObject = function() {
		return this._container;
	};

	return Tank;
});