// This meteor module provides a simplified interface/api to talk to the meteor implementation
var meteor = (function() {

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
	};

	var DDP = require('ddp');
	var login = require('ddp-login');
	var token = null;

	var ddpclient = new DDP({
		host: config.host,
		port: config.port
	});

	var observer = {};

	var my = {};

	//private methods

	function postLoginSuccess(userInfo) {
		// We are now logged in, with userInfo.token as our session auth token.
		console.log('Login Successful!' + JSON.stringify(userInfo));
		//userId = userInfo.id;
		//token = userInfo.token;
		//subscribe();
	}

	function subscribe() {
		ddpclient.subscribe(
			config.subscribeTo, // name of Meteor Publish function to subscribe to
			//[userId], // any parameters used by the Publish function
			function() { // callback when the subscription is complete
				console.log('Subscription to data complete');
				//console.log(JSON.stringify(ddpclient.collections.userDetails));
			}
		);

		observer = ddpclient.observe(config.userCollection);
		observer.added = config.addedCallback;
		observer.changed = config.changedCallback;
		observer.removed = config.removedCallback;
	}

	function authenticate(callback) {
		login.loginWithToken(ddpclient, token, function(err, userInfo) {
			if (err) throw err;
			token = userInfo.token;
			callback();
		});
	}

	//public methods	

	my.configure = function(callbacks, callback) {
		if (callbacks && typeof callbacks == "object") {
			if (callbacks.addedCallback != undefined && typeof callbacks.addedCallback == "function") {
				config.addedCallback = callbacks.addedCallback;
				console.log('Added-callback configured successfully');
			}
			if (callbacks.changedCallback != undefined && typeof callbacks.changedCallback == "function") {
				config.changedCallback = callbacks.changedCallback;
				console.log('Changed-callback configured successfully');
			}
			if (callbacks.removedCallback != undefined && typeof callbacks.removedCallback == "function") {
				config.removedCallback = callbacks.removedCallback;
				console.log('Removed-callback configured successfully');
			}
		}
		//execute passed callback if present
		if (callback && typeof callback == "function") {
			callback();
		}
	}

	/**
	 * This method handles user login
	 * @param  {function} callback [optional]
	 *
	 * Callback Example:
	 * function(err, result) {
	 *    if (err) {
	 *        handle error
	 *    } else {
	 *        success, result has the following structure:
	 *        {"id":"user id","token":"oauth token","tokenExpires":"2015-07-05T02:07:30.993Z"}
	 *    }
	 * }
	 */
	my.login = function(callback) {
		ddpclient.connect(function(err) {
			if (err) {
				if (callback && typeof callback == "function") {
					callback(err);
				} else {
					throw err;
				}
			}

			login(ddpclient, { // Options below are the defaults
					env: 'METEOR_TOKEN', // Name of an environment variable to check for a
					// token. If a token is found and is good,
					// authentication will require no user interaction.
					method: 'account', // Login method: account, email, username or token
					account: config.userId, // Prompt for account info by default
					pass: config.password, // Prompt for password by default
					retry: 5, // Number of login attempts to make
					plaintext: false // Do not fallback to plaintext password compatibility
						// for older non-bcrypt accounts
				},
				function(error, userInfo) {
					token = userInfo.token; //set the oauth token for further transactions
					subscribe();
					if (callback && typeof callback == "function") {
						callback(error, userInfo);
					}
				});
		});
	};

	/**
	 * Initializes the state for the user
	 * @param  {string} //projectName/namespace
	 * @param  {object}	//object with key value pairs, i.e. fields and their initial values
	 * @param  {function} callback [optional]
	 *
	 * Callback Example:
	 * function(err, result) {
	 *    if (err) {
	 *        handle error
	 *    } else {
	 *        success, result is true
	 *    }
	 * }
	 */
	my.init = function(namespace, fields, callback) {
		authenticate(function() {
			ddpclient.call(
				'init', [namespace, fields],
				function(error, result) {
					if (callback && typeof callback == "function") {
						callback(error, result);
					}
				}
			);
		});
	}


	/**
	 * Updates fields of the namespace passed.
	 * The fields and their values to be updated are passed as key:value pairs within a json object.
	 *
	 * Important: The field names passed inside the json object should be consistent
	 * with those that have been used while initialization the state using the 'init' method.
	 * In case the fields are not the same, these new fields would be created.
	 *
	 * This feature can be used to add fields when the project/application evolves but
	 * in order to ensure consistency of fields, correct field names should be passed each time.
	 *
	 * Tip: As javascript does not support constants directly, using a module for storing constants
	 * could be helpful to prevent changing of name. An example of one such module is:
	 * var CONFIG = (function() {
	 *   var private = {
	 *      'MY_CONST': '1',
	 *      'ANOTHER_CONST': '2'
	 *   };
	 *
	 *   return {
	 *   	 get: function(name) { return private[name]; }
	 *   };
	 * })();
	 *
	 * usage: CONFIG.get('MY_CONST');
	 *
	 *
	 * @param  {object}	//object with key value pairs, i.e. fields and their new values
	 * @param  {function} callback [optional]
	 *
	 * Callback Example:
	 * function(err, result) {
	 *    if (err) {
	 *        handle error
	 *    } else {
	 *        success, result is true
	 *    }
	 * }
	 */
	my.update = function(object, callback) {
		authenticate(function() {
			ddpclient.call(
				'update', [object],
				function(error, result) {
					if (callback && typeof callback == "function") {
						callback(error, result);
					}
				}
			);
		});
	}

	return my;
}());

module.exports = meteor;