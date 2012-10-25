Archive = function( _p, _el ) {
    var _self = this;
    var _parent = _p;

    // points to dom element that will hold stream
    this._archive = _el;

    // holds all the stream objects
    this._items = new Array();

    /*
        reset the array
        kill the content
    */
    this.clear = function() {
        _self._items = new Array();
        $(".archive", _el).html("");
    }

    /*
        re-center the chat stream
    */
    this.recenter = function() {
        _self._archive.css({
            left: ($("#right-wrapper").width()/2) - (_self._archive.width()/2)
        });
    }

    /*
        get the width and height of a rescaled image
        takes an index
        returns an object with width and height
    */
    this.getSize = function( index ) {
        if( _self._items[index] ) {
            return { width: _self._items[index].w, height: _self._items[index].h };
        } else {
            return { width: 0, height: 0 };
        }
    }

    /*
        call display on the archive
        takes an index and calls the display function
        of that object
    */
    this.display = function( index ) {
        $("#postedby").hide();
        $("#postedby span").html( _self._items[index].username );

        _self._items[index].display();

        $(".selected", _self._archive).removeClass("selected");
        $(".thumb:eq("+current_image+")", _self._archive).addClass("selected");
    }

    /*
        create a Stream Image object
        takes a username and url
        builds a thumb
    */
    this.StreamImage = function( _username, _url ) {
        this.username = _username;
        this.url = _url;
        this.thumb = _url+"?w=90&h=90&fit=crop";
        this.w = 0;
        this.h = 0;
        var _self = this;
        this.display = function() {
            var img = new Image();
            img.onload = function() {
                _self.w = this.width;
                _self.h = this.height;
                img.className = "currentstreamitem";
                $(img).hide();
                $("#stream").html("").append( img );
                
                $(img).css({
                    top: $("#stream").height()/2 - this.height/2,
                    left: $("#stream").width()/2 - this.width/2
                }).mouseover(function(event) {
                    // $("#postedby").width( this.width ).css({
                    //     left: $("#stream").width()/2 - this.width/2 + 40,
                    //     top: $("#stream .currentstreamitem").offset().top
                    // }).fadeIn();
                }).mouseout(function(event){
                    //$("#postedby").fadeOut();
                }).fadeIn();

                $(img).siblings(".loader").hide();
            }
            img.src = this.url+"?h="+$("#stream").height()+"&w="+$("#stream").width()+"&fit=max&vib=1";
        };
    }

    /*
        create a Stream YouTube object
        takes a username, thumb_url and video id
    */
    this.StreamYouTube = function( _username, _thumb, _vid ) {
        this.username = _username;
        this.thumb = _thumb;
        this.vid = _vid;
        this.w = 640;
        this.h = 480;
        this.display = function() {
            $("#stream").html('<iframe class="currentstreamitem" width="640" height="480" src="http://www.youtube.com/embed/'+this.vid+'?autoplay=1" frameborder="0" allowfullscreen></iframe>')
            $("#stream .currentstreamitem").css({
                top: $("#stream").height()/2 - $("#stream .currentstreamitem").height()/2,
                left: $("#stream").width()/2 - $("#stream .currentstreamitem").width()/2
            });
        }
    }

    /*
        create a Stream Vimeo object
        takes a username, thumb_url and video id
    */
    this.StreamVimeo = function( _username, _thumb, _vid ) {
        this.username = _username;
        this.thumb = _thumb;
        this.vid = _vid;
        this.w = 640;
        this.h = 480;
        this.display = function() {
            $("#stream").html('<iframe class="currentstreamitem" width="640" height="480" src="http://player.vimeo.com/video/'+$(".thumb:eq("+current_image+")").data("vimeo")+'?autoplay=1"></iframe>');
            $("#stream .currentstreamitem").css({
                top: $("#stream").height()/2 - $("#stream .currentstreamitem").height()/2,
                left: $("#stream").width()/2 - $("#stream .currentstreamitem").width()/2
            });
        }
    }

    /*
        add an Image to the stream
        takes a msg object and a boolean to append or prepend
    */
    this.addImage = function( msg, shift ) {
        if( shift ) {
            _self._items.unshift( new _self.StreamImage(msg["username"], msg["msg"]) );
            _self.addToArchive(0);
        } else {
            _self._items.push( new _self.StreamImage(msg["username"], msg["msg"]) );
        }
    }

    /*
        add a Vimeo video to the stream
        takes a msg object and a boolean to append or prepend
    */
    this.addVimeo = function( msg, shift ) {
        if( shift ) {
            _self._item.unshift( new _self.StreamVimeo(msg["username"], msg["msg"], msg["vid"]) );
            _self.addToArchive(0);
        } else {
            _self._item.push( new _self.StreamVimeo(msg["username"], msg["msg"], msg["vid"]) );
        }
    }


    /*
        add a YouTube video to the stream
        takes a msg object and a boolean to append or prepend
    */
    this.addYouTube = function( msg, shift ) {
        if( shift ) {
            _self._items.unshift( new _self.StreamYouTube(msg["username"], msg["msg"], msg["vid"]) );
            _self.addToArchive(0);
        } else {
            _self._items.push( new _self.StreamYouTube(msg["username"], msg["msg"], msg["vid"]) );
        }
    }

    /*
        Display the archive
        1) rebuild the thumbs from archive array
        2) attach actions
    */
    this.refresh = function() {
        for( var i = 0, len = _self._items.length; i < len; i++ ) {
            if( _self._items[i].vid ) {
                var append_string = "<li class='thumb ytvideo'><img class='loader' src='/img/gifs/loading.gif' /><img class='thumb_img' src='"+_self._items[i].thumb+"' /><span class='playbutton'>&nbsp</span></li>";
            } else {
                var append_string = "<li class='thumb'><img class='loader' src='/img/gifs/loading.gif' /><img class='thumb_img' src='"+_self._items[i].thumb+"' /></li>";
            }
            $(".archive", _self._archive ).append(append_string);
        }

        $(".thumb_img").load(function(){
            $(this).animate({opacity:1});
            $(this).siblings(".loader").hide();
        });

        var width_of_thumbs = num_thumbs * ($(".thumb").outerWidth() + 8 );
        $(".archive-content", _self._archive).width( width_of_thumbs );
        $(".thumb").click(function(event) {
            current_image = $(this).index();
            loadNextImage();
        });

        $(".thumb_img").error(function(){
            // zero based index
            var index = $(this).parent(".thumb").index();
            _self._items.splice(index,1);
            num_images--;
            $(this).parent(".thumb").remove();
            if( current_image == index ) {
                loadNextImage();  
            }
        });
    }


    /*
        add latest image to archive strip on page
    */
    this.addToArchive = function( index ) {
        if( _self._items[index].vid ) {
            var prepend_string = "<li class='thumb ytvideo'><img class='loader' src='/img/gifs/loading.gif' /><img class='thumb_img' src='"+_self._items[index].thumb+"' /><span class='playbutton'>&nbsp</span></li>";
        } else {
            var prepend_string = "<li class='thumb'><img class='loader' src='/img/gifs/loading.gif' /><img class='thumb_img' src='"+_self._items[index].thumb+"' /></li>";
        }
        $(".archive", _self._archive ).prepend(prepend_string);

        $(".thumb").click(function(event) {
            current_image = $(this).index();
            loadNextImage();
        });

        $(".thumb_img").load(function(){
            $(this).animate({opacity:1});
            $(this).siblings(".loader").hide();
        });
    }


    /*
        bind keyboard actions
        check to see if you are in the comment box
        before eating the keyboard event
    */    
    this.bindKeys = function() {
        $(document).keydown(function(e) {
            var keyCode = e.keyCode;
            if( !bCommenting ) {
                switch(keyCode) {
                    case 37: // left arrow
                        if( current_image > 0 ) {
                            current_image--;    
                            loadNextImage();
                        }
                    break;
                    case 38: // up arrow
                        if( current_image > 0 ) {
                            current_image--;
                            loadNextImage();
                        }
                    break;
                    case 39: // right arrow
                        if( current_image < num_images-1 ) {
                            current_image++;
                            loadNextImage();
                        }
                    break;
                    case 40: // down arrow
                        if( current_image < num_images-1 ) {
                            current_image++;
                            loadNextImage();
                        }
                    break;
                }
            }
        });
    }
}