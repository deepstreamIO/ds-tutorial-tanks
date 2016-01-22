var Utils = require( './utils' );
var config = require( './config.json' );

function Tanks( ds ) {
	this._ds = ds;
	
	this._tanks = {};
	this._tanksList = this._ds.record.getList( 'tanks' );	
	this._tanksList.setEntries( [] );

	this._ds.event.subscribe( 'join-game', this._createTank.bind( this ) );
	this._ds.event.subscribe( 'leave-game', this._destroyTank.bind( this ) );
}

Tanks.prototype.updateState = function() {
	var tanks = this._tanks;
	var tank, direction, destroyed;

	for( var tankName in tanks ) {
		tank = tanks[ tankName ];
		tankView = tank.view;
		tankControl = tank.control;

		direction = tankControl.get( 'direction' );
		turret = tankControl.get( 'turretDirection' );
		destroyed = tankView.get( 'destroyed' );

		if( 
			( direction.left || direction.right ) && !( direction.left && direction.right ) 
			|| 
			( direction.forwards || direction.backwards ) && !( direction.forwards && direction.backwards ) 
		) {
			!destroyed && this._moveTank( direction, tank, tanks );
		}


		tankView.set( 'turretRotation', tankControl.get( 'turretRotation' ) );
	}
};

Tanks.prototype.isTankAlive = function( tankName ) {
	var tank = this._tanks[ tankName ];
	return tank && tank.view.get( 'destroyed' ) === false;
};

Tanks.prototype.checkIfBulletHit = function( bulletOwner, bulletPosition ) {
	for( var tankName in this._tanks ) {
		tankView = this._tanks[ tankName ].view;
		if( bulletOwner === tankName ) {
			continue;
		}

		if( Utils.intersects( bulletPosition, tankView.get( 'position' ), config.bulletDimensions, config.tankDimensions ) ) {
			tankHealth =  tankView.get( 'health' ) - 1;
			tankView.set( 'health', tankHealth );
			if( tankHealth === 0 ) {
				tankView.set( 'destroyed', true );
				this._increaseTankStats( bulletOwner, 'kills' );
				this._increaseTankStats( tankName, 'died' );
				setTimeout( this._respawnTank.bind( this, tankName ), config.respawnTimeout );
			}
			return true;
		}
	}
	return false;
};

Tanks.prototype._createTank = function( tankName ) {
	var tank = this._ds.record.getRecord( tankName );
	tank.set( {
		position: this._getInitialPosition( tankName ),
		color: this._getColor(),
		turretRotation: 0,
		rotation: 0,
		destroyed: false,
		health: 3,
		kills: 0, 
		died: 0
	} );

	var tankControl = this._ds.record.getRecord( tankName + '-control' );
	tankControl.set( {
		direction: {
			left: false,
			right: false,
			forwards: false,
			backwards: false 
		},
		turretRotation: 0
	} );

	tank.whenReady( function() {
		tankControl.whenReady( function() {
			if( this._tanksList.getEntries().indexOf( tankName ) === -1 ) {
				this._tanksList.addEntry( tankName );
			}
			this._tanks[ tankName ] = {
				view: tank,
				control: tankControl
			};
		}.bind( this ) );
	}.bind( this ) );
};

Tanks.prototype._moveTank = function( direction, tank, tanks ) {
	var tankView = tank.view;
	var tankControl = tank.control;

	var position = tankView.get( 'position' );	
	var rotation = tankView.get( 'rotation' );	

	if( direction.left ) {
		rotation -= ( Math.PI / 90 );		
	} else if( direction.right ) {
		rotation += ( Math.PI / 90 );
	}

	if( rotation > ( Math.PI * 2 ) ) {
		rotation = 0;
	} else if( rotation < 0 ) {
		rotation = Math.PI * 2;
	}

	if( direction.forwards ) {
		position.x += ( Math.sin( rotation ) * config.tankSpeed );		
		position.y -= ( Math.cos( rotation ) * config.tankSpeed );		
	} else if( direction.backwards ) {
		position.x -= ( Math.sin( rotation ) * config.tankSpeed );		
		position.y += ( Math.cos( rotation ) * config.tankSpeed );		
	}

	if( this._collidesWithOtherTanks( position, tankView.name ) || Utils.collidesWithBorder( position ) ) {
		return;
	}

	tankView.set( 'rotation', rotation );
	tankView.set( 'position', position );
};

Tanks.prototype._destroyTank = function( tankName ) {
	var tank = this._tanks[ tankName ];
	delete this._tanks[ tankName ];
	this._tanksList.removeEntry( tankName );
};

Tanks.prototype._respawnTank = function( tankName ) {
	var tank = this._tanks[ tankName ];

	tank.view.set( 'position', this._getInitialPosition() );
	tank.view.set( 'destroyed', false );
	tank.view.set( 'health', 3 );

	tank.control.set( {
		direction: {
			left: false,
			right: false,
			forwards: false,
			backwards: false 
		},
		turretRotation: 0
	} );
};

Tanks.prototype._collidesWithOtherTanks = function( position, tankName ) {
	var tanks = this._tanks;
	for( var _tankName in tanks ) {
		if( _tankName === tankName ) {
			continue;
		}
		if( Utils.intersects( position, tanks[ _tankName ].view.get( 'position' ), config.tankDimensions, config.tankDimensions ) ) {
			return true;
		}
	}

	return false;
};

Tanks.prototype._getInitialPosition = function( tankName ) {
	var x = 1000 *  Math.random() / 2;
	var y = 1000 *  Math.random() / 2;

	while( this._collidesWithOtherTanks( { x: x, y: y }, tankName ) ) {
		x = 1000 *  Math.random() / 2;
		y = 1000 *  Math.random() / 2;		
	}

	return { 
		x: x,
		y: y
	};
};

Tanks.prototype._getColor = function() {
	return Math.floor( ( Math.random() * 4 ) + 1 );
};

Tanks.prototype._increaseTankStats = function( tankName, stat ) {
	var tank = this._tanks[ tankName ].view;
	tank.set( stat, tank.get( stat ) + 1 ); 
};

module.exports = Tanks;