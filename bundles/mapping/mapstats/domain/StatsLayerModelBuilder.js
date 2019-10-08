/*
 * @class Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder
 * JSON-parsing for stats layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder', function (sandbox) {
    this.localization = Oskari.getLocalization("MapStats");
    this.sandbox = sandbox;
}, {
    _createCategoryMappingsFromConf : function(conf) {
        var map = {
            'categories': [],
            'categoriesHierarchy': {},
            'wmsNames': {},
            'filterProperties': {},
            'groupKeys': {},
            'hasVisualization' : {}
        };

        $.each(conf, function(name, confItem) {
            map.categories.push(name);
            map.categoriesHierarchy[name] = {};
            map.categoriesHierarchy[name]["child"] = confItem["child"];
            map.categoriesHierarchy[name]["type"] = confItem["type"];
            map.wmsNames[name] = confItem["wmsNames"];
            map.filterProperties[name] = confItem["filterProperties"];
            map.groupKeys[name] = confItem["groupKey"];
            map.hasVisualization[name] = confItem["hasVisualization"];
        });

        return map;
    },
    /**
     * parses any additional fields to model
     * @param {Oskari.mapframework.bundle.mapstats.domain.StatsLayer} layer partially populated layer
     * @param {Object} mapLayerJson JSON presentation of the layer
     * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {
        
        var me = this;
        layer.setWmsName(mapLayerJson.wmsName);
        //  Default field name  for to link map features in stats visualization
        if (mapLayerJson.visualizations) {
            layer.setFilterPropertyName(mapLayerJson.visualizations[0].filterproperty);
        }
        // Populate layer tools 
        var toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');

        // Statistics
        var tool1 = toolBuilder();
        var locTool = me.localization.tools.table_icon;
        tool1.setName("table_icon");
        tool1.setTitle(locTool.title);
        tool1.setTooltip(locTool.tooltip);
        //tool1.setIconCls("icon-restore");
        tool1.setCallback(function () {
            me.sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, layer]);
        });
        layer.addTool(tool1);

        var statsConf = {
            /* ARC GIS definitions */
            'KUNTA': { 'name': 'KUNTA', 'child': null, 'wmsNames': '25', 'filterProperties': 'KuntaNro', 'groupKey': 'municipality', 'type': 'administrative', 'hasVisualization': true },
            'SEUTUKUNTA': { 'name': 'SEUTUKUNTA', 'child': "KUNTA", 'wmsNames': '18', 'filterProperties': 'SkuntaNro', 'groupKey': 'sub_region', 'type': 'administrative', 'hasVisualization': true },
            'MAAKUNTA': { 'name': 'MAAKUNTA', 'child': "SEUTUKUNTA", 'wmsNames': '15', 'filterProperties': 'MkuntaNro', 'groupKey': 'region', 'type': 'administrative', 'hasVisualization' : true },
            'ELY_E': { 'name': 'ELY_E', 'child': "MAAKUNTA", 'wmsNames': '12', 'filterProperties': 'ELYNro', 'groupKey': 'ely_e', 'type': 'administrative', 'hasVisualization': true },
            'ELY_Y': { 'name': 'ELY_Y', 'child': "MAAKUNTA", 'wmsNames': '9', 'filterProperties': 'ELYyNro', 'groupKey': 'ely_y', 'type': 'administrative', 'hasVisualization': true },
            'ELY_L': { 'name': 'ELY_L', 'child': "MAAKUNTA", 'wmsNames': '6', 'filterProperties': 'ELYlNro', 'groupKey': 'ely_l', 'type': 'administrative', 'hasVisualization': true },
            'ADMINISTRATIVELAWAREA': { 'name': 'ADMINISTRATIVELAWAREA', 'child': "MAAKUNTA", 'wmsNames': '-1', 'filterProperties': '', 'groupKey': 'administrative_law_area', 'type': 'administrative' },
            'PALISKUNTA': { 'name': 'PALISKUNTA', 'child': null, 'wmsNames': '24', 'filterProperties': 'Plk_nro', 'groupKey': 'reindeer_herding_cooperative', 'type': 'administrative', 'hasVisualization': true },
            'FINLAND': { 'name': 'FINLAND', 'child': null, 'wmsNames': '-1', 'filterProperties': '', 'groupKey': 'finland', 'type': 'administrative' },
            'NEIGHBORHOODTYPE': { 'name': 'NEIGHBORHOODTYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'neighborhood_type', 'type': 'functional' },
            'NEIGHBORHOODCLASS': { 'name': 'NEIGHBORHOODCLASS', 'child': 'NEIGHBORHOODTYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'neighborhood_class', 'type': 'functional' },
            'PLANNEDAREATYPE': { 'name': 'PLANNEDAREATYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'planned_area_type', 'type': 'functional' },
            'PLANNEDAREACLASS': { 'name': 'PLANNEDAREACLASS', 'child': 'PLANNEDAREATYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'planned_area_class', 'type': 'functional' },
            'CITYRURALAREATYPE': { 'name': 'CITYRURALAREATYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'city_rural_area_type', 'type': 'functional' },
            'CITYRURALAREACLASS': { 'name': 'CITYRURALAREACLASS', 'child': 'CITYRURALAREATYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'city_rural_area_class', 'type': 'functional' },
            'URBANAREATYPE': { 'name': 'URBANAREATYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'urban_area_type', 'type': 'functional' },
            'URBANAREACLASS': { 'name': 'URBANAREACLASS', 'child': 'URBANAREATYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'urban_area_class', 'type': 'functional' },
            'CITYCENTRALTYPE': { 'name': 'CITYCENTRALTYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'city_central_type', 'type': 'functional' },
            'CITYCENTRALCLASS': { 'name': 'CITYCENTRALCLASS', 'child': 'CITYCENTRALTYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'city_central_class', 'type': 'functional' },
            'SHOPAREATYPE': { 'name': 'SHOPAREATYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'shop_area_type', 'type': 'functional' },
            'SHOPAREACLASS': { 'name': 'SHOPAREACLASS', 'child': 'SHOPAREATYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'shop_area_class', 'type': 'functional' },
            'LOCALDENSITYTYPE': { 'name': 'LOCALDENSITYTYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'locality_density_type', 'type': 'functional' },
            'LOCALDENSITYCLASS': { 'name': 'LOCALDENSITYCLASS', 'child': 'LOCALDENSITYTYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'locality_density_class', 'type': 'functional' },
            'LOCALITYRURALTYPE': { 'name': 'LOCALITYRURALTYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'locality_rural_type', 'type': 'functional' },
            'LOCALITYRURALCLASS': { 'name': 'LOCALITYRURALCLASS', 'child': 'LOCALITYRURALTYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'locality_rural_class', 'type': 'functional' },
            'URBANZONETYPE': { 'name': 'URBANZONETYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'urban_zone_type', 'type': 'functional' },
            'URBANZONECLASS': { 'name': 'URBANZONECLASS', 'child': 'URBANZONETYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'urban_zone_class', 'type': 'functional' },
            'LOCALSIZETYPE': { 'name': 'LOCALSIZETYPE', 'child': null, 'wmsNames': null, 'filterProperties': '', 'groupKey': 'locality_size_type', 'type': 'functional' },
            'LOCALSIZECLASS': { 'name': 'LOCALSIZECLASS', 'child': 'LOCALSIZETYPE', 'wmsNames': null, 'filterProperties': '', 'groupKey': 'locality_size_class', 'type': 'functional' }
        };


        // TODO: set this with actual data after structural changes
        // TODO: put it in configuration
        // in map layers have taken place.
        var categoryMappings = this._createCategoryMappingsFromConf(statsConf);
        layer.setCategoryMappings(categoryMappings);

        // Info
        if (layer.getMetadataIdentifier()) {
            var tool2 = toolBuilder();
            tool2.setName("info_icon");
            tool2.setIconCls("icon-info");
            tool2.setCallback(function () {
                // TODO make this work with statslayer...
                var rn = 'catalogue.ShowMetadataRequest';
                var uuid = layer.getMetadataIdentifier();
                var additionalUuids = [];
                var additionalUuidsCheck = {};
                additionalUuidsCheck[uuid] = true;
                var subLayers = layer.getSubLayers(),
                    s,
                    subUuid;
                if (subLayers && subLayers.length > 0) {
                    for (s = 0; s < subLayers.length; s++) {
                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (subUuid && subUuid !== "" && !additionalUuidsCheck[subUuid]) {
                            additionalUuidsCheck[subUuid] = true;
                            additionalUuids.push({
                                uuid: subUuid
                            });

                        }
                    }

                }

                me.sandbox.postRequestByName(rn, [{
                    uuid: uuid
                },
                    additionalUuids
                    ]);
            });
            layer.addTool(tool2);
        }

        // Diagram icon
        /*
        var tool2 = toolBuilder();
        var locTool = me.localization.tools.diagram_icon;
        tool2.setName("diagram_icon");
        tool2.setTitle(locTool.title);
        tool2.setTooltip(locTool.tooltip);
        tool2.setIconCls("layer-stats");
        tool2.setCallback(function() {
            alert('Näytä tiedot diagrammissa');
        });
        layer.addTool(tool2);
        */

        // Statistics mode
        /*
        var tool3 = toolBuilder();
        var locTool = this.localization.tools.statistics;
        tool3.setName("statistics");
        tool3.setTitle(locTool.title);
        tool3.setTooltip(locTool.tooltip);
        tool3.setCallback(function() {
            alert('Kirjaudu palveluun ja siirry tilastomoodiin');
        });
        layer.addTool(tool3);
        */
        //mapLayerJson.visualizations = [] -> populate styles
        /*

         var styleBuilder = Oskari.clazz
         .builder('Oskari.mapframework.domain.Style');

         var styleSpec;

         for ( var i = 0, ii = mapLayerJson.styles.length; i < ii; ++i) {
         styleSpec = mapLayerJson.styles[i];
         var style = styleBuilder();
         style.setName(styleSpec.identifier);
         style.setTitle(styleSpec.identifier);

         layer.addStyle(style);
         if (styleSpec.isDefault) {
         layer.selectStyle(styleSpec.identifier);
         break;
         }
         }

         layer.setFeatureInfoEnabled(true);
         if (mapLayerJson.tileMatrixSetData) {
         layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
         layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
         }
         */

    }
});