/**
 * @class Oskari.mapframework.event.common.AfterMapLayerAddEvent
 *
 * Notifies application bundles that a map layer has been added to selected
 * layers.
 * Triggers on Oskari.mapframework.request.common.AddMapLayerRequest
 * Opposite of Oskari.mapframework.event.common.AfterMapLayerRemoveEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapLayerAddEvent',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            mapLayer added map layer (matching one in MapLayerService)
     */

    function (mapLayer) {
        this._creator = null;
        this._mapLayer = mapLayer;
    }, {
        /** @static @property __name event name */
        __name: "AfterMapLayerAddEvent",

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
         *            added map layer (matching one in MapLayerService)
         */
        getMapLayer: function () {
            return this._mapLayer;
        },
        /**
         * @method getKeepLayersOrder
         * @return {Boolean} boolean true if we should keep the layer order
         */
        getKeepLayersOrder: function () {
            return true;
        },
        /**
         * @method isBasemap
         * @return {Boolean} boolean true if this is a basemap
         */
        isBasemap: function () {
            return this.getMapLayer().isBaseLayer();
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });