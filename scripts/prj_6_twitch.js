
// list of active users from twitch

var userNameList = ['riotgames','syndicate','summit1g','esl_csgo',
'esltv_cs','nightblue3','imaqtpie','lirikk','lirik','sodapoppin',
'meclipse','cretetion', 'shroud','officialbjergsen','wolves_bjergsen',
'theoriginalweed','joshog','freecodecamp','Tsm_dyrus','dyrus','gosu',
'dreamhackcs','timthetatman','ESL_SC2', 'captainsparklez','goldglove','boxbox',
'speeddemosarchivesda','doublelift_renamed300203','doublelift',
'drdisrespectlive','OgamingSC2', 'sivhd','iijeriichoii','faceittv','Faceit',
'faker','tsm_theoddone','izakooo','pewdiepie','eleaguetv','amazhs','Voyboy',
'cohhcarnage','loltyler1',
'omgitsfirefoxx','kinggothalion','habathcx', 'thenadeshot','nadeshot',
'kittyplaysgames','kittyplays','yoda','stonedyooda','RobotCaleb', 'GiantWaffle',
'Gronkh','bobross','nick28t','noobs2ninjas', 'gassymexican','monstercat','cryaotic',
'montanablack88','sovietwomble',
'ProfessorBroman','nickbunyun','nalcs1','starladder5','twitch','e3','tsm_bjergsen',
'forsenlol','yogscast','rewinside','zeeoon','legendarylea','markiplier',
'dansgaming','pokimane','froggen','olofmeister','towelliee','aphromoo',
'ninja','streamerhouse'];

// userNameList array size.

var liveArray = []; // array of live users for search
var notLiveArray = []; // array of off air users for search
var allUsersArray = []; // array of all users for search
var datalist1 = [];
var size = userNameList.length; // size of userNameList

window.onload = function(){

	// iterate through the user names and get basic info

	userNameList.forEach(function(name){

		var user_url = 'https://wind-bow.gomix.me/twitch-api/users/';

		user_url += name + '?callback=?';

		$.getJSON(user_url, function succcess(data){

			var display_name = data.display_name; // user name to display
			var name = data.name; // user name to put in url
			var logo = data.logo; // link to logo img
			var bio = data.bio;   // user bio info

			// pass to isItLive to find out
			// who is and isn't on the air now
			// if data is not undefined
			if (data.name != null || data.name != undefined){

			isItLive(display_name, name, logo, bio);
				
			}			
		});
	});

// isItLive takes the display_name, name, logo, & bio
// gets the users current broadcast status  

function isItLive(display_name, name, logo, bio){
	var live = true;
	var stream_url = 'https://wind-bow.gomix.me/twitch-api/streams/';
	stream_url += name + '?callback=?';

	$.getJSON(stream_url, function succcess(data){

		if(data.stream != null){
			live = true;
		}else{
			live = false;
			//console.log(name + " :" + live);
		}

		// now we pass it all to makeItWork to build the page
		makeItWork(display_name, logo, bio, live);	

	});
}

// create the page
function makeItWork(display_name, logo, bio, live){
		var new_live = document.createElement('img');
		var onAir = '';

		if (bio == null){ // handle null bio case
			bio = 'no bio available';
		}
		else{ // if bio is too long limit size 
			bio = bio.substring(0,125) + "...";
		}
		if(live != false){

			new_live.setAttribute('id','stream_status_live');
			onAir = 'imgs/plus.png'
			liveArray.push(display_name);
			allUsersArray.push(display_name);

		}
		else{

			new_live.setAttribute('id','stream_status_notLive');
			onAir = 'imgs/minus.png'
			notLiveArray.push(display_name);
			allUsersArray.push(display_name);
		}

		if(!logo){
			logo = 'imgs/murray.jpg';
		}
		
		var user_page = 'https://www.twitch.tv/' + display_name; // url to users stream
		var stream_display = document.getElementById('stream_display'); // main display div
		var stream_id = document.createElement('div'); // individual user div
		var new_h5 = document.createElement('h5'); // create h5
		var new_a = document.createElement('a'); // create link
		var new_logo = document.createElement('img'); // logo img 
		var new_par = document.createElement('p'); // bio paragraph

		stream_id.setAttribute('class','break');
		stream_id.setAttribute('id', 'stream');
		new_h5.setAttribute('id','streamName');
		new_a.setAttribute('href', user_page )
		new_a.innerHTML = display_name;
		new_logo.setAttribute('id','stream_logo');
		new_logo.setAttribute('src',logo);
		new_live.setAttribute('src', onAir);
		new_par.innerHTML = bio;
		new_h5.appendChild(new_a);
		stream_id.appendChild(new_h5);
		stream_id.appendChild(new_logo);
		stream_id.appendChild(new_live);
		stream_id.appendChild(new_par);
		stream_display.appendChild(stream_id);
		var stats = document.getElementById('stats');
		stats.innerHTML = size + " Users";

		// create the initial search that includes all users
		var searchdata = document.getElementById('datalist1');//data list element on html
		var newoption = document.createElement('option');// creates search option elements
		newoption.setAttribute('value', display_name); // creates search element from display name
		searchdata.append(newoption);

	}	
};

// toggle between buttons

	$("button").click(function(){
	  $("button").removeClass("active");
	  $(this).addClass("active");
	});

// add functionality to buttons

	document.getElementById("onLine").addEventListener("click", hideOffLine);
	document.getElementById("offLine").addEventListener("click", hideOnLine);
	document.getElementById("all").addEventListener("click", showAll);

	function hideOffLine(){
		var div = document.getElementById('stream');
		$("[style]").removeAttr("style");
		$('*[id*=stream_status_notLive]:visible').each(function() {
		$(this).parent().hide();
		});
		var stats = document.getElementById('stats');
		stats.innerHTML = + liveArray.length + " Users"	

		search(liveArray);	
	}

	function hideOnLine(){
		$("[style]").removeAttr("style");
		$('*[id*=stream_status_live]:visible').each(function() {
		$(this).parent().hide();
		});
		var stats = document.getElementById('stats');
		stats.innerHTML = notLiveArray.length + " Users";
		search(notLiveArray);
	}

	function showAll(){
		$("[style]").removeAttr("style");
		stats.innerHTML = allUsersArray.length + " Users";
		search(allUsersArray);

	}

// creates the datalist for the search function
function search(datalist1){

	var searchdata = document.getElementById('datalist1');
	$( "option" ).remove(); // clear option before building it

	for(var i = 0; i < datalist1.length; i++){
		var newoption = document.createElement('option');
		newoption.setAttribute('value', datalist1[i]);
		searchdata.append(newoption);
	}
}

// gets user chosen from search and creates url to stream
function choice(ele) {
    if(event.key === 'Enter') {
    	openInNewTab('https://www.twitch.tv/' + ele.value);
		    // alert('https://www.twitch.tv/' + ele.value);        
    }
}

// sends user to stream on enter in a new tab
function openInNewTab(url) {
var win = window.open(url, '_blank');
win.focus();
}







