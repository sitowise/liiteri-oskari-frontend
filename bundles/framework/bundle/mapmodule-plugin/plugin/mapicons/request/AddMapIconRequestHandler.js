/**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolContainerRequestHandler
 * Handles Oskari.mapframework.bundle.toolbar.request.ToolContainerRequest
 *  for managing toolbar buttons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.request.AddMapIconRequestHandler',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance} toolbar
 *          reference to toolbarInstance that handles the buttons
 */
function (plugin) {
    this._plugin = plugin;
}, {
    /**
     * @method handleRequest 
     * Hides the requested infobox/popup
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.toolbar.request.AddToolbarRequest/Oskari.mapframework.bundle.toolbar.request.RemoveToolbarRequest/Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest} request
     *      request to handle
     */
    handleRequest: function (core, request) {
        this._plugin.addMapIcon(request.getExtension(), request.getDescription());
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
