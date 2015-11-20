//Videos = new Meteor.Collection('videos');

// pose information => Maps videoId -> pose for various times
// where poses are maintained as key-value pairs, key -> time of pose,
// value -> details for the pose
pose = {
  //id -> 1 corresponds to the first video
  "1": {
    "3": {
      "id": "poseID_1",
      "name": "pose1",
      "template": "pose template to be rendered(optional)"
    },
    "5": {
      "id": "poseID_2",
      "name": "pose2",
      "template": "pose template to be rendered(optional)"
    }
  },
  "2": {
    "3": {
      "id": "poseID_1",
      "name": "pose1",
      "template": "pose template to be rendered(optional)"
    },
    "5": {
      "id": "poseID_2",
      "name": "pose2",
      "template": "pose template to be rendered(optional)"
    }
  }
}

Users = new Meteor.Collection('userDetails');



/*
Sample format of metadata collection
{
  "xlab_module_1": {},
  "movie_id_1": {
    "movie_meta": {
      "name": "matrix",
      "length": "5.50",
      "rating": "4"
    },
    "publish": {},
    "developer": {}
  }
}
*/
Metadata = new Meteor.Collection('metadata');

Metadata.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {    
    return userId;
  },
  remove: function (userId, doc) {    
    return userId;
  }
});

Dictionary = new Meteor.Collection('dictionary');

Dictionary.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {    
    return userId;
  },
  remove: function (userId, doc) {    
    return userId;
  }
});

// meteor collection for storing the orchestration videos
OrchVideos = new Meteor.Collection('orchVideos');

OrchVideos.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {    
    return userId;
  },
  remove: function (userId, doc) {    
    return userId;
  }
});