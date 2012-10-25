Canvas = function( _target, _options ) {
    var self = this;
    this.canvas;
    this.context;
    this.trashio;

    this.t = _target;
    this.w = _options.width;
    this.h = _options.height;
    this.autostart = _options.autostart;
    this.draw = _options.draw;
    this.assets = _options.assets;
    this.assets_loaded = 0;
    this.active = false;

    this.sprites = []; // array of available sprites
    this.food = []; // array of food objects
    this.alive = 5; // available food
    this.sid; // you're player id
    this.players = {}; // hash of players associative array based on sid

    this.background = function( bg ) {
        self.context.fillStyle = bg;
        self.context.fillRect( 0, 0, self.w, self.h );
    }

    this.checkHits = function() {
        for(var i = 0, len = self.food.length; i < len; i++ ) {
            if( self.food[i].alive && self.food[i].hitTest(self.players[self.sid]) ) {
                sfx.play();
                var msg = self.trashio.createMessage("score", self.sid);
                self.trashio.sendMessage(msg);
                var msg = self.trashio.createMessage("food", i);
                self.trashio.sendMessage(msg);

                //self.players[self.sid].score++;
                //self.alive--;
            }
        }
    }

    this.readyPlayer = function( sid ) {
        // canvas, x, y, sprite
        self.sid = sid;
        self.players[sid] =  new Player( self, sid, 0, 0, 2, self.sprites[0] );
    }

    this.addPlayer = function( sid ) {
        self.players[sid] =  new Player( self, sid, 0, 0, 2, self.sprites[0] );
    }

    this.removePlayer = function( sid ) {
        delete self.players[sid];
    }

    this.setupOverlays = function() {
        $(window).blur(function(){
            //self.active = false;
        });

        $(window).focus(function(){
            self.active = true;
        });
    }

    this.setup = function() {
        self.setupOverlays();
        self.canvas = document.createElement( 'canvas' );
        self.canvas.id = "canvas";
        self.canvas.width = self.w;
        self.canvas.height = self.h;

        self.context = self.canvas.getContext( '2d' );
        self.context.font = "20pt Arial";

        self.t.append( self.canvas );
        $("#canvas").click(function(event){
            self.active = true;
        });

        self.trashio = new TrashIO(self,"worms");

        if( example.assets ) {
            for( var i = 0, len = self.assets.length; i < len; i++ ) {
                var img = new Image();
                img.onload = function() {
                    self.assets_loaded++;
                    // image_object, x, y, width, height, speed, index
                    //self.sprites.push( new Sprite( self, img, getRandInt(0,example.w-30), getRandInt(0,example.h-30), 30, 30, 2, 3) );
                    self.sprites.push( img );
                }
                img.src = self.assets[i];
            }
        }

        for( var i = 0; i < 5; i++ ) {
            self.food.push( new Food( self, getRandInt(0,example.w-10), getRandInt(0,example.h-10), 10, 10, 5 ) );    
        }

        if( self.autostart ) {
            self.animate();
        }

        $(self.canvas).hide().fadeIn(1000);
    }

    this.animate = function(timestamp) {
        requestAnimFrame( self.animate );
        if( self.assets_loaded == self.assets.length ) {
            self.draw(timestamp);
        }
    }

    this.start = function() {
        self.setup();
    }

    this.broadcast = function() {
        var msg = self.trashio.createMessage("move",self.sid);
        msg["x"] = self.players[self.sid].x;
        msg["y"] = self.players[self.sid].y;
        msg["index"] = self.players[self.sid].sprite.index;
        self.trashio.sendMessage( msg );
    }

    /*
        bind keyboard actions
        before eating the keyboard event
    */
    $(document).keydown(function(e) {
        var keyCode = e.keyCode;
        var modifier = 0;
        if( event.shiftKey ) {
            modifier = 10;
        }
        switch(keyCode) {
            case 37: // left arrow
                self.players[self.sid].moving = 1;
                self.players[self.sid].sprite.index = 1;
                self.players[self.sid].x-=self.players[self.sid].speed+modifier;
                if( self.players[self.sid].x <= 0 ) { self.players[self.sid].x = 0; }
                self.broadcast();
                return false;
            break;
            case 38: // up arrow
                self.players[self.sid].moving = 1;
                self.players[self.sid].sprite.index = 3;
                self.players[self.sid].y-=self.players[self.sid].speed+modifier;
                if( self.players[self.sid].y <= 0 ) { self.players[self.sid].y = 0; }
                self.broadcast();
                return false;
            break;
            case 39: // right arrow
                self.players[self.sid].moving = 1;
                self.players[self.sid].sprite.index = 2;
                self.players[self.sid].x+=self.players[self.sid].speed+modifier;
                if( self.players[self.sid].x >= self.w-self.players[self.sid].w ) { self.players[self.sid].x = self.w-self.players[self.sid].w; }
                self.broadcast();
                return false;
            break;
            case 40: // down arrow
                self.players[self.sid].moving = 1;
                self.players[self.sid].sprite.index = 0;
                self.players[self.sid].y+=self.players[self.sid].speed+modifier;
                if( self.players[self.sid].y >= self.h-self.players[self.sid].h ) { self.players[self.sid].y = self.h-self.players[self.sid].h; }
                self.broadcast();
                return false;
            break;
        }
    });

    $(document).keyup(function(e){
        self.moving = 0;
    });
}