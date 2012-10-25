TrashIO = function( _p, _room ) {
    var self = this;
    var parent = _p;

    this.connection;
    this.bConnected;
    this.room = _room;

    //this.ws_url = "ws://" + window.location.hostname + ":8081/" + parent.room;
    this.ws_url = "ws://localhost:8081/" + self.room;

    this.onWelcome = function(sid,players) {
        for( var i in players ) {
            if( players[i] == sid ) {
                parent.readyPlayer( sid );
            } else {
                parent.addPlayer( players[i] );
            }
        }
        var msg = self.createMessage("join",sid);
        self.sendMessage(msg);
    }

    this.sendMessage = function(msg) {
        self.connection.send(JSON.stringify(msg));
    }

    this.ping = function() {
        var msg = {"type":"ping"}
        self.sendMessage(msg);
    }

    this.pong = function() {
        var msg = {"type":"pong"}
        self.sendMessage(msg);
    }

    this.createMessage = function( _type, _msg ) {
        var msg = {};
        msg["type"] = _type;
        msg["msg"] = _msg;
        return msg;
    }

    this.setup = function() {
        if ("WebSocket" in window) {
            self.connection = new ReconnectingWebSocket( self.ws_url );
        }

        this.connection.onmessage = function( event ) {
            try {
                self.parseMessage( JSON.parse(event.data) );
            } catch (err) { console.log(err); }
        }

        this.connection.onopen = function( event ) {
            self.bConnected = true;
        }

        this.connection.onclose = function( event ) {
            self.bConnected = false;
        }
    }

    this.parseMessage = function( msg ) {
        if( msg["type"] ) {
            if( msg["type"] == "welcome" ) {
                self.onWelcome( msg["data"], msg["players"] );
            } else if( msg["type"] == "leave" && msg["msg"] != parent.sid ) {
                parent.removePlayer( msg["data"] );
            } else if( msg["type"] == "join" && msg["msg"] != parent.sid ) {
                parent.addPlayer( msg["msg"] );
            } else if ( msg["type"] == "move" && msg["msg"] != parent.sid ) {
                parent.players[msg["msg"]].x = msg.x;
                parent.players[msg["msg"]].y = msg.y;
                parent.players[msg["msg"]].sprite.index = msg.index;
            } else if( msg["type"] == "food" ) {
                parent.food[msg["msg"]].alive = false;
                parent.alive--;
            } else if( msg["type"] == "score" ) {
                parent.players[msg["msg"]].score++;
            }
        }
    }

    self.setup();
};