Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

loadNextImage = function() {
	stream.clear();
	archive.display(current_image);

	// careful, that 2 is a magic number...
	if( current_image > num_thumbs-2 ) {
		$("#archive-wrapper .archive").css({
			left: -($(".thumb").outerWidth()+8) * ( current_image - (num_thumbs-1) )
		});
	} else if( current_image == 0 ) {
		$("#archive-wrapper .archive").css({
			left: "0px"
		});
	}
}

handleResize = function() {
	$("#chat-wrapper").css("height",$("#left-wrapper").height()-130);
	$("#chat").css("height",$("#chat-wrapper").height());
	$("#chat").scrollTop($("#chat")[0].scrollHeight);
	
	$("#right-wrapper").css("width", $(window).width() - $("#left-wrapper").outerWidth());

	stream.resize();

	$("#postedby").width($("#stream .currentstreamitem").width());
	$("#postedby").css({
		left: ($("#stream").width()/2 - $("#stream .currentstreamitem").width()/2) + 40,
		top: $("#stream .currentstreamitem").offset().top
	});
	
	archive.recenter();
	trash.trashtruck.resize();
}

handleLogout = function() {
	$("#chatbox").addClass("login");
	$("#chatbox input").attr("placeholder","enter user name...");
}

var months=new Array();
months[0]="Jan";
months[1]="Feb";
months[2]="Mar";
months[3]="Apr";
months[4]="May";
months[5]="Jun";
months[6]="Jul";
months[7]="Aug";
months[8]="Sep";
months[9]="Oct";
months[10]="Nov";
months[11]="Dec";
timestamp = function() {
	var date = new Date();

	var hours = date.getHours()%12;
	var minutes = "";
	var ampm = "";
	var month = months[date.getMonth()];
	var day = date.getDate();
	var year = date.getUTCFullYear();

	// am or pm
	if( date.getHours() < 12 ) {
		ampm = "am";
	} else {
		ampm = "pm";
	}

	if( hours == "0" ) { hours = "12"; }

	// set minutes
	if( date.getMinutes() < 10 ) {
		 minutes = "0"+date.getMinutes();
	} else {
		minutes = date.getMinutes();
	}

	var time = month + " " + day + ", " + year + ", " + hours+":"+minutes+ampm;

	// var msg = trash.createMessage( "roomnotice", time );
	// msg["special"] = "timecheck";
	//trash.trashio.sendMessage( msg );

	// $("#chat").append("<p class='chatitem roomnotice time'>"+time+"</p>");
	// $("#chat").animate({
	// 	scrollTop: $("#chat")[0].scrollHeight
	// });
	return time;
}

var trash, room, username, archive, camera, stream;
var num_images = 0;
var num_thumbs = 8;
var current_image = 0;
var bCommenting = false;

// 1000 is the number of milliseconds in a second.
// 60 is the number of seconds in a minute
// 30 is the number of minutes.
clock_interval = 1000 * 60 * 30;

var bNewRoom = 0;
$(document).ready(function() {

	/* NODDLING, UNPLACED BEHAVIOR */

	$("#camera-button").click(function(){
		camera.open();
	});

	/* END NOODLING */

	/* SETUP */

	username = $.cookie("trash_username") || "derp";
	room = window.location.pathname.split("/")[2] || "home";
	trash = new Trash(window, username, room);
	archive = new Archive( window, $("#archive-wrapper"));
	camera = new Camera( window, $("#camera-wrapper") );
	stream = new Stream( window, $("#stream") );

	trash.trashtruck = new TrashTruck( trash, $("#draganddrop-wrapper") );

    $(document).bind('dragenter', function(event) {
    	if( window.event.pageY > 47 ) {
        	$('#draganddrop-wrapper').fadeIn(500);
        	return false;
    	}
    });

	$("#roomtitle").hide().html(room).fadeIn();

	// TIMER FOR CHAT
	// setInterval( timestamp, clock_interval );

	/* END SETUP */

	/* WINDOW EVENTS */

	handleResize();

	//window.addEventListener("paste", handlePaste, false);

    $(window).resize(handleResize);

	if( !$.cookie("trash_username") ) {
		$("#chatbox").addClass("login");
		$("#chatbox input").attr("placeholder","enter user name...");
	} else {
		$("#chatbox input").attr("placeholder","new message...");
	}

	$("#logOut").click(trash.handleLogout);

	$("#roomtitle").click(function() {
		$("#peopleinroom").html("");
		for(var i = 0, len = trash.whos_online.length; i < len; i++ ) {
			$("#peopleinroom").append("<li><a href='/room/"+trash.whos_online[i]+"'</a>"+trash.whos_online[i]+"</li>");
		}
		$("#peopleinroom").toggle();
	});

	$("#right").mousemove(function(event) {
		if( event.pageY > $(document).height() - 100 ) {
			// $("#archive-wrapper").stop().animate({
			// 	bottom: "0px"
			// }, 100);
			$("#archive-wrapper").stop().css("bottom","0px");
		} else {
			$("#archive-wrapper").stop().animate({
				bottom: "-90px"
			}, 100);
		}
	}).mouseout(function(event) {
		if( event.pageY > $(document).height() - 100 && event.pageX > $("#left").width() ) {
			// do nothing, but maybe something else in future...
		} else {
			$("#archive-wrapper").stop().animate({
				bottom: "-90px"
			}, 100);
		}
	});

	/* END WINDOW EVENTS */

	/* ALL STREAM EVENTS */

	trash.trashio = new TrashIO(trash, {
		onDisconnect: function(){
			$("#info").slideDown();
			$("#chatbox input").slideUp();
		},
		onConnect: function(){
			bNewRoom = 0;
			$("#info").slideUp();
			$("#chatbox input").slideDown();
		},
		onRegister : function(msg) {
			trash.whos_online = [];
			for( person in msg["msg"] ) {
				if( msg["msg"][person] != "" ) { trash.whos_online.push( msg["msg"][person] ); }
			}
			$("#peopleinroom").html("");
			for(var i = 0, len = trash.whos_online.length; i < len; i++ ) {
				$("#peopleinroom").append("<li><a href='/room/'"+trash.whos_online[i]+"</a>"+trash.whos_online[i]+"</li>");
			}
			$(".numactivedorks").text( trash.whos_online.length );
		},
		onUnregister : function(msg) {
			trash.whos_online = [];
			for( person in msg["msg"] ) {
				if( msg["msg"][person] != "" ) { trash.whos_online.push( msg["msg"][person] ); }
			}
			$("#peopleinroom").html("");
			for(var i = 0, len = trash.whos_online.length; i < len; i++ ) {
				$("#peopleinroom").append("<li><a href='/room/'"+trash.whos_online[i]+"</a>"+trash.whos_online[i]+"</li>");
			}
			$(".numactivedorks").text( trash.whos_online.length );
		},
		onChat : function(name, msg) {
			var bump = false;
			if( Math.abs(($("#chat")[0].scrollHeight - $("#chat").scrollTop()) - $("#chat").height()) == 0 ) {
				bump = true;
			}
			$("#chat").append( "<p class='chatitem'><span class='username'>"+name+": </span>"+urlize(msg, {target:'_blank'})+"</p>" );
			if( bump ) {
				$("#chat").animate({
					scrollTop: $("#chat")[0].scrollHeight
				});
			}
		},
		onChatHistory : function(msgs) {
			$("#chat").html("");
			for( var i = 0, len = msgs.length; i < len; i++ ) {
				if( msgs[i]["special"] ) {
					if( msgs[i]["special"] == "timecheck" ){
						$("#chat").prepend("<p class='chatitem roomnotice time'>"+timestamp()+"</p>");
					}
				} else {
					$("#chat").prepend( "<p class='chatitem'><span class='username'>"+msgs[i]["username"]+": </span>"+urlize(msgs[i]["msg"], {target:'_blank'})+"</p>" );
				}
			}
			$("#chat").scrollTop($("#chat")[0].scrollHeight);
			if( !msgs.length ) {
				bNewRoom++;
				// 1 = someone has typed in the room before
				// 0 = no one has typed
				// 2 = brand new room
				if( bNewRoom == 2 ) {
					$("#chat").append( "<p class='chatitem roomnotice'>This is a brand new room!</span></p>" );
				}
			}
		},
		onImage : function(msg) {
			num_images++;
			if( msg["special"] ) {
				if( msg["special"] == "yt" ) {
					archive.addYouTube( msg, true );
				} else if( msg["special"] == "vimeo" ) {
					archive.addVimeo( msg, true );
				}				
			} else {
				archive.addImage( msg, true );
			}

			if( !current_image ) {
				loadNextImage();
			} else {
				current_image++;
			}

			if( msg["username"].toLowerCase() == trash.username.toLowerCase() ) {
				current_image = 0;
				loadNextImage();
			}
			
			archive.recenter();
		},
		onStreamHistory : function(stream) {
			num_images = stream.length;
			archive.clear();
			for( var i = 0, len = stream.length; i < len; i++ ) {
				if( stream[i]["special"] ) {
					if( stream[i]["special"] == "yt" ) {
						archive.addYouTube( stream[i], false );
					} else if( stream[i]["special"] == "vimeo" ) {
						archive.addVimeo( stream[i], false );
					}
				} else {
					archive.addImage( stream[i], false );
				}
			}

			archive.refresh();
			if( num_images ) {
				loadNextImage();
			} else {
				bNewRoom++;
				// 1 = someone has typed in the room before
				// 0 = no one has typed
				// 2 = brand new room
				if( bNewRoom == 2 ) {
					$("#chat").append( "<p class='chatitem roomnotice'>This is a brand new room!</span></p>" );
				}
			}

			archive.recenter();
		},
		onRoomNotice: function(msg) {
			var bump = false;
			if( Math.abs(($("#chat")[0].scrollHeight - $("#chat").scrollTop()) - $("#chat").height()) == 0 ) {
				bump = true;
			}

			if( msg["special"] ) {
				if( msg["special"] == "namechange" ) {
					$("#chat").append( "<p class='chatitem roomnotice'><span class='username'>"+msg["msg"]+"</span> is now <span class='username'>"+msg["username"]+"</span></p>" );
				} else if( msg["special"] == "timecheck" ) {
					$("#chat").append("<p class='chatitem roomnotice time'>"+timestamp()+"</p>");
				}
			}

			if( bump ) {
				$("#chat").animate({
					scrollTop: $("#chat")[0].scrollHeight
				});
			}
		},
		onStream: function(msg) {
			var bump = false;
			if( Math.abs(($("#chat")[0].scrollHeight - $("#chat").scrollTop()) - $("#chat").height()) == 0 ) {
				bump = true;
			}

			$("#stream").html(msg["stream"]);
			$("#chat").append( "<p class='chatitem roomnotice'><span class='username'>"+msg["username"]+"</span> took over stream!</p>" );
			
			if( bump ) {
				$("#chat").animate({
					scrollTop: $("#chat")[0].scrollHeight
				});
			}
		}
	});
	trash.setup();

	$("#chatbox").submit(function(event) {
		event.preventDefault();
		if( $("#newchatmessage").val() != "" ) {
			if( $("#chatbox").hasClass("login") ) {
				$.cookie("trash_username", $("#newchatmessage").val(), {expire:365} ); // good for a year
				trash.username = $("#newchatmessage").val();
				trash.trashio.register();
				$("#chatbox").removeClass("login");
				$("#chatbox input").attr("placeholder","new message...");
				if( trash.old_name != "derp" && trash.old_name != trash.username ) {
					var msg = trash.createMessage( "roomnotice", trash.old_name );
					msg["special"] = "namechange";
					trash.trashio.sendMessage( msg );
				}
			} else {
				var msg = trash.createMessage( "chat", $("#newchatmessage").val() );
				trash.trashio.sendMessage( msg );
				$("#chat").scrollTop($("#chat")[0].scrollHeight);
			}
		}
		$("#newchatmessage").val("");
	});

	$("#chatbox input").blur(function(){
		bCommenting = false;
	}).focus(function(){
		bCommenting = true;
	});

	archive.bindKeys();

	/* END ALL STREAM EVENTS */
});
