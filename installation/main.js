/* document.ready equivalent
 * http://stackoverflow.com/questions/1795089/need-help-with-jquery-to-javascript/1795167#1795167
 */

// Mozilla, Opera, Webkit
if ( document.addEventListener ) {
  document.addEventListener( "DOMContentLoaded", function(){
    document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
    domReady();
  }, false );

// If IE event model is used
} else if ( document.attachEvent ) {
  // ensure firing before onload
  document.attachEvent("onreadystatechange", function(){
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", arguments.callee );
      domReady();
    }
  });
}

function domReady () {
	// THIS CHUNK OF CODE COULD BE RESTORED FOR CROSS-/CURRENT/SPECIFIC DEVICE BUTTONS
	/*var permissionsExplainedHelpButton = document.getElementById('perm-b-expl');
	var permissionsExplainedContainer = document.getElementById('permissions-explained');
	permissionsExplainedHelpButton.onclick = function() {showHideUsingHeight(permissionsExplainedContainer, '9em', '10px')};

	var permDevCross = document.getElementById('perm-b-cross');
	var permDevCurr = document.getElementById('perm-b-curr');
	var permDevButtons = [permDevCross, permDevCurr]; //I could probably use objectsForLater here... TODO
	permDevCross.onclick = function() {selectItem(permDevButtons, 0)};
	permDevCurr.onclick = function() {selectItem(permDevButtons, 1)};*/

	var updateInfoHelpButton = document.getElementById('updateinfo-button');
	var updateInfoContainer = document.getElementById('updateinfo');
	updateInfoHelpButton.onclick = function() {showHideUsingHeight(updateInfoContainer, {h:'4em', p:'1em', m:'0 5% 10px'})};

	fillInAppInfo();
	drawPermissionsList();
}

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

function showHideUsingHeight(element, styleObj, clickedObj) {
	//styleObj can contain "h" for maxheight, "p" for padding and "m" for margin
	console.log(this);
	console.log(clickedObj);
	var className = "unfolded";
	if(element.style.maxHeight == '0px' || element.style.maxHeight == '0' || element.style.maxHeight == '') {
		element.style.maxHeight = styleObj.h;
		if(styleObj.p) element.style.padding = styleObj.p;
		if(styleObj.m) element.style.margin = styleObj.m;
		if(clickedObj) addClass(clickedObj, className);
	} else {
		element.style.maxHeight = '0px';
		element.style.padding = '0px';
		element.style.margin = '0px';
		if(clickedObj) removeClass(clickedObj, className);
	}
}

function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/* MOCKS */

var mocked = {};

mocked.app = {
	name: "Application With a Lengthy Name",
	developer: "Super Developer X",
	img: "webinos_logo_app.png",
	ver: "0.1",
	installed: !!(Math.floor(Math.random()*2))
}

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

mocked.devices = [{
		name: "Current device"
	}, {
		name: "Samsung Galaxy Tab 10.1"
	}];

//mock generator
var generateMockedData = function(arrayObjectName, quantity) {
	var i = 0,
		destArr = mocked[arrayObjectName];

	for(i; i<quantity; i++) {
		if(arrayObjectName == 'permissions') {
			destArr.push({
				category: "Lorem "+(i+1),
				name: "Lorem ipsum "+(i+1),
				desc: "Bacon ipsum dolor sit amet andouille cow ham bacon pancetta ribeye beef ribs ground round.",
				permission: Math.floor(Math.random()*3),
				required: !!(Math.floor(Math.random()*2))
			});
		} else if(arrayObjectName == 'devices') {
			destArr.push({
				name: "Lorem "+(i+1),
			});
		}
	}
}

// generate more mocked data
generateMockedData('permissions', 5);
//generateMockedData('devices', Math.floor(Math.random()*3));


//draw
var objectsForLater = {}; //a place to gather all objects that I'm going to iterate later (onclick active class, and so on)

function fillInAppInfo() {
	var appimg = document.getElementById('appimg'),
		appname = document.getElementById('appname'),
		appdev = document.getElementById('appdev'),
		installButton = document.getElementById('installbutton'),
		updateInfoHelpButton = document.getElementById('updateinfo-button');

		appimg.src = "img/"+mocked.app.img;
		appname.innerHTML = mocked.app.name;
		appdev.innerHTML = mocked.app.developer;

		if(mocked.app.installed) {
			addClass(installButton, 'update');
			installButton.innerHTML = 'UPDATE';
			updateInfoHelpButton.style.display = "inline-block";
		}
};

function drawPermissionsList() {
	var permissionsListContainer = document.getElementById('permissions-list'),
		permissions = mocked.permissions,
		//devices = mocked.devices,
		i = 0,
		j = permissions.length;
		//k = 0,
		//l = devices.length,
		//deviceNamesSet = false;
	objectsForLater.permissionCategories = {};

	/*if(window.innerWidth < 960) {
		l = 1; //we don't want to generate other devices for a mobile ui
	}*/

	for(i; i<j; i++) {
		var category,
			permUnit = document.createElement("div");

		var lastInsertedInCategory = objectsForLater.permissionCategories[permissions[i].category];
		if(!lastInsertedInCategory) { // no previous object = no category
			category = document.createElement("h1");
			category.innerHTML = permissions[i].category;
			permissionsListContainer.appendChild(category);
		}

		var name = document.createElement("h3");
		name.innerHTML = permissions[i].name;
		if(permissions[i].required) {
			var required = document.createElement("span");
			required.innerHTML = "required";
			name.appendChild(required);
		}
		var nameArrowImg = document.createElement("img");
		if(window.innerWidth < 960) {
			nameArrowImg.src = "img/arrow-320.png";
		} else {
			nameArrowImg.src = "img/arrow.png";
		}
		name.appendChild(nameArrowImg);
		var desc = document.createElement("p");
		desc.innerHTML = permissions[i].desc;
		desc.className = "info";
		name.onclick = (function(el, clickedEl) {
			return function() {
				showHideUsingHeight(el, {h:'8em', p:'5px'}, clickedEl);
			};
		})(desc, name);

		permUnit.appendChild(name);
		permUnit.appendChild(desc);

		var permControls = document.createElement("div");
		permControls.className = "permissions-controls";
		drawPermissionButtons(permControls, permissions[i].permission);
		permUnit.appendChild(permControls);

		if(!lastInsertedInCategory) {
			permissionsListContainer.appendChild(permUnit);
			objectsForLater.permissionCategories[permissions[i].category] = permUnit;
		} else {
			insertAfter(lastInsertedInCategory, permUnit);
		}
	}
	/*if(!deviceNamesSet && window.innerWidth >= 960) {
		var deviceNames = document.getElementById('device-names'),
			device,
			deviceInstall;
		objectsForLater['deviceNames'] = [];

		for(k; k<l; k++) {
			device = document.createElement("div");
			if(k!=0) { //TODO, only mocked visual select now
				device.className = "name";
			} else {
				device.className = "name selected";
			}
			device.innerHTML = devices[k].name;
			device.onclick = (function(active) {
				return function() {
					selectItem('deviceNames', active);
				};
			})(k);
			objectsForLater['deviceNames'].push(device);
			deviceNames.appendChild(device);

			deviceInstall = document.createElement("div");
			deviceInstall.className = "checkbox";
			deviceInstall.onclick = (function(obj) {
				return function() {
					if(this.className.indexOf('selected') == '-1') {
						addClass(this, 'selected');
					} else {
						removeClass(this, 'selected');
					}
				};
			})(k);
			deviceNames.appendChild(deviceInstall);
		}
		deviceNamesSet = true;
	}*/
};
//drawPermissionsList();

function drawPermissionButtons(container, active) {
		var classes = ['','',''];
		classes[active] = ' selected';
		var docFragment = document.createDocumentFragment();

		var b_allow = document.createElement("div");
		b_allow.innerHTML = "Allow";
		b_allow.className = "button allow"+classes[0];
		docFragment.appendChild(b_allow);

		var b_prompt = document.createElement("div");
		b_prompt.innerHTML = "Prompt";
		b_prompt.className = "button prompt"+classes[1];
		docFragment.appendChild(b_prompt);

		var b_deny = document.createElement("div");
		b_deny.innerHTML = "Deny";
		b_deny.className = "button deny"+classes[2];
		docFragment.appendChild(b_deny);

		var buttons = [b_allow, b_prompt, b_deny];
		b_allow.onclick = function() {selectItem(buttons, 0)};
		b_prompt.onclick = function() {selectItem(buttons, 1)};
		b_deny.onclick = function() {selectItem(buttons, 2)};

		//container.innerHTML = '';
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