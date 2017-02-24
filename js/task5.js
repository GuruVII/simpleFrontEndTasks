$( document ).ready(function() {
	document.getElementById("element1").addEventListener("mousemove", function(event) {
		event.stopPropagation();
		$("#element1").css("backgroundColor", "blue");
	    $("#element3").css("backgroundColor", "white");
	    $("#element2").css("backgroundColor", "white");
	    
	});
	document.getElementById("element2").addEventListener("mousemove", function(event) {
		event.stopPropagation();
	    $("#element2").css("backgroundColor", "blue");
	    $("#element1").css("backgroundColor", "white");
	    $("#element3").css("backgroundColor", "white");
	});
	document.getElementById("element3").addEventListener("mousemove", function(event) {
		event.stopPropagation();
	    $("#element3").css("backgroundColor", "blue");
	    $("#element1").css("backgroundColor", "white");
	    $("#element2").css("backgroundColor", "white");
	});
	
	document.getElementsByClassName("container")[0].addEventListener("mousemove", function(event) {
		event.stopPropagation();
	    $("#element3").css("backgroundColor", "white");
	    $("#element1").css("backgroundColor", "white");
	    $("#element2").css("backgroundColor", "white");
	});
});