Camera = function( _p, _el ) {
	var _self = this;
	var _parent = _p;
	this._camera = _el;

	this.timeUntilPhoto = 3;
	this.ct;

	$(".takepicture", _self._camera).click(function(){
		camera.takePicture();
	});

	$(".closecamera", _self._camera).click(function(){
		//$(_self._camera).hide();
		$(_self._camera).animate({
			top: 0,
			left: 0,
			width: 0,
			height: 0
		}, 250, function(){
			$(_self._camera).hide();
		});
	});

	this.uploadPhoto = function( img ) {
		$.ajax({
			type: 'POST',
			url: '/uploadfile',
			dataType: "json",
			data: { image: img },
			success: function(resp){
				if( resp["result"] && resp["result"] == "success") {
					var msg = trash.createMessage("image",resp["msg"]);
					trash.trashio.sendMessage(msg);
				}
				$(_self._camera).hide();
			}
		});
	}

	this.cameraCountdown = function() {
		clearTimeout( _self.ct );
		_self.timeUntilPhoto--;
		$(".countdown", _self._camera).html(_self.timeUntilPhoto);
		if(_self.timeUntilPhoto == 0 ) {
			$(".countdown", _self._camera).html("");
			$(".countdown", _self._camera).css("background-color", "#FFFFFF");
			$(".countdown", _self._camera).fadeOut(1500);
			_self.uploadPhoto( webcam.save() );
		} else {
			_self.ct = setTimeout( _self.cameraCountdown, 1000 );
		}
	}

	this.attach = function( el ) {
	    el.webcam({
	        swffile: "/swf/sAS3Cam.swf?v=20120613",

	        previewWidth: 640,
	        previewHeight: 480,

	        resolutionWidth: 640,
	        resolutionHeight: 480,

	        noCameraFound: function () {
	            
	        },

	        swfApiFail: function(e) {
	            
	        },

	        cameraDisabled: function () {
	            
	        },

	        cameraEnabled:  function () {
	            var cameraApi = this;
	            if (cameraApi.isCameraEnabled) {
	                return;
	            } else {
	                cameraApi.isCameraEnabled = true;
	            }
	            var cams = cameraApi.getCameraList();

	            setTimeout(function() {
	                cameraApi.setCamera('0');
	            }, 750);
	        }
	    });
	}

	this.open = function() {
		$(_self._camera).show().animate({
			top: $(document).height()/2 - 640/2,
			left: $(document).width()/2 - 480/2,
			width: 640,
			height: 480
		}, 250);
		// $(_self._camera).css({
		// 	left: $(document).width()/2 - $(_self._camera).width()/2,
		// 	top: $(document).height()/2 - $(_self._camera).height()/2
		// }).show();
		_self.attach( $(".camera", _self._camera) );
	}

	this.takePicture = function() {
		_self.timeUntilPhoto = 3;
		$(".countdown", _self._camera).css("background-color", "transparent").html("3").show();
		clearTimeout( _self.ct );
		_self.ct = setTimeout( _self.cameraCountdown, 1000 );
	}
}