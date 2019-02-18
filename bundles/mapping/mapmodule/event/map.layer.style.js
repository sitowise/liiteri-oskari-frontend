/**
 * @class Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent
 *
 * Triggers when a
 * Oskari.mapframework.request.common.ChangeMapLayerStyleRequest is received.
 * The event includes the maplayer with the modified style.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            mapLayer
     */

    function (mapLayer) {
        this._mapLayer = mapLayer;
    }, {
        /** @static @property __name event name */
        __name: "AfterChangeMapLayerStyleEvent",
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getMapLayer
         * @return
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         * changed maplayer
         */
        getMapLayer: function () {
            return this._mapLayer;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });