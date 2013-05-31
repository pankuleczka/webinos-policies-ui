/* MOCKS */

var mocked = {};

mocked.user = {
	name: "Tardar Sauce",
	email: "grumpy@nonexistent.com",
	img: "person1.png",
	lastAccess: null
};
mocked.permissions = [{
	category: "Location",
	name: "Use Location",
	desc: "This is used for providing location-based information such as nearby points of interest. This data will not be collected by any third party.",
	permission: 0,
	required: false
}, {
	category: "Device Status",
	name: "View battery life",
	desc: "Allows an application to collect battery statistics.",
	permission: 1,
	required: true
}, {
	category: "Device Status",
	name: "View Wi-Fi status",
	desc: "Allows applications to access information about Wi-Fi networks.",
	permission: 2,
	required: true
}];


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


/* DRAW */


var objectsForLater = {}; //a place to gather all objects that I'm going to iterate later (onclick active class, and so on)

var drawUserData = function() {
	document.getElementById('newUserReqName').innerHTML = UIdata.user.name;
	document.getElementById('newUserReqNameInfo1').innerHTML = UIdata.user.name;
	document.getElementById('newUserReqNameInfo2').innerHTML = UIdata.user.name;
	var usrImg = document.getElementById('newUserReqImg');
	usrImg.src = 'img/'+UIdata.user.img;
	usrImg.onerror = function(){
		usrImg.src = 'img/userPlaceholder.png';
	};

	drawPermissionButtons("newUserReqButtons", [{n:"Allow",c:"allow"}, {n:"Deny",c:"deny"}]);
}

var drawUserPermissions = function() {
	document.getElementById('newUserPermName').innerHTML = UIdata.user.name;

	var permissionsListContainer = document.getElementById('user-permission-list-container'),
		permissions = UIdata.permissions,
		i = 0,
		j = permissions.length;

	for(i; i<j; i++) {
		var category = document.createElement("h1");
		category.innerHTML = permissions[i].category;
		permissionsListContainer.appendChild(category);

		var permControls = document.createElement("div");
		permControls.className = "permissions-controls";
		permControls.id = "permButtons"+i;
		drawPermissionButtons(permControls, [{n:"Deny",c:"deny"}, {n:"Allow",c:"allow"}, {n:"Ask later",c:"prompt"}, ], permissions[i].permission);
		permissionsListContainer.appendChild(permControls);
	}
}

if(document.body.id == 'user-allow-page') {
	drawUserData();
} else { //user-permissions-page
	drawUserPermissions();
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
		removeClass(elements[i], 'selected');
	}
}