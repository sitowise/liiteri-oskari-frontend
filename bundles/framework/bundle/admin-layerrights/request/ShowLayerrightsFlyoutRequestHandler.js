Oskari.clazz.define('Oskari.mapframework.bundle.admin-layerrights.request.ShowLayerrightsFlyoutRequestHandler',

function(instance) {
    this.instance = instance;
}, {
    handleRequest: function (core, request) {
    	this.instance.showFlyout();
   }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
