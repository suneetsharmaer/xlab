  Template.videoDetails.helpers({

      moduleName: function() {
          return Session.get('moduleName');
      },

      videoList: function() {
          //Session.set('module', 'xlab_module_1');
          var module = Session.get('moduleId');
          //console.log('module: ' + module);
          if (module != undefined) {
              //dynamic fetch from videos collection
              if (module == 'xlab_module_4') {
                 var vids = OrchVideos.findOne({});   

                 //generate array for displaying the videos
                 videoArray = [];
                 for(key in vids.videos){
                    videoArray.push(vids.videos[key]);  
                 }              
                 Meteor.log.debug('videoArray:\n'+JSON.stringify(videoArray));
                 return videoArray;
              } else {
                  // static fetch from config files
                  Meteor.log.info('module: ' + module);
                  if (config.video[module] != undefined) {
                      return config.video[module].videos;
                  } else {
                      Meteor.log.error('Configuration for module ' + module + ' not available');
                  }
              }
          } else {
              Meteor.log.error('Module not set');
          }
      }
  });

  var id;
  var name;
  var videoSource;
  var metaSource;

  Template.videoDetails.events({
      'click .play': function(e) {
          e.preventDefault(); //this will prevent the link trying to navigate to another page
          var href = $(this).attr("href"); //get the href so we can navigate later
          id = $(this).attr("id");
          name = $(this).attr("name");
          videoSource = $(this).attr("videoSource");
          //metaSource = $(this).attr("metaSource");

          console.log('id: ' + id + ' name: ' + name + ' videoSource: ' + videoSource + ' metaSource: ' + metaSource);
          Session.set('renderTemplate', 'videoPlayer');
          Session.set('videoName', name);
          //addVideoTag(videoSource);
      },
      'click #home': function() {
          Session.set('renderTemplate', 'moduleSelection');
          Session.set('moduleName', '');
          Session.set('moduleId', '');
      },
      'click #screenSelection': function() {
          Session.set('renderTemplate', 'screenOptions');
      }
  });


  Template.videoPlayer.rendered = function() {
      var module = Session.get('moduleId');
      if (module != undefined) {
          Meteor.log.info('module: ' + module);
          if (config.video[module] != undefined) {
              console.log('module: ' + module + ' \nconfig: ' + JSON.stringify(config.video[module]));
              addVideoTag(videoSource, config.video[module]);
              //getMetadata(metaSource, config.video[module].onUpdateTimestamp);
              getMetadata(id, config.video[module].onUpdateTimestamp);
          } else {
              Meteor.log.error('Configuration for module ' + module + ' not available');
          }
      } else {
          Meteor.log.error('Module not set');
      }
  }

  //add video player
  function addVideoTag(videoURL, videoConfig) {
      if (videoURL != null) {

          var controls = '';
          var autoplay = '';
          if (videoConfig.controls == 'on') {
              controls = 'controls';
          }
          if (videoConfig.autoplay == 'on') {
              autoplay = 'autoplay';
          }

          $("#videoHolder").html(
              '<div class="flex-video">' +
              '<video id="videoTag" width="400" ' + autoplay + ' ' + controls + '>' +
              '<source src="' + videoURL + '" type="video/mp4"></source>' +
              //'<track id="nav" kind="chapters" label="English subtitles" src="' + videoDetails + '" srclang="en" default></track>' +
              '</video>' +
              '</div>'
          );


          $("#videoTag").bind("ended", function() {
              Meteor.call('videoEnd');
          });
      }
  }

  function getMetadata(videoId, serverMethod) {
      var meta = Metadata.findOne({});
      //console.log(meta);
      if (meta.meta[videoId] != undefined) {
          Meteor.log.info('Metadata for videoId ' + videoId + ' found');
          bindMetaDataToVideo(meta.meta[videoId], serverMethod);
      } else {
          Meteor.log.error('Metadata for videoId ' + videoId + ' not found');
      }
  }

  // function getMetadata(metaDataURL, serverMethod) {
  //     $.ajax({
  //         dataType: "json",
  //         type: 'GET',
  //         url: metaDataURL,
  //         success: function(response) {
  //             bindMetaDataToVideo(response, serverMethod);
  //             console.log('metadata: ' + response);
  //         }
  //     });
  // }


  function bindMetaDataToVideo(jsonData, serverMethod) {
      //for keeping track of time event already displayed, since timeupdate call can be 
      //triggered multiple times within a single second depending on the system. 
      var alreadyDisplayed = [];

      var dictionary = Dictionary.findOne({});
      console.log(dictionary.dict);
      $("#videoTag").bind("timeupdate", function() {

          var time = parseInt(this.currentTime, 10);

          if (jsonData.hasOwnProperty(time) && alreadyDisplayed.indexOf(time) == -1) {
              alreadyDisplayed.push(time);

              //push information to second screen by adding details to collection
              //which is being viewed through second screen template
              //console.log('id: ' + id);
              console.log('time: ' + time);
              var moduleId = Session.get('moduleId');
              if (moduleId == 'xlab_module_3') {
                  var event = jsonData[time];
                  var lightEffect = {};
                  Meteor.log.info('event: ' + JSON.stringify(event));

                  var eventName = event[0]['name'];
                  //transform abstract event to commands for lights
                  if (eventName != undefined && dictionary.dict[eventName]) {
                      lightEffect = dictionary.dict[eventName].light;
                      Meteor.log.info('Found light effect ' + JSON.stringify(lightEffect));
                  } else {
                      Meteor.log.error('Could not find effect ' + eventName + ' in the dictionary');
                  }
                  Meteor.call(serverMethod, moduleId, time, lightEffect); //used currently for orch+lights
              } else {
                  Meteor.call(serverMethod, id, time); //used currently for ads
              }
          }
      });
  }
