Oskari.clazz.define(
        'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundDrawPlugin.request.StopDrawingRequestPluginHandler',
        
        function(sandbox, drawPlugin) {
            this.sandbox = sandbox;
            this.drawPlugin = drawPlugin;
        },
        {
            handleRequest: function(core,request) {
                this.sandbox.printDebug("[Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StopDrawingRequestPluginHandler] Stop drawing");
                if(request.isCancel()) {
                    // we wish to clear the drawing without sending further events
                    this.drawPlugin.stopDrawing(request.getPluginId());
                }
                else {
                    // pressed finished drawing, act like dblclick
                    this.drawPlugin.forceFinishDraw(request.getPluginId());
                }
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });