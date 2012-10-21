Canvas = function( _target, _options ) {
    var self = this;
    this.canvas;
    this.context;

    this.t = _target;
    this.w = _options.width;
    this.h = _options.height;
    this.autostart = _options.autostart;
    this.draw = _options.draw;

    this.setup = function() {
        self.canvas = document.createElement( 'canvas' );
        self.canvas.id = "canvas";
        self.canvas.width = self.w;
        self.canvas.height = self.h;

        self.context = self.canvas.getContext( '2d' );

        self.t.append( self.canvas );
            
        $(self.canvas).hide().fadeIn(1000);
        if( self.autostart ) {
            self.animate();
        }
    }

    this.animate = function(timestamp) {
        requestAnimFrame( self.animate );
        self.draw(timestamp);
    }

    this.start = function() {
        self.setup();
    }   
}