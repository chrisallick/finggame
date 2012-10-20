window.requestAnimFrame = ( function() {
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(draw, element) {
                window.setTimeout(draw, 1000 / 60);
            };
})();

$(document).ready(function(){
	animate = function(timestamp) {
        requestAnimFrame(animate);
        draw(timestamp);
    }

    if( $("#canvas").length > 0 ) {
        w = $(document).width();
        h = 370;
        $("#canvas").attr("height", h);
        $("#canvas").attr("width", w);
    
        ps = new ParticleSystem();
        // for every 100 pixels, release 4 particles
        ps.init( w, h, Math.floor(w/100)*3 );
        
        $("#canvas").fadeIn(1000);
        animate();
    }
});