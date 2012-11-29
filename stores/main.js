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

	if(!('biale'=='czarne')) {
			checked = ' checked="checked"';
		} else {
			checked = '';
		}
	html += '' +
		'<hr>' +
		'<div>' +
			'<input type="checkbox"'+checked+' id="store-other">' +
			'<label for="store-other">Allow apps to be installed from other locations</label>' +
		'</div>';

	storeListContainer.innerHTML = html;
}();