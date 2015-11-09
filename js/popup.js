//Authors : Nitish Singh and Gourav Goyal

document.addEventListener('DOMContentLoaded', function () {
	textContent		=$(".text-content");
	footerTime		=$(".time");
	footerStatus	=$(".status");
	//set last position of cursor
	function setCursor(input, selectionStart, selectionEnd) {
		var controlName=document.getElementById(input);
		if (controlName.setSelectionRange) {
			controlName.focus();
			controlName.setSelectionRange(selectionStart, selectionEnd);
		}
	}
	
	//set last dimension
	function setDimension() {
		chrome.storage.local.get(["height","width"], function (obj) {
			if( obj["height"] && obj["width"] ) {
				textContent.height(parseInt(obj["height"]));
				textContent.width(parseInt(obj["width"]));
			}
			else
			{
				textContent.height(299);
				textContent.width(248);
			}				
		});
	}
	
	chrome.windows.getCurrent(function(w) {
		textContent.focus();
		chrome.storage.sync.get(["notes","lastUpdate"], function (obj) {
			setDimension();
			var notes,lastUpdate;
			if($.trim(obj["notes"])){	notes=$.trim(obj["notes"]);	}	else{	notes="";}
			if($.trim(obj["lastUpdate"])){	lastUpdate=obj["lastUpdate"];}	else{ lastUpdate="";}
			textContent.html(notes);
			footerTime.html(lastUpdate);
			footerStatus.html("Welcome..").css("color","deeppink");
		});
		chrome.storage.local.get("cursorPosition",function(obj){
			var cursorPosition;
			if($.trim(obj[cursorPosition])){	cursorPosition=parseInt(obj["cursorPosition"]);}	else{	cursorPosition=0;}
			setCursor("text-content", cursorPosition, cursorPosition);
		});
	});
	
	document.addEventListener("keydown",function (e) {
		//support for tab key
		var keyCode = e.which;
		if (keyCode == 9) {
			e.preventDefault();
			var start = textContent.get(0).selectionStart;
			var end = textContent.get(0).selectionEnd;
			textContent.val(textContent.val().substring(0, start) + "\t" + textContent.val().substring(end));
			setCursor("text-content", end+1, end+1);
		}
		footerStatus.html("Taking notes..").css("color","red");
	});
	
	document.addEventListener("keyup", function (e) {
        var current     = new Date();
		var lastUpdate  = "Edited on "+current.getDate()+"-"+current.getMonth()+"-"+current.getFullYear()+" at "+current.getHours()+":"+current.getMinutes()+":"+current.getSeconds();
		chrome.storage.sync.set({"notes": textContent.val(),"lastUpdate": lastUpdate}, function() {
			footerStatus.html("Saved..").css("color","green");
			footerTime.html(lastUpdate);
		});
	});
	
	textContent.blur(function(){
		cursorPosition = textContent.prop("selectionStart");
		chrome.storage.local.set({"height": textContent.height(), "width" : textContent.width(),"cursorPosition":cursorPosition }, function() {
			//Do something incredible
       });
	})	
	
});