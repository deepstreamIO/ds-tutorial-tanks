define(function( require ){

	function AIHelper( ds, tankName ) {
		this._ds = ds;

		this._tanksList = ds.record.getList( 'tanks' );
		this._tankView = ds.record.getRecord( tankName );
		this._tankControl = ds.record.getRecord( tankName + '-control' );

		this._rotatingTimeout = null;
	}

	AIHelper.prototype.toRadians = function( containerPosition, x, y ) {
		var _x = containerPosition.x - x;
		var _y = containerPosition.y - y;

		return ( Math.atan2( _y, _x ) - Math.PI / 2 ) % ( 2 * Math.PI );
	};

	AIHelper.prototype.aimAtTank = function( enemyTank ) {
		this._tankControl.set( 'turretRotation', 
			this.toRadians( 
				this._tankView.get( 'position' ), 
				enemyTank.get( 'position.x' ), 
				enemyTank.get( 'position.y' ) 
			)
		);
	};

	AIHelper.prototype.fireAtAnyTankInRange = function() {
		var tanks = this._tanksList.getEntries();
		var p1 = this._tankView.get( 'position' );
		var p2;
		var distance;
		var enemyTank;

		for( var i=0; i < tanks.length; i++ ) {
			enemyTank = this._ds.record.getRecord( tanks[ i ] );
			if( tanks[ i ] !== this._tankView.name && !enemyTank.get( 'destroyed' )  ) {
				if( this.inRange( p1, enemyTank.get( 'position' ) ) ) {
					this.aimAtTank( enemyTank );
					this._ds.event.emit( 'fire' );
					return;			
				}
			}
		};
	};

	AIHelper.prototype.inRange = function( p1, p2 ) {
		return Math.hypot( p1.x-p2.x, p1.y-p2.y ) < 350;
	}

	AIHelper.prototype.rotateToPoint = function( x, y ) {
		window.clearTimeout( this._rotatingTimeout );

		var expectedRotation = this.toRadians( this._tankView.get( 'position' ), x, y );
		if( expectedRotation < 0 && Math.abs( expectedRotation ) > Math.PI ) {
		 	expectedRotation =  expectedRotation + (2 * Math.PI);
		}

		var diff = ( this._tankView.get( 'rotation' ) - expectedRotation ) % Math.PI;
		if( diff > 0.1 || diff < -0.1 ) {
		 		this._tankControl.set( 'direction.left', diff > 0.1 );
				this._tankControl.set( 'direction.right', diff < -0.1 );
				this._rotatingTimeout = window.setTimeout( this.rotateToPoint.bind( this, x, y ), 50 );		
		} else {
				this._tankControl.set( 'direction.right', false );
				this._tankControl.set( 'direction.left', false );
		} 
	};

	return AIHelper;
});