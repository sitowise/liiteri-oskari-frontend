/*
 * @class Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder
 * JSON-parsing for analysis layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder', function(sandbox) {
	this.localization = Oskari.getLocalization("MapAnalysis");
    this.sandbox = sandbox;
    this.wfsBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',sandbox);
}, {
	/**
	 * parses any additional fields to model
	 * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer partially populated layer
	 * @param {Object} mapLayerJson JSON presentation of the layer
	 * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
	 */
	parseLayerData : function(layer, mapLayerJson, maplayerService) {
        var me = this;
        var loclayer = me.localization.layer;

        // call parent parseLayerData
        this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
		if(mapLayerJson.fields){
			layer.setFields(mapLayerJson.fields);
		}
		if(mapLayerJson.locales){
            layer.setLocales(mapLayerJson.locales);
        }
		if(mapLayerJson.name){
			layer.setName(mapLayerJson.name);
		}
		if (mapLayerJson.wpsName) {
			layer.setWpsName(mapLayerJson.wpsName);
		}
		if (mapLayerJson.wpsUrl) {
			layer.setWpsUrl(mapLayerJson.wpsUrl);
		}
		if (mapLayerJson.wpsLayerId) {
			layer.setWpsLayerId(mapLayerJson.wpsLayerId);
		}
		if (mapLayerJson.wps_params) {
			layer.setWpsLayerParams(mapLayerJson.wps_params);
		}
        if (mapLayerJson.override_sld) {
            layer.setOverrideSld(mapLayerJson.override_sld);
        }
		if (loclayer.organization) {
		layer.setOrganizationName(loclayer.organization);
		}
		if (loclayer.inspire) {
        layer.setInspireName(loclayer.inspire);
        }
	}
});
