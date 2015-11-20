#xlab-node
This nodejs module provides a simplified interface/api to talk to the xlab meteor cloud infrastructure.

##Installation
As this is not a npm package currently, pull the code and within the project folder run:
```
npm install
```

##Usage
Running the following command will test the basic api features.
```
npm test
```
**Note** Testing the client requires an active meteor application running locally or on the cloud. The configuration details are shown in the next section.

*Sample usage*
```js
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
meteor.configure(callbacks);

/**
 * Configure with callback
 */
meteor.configure(callbacks, function() {
	console.log('After configuration');
});


/**
 * Login basic
 */
meteor.login();

/**
 * login with callback
 */
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


/**
 * Initialize basic
 */
meteor.init('yoga', {
	'key1': 'valueInit1',
	'key2': 'valueInit2'
});

/**
 * initialize with callback
 */
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
	}
);


/**
 * Update basic
 */
meteor.update({
	'yoga.key2': 'valueNew2'
});

/**
 * update with callback
 */
meteor.update({
		'yoga.key2': 'valueNew2'
	},
	function(err, result) {
		if (err) {
			console.log('Error: ' + JSON.stringify(err));
		} else {
			console.log('Update success: ' + JSON.stringify(result));
		}
	}
);

```
###Configuration
Currently, the project related configurations can be updated in the index.js file. The project has the following default configurations:
```
// configuration
	var config = {
		// for dyanamic user authentication, assign null to userId and password fields.
		// this allows for prompt while starting up the node js client
		userId: 't@t.com', //user email: same as for meteor login
		password: '123456', //user password: same as for meteor login

		//callback which is called when anything is added to the userCollection
		addedCallback: function(id) {
			console.log("[ADDED] to " + observer.name + ":  " + id);
		},

		//callback which is called when anything is changed in the userCollection
		changedCallback: function(id, oldFields, clearedFields, newFields) {
			console.log("[CHANGED] in " + observer.name + ":  " + id);
			console.log("[CHANGED] old field values: ", oldFields);
			console.log("[CHANGED] cleared fields: ", clearedFields);
			console.log("[CHANGED] new fields: ", newFields);
		},

		//callback which is called when anything is removed from the userCollection
		removedCallback: function(id, oldValue) {
			console.log("[REMOVED] in " + observer.name + ":  " + id);
			console.log("[REMOVED] previous value: ", oldValue);
		},
		subscribeTo: 'userData', // name of Meteor Publish function to subscribe to
		userCollection: 'userDetails', //collection in meteor to be observed for changes		
		host: 'localhost', //meteor host address
		port: '3000' //meteor port number
	}
```
##Business logic in Meteor
For adding business logic on the meteor server, refer to the **logic** and **update** functions here:
https://github.com/mlab/xlab-NetworkArch/blob/master/xlab-meteor/server/yoga/yoga.js
