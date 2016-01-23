var config = require( './config' );

var Utils = {};

Utils.intersects = function( objectA, objectB, objectASize, objectBSize ) {
	var objectARight = objectA.x + objectASize.x;
	var objectABottom = objectA.y + objectASize.y;

	var objectBRight = objectB.x + objectBSize.x;
	var objectBBottom = objectB.y + objectBSize.y;

	if ( objectARight <= objectB.x )
	{
		return false;
	}

	if ( objectABottom <= objectB.y )
	{
		return false;
	}

	if ( objectA.x >= objectBRight )
	{
		return false;
	}

	if ( objectA.y >= objectBBottom )
	{
		return false;
	}

	return true;
};

Utils.collidesWithBorder = function( position ) {
	if( Utils.intersects( position, { x: 0, y: 0 }, config.tankDimensions, { x: 0, y: 900 } ) ) {
		return true;
	}

	if( Utils.intersects( position, { x: 1600, y: 0 }, config.tankDimensions, { x: 0, y: 900 } ) ) {
		return true;
	}

	if( Utils.intersects( position, { x: 0, y: 0 }, config.tankDimensions, { x: 1600, y: 0 } ) ) {
		return true;
	}

	if( Utils.intersects( position, { x: 0, y: 900 }, config.tankDimensions, { x: 1600, y: 0 } ) ) {
		return true;
	}

	return false;
};

module.exports = Utils;