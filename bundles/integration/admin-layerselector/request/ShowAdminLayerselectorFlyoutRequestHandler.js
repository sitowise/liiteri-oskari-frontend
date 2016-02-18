Oskari.clazz.define('Oskari.integration.bundle.admin-layerselector.request.ShowAdminLayerselectorFlyoutRequestHandler',

function(instance) {
    this.instance = instance;
}, {
    handleRequest: function (core, request) {
    	this.instance.showFlyout();
   }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
