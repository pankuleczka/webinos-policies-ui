/* MOCKS */

var mocked = {};

mocked.quickSettings = [{
	name: "Incognito",
	enabled: true
}, {
	name: "Internet",
	enabled: false
}, {
	name: "Local Discovery",
	enabled: true
}, {
	name: "Location",
	enabled: true
}, {
	name: "Payment",
	enabled: false
}, {
	name: "People",
	enabled: true
}, {
	name: "SMS & Telephony",
	enabled: false
}];


mocked.quickStatus = [{
	name: "Internet",
	status: false
}, {
	name: "GPS",
	status: true
}];


mocked.stores = [{
	name: "apps.webinos.org",
	allow: false
}, {
	name: "ubiapps.com",
	allow: true
}];


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
		if(arrayObjectName == 'stores') {
			destArr.push({
				name: "lorem.ipsum"+(i+1)+".com",
				allow: !!(Math.floor(Math.random()*2))
			});
		} else if(arrayObjectName == 'people') {
			destArr.push({
				name: "Loremford Ipsumov "+(i+1),
				email: "lorips"+(i+1)+"@nonexistent.com",
				lastAccess: 1341732300428-(123456789*i)
			});
		}
	}
}

// generate more mocked data
generateMockedData('stores', 3);
generateMockedData('people', 8);

/*
//mock generator
var generateMockedData = function(arrayObjectName, quantity) {
	var i = 0,
		randomnumber,
		destArr = mocked[arrayObjectName];

	for(i; i<quantity; i++) {
		if(arrayObjectName == 'people') {
			destArr.push({
				name: "Loremford Ipsumov "+(i+1),
				email: "lorips"+(i+1)+"@nonexistent.com",
				lastAccess: 1341732300428-(123456789*i)
			});
		} //else {
	}
}

// generate more mocked data
generateMockedData('people', 8);
*/

//------------------------->8---CUT-HERE---------------------------------------------------------


var UIdata = {};
UIdata = mocked; //to be changed during the integration


/* GENERAL */


function removeClass(element, className) {
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;
	var newClassString = '';
	var indexPos = classString.indexOf(className);
	if(indexPos == -1) {
		return;
	} else if (indexPos == 0) {
		newClassString = classString.substring(0, indexPos) + classString.substr(indexPos+className.length);
	} else {
		newClassString = classString.substring(0, indexPos-1) + classString.substr(indexPos+className.length);
	}

	element.className = newClassString;
}

function addClass(element, className) {
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;
	if(classString != '') {
		var indexPos = classString.indexOf(className);
		if(indexPos == -1) {
			element.className += ' '+className;
		}
	} else {
		element.className = className;
	}
}

function selectItem(elements, active) {
	if(typeof elements == 'string') {
		elements = objectsForLater[elements];
	} else if(typeof elements != 'object' || (typeof elements == 'object' && isNaN(elements.length)) ) { //not an array
		console.log("selectItem: bad object type");
	}

	for(var i in elements) {
		if(i == active) {
			addClass(elements[i], 'selected');
			continue;
		}
		if(typeof elements[i] != 'object') { //to skip for now possible array's "length"; TODO! do it better
			continue;
		}
		removeClass(elements[i], 'selected');
	}
}

function showPopup(popup) {
	objectsForLater.popupOverlay.style.display = "table";
	objectsForLater.popupOverlay.style.top = document.body.scrollTop+'px'; //center
	objectsForLater.popupContainer.style.display = "table-cell";
	popup.style.display = "block";
	document.body.style.overflow = "hidden";

	if(!popup.closeButtonsInitialized) {
		var closeButtons = popup.getElementsByClassName('popup-close'),
			i=0,
			j=closeButtons.length;

		for(i; i<j; i++) {
			closeButtons[i].onclick = function() {closePopup(popup);};
		}

		popup.closeButtonsInitialized = true;
	}
}

function closePopup(popup) {
	objectsForLater.popupOverlay.style.display = "none";
	objectsForLater.popupContainer.style.display = "none";
	popup.style.display = "none";
	document.body.style.overflow = "visible";
}

function showPage(linkId) {
	var pageId = linkId.split("-")[1];
	if(pageId) {
		var page;
		if(objectsForLater.pages[pageId]) {
			page = objectsForLater.pages[pageId];
		} else {
			page = document.getElementById(pageId);
		}
		currentPage.style.display = "none";
		page.style.display = "block";
		currentPage = page;
	} else {
		console.log("Can't show this page, bad id");
	}
}

function disableQuickSettingsSwitch(name) {
	var quickSettings = UIdata.quickSettings,
		i = 0,
		j = quickSettings.length;

	for(i; i<j; i++) {
		if(quickSettings[i].name == name) {
			document.getElementById('myonoffswitch'+i).disabled = true;
			addClass('qsnl'+i, 'disabled');
			break;
		}
	}
}

function drawPermissionButtons(container, buttons, active) {
	if(typeof container != 'object') container = document.getElementById(container);

	var docFragment = document.createDocumentFragment();
	var buttonObjList = objectsForLater[container.id] = []; //if the container has no id, clicking will not work
	var tmpBtnObj;
	var i = 0,
		j = buttons.length;

	for(i;i<j;i++) {
		tmpBtnObj = document.createElement("div");
		tmpBtnObj.innerHTML = buttons[i].n;
		tmpBtnObj.className = "button "+buttons[i].c;

		tmpBtnObj.onclick = (function(buttons, clickedEl) {
			return function() {
				selectItem(buttons, clickedEl);
			};
		})(container.id, i);

		docFragment.appendChild(tmpBtnObj);
		buttonObjList.push(tmpBtnObj);
	}

	//set active button
	if(!active) {
		var active = 0;
	}
	addClass(buttonObjList[active], 'selected');

	//set class for number of buttons
	addClass(container, 'noOfButtons'+j);

	container.appendChild(docFragment);
}


/* DATE MANIPULATION */


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


/* DRAW */


var objectsForLater = {}; //a place to gather all objects that I'm going to iterate later (onclick active class, and so on)

objectsForLater.pages = {}; //page initialization
objectsForLater.pages['quickSettings'] = document.getElementById('quickSettings');
var currentPage = objectsForLater.pages['quickSettings'];


var enableTabs = function() {
	var tabs = document.getElementById('tabs').children;

	var i = 0,
	j = tabs.length;

	for(i;i<j;i++) {
		tabs[i].onclick = (function(elements, clickedEl) {
			return function() {
				selectItem(elements, clickedEl);
				showPage(this.id);
			};
		})(tabs, i);
	}
}();

var enablePopups = function() {
	objectsForLater.popupOverlay = document.getElementById('popup_overlay');
	objectsForLater.popupContainer = document.getElementById('popup_container');

	objectsForLater.popupTest = document.getElementById('popup-test');
	objectsForLater.popupAddToPolicy = document.getElementById('popup-addToPolicy');
	objectsForLater.popupPolicyEntity = document.getElementById('popup-policyEntity');
	objectsForLater.popupPolicyEntityEdit = document.getElementById('popup-policyEntity-edit');

	document.getElementById('t-test').onclick = function() {showPopup(objectsForLater.popupTest)};
	document.getElementById('t-add').onclick = function() {showPopup(objectsForLater.popupAddToPolicy)};

	document.getElementById('popup-addToPolicy-category').onclick = function() {policyEntityNewdit('category');}
	document.getElementById('popup-addToPolicy-object').onclick = function() {policyEntityNewdit('object');}
	document.getElementById('popup-addToPolicy-service').onclick = function() {policyEntityNewdit('service');}

	/* policy entity edit tabs - quite verbose... but it seems like I don't need a function for anything similar to this */
	var policyEntityEditSummaryTab = document.getElementById('popup-policyEntity-edit-summary');
	var policyEntityEditDetailsTab = document.getElementById('popup-policyEntity-edit-details');

	var policyEntityEditTabs = [policyEntityEditSummaryTab, policyEntityEditDetailsTab];

	objectsForLater.policyEntityEditSummaryPage = document.getElementById('policyEntity-edit-summary');
	objectsForLater.policyEntityEditDetailsPage = document.getElementById('policyEntity-edit-details');

	policyEntityEditSummaryTab.onclick = function() {
		selectItem(policyEntityEditTabs, 0);
		objectsForLater.policyEntityEditSummaryPage.style.display = 'block';
		objectsForLater.policyEntityEditDetailsPage.style.display = 'none';
	}
	policyEntityEditDetailsTab.onclick = function() {
		selectItem(policyEntityEditTabs, 1);
		objectsForLater.policyEntityEditSummaryPage.style.display = 'none';
		objectsForLater.policyEntityEditDetailsPage.style.display = 'block';
	}
	/* policy entity edit tabs END */

}();

var toolbarShowHide = function() {
	objectsForLater.toolbar = document.getElementById('toolbar');
	document.getElementById('toolbar-showhide').onclick = function() {
		if(objectsForLater.toolbar.style.maxHeight != '100%') {
			objectsForLater.toolbar.style.maxHeight = '100%';
			addClass(this, 'hide');
		} else {
			objectsForLater.toolbar.style.maxHeight = '10px';
			removeClass(this, 'hide');
		}
	};
}();

function policyEntityNewdit(newTypeOrId, previousPopup) {
	var previousPopup;

	if(typeof newTypeOrId != 'object') { //new
		previousPopup = objectsForLater.popupAddToPolicy;
		//generate new id
	} else { //edit
		previousPopup = objectsForLater.popupPolicyEntity;
		//fill in
	}

	previousPopup.style.display = "none";
	showPopup(objectsForLater.popupPolicyEntityEdit);
}

var drawQuickSettings = function() {
	var quickSettingsSwitchesContainer = document.getElementById('quickSettings-switches-content'),
		quickSettingsStatusContainer = document.getElementById('quickSettings-status-content'),
		html = '',
		quickSettings = UIdata.quickSettings,
		quickStatus = UIdata.quickStatus,
		i = 0,
		j = quickSettings.length,
		checked = '',
		active = '';

	for(i; i<j; i++) {
		if(quickSettings[i].enabled) {
			checked = ' checked';
		} else {
			checked = '';
		}

		html += '' +
			'<label id="qsnl'+i+'" class="onoffswitch-namelabel" for="myonoffswitch'+i+'">'+quickSettings[i].name+'</label>' +
			'<div class="onoffswitch">' +
				'<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch'+i+'"'+checked+'>' +
				'<label class="onoffswitch-label" for="myonoffswitch'+i+'">' +
					'<div class="onoffswitch-inner"></div>' +
					'<div class="onoffswitch-switch"></div>' +
				'</label>' +
			'</div>';
	}

	quickSettingsSwitchesContainer.innerHTML = html;

	//reset and continue
	html = '';
	i = 0;
	j = quickStatus.length;

	for(i; i<j; i++) {
		if(quickStatus[i].status) {
			active = ' active';
		} else {
			active = ' inactive';
			disableQuickSettingsSwitch(quickStatus[i].name);
		}

		html += '' +
			'<div class="qstatus-name">'+quickStatus[i].name+'</div><div class="qstatus-icon'+active+'" id="status-icon'+i+'"></div>';
	}

	quickSettingsStatusContainer.innerHTML = html;
}();


var drawStoreList = function() {
	var storeListContainer = document.getElementById('storesSettings'),
		html = '',
		stores = UIdata.stores,
		i = 0,
		j = stores.length,
		checked;

	for(i; i<j; i++) {
		if(stores[i].allow) {
			checked = ' checked="checked"';
		} else {
			checked = '';
		}
		html += '' +
			'<div>' +
				'<input type="checkbox"'+checked+' id="store'+i+'">' +
				'<label for="store'+i+'">'+ stores[i].name +'</label>' +
			'</div>';
	}

	html += '' +
		'<hr>' +
		'<div id="unknown-location">' +
			'<div>Allow apps to be installed from other locations</div>' +
			'<div class="permissions-controls" id="unk-loc-per-con"></div>' +
			'<div id="unk-loc-explained" class="info">"Allow once" will allow installation for the next application only, then it will change to "Deny".</div>' +
		'</div>';

	storeListContainer.innerHTML = html;

	drawPermissionButtons('unk-loc-per-con', [{n:"Allow",c:"allow"}, {n:"Allow once",c:"prompt"}, {n:"Deny",c:"deny"}], 1);
}();

var drawPeopleList = function() {
	var peopleListContainer = document.getElementById('people-list'),
		html = '',
		people = UIdata.people,
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


// list.js
var listOptions = {
    valueNames: ['name', 'email', 'lastused-timestamp']
};

var peopleList = new List('peoplePolicies', listOptions);