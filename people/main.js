function getDayName(date) {
	var dateNow = new Date();
	var dateYesterday = new Date();
	dateYesterday.setDate(dateNow.getDate() - 1);
	var givenYear = date.getFullYear(),
		givenMonth = date.getMonth(),
		givenDay = date.getDate();

	if (givenYear === dateNow.getFullYear() &&
		givenMonth === dateNow.getMonth() &&
		givenDay === dateNow.getDate()
		)
	{
		return 'Today';
	} else if (	givenYear === dateYesterday.getFullYear() &&
				givenMonth === dateYesterday.getMonth() &&
				givenDay === dateYesterday.getDate()
				)
	{
		return 'Yesterday';
	} else {
		if(givenDay<10) givenDay = '0'+givenDay;
		givenMonth+=1;
		if(givenMonth<10) givenMonth = '0'+givenMonth;
		return givenDay+'.'+givenMonth+'.'+givenYear;
	}
	/* else {
		var day = date.getDay();
		switch (day) {
		case 0:
			return 'Sunday';
			break;
		case 1:
			return 'Monday';
			break;
		case 2:
			return 'Tuesday';
			break;
		case 3:
			return 'Wednesday';
			break;
		case 4:
			return 'Thursday';
			break;
		case 5:
			return 'Friday';
			break;
		case 6:
			return 'Saturday';
			break;
		}
	}*/
}

function formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  var hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime;
}

// preliminary mocks
var mocked = {};
mocked.people = [{
		name: "Tardar Sauce",
		email: "grumpy@nonexistent.com",
		img: "person1.png",
		lastAccess: new Date().getTime()
	}, {
		name: "Pokey Feline",
		email: "pokey@nonexistent.com",
		img: "person2.png",
		lastAccess: 1354421200428
	}];

//mock generator
var generateMockedData = function(arrayObjectName, quantity) {
	var i = 0,
		randomnumber,
		destArr = mocked[arrayObjectName];

	for(i; i<quantity; i++) {
		if(arrayObjectName == 'people') {
			destArr.push({
				name: "Lorem Ipsum "+(i+1),
				email: "lorips"+(i+1)+"@nonexistent.com",
				lastAccess: 1341732300428-(123456789*i)
			});
		} //else {
	}
}

// generate more mocked data
generateMockedData('people', 8);

//draw
var drawPeopleList = function() {
	var peopleListContainer = document.getElementById('people-list'),
		html = '',
		people = mocked.people,
		i = 0,
		j = people.length,
		pic,
		date;

	for(i; i<j; i++) {
		if(!people[i].img) {
			pic = 'placeholder.png';
		} else {
			pic = people[i].img;
		}

		thaDate = new Date(people[i].lastAccess);

		html += '' +
			'<li>' +
				'<img src="img/'+pic+'">' +
				'<div class="name">'+ people[i].name +'</div>' +
				'<div class="email">'+ people[i].email +'</div>' +
				'<div class="lastused">Last used your personal zone: <span>'+ getDayName(thaDate)+', '+formatAMPM(thaDate) +'</span></div>' +
				'<div class="lastused-timestamp">'+ thaDate.getTime() +'</div>' +
				'<div class="button">Edit permissions</div>' +
			'</li>';
	}

	peopleListContainer.innerHTML = html;
}();

var listOptions = {
    valueNames: ['name', 'email', 'lastused-timestamp']
};

var peopleList = new List('people-list-container', listOptions);