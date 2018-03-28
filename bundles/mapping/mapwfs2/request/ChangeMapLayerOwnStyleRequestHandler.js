/**
 * @class Oskari.mapframework.bundle.mapwfs2.request.ChangeMapLayerOwnStyleRequestHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.request.ChangeMapLayerOwnStyleRequestHandler",

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin} plugin
     */

    function (plugin) {
        this.plugin = plugin;
    }, {
        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var layerId = request.getId();                           			
			var values = request.getStyle();

            var self = this;

			var counter = 0;
			var interval = window.setInterval(function () {
			    counter++;

			    var layer = self.plugin.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
				if ((layer != null && self.plugin.getConnection().isConnected())) {
					var styleName = "oskari_custom";

					// remove old custom tiles
					self.plugin.deleteTileCache(layerId, styleName);

					// set values to backend 
					layer.setCustomStyle(values);
					self.plugin.setCustomStyle(layerId, values);

					// change style to custom
					layer.selectStyle(styleName);
					var event = self.plugin.getSandbox().getEventBuilder('MapLayerEvent')(layerId, 'update');
					self.plugin.getSandbox().notifyAll(event);
					
					window.clearInterval(interval);
				}
				else if (counter > 20) {
				    window.clearInterval(interval);
				}
			}, 1000);
			

        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
