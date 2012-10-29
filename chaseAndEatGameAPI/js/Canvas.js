Canvas = function( _target, _options ) {
    var self = this;
    this.canvas;
    this.context;

    this.t = _target;
    this.w = _options.width;
    this.h = _options.height;
    this.autostart = _options.autostart;
    this.draw = _options.draw;
    this.assets = _options.assets;
    this.assets_loaded = 0;
    this.active = false;

    this.images = [];
    this.food = [];
    this.alive = 5;

    this.gamepad = new Gamepad();

    this.gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
        console.log('Connected', device);
    });

    this.gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
        console.log('Disconnected', device);
    });

    this.gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
        console.log('Unsupported controller connected', device);
    });

    this.gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
        var wrap,
            control,
            value,
            i;

        for (i = 0; i < gamepads.length; i++) {
            if( gamepads[i].state.DPAD_LEFT ) {
                self.images[0].moving = 1;
                self.images[0].goLeft(10);
            }
            if( gamepads[i].state.DPAD_RIGHT ) {
                self.images[0].moving = 1;
                self.images[0].goRight(10);
            }
            if( gamepads[i].state.DPAD_UP ) {
                self.images[0].moving = 1;
                self.images[0].goUp(10);
            }
            if( gamepads[i].state.DPAD_DOWN ) {
                self.images[0].moving = 1;
                self.images[0].goDown(10);
            }
        }
    });

    if (!this.gamepad.init()) {
        alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
    }

    this.background = function( bg ) {
        self.context.fillStyle = bg;
        self.context.fillRect( 0, 0, self.w, self.h );
    }

    this.checkHits = function() {
        for(var i = 0; i < 5; i++ ) {
            if( this.food[i].alive && this.food[i].hitTest(this.images[0]) ) {
                sfx.play();
                self.alive--;
            }
        }
    }

    this.setupOverlays = function() {
        $(window).blur(function(){
            self.active = false;
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

        if( example.assets ) {
            for( var i = 0, len = self.assets.length; i < len; i++ ) {
                var img = new Image();
                img.onload = function() {
                    self.assets_loaded++;
                    // image_object, x, y, width, height, speed, index
                    self.images.push( new Sprite( self, img, getRandInt(0,example.w-30), getRandInt(0,example.h-30), 30, 30, 2, 3) );
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
}