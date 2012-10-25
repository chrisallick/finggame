$(document).ready(function(){
	$("#login").submit(function(event){
		event.preventDefault();

        $("#login").removeClass("error");

        $.ajax({
            type: "POST",
            url: "/login",
            dataType: "json",
            data: {
                email: $("#email").val()
			}
        }).done(function( resp ) {
            if( resp["result"] == "success" ) {
                $("#login").animate({"opacity":"0"},function(){
                    $("#login").hide();
                    $("#setusername").fadeIn().focus();;
                });
            } else {
                $("#login").addClass("error");
            }
		});
	});

    $("#setusername").submit(function(event){
        event.preventDefault();

        $("#setusername").removeClass("error");

        $.ajax({
            type: "POST",
            url: "/setusername",
            dataType: "json",
            data: {
                username: $("#username").val()
            }
        }).done(function( resp ) {
            if( resp["result"] == "success" ) {
                $("#setusername").animate({"opacity":"0"},function(){
                    $("#setusername").slideUp(function(){
                        $("#setusername").hide();
                        $("#newchatmessage").slideDown();
                    });
                });
            } else {
                $("#setusername").addClass("error");
            }
        });
    });
});