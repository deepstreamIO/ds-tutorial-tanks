define(function( require ){

    var PIXI = require( 'pixi' );
    var Smoke = require( './smoke' );
    var COLORS = [
        'Beige',
        'Black',
        'Blue',
        'Green'
    ];

    function Tank( tankName, data, isPlayer ) {
 		this.tankName = tankName;

        this._container = new PIXI.Container();

		this._color = isPlayer ? 'Red' : COLORS[ data.color ];

        this.setPosition( data.position.x, data.position.y );

        // Body
        this._body = PIXI.Sprite.fromFrame( 'tank' + this._color + '.png' );
        this._body.pivot.x = 37.5;
        this._body.pivot.y = 35;

        this._container.addChild( this._body );

        // Tank name + kills + died
        this._name = new PIXI.Text( '', {font:'20px Comic Sans MS', fill: 'black'} );
        this.setMetaData( data.kills, data.died );
        this._name.pivot.x = 30;
        this._name.pivot.y = 70;
        this._container.addChild( this._name );

        this._health = new PIXI.Text( '', {font:'20px Comic Sans MS', fill: 'black'} );
        this.setHealth( data.health );
        this._health.pivot.x = 20;
        this._health.pivot.y = -30;
        this._container.addChild( this._health );

        // Turret
        this._turret = PIXI.Sprite.fromFrame( 'barrel' + this._color + '.png' );
        this._turret.pivot.x = 6;
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

	Tank.prototype.setRotation = function( rotation ) {
        this._body.rotation = rotation;
    };

    Tank.prototype.setMetaData = function( kills, died ) {
        this._name.text = this.tankName + "(" + kills + "/" + died + ")";
    };

    Tank.prototype.setHealth = function( health ) {
    	// Tank health
        var tankHealth = '';
        for(var i = 0; i<health; i++) {
            tankHealth += '♥';
        }
        this._health.text = tankHealth;
    };

    Tank.prototype.setTurretRotation = function( rotation ) {
        this._turret.rotation = rotation;
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