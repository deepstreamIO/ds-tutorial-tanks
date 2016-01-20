define(function( require ){

	function TankController( ds, tankName ) {
		ds.event.emit( 'create-tank', tankName );

		var tank = ds.record.getRecord( tankName );

		document.body.onkeydown = function( e ) {
			if( e.which === 39 ) {
				tank.set( 'direction.right', true );
			} else if( e.which === 37 ) {
				tank.set( 'direction.left', true );
			} else if( e.which === 38 ) {
				tank.set( 'direction.forwards', true );
			} else if( e.which === 40 ) {
				tank.set( 'direction.backwards', true );
			}
			e.preventDefault();
		};

		document.body.onkeyup = function( e ) {
			if( e.which === 39 ) {
				tank.emit( 'direction.right', false );
			} else if( e.which === 37 ) {
				tank.set( 'direction.left', false );
			} else if( e.which === 38 ) {
				tank.set( 'direction.forwards', false );
			} else if( e.which === 40 ) {
				tank.set( 'direction.backwards', false );
			}
			e.preventDefault();
		};

		document.body.onmousemove = function( e ) {
			tank.set( 'turretRotation', toRadians( tank.get( 'position' ), e.offsetX, e.offsetY ) );
		};

		document.body.onclick = function( e ) {
			ds.event.emit( 'fire', tankName );
		}.bind( this );
	}

	function toRadians( containerPosition, x, y ) {
		var _x = containerPosition.x - x;
		var _y = containerPosition.y - y;

		return Math.atan2( _y, _x ) - Math.PI / 2;
	};

	return TankController;
});