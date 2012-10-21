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
        assets: ["img/worm.png"],
        draw: function(timestamp) {
            this.context.fillStyle = 'rgb(245,245,245)';
            this.context.fillRect( 0, 0, this.w, this.h );

            this.context.drawImage(
                this.images[0].image,
                30*this.images[0].step, 30,
                30, 30,
                this.images[0].x, this.images[0].y,
                this.images[0].w, this.images[0].h
            );

            //this.images[0].step++;
            if( this.images[0].step > 3 ) {
                this.images[0].step = 0;
            }
        }
    });

    example.setup();
});