/**
 * @class Oskari.liiteri.bundle.liiteri-usergisdata.request.SelectCurrentTabRequest
 * 
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-usergisdata.request.SelectCurrentTabRequest',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
    }, {
        /** @static @property __name request name */
        __name: "liiteri-usergisdata.SelectCurrentTabRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });