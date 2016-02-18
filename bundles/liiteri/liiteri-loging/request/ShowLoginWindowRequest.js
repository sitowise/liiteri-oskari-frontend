/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.request.SetServicePackageRequest
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-loging.request.ShowLoginWindowRequest',

    function () {
    }, {
        /** @static @property __name request name */
        __name: "liiteri-loging.ShowLoginWindowRequest",
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
