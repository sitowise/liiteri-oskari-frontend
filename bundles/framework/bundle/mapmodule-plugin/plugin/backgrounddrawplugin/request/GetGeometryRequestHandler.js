Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.GetGeometryRequestPluginHandler', function (sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var callBack = request.getCallBack();
        this.sandbox.printDebug("[Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.GetGeometryRequestPluginHandler] geometry requested");
        
        var wkt = this.drawPlugin.getDrawingAsWKT(request.getPluginId());

        if (callBack != null)
            callBack(wkt);

        return wkt;
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
