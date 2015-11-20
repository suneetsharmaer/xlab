Meteor.methods({

  /**
   * Intialize the state of the user in the user collection
   * based on the project and the fields passed
   * @param  {string} namespace
   * @param  {object} fields
   * @return {boolean} [returns true if successful]
   */
  'init': function(namespace, fields) {
    Meteor.log.debug('Initializing namespace: ' + namespace + '\nfields:\n' + JSON.stringify(fields));
    var set = {};
    set[namespace] = fields;
    Users.upsert({
      userId: Meteor.userId()
    }, {
      $set: set
    }, {
      upsert: true
    })

    return true;
  },

  /**
   * Updates the state
   * @param  {object} Ex. {'namespace.key1':'newValue1', 'namespace.key2': 'value2'}
   * @return {boolean}
   */
  'update': function(object) {
    Meteor.log.debug('Updating fields:\n' + JSON.stringify(object));

    /**
     * Add business logic for setting other fields based on the received state
     * and the state maintained on the server
     * Ex. if namespace.key1 is being updated from the node client, the logic
     * might involve setting the namespace.key2 as well, which would be read on the
     * video client.
     */


    Users.upsert({
      userId: Meteor.userId()
    }, {
      $set: logic(object)
    }, {
      upsert: true
    })

    return true;
  }

})

/**
 * Sample logic
 * @param  {object} object [The object containing changes, passed from update funtion]
 * @return {object}        [The object which needs to be updated in the collection]
 */
function logic(object) {
  //based on the state passed, update the object  
  console.log('business logic');
  return object;
}