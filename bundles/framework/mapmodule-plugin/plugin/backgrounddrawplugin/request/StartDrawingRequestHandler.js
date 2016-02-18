Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.StartDrawingRequestPluginHandler', function (sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this.sandbox.printDebug("[Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StartDrawingRequestPluginHandler] Start Drawing: " + drawMode);
        this.drawPlugin.startDrawing(request.getPluginId(),
            {
            drawMode : request.getDrawMode(),
            geometry : request.getGeometry(),
            isModify : request.isModify(),
            style : ''
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
