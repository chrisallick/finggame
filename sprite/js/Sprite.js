Sprite = function( _parent, _img, _x, _y, _width, _height, _speed, _index) {
	var self = this;
	var parent = _parent;

	this.x = _x;
	this.y = _y;
	this.w = _width;
	this.h = _height;
	this.speed = _speed;
	this.image = _img;
	this.index = _index;

	this.step = 0;
	this.last_time = 0;
	this.moving = 0;

	this.draw = function(timestamp) {
        parent.context.drawImage(
            self.image, // image object
            30*self.step, 30*self.index, // x, y 
            30, 30, // width and height
            self.x, self.y, // x, y of canvas
            self.w, self.h // width, height of drawspace
        );

        if( !self.last_time ) {
            self.last_time = timestamp;
        } else {
            if( timestamp - self.last_time > 500 ) {
            	if( self.moving ) {
                	self.step++;
            	}
                self.last_time = timestamp;
            }
        }

        if( self.step > 3 ) { self.step = 0; }
	}

    /*
        bind keyboard actions
        check to see if you are in the comment box
        before eating the keyboard event
    */
    $(document).keydown(function(e) {
        var keyCode = e.keyCode;
        self.moving = 1;
        switch(keyCode) {
            case 37: // left arrow
                self.index = 1;
                self.x-=self.speed;
        		if( self.x <= 0 ) { self.x = 0; }
        		return false;
            break;
            case 38: // up arrow
                self.index = 3;
                self.y-=self.speed;
                if( self.y <= 0 ) { self.y = 0; }
                return false;
            break;
            case 39: // right arrow
                self.index = 2;
                self.x+=self.speed;
                if( self.x >= parent.w-self.w ) { self.x = parent.w-self.w; }
                return false;
            break;
            case 40: // down arrow
                self.index = 0;
                self.y+=self.speed;
                if( self.y >= parent.h-self.h ) { self.y = parent.h-self.h; }
                return false;
            break;
        }
    });

    $(document).keyup(function(e){
    	self.moving = 0;
    });
}