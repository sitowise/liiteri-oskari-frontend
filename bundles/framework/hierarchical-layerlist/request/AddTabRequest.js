/**
 * @class Oskari.mapframework.bundle.hierarchical-layerlist.request.AddTabRequest
 * Requests tab to be added
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.request.AddTabRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} viewname for the view to be saved
 */
function (view, first) {
    this._first = !!first;
    this._view = view;
},{
    /** @static @property __name request name */
    __name: "hierarchical-layerlist.AddTabRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    getView: function () {
        return this._view;
    },
    /**
     * @method isFirst
     * @return {Boolean} is tab added as first
     */
    isFirst : function() {
        return this._first;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});