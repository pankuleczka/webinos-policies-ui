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

mocked.applications = [{
	id: 1,
	name: 'Kids In Focus'
}, {
	id: 2,
	name: 'Webinos Travel'
}, {
	id: 3,
	name: 'Spy on your loved ones'
}, {
	id: 4,
	name: 'Prodigy of Ouroboros'
}];

mocked.services = [{
	id: 1,
	name: 'GPS'
}, {
	id: 2,
	name: 'Wifi'
}, {
	id: 3,
	name: 'Photo'
}, {
	id: 4,
	name: 'Video'
}, {
	id: 5,
	name: 'SMS'
}];

mocked.permissions = [{
	id: 0,
	profileId: 3,
	personId: 1,
	name: "Navigation",
	appId: 1,
	serviceId: 1,
	perm: 1 //1 allow, 0 prompt, -1 deny
}, {
	id: 1,
	profileId: 3,
	personId: 1,
	name: "Wifi",
	appId: 1,
	serviceId: 2,
	perm: 1
}, {
	id: 2,
	profileId: 3,
	personId: 1,
	name: "Photos",
	appId: 2,
	serviceId: 3,
	perm: 1
}, {
	id: 3,
	profileId: 3,
	personId: 1,
	name: "Camera",
	appId: 1,
	serviceId: 4,
	perm: 0
}, {
	id: 4,
	profileId: 3,
	personId: 1,
	name: "GPS",
	appId: 3,
	serviceId: 1,
	perm: -1
}, {
	id: 5,
	profileId: 1,
	personId: 1,
	name: "Camera",
	appId: 1,
	serviceId: 4,
	perm: 1
}, { //2nd person
	id: 6,
	profileId: 1,
	personId: 2,
	name: "GPS",
	appId: 3,
	serviceId: 1,
	perm: -1
}, {
	id: 7,
	profileId: 1,
	personId: 2,
	name: "Wifi",
	appId: 4,
	serviceId: 2,
	perm: 1
}];

mocked.appPermissions = [{ //APPS tab
	id: 0,
	personId: 1,
	appId: 1,
	serviceId: 1,
	perm: 1 //1 allow, 0 prompt, -1 deny
}, {
	id: 1,
	personId: 1,
	appId: 1,
	serviceId: 2,
	perm: 1
}, {
	id: 2,
	personId: 1,
	appId: 2,
	serviceId: 3,
	perm: 1
}, {
	id: 3,
	personId: 1,
	appId: 1,
	serviceId: 4,
	perm: 0
}, {
	id: 4,
	personId: 1,
	appId: 3,
	serviceId: 1,
	perm: -1
}, {
	id: 5,
	personId: 1,
	appId: 1,
	serviceId: 4,
	perm: 1
}, { //2nd person
	id: 6,
	personId: 2,
	appId: 3,
	serviceId: 1,
	perm: -1
}, {
	id: 7,
	personId: 2,
	appId: 4,
	serviceId: 2,
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
	e.dataTransfer.dropEffect = 'move';
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
		updatePermission(id, permission);
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
	var profiles = appData.profiles || [],
		people = appData.people || [];

	appData.placesPolicies = {};
	domObjs.placesPolicies = {};
	domObjs.placesPolicies.profileListContainer = document.getElementById('places-profiles');
	domObjs.placesPolicies.peopleSelect = document.getElementById('places-people');
	domObjs.placesPolicies.allow = document.getElementById('places-allow');
	domObjs.placesPolicies.prompt = document.getElementById('places-prompt');
	domObjs.placesPolicies.deny = document.getElementById('places-deny');
	domObjs.placesPolicies.profiles = {};
	domObjs.placesPolicies.permissions = {};

	createProfileList(profiles, domObjs.placesPolicies.profileListContainer, 'placesPolicies');

	createPeopleDropdownOptions(people, domObjs.placesPolicies.peopleSelect, 'placesPolicies');

	dragDropInitColumns();

	if(profiles.length > 0) {
		drawDraggablePermissions('placesPolicies');
	}

	fillOptionsFromArray(domObjs.popupAddPermissionApp, appData.applications);
	fillOptionsFromArray(domObjs.popupAddPermissionType, appData.services); //also needed for "app" tab
}();

var drawApps = function() {
	var applications = appData.applications || [],
		people = appData.people || [];

	appData.appsPolicies = {};
	domObjs.appsPolicies = {};
	domObjs.appsPolicies.appListContainer = document.getElementById('apps-list');
	domObjs.appsPolicies.peopleSelect = document.getElementById('apps-people');
	domObjs.appsPolicies.allow = document.getElementById('apps-allow');
	domObjs.appsPolicies.prompt = document.getElementById('apps-prompt');
	domObjs.appsPolicies.deny = document.getElementById('apps-deny');
	domObjs.appsPolicies.profiles = {};
	domObjs.appsPolicies.permissions = {};

	createProfileList(applications, domObjs.appsPolicies.appListContainer, 'appsPolicies');

	createPeopleDropdownOptions(people, domObjs.appsPolicies.peopleSelect, 'appsPolicies');

	dragDropInitColumns();

	if(applications.length > 0) {
		drawDraggablePermissions('appsPolicies');
	}

	//fillOptionsFromArray(domObjs.popupAddPermissionType, appData.services);
}();

function createProfileList(profiles, container, tab) {
	var i = 0,
		j = profiles.length,
		docFrag = document.createDocumentFragment();

	for(i; i<j; i++) {
		createProfileListEntry(profiles[i], docFrag, tab);
		if(i == 0) {
			setActiveProfile(profiles[i].id, tab); //initial highlight
		}
	}
	container.appendChild(docFrag);
}

function createProfileListEntry(profile, parentElement, tab) {
	if(!tab) {
		var tab = domObjs.pages.tabsPolEd._currentPage.id;
	}
	var entry = document.createElement("div");
	entry.textContent = profile.name;
	entry.onclick = function() {openProfile(profile.id)};
	if(tab == 'placesPolicies') {
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
	}
	parentElement.appendChild(entry);

	domObjs[tab].profiles[profile.id] = entry;

	return entry;
}
function setActiveProfile(id, tab) {
	if(!tab) {
		var tab = domObjs.pages.tabsPolEd._currentPage.id;
	}
	appData[tab].currentProfileId = id;
	var obj = domObjs[tab].profiles[id];
	obj.className = 'selected'; //addClass ?
	domObjs[tab].currentProfileDiv = obj;
}

function createPeopleDropdownOptions(people, dropdown, tab) {
	var docFrag = document.createDocumentFragment(),
		i = 0,
		j = people.length,
		option;

	for(i; i<j; i++) {
		option = document.createElement("option");
		option.setAttribute('value', people[i].id);
		option.textContent = people[i].name;
		docFrag.appendChild(option);
		if(i == 0) {
			setActivePerson(people[i].id, tab); //init internal state
		}
	}
	dropdown.appendChild(docFrag);
	dropdown.onchange = function() {
		var id = this.options[this.selectedIndex].value;
		setActivePerson(id);
		drawDraggablePermissions();
	}
}

function setActivePerson(id, tab) {
	if(!tab) {
		var tab = domObjs.pages.tabsPolEd._currentPage.id;
	}
	appData[tab].currentPersonId = id;
}

function createPermissionEntry(permission, docFrag, tab) {
	var entry,
		name,
		controls,
		edit,
		del,
		nameHtml;
	if(!tab) {
		var tab = domObjs.pages.tabsPolEd._currentPage.id;
	}
	if(tab == 'appsPolicies') {
		nameHtml = '<b>'+getObjFromArrayById(permission.serviceId, appData.services).name+'</b>';
	} else if(tab == 'placesPolicies') {
		nameHtml = '<b>'+permission.name+'</b>@'+getObjFromArrayById(permission.appId, appData.applications).name;
	}
	entry = document.createElement("div");
	entry.setAttribute('draggable', 'true');
	entry.id = permission.id;
	name = document.createElement("div");
	name.innerHTML = nameHtml;
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

	domObjs[tab].permissions[permission.id] = name;

	return entry;
}

function drawDraggablePermissions(tab) {
	if(!tab) {
		var tab = domObjs.pages.tabsPolEd._currentPage.id;
	}
	var permissions,
		permissionId,
		currentPermId;
	if(tab == 'appsPolicies') {
		permissions = appData.appPermissions || [];
		permissionId = 'appId';
	} else if(tab == 'placesPolicies') {
		permissions = appData.permissions || [];
		permissionId = 'profileId';
	}

	var personId = appData[tab].currentPersonId,
		currentPermId = appData[tab].currentProfileId;
	if(!permissionId || !personId || !tab) return false;

	domObjs[tab].allow.innerHTML = '';
	domObjs[tab].prompt.innerHTML = '';
	domObjs[tab].deny.innerHTML = '';

	var docFragAllow = document.createDocumentFragment(),
		docFragPrompt = document.createDocumentFragment(),
		docFragDeny = document.createDocumentFragment(),
		i = 0,
		j = permissions.length;

	for(i; i<j; i++) {
		if(permissions[i][permissionId] == currentPermId && permissions[i].personId == personId) {
			if(permissions[i].perm == 1) {
				docFrag = docFragAllow;
			} else if(permissions[i].perm == 0) {
				docFrag = docFragPrompt;
			} else if(permissions[i].perm == -1) {
				docFrag = docFragDeny;
			}

			createPermissionEntry(permissions[i], docFrag, tab);
		}
	}
	domObjs[tab].allow.appendChild(docFragAllow);
	domObjs[tab].prompt.appendChild(docFragPrompt);
	domObjs[tab].deny.appendChild(docFragDeny);

	//dragDropInitDraggables();
}

function fillOptionsFromArray(dropdown, optionsData) {
	var docFrag = document.createDocumentFragment(),
		option,
		i = 0,
		j = optionsData.length;

	for(i; i<j; i++) {
		option = document.createElement("option");
		option.setAttribute('value', optionsData[i].id);
		option.textContent = optionsData[i].name;
		docFrag.appendChild(option);
	}
	dropdown.appendChild(docFrag);
}

function openProfile(id) {
	var tab = domObjs.pages.tabsPolEd._currentPage.id;
	//de-highlight old one
	if(domObjs[tab].currentProfileDiv) {
		removeClass(domObjs[tab].currentProfileDiv, 'selected');
	}
	//set active + higlight + draw
	setActiveProfile(id);
	drawDraggablePermissions();
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

		if(!appData.placesPolicies.currentProfileId) {
			setActiveProfile(profile.id);
		}

		domObjs.placesPolicies.profileListContainer.appendChild(docFrag);
	} else { //edit
		profile = getObjFromArrayById(id, appData.profiles);
		if(!profile) return;

		profile.name = newName;
		//re-draw
		domObjs.placesPolicies.profiles[id].textContent = newName;
	}
}

function placesDeleteProfile() {
	var id = appData.placesPolicies.profileToDelete;
	//delete profile
	var profile = getObjFromArrayById(id, appData.profiles, true);
	appData.profiles.splice(profile.pos,1);
	var profileDiv = domObjs.placesPolicies.profiles[id];
	profileDiv.parentNode.removeChild(profileDiv);
	delete domObjs.placesPolicies.profiles[id]; //remove reference
	domObjs.placesPolicies.currentProfileDiv = undefined;

	var removePermissionsHtml = false;
	if(appData.placesPolicies.currentProfileId == id) { //if current profile is being deleted select first one
		if(appData.profiles.length > 0) {
			openProfile(appData.profiles[0].id);
		} else {
			appData.placesPolicies.currentProfileId = undefined;
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
				var permissionDiv = domObjs.placesPolicies.permissions[permId].parentNode; //one node higher
				permissionDiv.parentNode.removeChild(permissionDiv);
			}
			delete domObjs.placesPolicies.permissions[permId]; //remove reference
			appData.permissions.splice(i,1);
			i--; //compensate for the missing element
			j--;
		}
	}
	appData.placesPolicies.profileToDelete = undefined;
}

function addEditPermission() {
	var tab = domObjs.pages.tabsPolEd._currentPage.id;

	var app = domObjs.popupAddPermissionApp.value;
	var type = domObjs.popupAddPermissionType.value;
	var perm = domObjs.popupAddPermissionAction.value;
	var personId = appData[tab].currentPersonId;

	var newName = domObjs.popupAddPermissionName.value;
	if(newName == '') {
		newName = getObjFromArrayById(type, appData.services).name;
	}

	var destColumn;
	if(perm == 'allow') {
		perm = 1;
		destColumn = domObjs[tab].allow;
	} else if(perm == 'prompt') {
		perm = 0;
		destColumn = domObjs[tab].prompt;
	} else if(perm == 'deny') {
		perm = -1;
		destColumn = domObjs[tab].deny;
	}

	var id = domObjs.popupAddPermissionId.value,
		permission;

	if(!id) { //new
		permission = {};
		permission.id = new Date().valueOf();
		if(tab == 'placesPolicies') {
			permission.profileId = appData.placesPolicies.currentProfileId,
			permission.name = newName;
		}
		permission.appId = app;
		permission.serviceId = type;
		permission.perm = perm;
		permission.personId = personId;

		appData.permissions.push(permission);

		//draw
		var docFrag = document.createDocumentFragment();
		createPermissionEntry(permission, docFrag);
		destColumn.appendChild(docFrag);
	} else { //edit
		if(tab == 'appsPolicies') {
			permission = getObjFromArrayById(id, appData.appPermissions);
		} else if(tab == 'placesPolicies') {
			permission = getObjFromArrayById(id, appData.permissions);
		}
		if(!permission) return;

		var permissionChanged = false;
		if(permission.perm != perm) {
			permissionChanged = true;
		}

		permission.appId = app;
		permission.serviceId = type;
		permission.perm = perm;
		permission.personId = personId;

		var nameHtml;
		if(tab == 'appsPolicies') {
			nameHtml = '<b>'+getObjFromArrayById(permission.serviceId, appData.services).name+'</b>';
		} else if(tab == 'placesPolicies') {
			permission.name = newName;
			nameHtml = '<b>'+permission.name+'</b>@'+getObjFromArrayById(permission.appId, appData.applications).name;
		}

		//re-draw
		domObjs[tab].permissions[id].innerHTML = nameHtml;
		if(permissionChanged) {
			destColumn.appendChild(domObjs[tab].permissions[id].parentNode);
		}
	}
}

function updatePermission(id, permission) {
	var tab = domObjs.pages.tabsPolEd._currentPage.id,
		permissionObj;
	if(tab == 'appsPolicies') {
		permissionObj = getObjFromArrayById(id, appData.appPermissions);
	} else if(tab == 'placesPolicies') {
		permissionObj = getObjFromArrayById(id, appData.permissions);
	}
	if(!permissionObj) return;
	if(!isNaN(permission)) permissionObj.perm = permission;
}

function deletePermission() {
	var tab = domObjs.pages.tabsPolEd._currentPage.id,
		id = appData[tab].permissionToDelete,
		permission;
	if(tab == 'appsPolicies') {
		permission = getObjFromArrayById(id, appData.appPermissions, true);
		appData.appPermissions.splice(permission.pos,1);
	} else if(tab == 'placesPolicies') {
		permission = getObjFromArrayById(id, appData.permissions, true);
		appData.permissions.splice(permission.pos,1);
	}
	var permissionDiv = domObjs[tab].permissions[id].parentNode; //one node higher
	permissionDiv.parentNode.removeChild(permissionDiv);
	delete domObjs[tab].permissions[id]; //remove reference
	appData[tab].permissionToDelete = undefined;
}

/* POPUPS */
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

function profileDeletePopup(id) {
	appData.placesPolicies.profileToDelete = id;
	showPopup(domObjs.popupDeleteProfile);
}

function permissionEditPopup(newPermissionOrId) {
	var tab = domObjs.pages.tabsPolEd._currentPage.id;

	if(isNaN(newPermissionOrId)) { //new
		if(newPermissionOrId == "allow" || newPermissionOrId == 'prompt' || newPermissionOrId == 'deny') {
			domObjs.popupAddPermissionAction.value = newPermissionOrId;
		} else {
			domObjs.popupAddPermissionAction.options[0].selected = "selected";
		}
		//reset other fields
		domObjs.popupAddPermissionId.value = '';
		domObjs.popupAddPermissionName.value = '';
		if(tab == 'appsPolicies') {
			domObjs.popupAddPermissionApp.value = appData[tab].currentProfileId;
		} else {
			domObjs.popupAddPermissionApp.options[0].selected = "selected";
		}
		domObjs.popupAddPermissionType.options[0].selected = "selected";
	} else { //edit
		var permission;

		if(tab == 'appsPolicies') {
			permission = getObjFromArrayById(newPermissionOrId, appData.appPermissions);
		} else if(tab == 'placesPolicies') {
			permission = getObjFromArrayById(newPermissionOrId, appData.permissions);
		}

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
		domObjs.popupAddPermissionApp.value = permission.appId;
		domObjs.popupAddPermissionType.value = permission.serviceId;
		domObjs.popupAddPermissionAction.value = permValue;
	}

	if(tab == 'appsPolicies') {
		domObjs.popupAddPermissionNameContainer.style.display = "none";
		domObjs.popupAddPermissionAppContainer.style.display = "none";
	} else if(tab == 'placesPolicies') {
		domObjs.popupAddPermissionNameContainer.style.display = "block";
		domObjs.popupAddPermissionAppContainer.style.display = "block";
	}

	//TODO block here options that would collide with already set permissions
	//this would have to be pretty dynamic = not so easy

	showPopup(domObjs.popupAddPermission);
}

function permissionDeletePopup(id) {
	var tab = domObjs.pages.tabsPolEd._currentPage.id;
	appData[tab].permissionToDelete = id; //TODO meh
	showPopup(domObjs.popupDeletePermission);
}