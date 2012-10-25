Trash = function( _p, _room ) {
	var self = this;
	var parent = _p;

	this.room = _room;
	this.trashio = new TrashIO(self);

    this.createMessage = function( _type, _msg ) {
    	var msg = {};
    	msg["type"] = _type;
    	msg["msg"] = _msg;
    	return msg;
    }

	this.setup = function() {
		self.trashio.setup();
	}
};