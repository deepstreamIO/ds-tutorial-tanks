define(function( require ){
	var PIXI = require( 'pixi' );
	var ONE_THIRD = 1 / 3;
	var SmokeCloud = require( './smoke-cloud' );

	function Smoke( x, y ) {
		this._container = new PIXI.Container();
		this._container.pivot.x = x;
		this._container.pivot.y = y;

		this._smokeCloud1 = new SmokeCloud( 8, 44 );
		this._smokeCloud2 = new SmokeCloud( 8, 44 );
		this._smokeCloud3 = new SmokeCloud( 8, 44 );

		this._container.addChild( this._smokeCloud1.getPixiObject() );
		this._container.addChild( this._smokeCloud2.getPixiObject() );
		this._container.addChild( this._smokeCloud3.getPixiObject() );

		this._phase = 0;
		this._step = 0.005;
		this._animationFrameId = null;
	}

	Smoke.prototype.start = function() {
		this._updatePhase();
	};

	Smoke.prototype._updatePhase = function() {
		this._phase += this._step;
		if( this._phase > ONE_THIRD ) {
			this._phase = 0;
		}
		this._smokeCloud1.setPhase( this._phase );
		this._smokeCloud2.setPhase( this._phase + ONE_THIRD );
		this._smokeCloud3.setPhase( this._phase + ONE_THIRD * 2 );
		this._animationFrameId = requestAnimationFrame( this._updatePhase.bind( this ) );
	};


	Smoke.prototype.getPixiObject = function() {
		return this._container;
	};

	return Smoke;

});