define(function( require ){

    var Utils = require( './utils' );

    function TankController( ds, tankName ) {
        ds.event.emit( 'join-game', tankName );

        var utils = new Utils( ds, tankName );
        var tanksList = ds.record.getList( 'tanks' );
        var tankView = ds.record.getRecord( tankName );
        var tankControl = ds.record.getRecord( tankName + '-control' );

        document.body.onkeydown = function( e ) {
            switch(e.which) {
                case 39:
                case 68:
                    tankControl.set( 'direction.right', true ); break;

                case 37:
                case 65:
                    tankControl.set( 'direction.left', true ); break;

                case 38:
                case 87:
                    tankControl.set( 'direction.forwards', true ); break;

                case 40:
                case 83:
                    tankControl.set( 'direction.backwards', true ); break;

            }
            e.preventDefault();
        };

        document.body.onkeyup = function( e ) {
            switch(e.which) {
                case 39:
                case 68:
                    tankControl.set( 'direction.right', false ); break;

                case 37:
                case 65:
                    tankControl.set( 'direction.left', false ); break;

                case 38:
                case 87:
                    tankControl.set( 'direction.forwards', false ); break;

                case 40:
                case 83:
                    tankControl.set( 'direction.backwards', false ); break;

            }
            e.preventDefault();
        };

        document.body.onmousemove = function( e ) {
            if( tankView.get( 'position') ) {
                tankControl.set( 'turretRotation', utils.toRadians( tankView.get( 'position' ), e.offsetX, e.offsetY ) );
                //utils.aimAtAnyTank( tankControl, tankView, tanksList );

                //utils.rotateToPoint( e.offsetX, e.offsetY );
            }
        };

        document.body.onclick = function( e ) {
            ds.event.emit( 'fire', tankName );
        }.bind( this );

        window.onunload= function() {
            ds.event.emit( 'leave-game', tankName );
        };
    }

    return TankController;
});
