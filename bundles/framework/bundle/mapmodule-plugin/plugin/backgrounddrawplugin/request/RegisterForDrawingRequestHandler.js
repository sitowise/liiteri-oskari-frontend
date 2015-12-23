Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.RegisterForDrawingRequestHandler', function (sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        if (request.isRegisterAction) {
            this.drawPlugin.registerForDrawing(request._creator);
        } else {
            this.drawPlugin.unregisterForDrawing(request._creator);
        }
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
