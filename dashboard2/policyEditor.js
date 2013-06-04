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
	id: 1,
	name: "Tardar Sauce",
	email: "grumpy@nonexistent.com",
	img: "person1.png",
	lastAccess: new Date().getTime()
}, {
	id: 2,
	name: "Pokey Feline",
	email: "pokey@nonexistent.com",
	img: "person2.png",
	lastAccess: 1354421200428
}];

mocked.profiles = [{
	id: 1,
	name: "Home"
}, {
	id: 2,
	name: "Office"
}, {
	id: 3,
	name: "Trip to dad's"
}, {
	id: 4,
	name: "Misc"
}];

mocked.apps = {
	'kidsinfocus': {
		name: 'Kids In Focus'
	},
	'webinostravel': {
		name: 'Webinos Travel'
	},
	'littlespy': {
		name: 'Spy on your loved ones'
	},
	'ouroboros': {
		name: 'Prodigy of Ouroboros'
	}
}

mocked.permissions = [{
	id: 0,
	profileId: 3,
	personId: 1,
	name: "Navigation",
	app: "kidsinfocus",
	service: "gps",
	perm: 1 //1 allow, 0 prompt, -1 deny
}, {
	id: 1,
	profileId: 3,
	personId: 1,
	name: "Wifi",
	app: "kidsinfocus",
	service: "wifi",
	perm: 1
}, {
	id: 2,
	profileId: 3,
	personId: 1,
	name: "Photos",
	app: "webinostravel",
	service: "photo",
	perm: 1
}, {
	id: 3,
	profileId: 3,
	personId: 1,
	name: "Camera",
	app: "kidsinfocus",
	service: "video",
	perm: 0
}, {
	id: 4,
	profileId: 3,
	personId: 1,
	name: "GPS",
	app: "littlespy",
	service: "gps",
	perm: -1
}, {
	id: 5,
	profileId: 1,
	personId: 1,
	name: "Camera",
	app: "kidsinfocus",
	service: "video",
	perm: 1
}, { //2nd person
	id: 6,
	profileId: 1,
	personId: 2,
	name: "GPS",
	app: "littlespy",
	service: "gps",
	perm: -1
}, {
	id: 7,
	profileId: 1,
	personId: 2,
	name: "Wifi",
	app: "ouroboros",
	service: "wifi",
	perm: 1
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


//------------------------->8---CUT-HERE---------------------------------------------------------


var appData = {};
appData = mocked; //to be changed during the integration


function disableQuickSettingsSwitch(name) {
	var quickSettings = appData.quickSettings,
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

/* DRAG & DROP */


function handleDragStart(e) { // this / e.target is the source node.
	this.style.opacity = '0.4';
	appData.dragSrcEl = this;
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData("text/plain", ""); //firefox needs this
	//console.log('drag start');
	//console.log(this);
}

function handleDragEnter(e) { // this / e.target is the current hover target.
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	addClass(this, 'over');
	appData.dragDestEl = this;
}

function handleDragOver(e) { // this / e.target is the current hover target.
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	return false;
}

function handleDragLeave(e) { // this / e.target is previous target element.
	removeClass(this, 'over');
}

function handleDrop(e) { // this / e.target is current target element.
	if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	}
	if (appData.dragSrcEl != this) {
		this.appendChild(appData.dragSrcEl);
		var id = appData.dragSrcEl.id;
		var columnId = this.id;
		var permission;
		if(columnId.indexOf('allow') != -1) {
			permission = 1;
		} else if(columnId.indexOf('prompt') != -1) {
			permission = 0;
		} else if(columnId.indexOf('deny') != -1) {
			permission = -1;
		}
		placesUpdatePermission(id, permission);
	}
	//console.log('drag drop');
	//console.log(this);
	return false;
}

function handleDragEnd(e) { // this/e.target is the source node.
	this.style.opacity = '1';
	removeClass(appData.dragDestEl, 'over');
	//console.log('drag end');
	//console.log(this);
}

function dragDropInitColumns() {
	var cols = document.querySelectorAll('.column');
	[].forEach.call(cols, function(col) {
		col.addEventListener('dragenter', handleDragEnter, false)
		col.addEventListener('dragover', handleDragOver, false);
		col.addEventListener('dragleave', handleDragLeave, false);
		col.addEventListener('drop', handleDrop, false);
	});
}
/*function dragDropInitDraggables() {
	var draggables = document.querySelectorAll('[draggable]');
	[].forEach.call(draggables, function(draggable) {
		draggable.addEventListener('dragstart', handleDragStart, false);
		draggable.addEventListener('dragend', handleDragEnd, false);
	});
}*/


var drawQuickSettings = function() {
	var quickSettingsSwitchesContainer = document.getElementById('quickSettings-switches-content'),
		quickSettingsStatusContainer = document.getElementById('quickSettings-status-content'),
		html = '',
		quickSettings = appData.quickSettings || [],
		quickStatus = appData.quickStatus || [],
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
	var storeListContainer = document.getElementById('storeListContainer'),
		html = '',
		stores = appData.stores || [],
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

	storeListContainer.innerHTML = html;

	drawPermissionButtons('unk-loc-per-con', [{n:"Allow",c:"allow"}, {n:"Allow once",c:"prompt"}, {n:"Deny",c:"deny"}], 1);
}();

var drawPeopleList = function() {
	var peopleListContainer = document.getElementById('people-list'),
		html = '',
		people = appData.people || [],
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
// end of list.js


var drawPlaces = function() {
	var docFrag = document.createDocumentFragment(),
		profiles = appData.profiles || [],
		i = 0,
		profLength = profiles.length,
		people = appData.people || [],
		j = people.length;

	appData.places = {};
	domObjs.places = {};
	domObjs.places.profileListContainer = document.getElementById('places-profiles');
	domObjs.places.peopleSelect = document.getElementById('places-people');
	domObjs.places.allow = document.getElementById('places-allow');
	domObjs.places.prompt = document.getElementById('places-prompt');
	domObjs.places.deny = document.getElementById('places-deny');
	domObjs.places.profiles = {};
	domObjs.places.permissions = {};

	//profile list
	for(i; i<profLength; i++) {
		createProfileListEntry(profiles[i], docFrag);
		if(i == 0) {
			setActiveProfile(profiles[i].id); //initial highlight
		}
	}
	domObjs.places.profileListContainer.appendChild(docFrag);

	//people drop-down
	docFrag = document.createDocumentFragment();
	i = 0;
	var option, key;
	for(i; i<j; i++) {
		option = document.createElement("option");
		option.setAttribute('value', people[i].id);
		option.textContent = people[i].name;
		docFrag.appendChild(option);
		if(i == 0) {
			setActivePerson(people[i].id); //init internal state
		}
	}
	domObjs.places.peopleSelect.appendChild(docFrag);
	domObjs.places.peopleSelect.onchange = function() {
		var id = this.options[this.selectedIndex].value;
		setActivePerson(id);
		drawPlacesPermissions();
	}

	dragDropInitColumns();

	if(profLength > 0) {
		drawPlacesPermissions();
	}

	//popup form
	docFrag = document.createDocumentFragment();
	option = null;
	key = null;
	for (key in appData.apps) {
		if (appData.apps.hasOwnProperty(key)) {
			option = document.createElement("option");
			option.setAttribute('value', key);
			option.textContent = appData.apps[key].name;
			docFrag.appendChild(option);
		}
	}
	domObjs.popupAddPermissionApp.appendChild(docFrag);
}();

function createProfileListEntry(profile, parentElement) {
	var entry = document.createElement("div");
	entry.textContent = profile.name;
	entry.onclick = function() {placesOpenProfile(profile.id)};
	var controls = document.createElement("span");
	var edit = document.createElement("img");
	edit.src = "img/edit.png";
	edit.setAttribute('alt', 'Edit');
	edit.onclick = function(e) {e.stopPropagation(); profileEditPopup(profile.id);};
	var del = document.createElement("img");
	del.src = "img/delete.png";
	del.setAttribute('alt', 'Delete');
	del.onclick = function(e) {e.stopPropagation(); profileDeletePopup(profile.id);};
	controls.appendChild(edit);
	controls.appendChild(del);
	entry.appendChild(controls);
	parentElement.appendChild(entry);

	domObjs.places.profiles[profile.id] = entry;

	return entry;
}
function setActiveProfile(id) {
	appData.places.currentProfileId = id;
	var obj = domObjs.places.profiles[id];
	obj.className = 'selected'; //addClass ?
	domObjs.places.currentProfileDiv = obj;
}

function setActivePerson(id) {
	appData.places.currentPersonId = id;
}

function createPermissionEntry(permission, docFrag) {
	var entry,
		name,
		controls,
		edit,
		del;
	entry = document.createElement("div");
	entry.setAttribute('draggable', 'true');
	entry.id = permission.id;
	name = document.createElement("div");
	name.innerHTML = '<b>'+permission.name+'</b>@'+appData.apps[permission.app].name;
	entry.appendChild(name);
	controls = document.createElement("span");
	edit = document.createElement("img");
	edit.src = "img/edit.png";
	edit.setAttribute('alt', 'Edit');
	edit.onclick = function(e) {permissionEditPopup(permission.id);};
	del = document.createElement("img");
	del.src = "img/delete.png";
	del.setAttribute('alt', 'Delete');
	del.onclick = function(e) {permissionDeletePopup(permission.id);};
	controls.appendChild(edit);
	controls.appendChild(del);
	entry.appendChild(controls);

	docFrag.appendChild(entry);

	entry.addEventListener('dragstart', handleDragStart, false);
	entry.addEventListener('dragend', handleDragEnd, false);

	domObjs.places.permissions[permission.id] = name;

	return entry;
}

function drawPlacesPermissions() {
	profileId = appData.places.currentProfileId;
	personId = appData.places.currentPersonId;
	if(!profileId || !personId) return false;

	domObjs.places.allow.innerHTML = '';
	domObjs.places.prompt.innerHTML = '';
	domObjs.places.deny.innerHTML = '';

	var docFragAllow = document.createDocumentFragment(),
		docFragPrompt = document.createDocumentFragment(),
		docFragDeny = document.createDocumentFragment(),
		permissions = appData.permissions || [],
		i = 0,
		j = permissions.length;

	for(i; i<j; i++) {
		if(permissions[i].profileId == profileId && permissions[i].personId == personId) {
			if(permissions[i].perm == 1) {
				docFrag = docFragAllow;
			} else if(permissions[i].perm == 0) {
				docFrag = docFragPrompt;
			} else if(permissions[i].perm == -1) {
				docFrag = docFragDeny;
			}

			createPermissionEntry(permissions[i], docFrag);
		}
	}
	domObjs.places.allow.appendChild(docFragAllow);
	domObjs.places.prompt.appendChild(docFragPrompt);
	domObjs.places.deny.appendChild(docFragDeny);

	//dragDropInitDraggables();
}

function placesOpenProfile(id) {
	//de-highlight old one
	if(domObjs.places.currentProfileDiv) {
		removeClass(domObjs.places.currentProfileDiv, 'selected');
	}
	//set active + higlight + draw
	setActiveProfile(id);
	drawPlacesPermissions();
}

function placesAddEditProfile() {
	var newName = domObjs.popupAddProfileName.value;
	if(newName == '') return;

	var id = domObjs.popupAddProfileId.value,
		profile;
	if(!id) { //new
		profile = {};
		profile.id = new Date().valueOf();
		profile.name = newName;

		appData.profiles.push(profile);
		//draw
		var docFrag = document.createDocumentFragment();
		createProfileListEntry(profile, docFrag);

		if(!appData.places.currentProfileId) {
			setActiveProfile(profile.id);
		}

		domObjs.places.profileListContainer.appendChild(docFrag);
	} else { //edit
		profile = getObjFromArrayById(id, appData.profiles);
		if(!profile) return;

		profile.name = newName;
		//re-draw
		domObjs.places.profiles[id].textContent = newName;
	}
}

function placesDeleteProfile() {
	var id = appData.places.profileToDelete;
	//delete profile
	var profile = getObjFromArrayById(id, appData.profiles, true);
	appData.profiles.splice(profile.pos,1);
	var profileDiv = domObjs.places.profiles[id];
	profileDiv.parentNode.removeChild(profileDiv);
	delete domObjs.places.profiles[id]; //remove reference
	domObjs.places.currentProfileDiv = undefined;

	var removePermissionsHtml = false;
	if(appData.places.currentProfileId == id) { //if current profile is being deleted select first one
		if(appData.profiles.length > 0) {
			placesOpenProfile(appData.profiles[0].id);
		} else {
			appData.places.currentProfileId = undefined;
			removePermissionsHtml = true; //no other profile, so we must clear permissions from the view
		}
	}
	//remove permissions AFTER profile change, to avoid pointless redraws
	var permissions = appData.permissions,
		i = 0,
		j = permissions.length;

	for(i; i<j; i++) {
		if(permissions[i].profileId == id) {
			var permId = permissions[i].id;
			if(removePermissionsHtml) {
				var permissionDiv = domObjs.places.permissions[permId].parentNode; //one node higher
				permissionDiv.parentNode.removeChild(permissionDiv);
			}
			delete domObjs.places.permissions[permId]; //remove reference
			appData.permissions.splice(i,1);
			i--; //compensate for the missing element
			j--;
		}
	}
	appData.places.profileToDelete = undefined;
}

function placesAddEditPermission() {
	var newName = domObjs.popupAddPermissionName.value;
	if(newName == '') return; //TODO or something default?

	var app = domObjs.popupAddPermissionApp.value;
	var type = domObjs.popupAddPermissionType.value;
	var perm = domObjs.popupAddPermissionAction.value;
	var destColumn;
	if(perm == 'allow') {
		perm = 1;
		destColumn = domObjs.places.allow;
	} else if(perm == 'prompt') {
		perm = 0;
		destColumn = domObjs.places.prompt;
	} else if(perm == 'deny') {
		perm = -1;
		destColumn = domObjs.places.deny;
	}

	var id = domObjs.popupAddPermissionId.value,
		permission;

	if(!id) { //new
		permission = {};
		permission.id = new Date().valueOf();
		permission.profileId = appData.places.currentProfileId,
		permission.name = newName;
		permission.app = app;
		permission.service = type;
		permission.perm = perm;

		appData.permissions.push(permission);

		//draw
		var docFrag = document.createDocumentFragment();
		createPermissionEntry(permission, docFrag);
		destColumn.appendChild(docFrag);
	} else { //edit
		permission = getObjFromArrayById(id, appData.permissions);
		if(!permission) return;

		permission.name = newName;
		permission.app = app;
		permission.service = type;
		permission.perm = perm;
		//re-draw
		domObjs.places.permissions[id].innerHTML = '<b>'+permission.name+'</b>@'+appData.apps[permission.app].name;
	}
}

function placesUpdatePermission(id, permission) {
	var permissionObj = getObjFromArrayById(id, appData.permissions);
	if(!permissionObj) return;
	if(!isNaN(permission)) permissionObj.perm = permission;
}

function placesDeletePermission() {
	var id = appData.places.permissionToDelete;
	var permission = getObjFromArrayById(id, appData.permissions, true);
	appData.permissions.splice(permission.pos,1);
	var permissionDiv = domObjs.places.permissions[id].parentNode; //one node higher
	permissionDiv.parentNode.removeChild(permissionDiv);
	delete domObjs.places.permissions[id]; //remove reference
	appData.places.permissionToDelete = undefined;
}

function profileEditPopup(id) {
	if(!id) { //new
		domObjs.popupAddProfileId.value = '';
		domObjs.popupAddProfileName.value = '';
	} else {
		var profile = getObjFromArrayById(id, appData.profiles);
		domObjs.popupAddProfileId.value = profile.id;
		domObjs.popupAddProfileName.value = profile.name;
	}
	showPopup(domObjs.popupAddProfile);
}

function permissionEditPopup(newPermissionOrId) {
	if(isNaN(newPermissionOrId)) { //new
		if(newPermissionOrId == "allow" || newPermissionOrId == 'prompt' || newPermissionOrId == 'deny') {
			domObjs.popupAddPermissionAction.value = newPermissionOrId;
		} else {
			domObjs.popupAddPermissionAction.options[0].selected = "selected";
		}
		//reset other fields
		domObjs.popupAddPermissionId.value = '';
		domObjs.popupAddPermissionName.value = '';
		domObjs.popupAddPermissionApp.options[0].selected = "selected";
		domObjs.popupAddPermissionType.options[0].selected = "selected";
	} else { //edit
		var permission = getObjFromArrayById(newPermissionOrId, appData.permissions);

		var permValue;
		if(permission.perm == 1) {
			permValue = 'allow';
		} else if(permission.perm == 0) {
			permValue = 'prompt';
		} else if(permission.perm == -1) {
			permValue = 'deny';
		}

		domObjs.popupAddPermissionId.value = permission.id;
		domObjs.popupAddPermissionName.value = permission.name;
		domObjs.popupAddPermissionApp.value = permission.app;
		domObjs.popupAddPermissionType.value = permission.type;
		domObjs.popupAddPermissionAction.value = permValue;
	}
	showPopup(domObjs.popupAddPermission);
}

function permissionDeletePopup(id) {
	appData.places.permissionToDelete = id; //TODO meh
	showPopup(domObjs.popupDeletePermission);
}

function profileDeletePopup(id) {
	appData.places.profileToDelete = id;
	showPopup(domObjs.popupDeleteProfile);
}