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
    this.images = [];

    this.setup = function() {
        self.canvas = document.createElement( 'canvas' );
        self.canvas.id = "canvas";
        self.canvas.width = self.w;
        self.canvas.height = self.h;

        self.context = self.canvas.getContext( '2d' );

        self.t.append( self.canvas );

        if( example.assets ) {
            for( var i = 0, len = self.assets.length; i < len; i++ ) {
                var img = new Image();
                img.onload = function() {
                    self.assets_loaded++;
                    var temp = {};
                    temp.image = img;
                    temp.x = 0;
                    temp.y = 0;
                    temp.w = 30;
                    temp.h = 30;
                    temp.step = 0;
                    self.images.push( temp );
                }
                img.src = self.assets[i];
            }
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