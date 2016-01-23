var Utils = require( './utils' );
var config = require( './config.json' );

function Bullets( ds, tanks ) {
	this._ds = ds;
	this._tanks = tanks;

	this._bulletsList = this._ds.record.getList( 'bullets' );
	this._bulletsList.setEntries( [] );
	this._ds.event.subscribe( 'fire', this._fireBullet.bind( this ) );
}

Bullets.prototype.updateState = function() {
	var bullets = this._bulletsList.getEntries();
	for( var i = 0; i < bullets.length; i++ ) {
		this._moveBullet( this._ds.record.getRecord( bullets[ i ] ) );
	}
};

Bullets.prototype._fireBullet = function( tankName ) {
	if( !this._tanks.isTankAlive( tankName ) ) {
		return;
	}
	
	var tank = this._ds.record.getRecord( tankName );

	var time = Date.now();
	if( time - tank.get( 'lastShotTime' ) < config.bulletReload ) {
		return;
	} else {
		tank.set( 'lastShotTime', time );
	}

	this._createBullet( tank );
};

Bullets.prototype._moveBullet = function( bullet, tanks ) {
	var position = bullet.get( 'position' );
	var rangeRemaining = bullet.get( 'rangeRemaining');
	var rotation = bullet.get( 'rotation');

	if( this._tanks.checkIfBulletHit( bullet.get( 'owner' ), position ) ) {
		this._destroyBullet( bullet );
		return;
	};

	if( rangeRemaining > 0 ) {
		position.x += ( Math.sin( rotation ) * config.bulletSpeed );		
		position.y -= ( Math.cos( rotation ) * config.bulletSpeed );		
		rangeRemaining--;

		bullet.set( 'position', position );
		bullet.set( 'rangeRemaining', rangeRemaining );

		return;
	} else {
		this._destroyBullet( bullet );
	}
};

Bullets.prototype._destroyBullet = function( bullet ) {
	this._bulletsList.removeEntry( bullet.name );
	bullet.set( 'destroyed', true );
};

Bullets.prototype._createBullet = function( tank ) {
	var bullets = this._bulletsList.getEntries();
	var bullet;
	var foundBullet = false;

	for( var i=0; i<bullets.length; i++ ) {
		bullet = this._ds.record.getRecord( bullets[ i ] );
		if( bullet.get( 'destroyed' ) ) {
			foundBullet = true;
			break;
		}
	}

	if( !foundBullet ) {
		bullet = this._ds.record.getRecord( 'bullet-' + bullets.length );
	}

	bullet.set( {
		position: {
			x: tank.get( 'position.x' ),
			y: tank.get( 'position.y' )
		},
		rotation: tank.get( 'turretRotation' ),
		rangeRemaining: config.bulletRange,
		owner: tank.name,
		destroyed: false
	} );

	if( !foundBullet ) {
		bullet.whenReady( function( bullet ) {
			this._bulletsList.addEntry( bullet.name );
		}.bind( this ) );
	}

	return bullet;
};

module.exports = Bullets;