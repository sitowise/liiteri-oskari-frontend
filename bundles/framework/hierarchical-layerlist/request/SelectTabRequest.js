/**
 * @class Oskari.mapframework.bundle.hierarchical-layerlist.request.SelectTabRequest
 * Requests tab to be selected
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.request.SelectTabRequest',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} tab tab to be selected
     */
    function (tab) {
        this._tab = tab;
    }, {
        /** @static @property __name request name */
        __name: "hierarchical-layerlist.SelectTabRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        getTab: function () {
            return this._tab;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });