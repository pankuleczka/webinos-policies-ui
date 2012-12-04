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

// preliminary mocks
var mocked = {};
mocked.stores = [{
		name: "apps.webinos.org",
		allow: false
	}, {
		name: "ubiapps.com",
		allow: true
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
		} //else {
	}
}

// generate more mocked data
generateMockedData('stores', 3);

//draw
var drawStoreList = function() {
	var storeListContainer = document.getElementById('store-list-container'),
		html = '',
		stores = mocked.stores,
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

	drawPermissionButtons('unk-loc-per-con', 1, "Allow", "Allow once", "Deny");
}();

function drawPermissionButtons(container, active, allowText, promptText, denyText) {
	if(typeof container != 'object') container = document.getElementById(container);

	var classes = ['','',''];
	classes[active] = ' selected';
	var docFragment = document.createDocumentFragment();

	var b_allow = document.createElement("div");
	b_allow.innerHTML = allowText;
	b_allow.className = "button allow"+classes[0];
	docFragment.appendChild(b_allow);

	var b_prompt = document.createElement("div");
	b_prompt.innerHTML = promptText;
	b_prompt.className = "button prompt"+classes[1];
	docFragment.appendChild(b_prompt);

	var b_deny = document.createElement("div");
	b_deny.innerHTML = denyText;
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