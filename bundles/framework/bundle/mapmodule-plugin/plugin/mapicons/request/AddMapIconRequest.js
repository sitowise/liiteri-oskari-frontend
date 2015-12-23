/**
 * Request to get open indicators.
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 *
 * @class Oskari.statistics.bundle.statsgrid.request.IndicatorsRequest
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.request.AddMapIconRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function(creator, description, extension) {
        this._creator = creator;
        this._extension = extension;
        this._description = description;
    }, {
        /** @static @property __name request name */
        __name: "MapIconsPlugin.AddMapIconRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        getDescription: function() {
            return this._description;
        },
        getExtension: function () {
            return this._extension;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });