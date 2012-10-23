var example, sfx;
$(document).ready(function() {
    /*
        wrapper_element, options
        this might be the dumbest thing ever...
    */
    example = new Canvas( $("#wrapper"), {
        width: $(document).width(),
        height: $(document).width(),
        autostart: true,
        assets: ["img/worm.png"], // these are automatically loaded for us
        draw: function(timestamp) {
            this.background('rgb(245,245,245)');
            for(var i = 0; i < 5; i++ ) {
                this.food[i].draw(timestamp);    
            }
            this.images[0].draw(timestamp);
            this.checkHits();
            if( this.alive <= 0 ) {
                this.context.fillStyle="#CC00FF";
                this.context.fillText("you win!", 200, 200);
            }
        }
    });

    example.setup();

    sfx = new Audio("wav/sfx.wav");
});