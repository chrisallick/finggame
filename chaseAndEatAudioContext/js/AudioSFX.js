AudioSFX = function( _p ) {
	var self = this;
	var parent = _p;

	this.sounds = new Array();

	this.context = new webkitAudioContext();

    // sfx = new Audio("wav/sfx.wav");
    // http://f1lt3r.com/w3caudio/web-audio-api/basic-examples/looping-sounds-without-gaps.html

    this.play = function( sound ) {
    	var source = self.context.createBufferSource();
    	source.buffer = self.sounds[sound];
    	source.connect( self.context.destination );
    	source.noteOn( 0 );
    }

    this.load = function() {
    	var request = new XMLHttpRequest();
    	request.addEventListener( 'load', function(e) {
        	self.context.decodeAudioData( request.response, function(decoded_data) {
        		self.sounds[0] = decoded_data;
        	}, function(e){
            	console.log("error");
        	});
    	}, false);
    	request.open( 'GET', 'wav/sfx.wav', true );
    	request.responseType = "arraybuffer";
    	request.send();
    }

    self.load();
}