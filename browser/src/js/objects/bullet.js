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
        this._bullet = PIXI.Sprite.fromFrame( 'bulletSilver.png' );
        this._bullet.position.x = settings.position.x;
        this._bullet.position.y = settings.position.y;
        this._bullet.rotation = settings.rotation;
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
