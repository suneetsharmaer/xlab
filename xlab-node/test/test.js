var meteor = require('../lib/index.js');


/**
 * Configurating callbacks
 * Pass a json objects with added, changed and removed callbacks.
 * See example below
 */


var callbacks = {};

//callback which is called when anything is added to the userCollection
callbacks.addedCallback = function(id) {
	console.log("[ADDED] Collection ID: "+id);
};

//callback which is called when anything is changed in the userCollection
callbacks.changedCallback = function(id, oldFields, clearedFields, newFields) {
	console.log("[CHANGED] Collection ID: "+id);
	console.log("[CHANGED] old field values: ", oldFields);
	console.log("[CHANGED] cleared fields: ", clearedFields);
	console.log("[CHANGED] new fields: ", newFields);
};

//callback which is called when anything is removed from the userCollection
callbacks.removedCallback = function(id, oldValue) {
	console.log("[REMOVED] Collection ID: "+id);
	console.log("[REMOVED] previous value: ", oldValue);
};

/**
 * Configure basic
 */

//meteor.configure(callbacks);

/**
 * Configure with callback
 */
var configure = function() {
	meteor.configure(callbacks, function() {
		console.log('After configuration');
	});
}

/**
 * Login basic
 */

//meteor.login();

/**
 * login with callback
 */
var login = function() {
	meteor.login(function(err, result) {

		if (err) {
			console.log('login error');
			console.log(JSON.stringify(err));
		} else {
			console.log('login success');
			console.log('user Id: ' + result.id);
			//call all other api methods after successful login		
		}

	});
}



/**
 * Initialize basic
 */

// meteor.init('yoga', {
// 	'key1': 'valueInit1',
// 	'key2': 'valueInit2'
// });

/**
 * initialize with call back
 */
var initialize = function() {
	meteor.init('yoga', {
			'key1': 'valueInit1',
			'key2': 'valueInit2'
		},
		function(err, result) {
			if (err) {
				console.log('Error: ' + JSON.stringify(err));
			} else {
				console.log('initialization success: ' + JSON.stringify(result));
			}
		});
}



/**
 * Update basic
 */
// meteor.update({
// 	//'yoga.key1': 'valueNew1',
// 	'yoga.key2': 'valueNew2'
// });

/**
 * update with callback
 */
var update = function() {
	meteor.update({
			//'yoga.key1': 'valueNew1',
			'yoga.key2': 'valueNew2'
		},
		function(err, result) {
			if (err) {
				console.log('Error: ' + JSON.stringify(err));
			} else {
				console.log('Update success: ' + JSON.stringify(result));
			}
		});
}

setTimeout(function() {
	configure();
}, 200);

setTimeout(function() {
	login();
}, 500);

setTimeout(function() {
	initialize();
}, 1000);

setTimeout(function() {
	update();
}, 1500);