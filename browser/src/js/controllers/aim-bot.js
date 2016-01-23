define(function( require ){

    var AIHelper = require( './ai-helper' );

    function AimBot( ds, tankName ) {
        var ai = new AIHelper( ds, tankName );

        function aimAndFire() {
            ai.fireAtAnyTankInRange();
        }

        setInterval( aimAndFire, 50 );
    }

    return AimBot;
});
