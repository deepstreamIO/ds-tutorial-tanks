define(function( require ){

    var World = require( 'objects/world' );
    var Tank = require( 'objects/tank' );
    var Bullet = require( 'objects/bullet' );

    var ManualControl = require( './controllers/manual-control' );
    var AimBot = require( './controllers/aim-bot' );
    var EvadeBot = require( './controllers/evade-bot' );

    function TanksGame( settings ) {
        this._settings = settings;
        this._ds = settings.deepstream;

        this._tanks = {};

        this._loader = new PIXI.loaders.Loader();
        this._loader.add( 'src/img/sprite-sheet.json' );
        this._loader.once( 'complete', this._init.bind( this ) );
        this._loader.load();
    }

    TanksGame.prototype._init = function() {
        this._world = new World( this._settings );

        /**
        * Create Tank Controls
        **/
        switch( this._settings.controller ) {
            case 'aimbot': 
                new AimBot( this._ds, this._settings.tankName );
                break;
            case 'evadebot': 
                new EvadeBot( this._ds, this._settings.tankName );
                break;
            default:
                new ManualControl( this._ds, this._settings.tankName );
        }

        /**
        * Listen to Tanks
        */
        this._tanksList = this._ds.record.getList( 'tanks' );
        this._tanksList.on( 'entry-added', tankAdded.bind( this ) );
        this._tanksList.on( 'entry-removed', tankRemoved.bind( this ) );
        this._tanksList.whenReady( function( tanks ) {
            tanks.getEntries().forEach( tankAdded.bind( this ) );
        }.bind( this ) );

        /**
        * Listen to Bullet
        */
        this._bulletsList = this._ds.record.getList( 'bullets' );
        this._bulletsList.on( 'entry-added', bulletAdded.bind( this ) );
        this._bulletsList.on( 'entry-removed', bulletRemoved.bind( this ) );
        this._bulletsList.whenReady( function( bullets ) {
            bullets.getEntries().forEach( bulletAdded.bind( this ) );
        }.bind( this ) );
    }

    function tankAdded( tankName ) {
        this._ds.record
            .getRecord( tankName )
            .whenReady( function( tankRecord ) {
                var tank = new Tank( 
                    tankRecord.name,
                    tankRecord.get(), 
                    this._settings.tankName === tankRecord.name
                );
                this._world.add( tank );

                tankRecord.subscribe( 'kills', function( kills ) {
                    tank.setMetaData( kills, tankRecord.get( 'died' ) );
                });

                tankRecord.subscribe( 'died', function( died ) {
                    tank.setMetaData( tankRecord.get( 'kills' ), died );
                });

                tankRecord.subscribe( 'health', function( health ) {
                    tank.setHealth( health );
                });

                tankRecord.subscribe( 'rotation', function( rotation ) {
                    tank.setRotation( rotation );
                });

                tankRecord.subscribe( 'position', function( position ) {
                    tank.setPosition( position.x, position.y );
                });

                tankRecord.subscribe( 'turretRotation', function( turretRotation ) {
                    tank.setTurretRotation( turretRotation );
                });

                tankRecord.subscribe( 'destroyed', function( destroyed ) {
                    if( destroyed ) {
                        tank.explode();
                    } else {
                        tank.revive();
                    }
                } );

                this._tanks[ tankName ] = tank;
            }.bind( this ) );
    };

    function tankRemoved( tankName ) {
        this._world.remove( this._tanks[ tankName ] );
    };

    function bulletAdded( bulletID ) {
        this._ds.record
            .getRecord( bulletID )
            .whenReady( function( bulletRecord ) {
                
                var bullet = new Bullet( bulletRecord.get() );

                bulletRecord.subscribe( 'position', function( position ) {
                    bullet.setPosition( position.x, position.y );
                } );

                bulletRecord.subscribe( 'destroyed', function( destroyed ) {
                    if( destroyed ) {
                        this._world.remove( bullet );
                    } else {
                        console.log( 'adding' )
                        this._world.addToBottom( bullet );
                    }
                }.bind( this ), true );
            }.bind( this ) );
    };

    function bulletRemoved( bulletID ) {
        //We don't remove bullets since we use object pooling
    };

    return TanksGame;
});
