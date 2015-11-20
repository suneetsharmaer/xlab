Meteor.methods({

    'findAds': function(videoId, time) {
        var userInfo = Users.find({
            userId: Meteor.userId()
        }).fetch();
        //console.log('userInfo: ' + JSON.stringify(userInfo));

        var ads = [];

        if (userInfo[0].xlab_module_2 != undefined && userInfo[0].xlab_module_2.ads != undefined) {
            //console.log('ads: ' + JSON.stringify(userInfo[0].ads));
            ads = userInfo[0].xlab_module_2.ads;
        }

        var ad = Meteor.call('extractAds', videoId, time);
        if (ad != undefined) {
            ads.unshift(ad);
            //console.log('pushed an ad: \n' + JSON.stringify(ad));
            Meteor.call('updateAds', ads);
        }
    },

    //this method can be replaced later based on the needs of how
    //ad data needs to be fetched/processed/stored in order to 
    //generate ad content. Currently its read from a pre-defined
    //collection called adsDirectory
    'extractAds': function(videoId, time) {
        Meteor.log.info('Extracting ad for videoId '+videoId+' time '+time);
        return ads[videoId][time];
    },


    //this method purely updates the ads array for the concerned user based on the
    //json array provided
    'updateAds': function(adsArray) {
            var setObj = {};
            setObj['xlab_module_2.ads'] = adsArray;
            setObj.time = Date.now();
            Users.upsert({
                userId: Meteor.userId()
            }, {
                $set: setObj
            }, {
                upsert: true
            })
        }
        // ,

    // 'videoEnd': function() {
    //   Users.update({
    //     userId: Meteor.userId()
    //   }, {
    //     $set: {
    //       ads: [],
    //       time: Date.now() // no need of comma here
    //     }
    //   });
    // }
})
