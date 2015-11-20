Meteor.publish("userData", function() {
    Meteor.log.info('Publishing userData');
    return Users.find({
        userId: this.userId
    });
});

//on startup add the default metadata into the collection
Meteor.startup(function() {
    Metadata.upsert({}, {
        $set: {meta : orch_time_data}
    }, {
        upsert: true
    })    

    OrchVideos.upsert({}, {
        $set: {videos : orchDefaultVideos}
    }, {
        upsert: true
    })
    
    Dictionary.upsert({}, {
        $set: {dict : orch_dict_data}
    }, {
        upsert: true
    })

    Meteor.log.info('Initializing orchestration videos, metadata and dictionary');

});

Meteor.publish("metadataInfo", function() {
    Meteor.log.info('Publishing metadataInfo');
    return Metadata.find({});
});

Meteor.publish("orchVideos", function() {
    Meteor.log.info('Publishing orchVideos');
    return OrchVideos.find({});
});

Meteor.publish("dict", function() {
    Meteor.log.info('Publishing dictionary');
    return Dictionary.find({});
});
