Trash = function( _p, username, room) {
	var _self = this;
	var _parent = _p;
	
	this.username = username;
	this.room = room;
	this.old_name;

	this.whos_online = [];

	this.bWindowFocused = true;
	this.itemsWhileBlured;

	this.chat_timer;

    $(window).blur(function() {
		_self.bWindowFocused = false;
		_self.itemsWhileBlured = 0;
    });

    $(window).focus(function() {
		_self.bWindowFocused = true;
      	document.title = "Trash.io";
    });

    this.startChatTimer = function( el ) {

    }

    this.itemWhileBlured = function() {
        if( !this.bWindowFocused ) {
            this.itemsWhileBlured++;
            var new_title = 'Trash.io (' + this.itemsWhileBlured + ')';
            document.title = new_title;
        }
    }

    this.createMessage = function( _type, _msg ) {
    	var msg = {};
    	msg["username"] = this.username;
    	msg["room"] = this.room;
    	msg["type"] = _type;
    	msg["msg"] = _msg;
    	return msg;
    }

	this.setup = function() {
		this.trashio.setup();
	}

	this.handleLogout = function() {
		_self.old_name = $.cookie("trash_username");
		$.removeCookie("trash_username");
		this.username = "derp";
		_parent.handleLogout();
	}

	this.handleReset = function() {
		$.removeCookie("trash_username");
		$.removeCookie("trash_email");
	}

	this.handlePaste = function(event) {
		var msg = this.createMessage( "chat", event.clipboardData.getData('Text') );
		this.trashio.sendMessage( msg );
	}
};