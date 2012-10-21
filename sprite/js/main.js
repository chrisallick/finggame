var example, sfx;
$(document).ready(function() {
    /*
        wrapper_element, options
        this might be the dumbest thing ever...
    */
    example = new Canvas( $("#wrapper"), {
        width: 640,
        height: 480,
        autostart: true,
        assets: ["img/worm.png"], // these are automatically loaded for us
        draw: function(timestamp) {
            this.background('rgb(245,245,245)');
            this.images[0].draw(timestamp);
        }
    });

    example.setup();

    sfx = new Audio("wav/sfx.wav");
});