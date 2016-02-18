/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSFeaturesEvent
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSLoadingFinishedEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer}
 *            layer
 */
function(layer) {
    this._layer = layer;
}, {
    /** @static @property __name event name */
    __name: "WFSLoadingFinishedEvent",

    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getLayer
     * @return {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    getLayer : function() {
        return this._layer;
    },
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
