define(function( require ){

    var AIHelper = require( './ai-helper' );

    function EvadeBot( ds, tankName ) {
        var ai = new AIHelper( ds, tankName );

        document.body.onmousemove = function( e ) {
        	ai.rotateToPoint( e.offsetX, e.offsetY );
        };
    }

    return EvadeBot;
});
