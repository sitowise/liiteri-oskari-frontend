/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.request.SetServicePackageRequest
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.request.SetServicePackageRequest',

    function (servicePackageId, restoreState) {
        this._servicePackageId = servicePackageId;
        this._restoreState = restoreState;
    }, {
        /** @static @property __name request name */
        __name: "liiteri-servicepackages.SetServicePackageRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        getServicePackageId: function () {
            return this._servicePackageId;
        },

        getRestoreState: function () {
            return this._restoreState;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
