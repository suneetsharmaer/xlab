//default template to be rendered
Session.set('renderTemplate', 'moduleSelection');
Template.singleVideo.helpers({
  screenTemplates: function() {
    return Session.get('renderTemplate');
  }
});