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
    this.isDown;

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
            	if( self.moving && parent.active ) {
                	self.step++;
            	}
                self.last_time = timestamp;
            }
        }

        if( self.step > 3 ) { self.step = 0; }
	}

    parent.canvas.addEventListener('mousedown', mouseDown, false);
    parent.canvas.addEventListener('mouseup', mouseUp, false);
    parent.canvas.addEventListener('mousemove', mouseMove, false);
    parent.canvas.addEventListener('mouseout', mouseOut, false);
    parent.canvas.addEventListener('touchstart', touchStart, false);
    parent.canvas.addEventListener('touchmove', touchMove, false);
    parent.canvas.addEventListener('touchend', touchEnd, false);

    function mouseMove(e) { }
    function mouseDown(e) {}
    function mouseUp(e) { }
    function mouseOut(e) { }
    function touchStart(e) { }
    function touchEnd(e) { }

    this.getMousePosition = function(e) {
        var p = {};
        if (e.pageX || e.pageY) {
            p.x = e.pageX;
            p.y = e.pageY;
        } else {
            p.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            p.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        p.x -= parent.canvas.offsetLeft;
        p.y -= parent.canvas.offsetTop;
        return p;
    }

    function touchMove(e) {
        e.preventDefault();
        var pos = self.getMousePosition(e);
        console.log( pos );

        var modifier = 10;
        if( pos.x < self.x ) {
            self.moving = 1;
            self.index = 1;
            self.x-=self.speed+modifier;
            if( self.x <= 0 ) { self.x = 0; }
        } else {
            self.moving = 1;
            self.index = 2;
            self.x+=self.speed+modifier;
            if( self.x >= parent.w-self.w ) { self.x = parent.w-self.w; }
        }

        if( pos.y < self.y ) {
            self.moving = 1;
            self.index = 3;
            self.y-=self.speed+modifier;
            if( self.y <= 0 ) { self.y = 0; }
        } else {
            self.moving = 1;
            self.index = 0;
            self.y+=self.speed+modifier;
            if( self.y >= parent.h-self.h ) { self.y = parent.h-self.h; }
        }

        self.moving = 0;
    }
}