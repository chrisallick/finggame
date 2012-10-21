var example;
$(document).ready(function() {
    /*
        wrapper_element, options
        this might be the dumbest thing ever...
    */
    example = new Canvas( $("#wrapper"), {
        width: 640,
        height: 480,
        autostart: true,
        draw: function(timestamp) {
            var x = Math.sin( timestamp*0.002) * 96 + this.w/2;
            var y = Math.cos( (timestamp*0.002) * 0.9 ) * 96 + this.w/2;

            this.context.fillStyle = 'rgb(245,245,245)';
            this.context.fillRect( 0, 0, this.w, this.h );

            this.context.fillStyle = 'rgb(255,0,0)';
            this.context.beginPath();
            this.context.arc( x, y, 10, 0, Math.PI * 2, true );
            this.context.closePath();
            this.context.fill();
        }
    }).setup();
});