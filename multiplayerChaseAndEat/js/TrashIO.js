TrashIO = function( _p, options ) {
    this.connection;
    this.bConnected;
    this.sid;

    var _self = this;
    var _parent = _p;


    this.onDisconnect = options.onDisconnect;
    this.onConnect = options.onConnect;
    this.onRoomNotice = options.onRoomNotice;
    this.onRegister = options.onRegister;
    this.onUnregister = options.onUnregister;
    this.onChat = options.onChat;
    this.onChatHistory = options.onChatHistory;
    this.onYouTube = options.onYouTube;
    this.onImage = options.onImage;
    this.onStreamHistory = options.onStreamHistory;
    this.onStream = options.onStream;

    //this.ws_url = "ws://0.0.0.0:8080/" + _parent.room; // localhost
    //this.ws_url = "ws://192.168.1.141:8080/" + _parent.room; // this computer's private ip
    //this.ws_url = "ws://stage.trash.io:8080/" + _parent.room; // public ws server
    this.ws_url = "ws://" + window.location.hostname + ":8080/" + _parent.room; // hostname of site with hardcoded port (best)

    this.onWelcome = function(msg) {
        this.sid = msg["msg"];
        this.register();
    }

    this.register = function() {
        var msg = _parent.createMessage( "register", this.sid );
        _self.sendMessage( msg );
    }

    this.sendMessage = function(msg) {
        _self.connection.send(JSON.stringify(msg));
    }

    this.sendChat = function(_msg) {
        var msg = _parent.createMessage( "chat", _msg );
        _self.connection.send(JSON.stringify(msg));
    }

    this.ping = function() {
        var msg = {"type":"pong"}
        _self.sendMessage(msg);
    }

    this.setup = function() {
        console.log( _self.ws_url );
        if ("WebSocket" in window) {
            _self.connection = new ReconnectingWebSocket( _self.ws_url );
        }

        this.connection.onmessage = function( event ) {
            try {
                _self.parseMessage( JSON.parse(event.data) );
            } catch (err) {}
        }

        this.connection.onopen = function( event ) {
            _self.bConnected = true;
            _self.onConnect();
        }

        this.connection.onclose = function( event ) {
            _self.bConnected = false;
            _self.onDisconnect();
        }
    }

    this.parseMessage = function( msg ) {
        console.log( msg );
        if( msg["type"] ) {
            if( msg["type"] == "welcome" ) {
                _self.onWelcome( msg );

            } else if( msg["type"] == "register" ) { // someone joins or leaves the site
                _self.onRegister( msg );

            } else if( msg["type"] == "unregister" ) { // someone signed off
                _self.onUnregister( msg );

            } else if( msg["type"] == "chat" ) { // chat message is received
                _parent.itemWhileBlured();
                _self.onChat( msg["username"], msg["msg"] );

            } else if( msg["type"] == "chathistory" ) { // chat history is received
                _self.onChatHistory( msg["msg"] );

            } else if( msg["type"] == "image" ) { // on image sent to site works with special youtube now
                _parent.itemWhileBlured();
                _self.onImage( msg );

            } else if( msg["type"] == "streamhistory" ) { // on chat history
                _self.onStreamHistory( msg["msg"] );

            } else if( msg["type"] == "roomnotice" ) {
                _self.onRoomNotice( msg );
            } else if( msg["type"] == "refresh" ) {
                window.location = window.location.pathname;
            } else if( msg["type"] == "stream" ) {
                _self.onStream( msg );
            } else if( msg["type"] == "ping" ) {
                _self.ping();
            } else if( msg["type"] == "video_stream" ) {
                $(".currentstreamitem").attr("src",msg["msg"]);
            }
        }
    }
};