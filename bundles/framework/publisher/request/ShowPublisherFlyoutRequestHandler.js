Oskari.clazz.define('Oskari.mapframework.bundle.publisher.request.ShowPublisherFlyoutRequestHandler',

function(instance) {
    this.instance = instance;
}, {
    handleRequest: function (core, request) {
    	this.instance.showFlyout();
   }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
