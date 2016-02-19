/**
 * @class Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer
 *
 * MapLayer of type Analysis
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /* Layer Type */
    this._layerType = "ANALYSIS";
    this._metaType = "ANALYSIS";
}, {
	/* Layer type specific functions */

    /**
     * Sets the WPS url where the layer images are fetched from
     *
     * @method setWpsUrl
     * @param {String} url
     */
    setWpsUrl: function(url) {
        this._wpsUrl = url;
    },

    /**
     * Gets the WPS url
     *
     * @method getWpsUrl
     * @return {String} the url for wps service
     */
    getWpsUrl: function() {
        return this._wpsUrl;
    },

    /**
     * @method setWpsName
     * @param {String} wpsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWpsName: function(wpsName) {
        this._wpsName = wpsName;
    },

    /**
     * @method getWpsName
     * @return {String} wpsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWpsName : function() {
        return this._wpsName;
    },

    /**
     * @method setWpsLayerId
     * @param {String} wpsLayerId used to identify the right analysis result
     */
    setWpsLayerId: function(wpsLayerId) {
        this._wpsLayerId = wpsLayerId;
    },

    /**
     * @method getWpsLayerId
     * @return {String}
     */
    getWpsLayerId : function() {
        return this._wpsLayerId;
    },
    /**
     * @method setOverrideSld
     * @param {String} override_sld override sld style name in geoserver
     */
    setOverrideSld: function (override_sld) {
        this._override_sld = override_sld;
    },
    /**
     * @method  getOverrideSld override sld style name in geoserver
     * @return {String}
     */
    getOverrideSld: function () {
        return this._override_sld;
    }

}, {
    "extend": ["Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer"]
});