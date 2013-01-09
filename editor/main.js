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

function showPopup(popup) {
	objectsForLater.popupOverlay.style.display = "table";
	objectsForLater.popupContainer.style.display = "table-cell";
	popup.style.display = "block";

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