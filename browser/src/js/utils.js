define(function( require ){

	function Utils( ds ) {
		this._ds = ds;
	}

	Utils.prototype.toRadians = function( containerPosition, x, y ) {
		var _x = containerPosition.x - x;
		var _y = containerPosition.y - y;

		return Math.atan2( _y, _x ) - Math.PI / 2;
	};

	Utils.prototype.aimAtTank = function( tankControl, tankView, tank ) {
	};

	Utils.prototype.closestTank = function( tankName) {
	
	};

	return Utils;
});