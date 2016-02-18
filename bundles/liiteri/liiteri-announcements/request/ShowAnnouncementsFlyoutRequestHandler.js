
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-announcements.request.ShowAnnouncementsFlyoutRequestHandler',

function(instance) {
    this.instance = instance;
}, {
    handleRequest: function (core, request) {
    	this.instance.showFlyout();
   }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
