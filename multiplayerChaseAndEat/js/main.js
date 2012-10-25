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
            for(var i = 0; i < 5; i++ ) {
                this.food[i].draw(timestamp);
            }
            for( var i in this.players ) {
                this.players[i].draw(timestamp);
            }

            this.checkHits();

            if( this.alive <= 0 ) {
                this.context.fillStyle="#CC00FF";

                // who won?
                var highest = -1;
                for( var player in this.players ) {
                    if( highest == -1 ) {
                        highest = this.players[player].sid;
                    } else {
                        if( this.players[player].sore > highest ) {
                            highest = this.players[player].sid;
                        }
                    }
                }

                if( highest == this.players[this.sid].sid ) {
                    this.context.fillText("you won!", 200, 200);
                } else {
                    this.context.fillText("player " + this.players[highest].score + " won!", 200, 200);
                }
            }
            var counter = 0;
            for( var player in this.players ) {
                var score = "player " + player + ": " + this.players[player].score;
                this.context.fillText(score, 20, 20+(20*counter));
                counter++;
            }
            

            if( this.active ) {

            } else {
                this.context.fillStyle = "rgba(0,0,0,.78)";
                this.context.fillRect(0,0,this.w,this.h);
                this.context.fillStyle = "#FFFFFF";
                this.context.fillText("Click to play!", 200, 200);
            }
        }
    });

    example.setup();

    sfx = new Audio("wav/sfx.wav");
});