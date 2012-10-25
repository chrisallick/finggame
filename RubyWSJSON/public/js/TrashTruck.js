TrashTruck = function( _p, _el ) {
    var _self = this;
    var _parent = _p;

    this._dnd = _el;

    this.valid_types = ["image/gif", "image/jpeg", "image/png"];

    $(_self._dnd).hide();

    $(_self._dnd).bind('dragenter dragover', function(event) {
        return false;
    }).bind('dragleave', function(event) {
        if( window.event.pageX == 0 || window.event.pageY <= 47 ) {
            $(this).fadeOut(500);
            return false;
        }
    }).bind('drop', function(event) {
        $(_self._dnd).removeClass("drop").addClass("crunch");

        _self.handleDrop(event,function(resp) {
            if( resp["result"] == "success" ) {
                var msg = _parent.createMessage( "image", resp["msg"] );
                _parent.trashio.sendMessage( msg );
                $(_self._dnd).fadeOut(500,function(){
                    $(_self._dnd).removeClass("crunch").addClass("drop");
                });
            } else if( resp["result"] == "forward" ) {
                var msg = _parent.createMessage( "chat", resp["msg"] );
                _parent.trashio.sendMessage( msg );
                $(_self._dnd).fadeOut(500,function(){
                    $(_self._dnd).removeClass("crunch").addClass("drop");
                });
            } else {
                $(".bg", _self._dnd).css({
                    "background-color":"#DE3D20"
                }).delay(250).animate({
                    "background-color" : "#5edcee"
                }, 750, function() {
                    $(_self._dnd).fadeOut(500,function(){
                        $(_self._dnd).removeClass("crunch").addClass("drop");
                        $(".bg", _self._dnd).css("background-color","#5edcee");
                    });
                });
            }
        });

        return false;
    });

    this.resize = function() {
        $(".dropit", _self._dnd).css({
            left: $(document).width()/2 - $(".dropit", _self._dnd).width()/2
        });

        $(".crunchit", _self._dnd).css({
            left: $(document).width()/2 - $(".crunchit", _self._dnd).width()/2
        });
    }

    this.validFile = function( file, filename ) {
        if( _self.valid_types.indexOf( file.type ) > -1 ) {
            return true;
        }
        return false;
    }

    this.uploadFile = function ( file, callback ) {
        var filename = file.name || file.fileName;

        if( file && filename && _self.validFile( file, filename ) ) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    try { var resp = JSON.parse( xhr.responseText ); } catch(e) {}
                    if( resp && resp["result"] == "success" ) {
                        callback(resp);
                    }
                }
            };
            onProgressHandler = function(event) {
                var percent = event.loaded/event.total;
                if( percent == 1 ) {}
            };
            onLoadStartHandler = function(event) {
                console.log( "started!" );
            };
            xhr.upload.addEventListener("progress", onProgressHandler, false);
            xhr.upload.addEventListener("onloadstart", onLoadStartHandler, false);
            xhr.open('POST', "/uploadfile", true);
            xhr.setRequestHeader('X-Filename', filename);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.send(file);
        } else {
            callback({
                "result":"fail",
                "msg": "not an accepted image file."
            });
        }
    }

    this.handleDrop = function( event, callback ) {
        event.preventDefault();

        var dataTransfer = event.originalEvent.dataTransfer;

        var img_url = "";
        if( jQuery.browser["mozilla"] ) {
            var url_string = event.originalEvent.dataTransfer.getData('text/html');
        } else {
            img_url = event.originalEvent.dataTransfer.getData('URL');
        }

        if (dataTransfer.files.length > 0) {
            var file = dataTransfer.files[0];
            _self.uploadFile( file, callback );
        } else if( img_url != "" ) {
            callback({
                "result": "forward",
                "msg": img_url
            });
        } else {
            callback({
                "result": "fail",
                "msg": "not an accepted image file."
            });
        }
    }
};