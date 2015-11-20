Template.eventDisplay.helpers({
  adList: function() {
    var userInfo = Users.find({
      userId: Meteor.userId()
    }).fetch();

    var ads = [];

    if (userInfo[0].xlab_module_2.ads != undefined) {
      console.log('ads for second screen found\n' + JSON.stringify(userInfo[0].ads));
      ads = userInfo[0].xlab_module_2.ads;
    }
    return ads;
  }
});