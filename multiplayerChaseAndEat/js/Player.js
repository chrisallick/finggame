Player = function( _p, _sid, _x, _y, _speed, _sprite ) {
	var self = this;
	var parent = _p;

	this.sid = _sid;
	this.sprite = new Sprite( self, _sprite, 30, 30, 3);
	this.score = 0;
	this.moving = 0;
	this.speed = _speed;
	this.x = _x;
	this.y = _y;
	this.w = 30;
	this.h = 30;

	this.draw = function(timestamp) {
		self.sprite.draw(timestamp);
        parent.context.drawImage(
            self.sprite.image, // image object
            30*self.sprite.step, 30*self.sprite.index, // x, y 
            30, 30, // width and height
            self.x, self.y, // x, y of canvas
            self.sprite.w, self.sprite.h // width, height of drawspace
        );
	}

	this.setup = function() {

	}

    self.setup();
}