/**
 *
 * A service to act as a WMTS Layer Source
 *
 * Requires services from MapLayerService (addLayer,removeLayer) (Will create
 * own domain objects, though)
 *
 */

Oskari.clazz.define('Oskari.mapframework.wmts.service.WMTSLayerService', function (mapLayerService) {
    this.mapLayerService = mapLayerService;
    this.capabilities = {};
    //this.capabilitiesClazz = Oskari.clazz.create("Oskari.openlayers.Patch.WMTSCapabilities_v1_0_0");
}, {
    /**
     * TEmp
     */
    setCapabilities: function (name, caps) {
        this.capabilities[name] = caps;

    },

    /**
     * Temp
     */
    getCapabilities: function (name) {
        return this.capabilities[name];
    },

    /**
     * This is a temporary solution actual capabilities to be
     * read in backend
     *
     */
    readWMTSCapabilites: function (wmtsName, capsPath, matrixSet, cb, conf) {

        var me = this;
        var format = new OpenLayers.Format.WMTSCapabilities();

        var httpGetConf = OpenLayers.Util.extend({
            url: capsPath,
            params: {
                SERVICE: "WMTS",
                VERSION: "1.0.0",
                REQUEST: "GetCapabilities"
            },
            success: function (request) {
                var doc = request.responseXML;
                if (!doc || !doc.documentElement) {
                    doc = request.responseText;
                }
                var caps = format.read(doc);

                me.setCapabilities(wmtsName, caps);
                var layersCreated = me.parseCapabilitiesToLayers(wmtsName, caps, matrixSet);
                if (cb) {
                    cb.apply(this, [layersCreated, caps]);
                }

            },
            failure: function () {
                alert("Trouble getting capabilities doc");
                OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
            }
        }, conf || {});

//        console.log(httpGetConf);

        OpenLayers.Request.GET(httpGetConf);

    },
    /**
     * This is a temporary solution actual capabilities to be
     * read in backend
     *
     */
    parseCapabilitiesToLayers: function (wmtsName, caps, matrixSet) {


        var me = this;
        var mapLayerService = this.mapLayerService;
        var getTileUrl = null;
        if (caps.operationsMetadata.GetTile.dcp.http.getArray) {
            getTileUrl = caps.operationsMetadata.GetTile.dcp.http.getArray;
        } else {
            getTileUrl = caps.operationsMetadata.GetTile.dcp.http.get;
        }
        var capsLayers = caps.contents.layers;
        var contents = caps.contents;
        var ms = contents.tileMatrixSets[matrixSet];
        var layersCreated = [],
            n,
            spec,
            mapLayerId,
            mapLayerName,
            mapLayerJson,
            layer,
            styleBuilder,
            styleSpec,
            style,
            i,
            ii;

        for (n = 0; n < capsLayers.length; n++) {

            spec = capsLayers[n];

            mapLayerId = spec.identifier;
            mapLayerName = spec.identifier;
            /*
             * hack
             */
            mapLayerJson = {
                wmtsName: mapLayerId,
                descriptionLink: "",
                orgName: wmtsName,
                type: "wmtslayer",
                legendImage: "",
                formats: {
                    value: "text/html"
                },
                isQueryable: true,
                //minScale : 4 * 4 * 4 * 4 * 40000,
                style: "",
                dataUrl: "",

                name: mapLayerId,
                opacity: 100,
                inspire: wmtsName, //"WMTS",
                maxScale: 1
            };

            layer = Oskari.clazz.create('Oskari.mapframework.wmts.domain.WmtsLayer');

            layer.setAsNormalLayer();
            layer.setId(mapLayerId.split('.').join('_'));
            layer.setName(mapLayerJson.name);
            layer.setWmtsName(mapLayerJson.wmtsName);
            layer.setOpacity(mapLayerJson.opacity);
            layer.setMaxScale(mapLayerJson.maxScale);
            layer.setMinScale(mapLayerJson.minScale);
            layer.setDescription(mapLayerJson.info);
            layer.setDataUrl(mapLayerJson.dataUrl);
            layer.setOrganizationName(mapLayerJson.orgName);
            layer.setInspireName(mapLayerJson.inspire);
            layer.setWmtsMatrixSet(ms);
            layer.setWmtsLayerDef(spec);
            layer.setVisible(true);

            layer.addWmtsUrl(getTileUrl);

            styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

            for (i = 0, ii = spec.styles.length; i < ii; ++i) {
                styleSpec = spec.styles[i];
                style = styleBuilder();
                style.setName(styleSpec.identifier);
                style.setTitle(styleSpec.identifier);

                layer.addStyle(style);
                if (styleSpec.isDefault) {
                    layer.selectStyle(styleSpec.identifier);
                    break;
                }
            }

            mapLayerService.addLayer(layer, false);
            layersCreated.push(layer);

        }

        return layersCreated;

    }
});