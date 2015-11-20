Template.screenOptions.helpers({
    moduleName: function() {
        return Session.get('moduleName');
    }
});

Template.screenOptions.events({
    'click #primary': function() {
        //for not allowing clicks on disabled buttons
        if ($('#primary').hasClass('disabled')) {
            return false;
        }
        console.log('primary options selected by userId: ' + Meteor.userId());
        Meteor.call('manageUser', Meteor.userId(), Session.get('moduleId'));
        //checkUser(Meteor.userId(), userExists, addUser);
        Session.set('renderTemplate', 'videoDetails');
    },

    'click #secondary': function() {
        //for not allowing clicks on disabled buttons
        if ($('#secondary').hasClass('disabled')) {
            return false;
        }
        console.log('secondary options selected by userId: ' + Meteor.userId());
        Session.set('renderTemplate', 'eventDisplay');
    },

    'click #reset': function() {
        Meteor.call('updateScreenInfo', Session.get('moduleId'), false);
        //printUserDetails(Meteor.userId());
        //UI.render(Template.screenOptions);
        Session.set('reset', true);
        return true;
        //Session.set('renderTemplate', 'screenOptions');
        //Session.set('secondaryButtonConfig', 'button radius');
        //Session.set('primaryButtonConfig', 'button radius');
    },
    'click #home': function() {
        //Meteor.call('updateScreenInfo', false);
        Session.set('renderTemplate', 'moduleSelection');
        Session.set('moduleName', '');
        Session.set('moduleId', '');
        return true;
        //Session.set('renderTemplate', 'screenOptions');
        //Session.set('secondaryButtonConfig', 'button radius');
        //Session.set('primaryButtonConfig', 'button radius');
    }
});

//handle activation of screen modes, i.e. Primary and Secondary screen options
//primary option is disabled if the user has selected the primary mode on some screen
Template.screenOptions.rendered = function() {
    console.log('ModuleName: ' + Session.get('moduleId'));
    checkScreenStatus();

}

Tracker.autorun(function() {
    if (Session.equals('reset', true)) {
        checkScreenStatus();
    }
});

function checkScreenStatus() {
    Meteor.call('checkScreenOneDisplay', Session.get('moduleId'), function(error, primaryScreenEnabled) {
        if (primaryScreenEnabled) {
            //activate only the secondary button
            $('#secondary').removeClass("disabled");
            $('#primary').addClass("disabled");
            //Session.set('secondaryButtonConfig', 'button radius');
            //Session.set('primaryButtonConfig', 'button radius disabled');
            //Template.instance().secondaryButtonConfig.set('button radius');
        } else {
            //activate only the primary button      
            //Session.set('primaryButtonConfig', 'button radius');
            //Session.set('secondaryButtonConfig', 'button radius disabled');
            $('#primary').removeClass("disabled");
            $('#secondary').addClass("disabled");
            //$('#secondary').removeClass("disabled");
            //primaryButtonConfig = 'button radius';
            //Template.instance().primaryButtonConfig.set('button radius');
        }
        Session.set('reset', false);
    });
}

function printUserDetails(userId) {
    console.log(Users.findOne({
        userId: userId
    }));
}
