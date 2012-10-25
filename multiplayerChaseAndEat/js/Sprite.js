Sprite = function( _p, _img, _width, _height, _index) {
	var self = this;
	var parent = _p;

	this.w = _width;
	this.h = _height;
	this.image = _img;
	this.index = _index;

	this.step = 0;
	this.last_time = 0;

	this.draw = function(timestamp) {
        if( !self.last_time ) {
            self.last_time = timestamp;
        } else {
            if( timestamp - self.last_time > 500 ) {
            	if( parent.moving && parent.active ) {
                	self.step++;
            	}
                self.last_time = timestamp;
            }
        }

        if( self.step > 3 ) { self.step = 0; }
	}
}