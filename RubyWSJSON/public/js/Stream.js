Stream = function( _p, _el ) {
	var _self = this;
	var _parent = _p;
	
	this._stream = _el;

	this.clear = function() {
	    $(_self._stream).html( "<img class='loader' src='/img/gifs/loading.gif' />" );
	    $(".loader", _self._stream).css({
	        top: $(_self._stream).height()/2 - $(".loader", _self._stream).height()/2,
	        left: $(_self._stream).width()/2 - $(".loader", _self._stream).width()/2
	    });
	}

	this.display = function( stream_object ) {

	}

	this.resize = function() {
		$(_self._stream).height( $("#right").height() - 100 ); // compensate for header and posted by
		$(_self._stream).width( $("#right").width() - 80 );
		$(_self._stream).css({
			left: ($("#right").width()/2) - (_self._stream.width()/2),
			top: 30
		});

		$(".loader", _self._stream).css({
			top: $(_self._stream).height()/2 - $(".loader", _self._stream).height()/2,
			left: $(_self._stream).width()/2 - $(".loader", _self._stream).width()/2
		});

		var o_width = archive.getSize(current_image).width;
		var o_height = archive.getSize(current_image).height;
		var n_height;
		var n_width;
		var frame = { x: $(_self._stream).width(), y: $(_self._stream).height() }

	    var over = o_width / o_height;
	    var under = o_height / o_width;
	    if( (frame.x / frame.y) >= over ) {
			n_width = over * frame.y;
			n_height = frame.y;
	    } else {
			n_width = frame.x;
			n_height = under * frame.x;
	    }

	    if( n_height <= o_height && n_width <= o_width ) {
	    	$(".currentstreamitem", _self._stream).height( n_height );
			$(".currentstreamitem", _self._stream).width( n_width );    	
	    }

		$(".currentstreamitem", _self._stream).css({
			top: $(_self._stream).height()/2 - $(".currentstreamitem", _self._stream).height()/2, // padding on top
			left: $(_self._stream).width()/2 - $(".currentstreamitem", _self._stream).width()/2
		});
	}
}