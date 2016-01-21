define(function( require ){

    function Utils( ds, tankName ) {
        this._ds = ds;

        this._tanksList = ds.record.getList( 'tanks' );
        this._tankView = ds.record.getRecord( tankName );
        this._tankControl = ds.record.getRecord( tankName + '-control' );

        this._rotatingTimeout = null;
    }

    Utils.prototype.toRadians = function( containerPosition, x, y ) {
        var _x = containerPosition.x - x;
        var _y = containerPosition.y - y;

        return Math.atan2( _y, _x ) - Math.PI / 2;
    };

    Utils.prototype.aimAtTank = function( enemyTank ) {
        this._tankControl.set( 'turretRotation',
            this.toRadians( this._tankView.get( 'position' ), enemyTank.get( 'position.x' ), enemyTank.get( 'position.y' ) )
        );
    };

    Utils.prototype.aimAtAnyTank = function() {
        var tanks = this._tanksList.getEntries();
        for( var i=0; i < tanks.length; i++ ) {
            if( tanks[ i ] !== this._tankView.name  ) {
                this.aimAtTank( this._tankControl, this._tankView, this._ds.record.getRecord( tanks[ i ] ) );
                return;
            }
        };
    };

    Utils.prototype.rotateToPoint = function( x, y ) {
        window.clearTimeout( this._rotatingTimeout );

        var expectedRotation = this.toRadians( this._tankView.get( 'position' ), x, y );
        var moveLeft = expectedRotation < 0;
        if( moveLeft ) {
            expectedRotation = ( Math.PI * 2 ) + expectedRotation;
        }

        var diff = Math.abs( expectedRotation - this._tankView.get( 'rotation' ) );
        if( moveLeft ) {
            if(  diff > 0.1 ) {
                this._tankControl.set( 'direction.left', true );
                this._rotatingTimeout = window.setTimeout( this.rotateToPoint.bind( this, x, y ), 50 );
            } else {
                this._tankControl.set( 'direction.left', false );
            }
            this._tankControl.set( 'direction.right', false );

        } else {
            if(  diff > 0.1 ) {
                this._tankControl.set( 'direction.right', true );
                this._rotatingTimeout = window.setTimeout( this.rotateToPoint.bind( this, x, y ), 50 );
            } else {
                this._tankControl.set( 'direction.right', false );
            }
            this._tankControl.set( 'direction.left', false );
        }
    };

    return Utils;
});
