/**
 * @class Oskari.mapframework.bundle.mapmodule.event.AfterAddMarkerEvent
 *
 * Event is sent after a map marker is added
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.AfterAddMarkerEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (data, id) {
        this._data = data;
        this._id = id;
    }, {
        __name: 'AfterAddMarkerEvent',

        getName: function () {
            return this.__name;
        },

        getData: function () {
            return this._data;
        },

        getID: function () {
            return this._id;
        },
        /**
         * Serialization for RPC
         * @return {Object} object has key id which has the marker id of the clicked
         */
        getParams: function () {
            return {
                id: this.getID()
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
