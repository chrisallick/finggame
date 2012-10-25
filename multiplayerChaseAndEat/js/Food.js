Food = function( _parent, _x, _y, _width, _height, _value ) {
	var self = this;
	var parent = _parent;

	this.x = _x;
	this.y = _y;
	this.w = _width;
	this.h = _height;
	this.alive = true;
	this.last_time = 0;
	this.step = 0;

	this.draw = function(timestamp) {
		if( self.alive ) {
			parent.context.fillStyle = "rgb(150,29,28)";
			parent.context.fillRect( self.x, self.y, self.w, self.h );

	        if( !self.last_time ) {
	            self.last_time = timestamp;
	        } else {
	            if( timestamp - self.last_time > 500 && parent.active) {
	                self.step++;
	                self.last_time = timestamp;
	            }
	        }

	        if( self.step > 5 ) {
	        	self.step = 0;
	        	self.w = self.h = getRandInt( 8, 30 );
	        	self.x = getRandInt(0,parent.w-self.w);
	        	self.y = getRandInt(0,parent.h-self.h);
	        }
		}

	}
	
	this.hitTest = function( character ) {
        //console.log( self.x, self.y, character.x, character.y );
		if( self.x >= character.x && self.x <= character.x+character.w || self.x+self.w >= character.x && self.x+self.w <= character.x+character.w ) {
			if( self.y >= character.y && self.y <= character.y+character.h || self.y+self.h >= character.y && self.y+self.h <= character.y+character.h ) {
				//self.alive = false;
				return true;
			}
		}
		return false;
	}
}