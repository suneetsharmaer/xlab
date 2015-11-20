Template.moduleSelection.helpers({
    moduleList: function() {
        return modules;
    }
});

var id;
var name;

Template.moduleSelection.events({
    'click .explore': function(e) {
        e.preventDefault(); //this will prevent the link trying to navigate to another page
        var href = $(this).attr("href"); //get the href so we can navigate later
        id = $(this).attr("id");
        name = $(this).attr("name");

        Meteor.log.info('id: ' + id + ' name: ' + name);
        Session.set('renderTemplate', 'screenOptions');
        Session.set('moduleId', id);
        Session.set('moduleName', name);
    }
});
