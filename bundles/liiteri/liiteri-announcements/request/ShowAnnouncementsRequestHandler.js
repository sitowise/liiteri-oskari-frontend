
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-announcements.request.ShowAnnouncementsRequestHandler',

function(instance) {
    this.instance = instance;
}, {
    handleRequest: function (core, request) {
    	this.instance._getAnnouncements();
   }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
