// Meteor.methods({

//   'updateTimestamp': function(moduleId, timestamp) {

//     var setObj = {};
//     setObj[moduleId+'.timestamp'] = timestamp;
//     setObj.time = Date.now();

//     Users.upsert({
//       userId: Meteor.userId()
//     }, {
//       $set: setObj
//     }, {
//       upsert: true
//     })
//   }
//   ,

//   'videoEnd': function(moduleId) {

//     var setObj = {};
//     setObj[moduleId+'.timestamp'] = 0;
//     setObj.time = Date.now();

//     Users.update({
//       userId: Meteor.userId()
//     }, {
//       $set: setObj
//     });
//   }
// })