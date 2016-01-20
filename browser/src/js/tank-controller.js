define(function( require ){

	function TankController( ds, tankName ) {
		ds.event.emit( 'join-game', tankName );

		var tankView = ds.record.getRecord( tankName );
		var tankControl = ds.record.getRecord( tankName + '-control' );

		document.body.onkeydown = function( e ) {
			if( e.which === 39 ) {
				tankControl.set( 'direction.right', true );
			} else if( e.which === 37 ) {
				tankControl.set( 'direction.left', true );
			} else if( e.which === 38 ) {
				tankControl.set( 'direction.forwards', true );
			} else if( e.which === 40 ) {
				tankControl.set( 'direction.backwards', true );
			}
			e.preventDefault();
		};

		document.body.onkeyup = function( e ) {
			if( e.which === 39 ) {
				tankControl.set( 'direction.right', false );
			} else if( e.which === 37 ) {
				tankControl.set( 'direction.left', false );
			} else if( e.which === 38 ) {
				tankControl.set( 'direction.forwards', false );
			} else if( e.which === 40 ) {
				tankControl.set( 'direction.backwards', false );
			}
			e.preventDefault();
		};

		document.body.onmousemove = function( e ) {
			tankControl.set( 'turretRotation', toRadians( tankView.get( 'position' ), e.offsetX, e.offsetY ) );
		};

		document.body.onclick = function( e ) {
			ds.event.emit( 'fire', tankName );
		}.bind( this );

		window.onunload= function() {
			ds.event.emit( 'leave-game', tankName );
		};
	}

	function toRadians( containerPosition, x, y ) {
		var _x = containerPosition.x - x;
		var _y = containerPosition.y - y;

		return Math.atan2( _y, _x ) - Math.PI / 2;
	};

	return TankController;
});