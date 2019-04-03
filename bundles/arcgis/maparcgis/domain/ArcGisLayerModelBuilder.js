/*
 * @class Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayerModelBuilder
 * JSON-parsing for arcgis layer
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayerModelBuilder', function (sandbox) {
    this.localization = Oskari.getLocalization('MapWfs2');
    this.sandbox = sandbox;
}, {
    /**
     * parses any additional fields to model
     * @param {Oskari.arcgis.bundle.arcgis.domain.StatsLayer} layer partially populated layer
     * @param {Object} mapLayerJson JSON presentation of the layer
     * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {
        var me = this;
        var toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');
        if (layer.isLayerOfType("arcgis")) {
            if (!mapLayerJson.options["hasNoStyles"]) {
                var locOwnStyle = this.localization['own-style'];
                var toolOwnStyle = toolBuilder();
                toolOwnStyle.setName("ownStyle");
                toolOwnStyle.setIconCls('show-own-style-tool');
                toolOwnStyle.setTitle(locOwnStyle);
                toolOwnStyle.setTooltip(locOwnStyle);
                toolOwnStyle.setCallback(function () {
                    me.sandbox.postRequestByName('ShowOwnStyleRequest', [layer.getId()]);
                });
                layer.addTool(toolOwnStyle);
            }            
        }

        // create a default style
        var locDefaultStyle = this.localization['default-style'];
        var defaultStyle = Oskari.clazz.create('Oskari.mapframework.domain.Style');
        defaultStyle.setName("default");
        defaultStyle.setTitle(locDefaultStyle);
        defaultStyle.setLegend("");

        // check if default style comes and give localization for it if found
        if (mapLayerJson.styles && mapLayerJson.styles.length > 0) {
            for (var i = 0; i < mapLayerJson.styles.length; i++) {
                if (mapLayerJson.styles[i].name === "default") {
                    mapLayerJson.styles[i].title = locDefaultStyle;
                    break;
                }
            }
        }

        // default style for WFS is given as last parameter
        maplayerService.populateStyles(layer, mapLayerJson, defaultStyle);

        layer.setWmsName(mapLayerJson.wmsName);
        layer.setLegendImage(me.sandbox.getAjaxUrl() + "action_route=GetArcGisLegend&LAYERID=" + layer.getId());
//        layer.setLayerUrl(mapLayerJson.wmsUrl);
    }
});