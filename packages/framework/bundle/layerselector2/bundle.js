/**
 * @class Oskari.mapframework.bundle.layerselector2.LayerSelectorBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselector2.LayerSelectorBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/instance.js"
        }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/layerselector2/service/layerlist.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/Flyout.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/Tile.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/model/LayerGroup.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/view/Layer.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/view/LayersTab.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/view/PublishedLayersTab.js"
        },
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/request/ShowFilteredLayerListRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/request/ShowFilteredLayerListRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/request/AddLayerListFilterRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/request/AddLayerListFilterRequestHandler.js"
        },
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/request/AddTabRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/request/AddTabRequestHandler.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/framework/layerselector2/resources/css/style.css"
        }],

        "locales": [{
            "lang": "hy",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/hy.js"
        }, {
            "lang": "bg",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/bg.js"
        }, {
            "lang": "cs",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/cs.js"
        }, {
            "lang": "da",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/da.js"
        }, {
            "lang": "de",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/de.js"
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/en.js"
        }, {
            "lang": "es",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/es.js"
        }, {
            "lang": "et",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/et.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/fi.js"
        }, {
            "lang": "fr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/fr.js"
        }, {
            "lang": "ka",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/ka.js"
        }, {
            "lang": "el",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/el.js"
        }, {
            "lang": "hr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/hr.js"
        }, {
            "lang": "hu",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/hu.js"
        }, {
            "lang": "is",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/is.js"
        }, {
            "lang": "it",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/it.js"
        }, {
            "lang": "lv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/lv.js"
        }, {
            "lang": "nb",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/nb.js"
        }, {
            "lang": "nl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/nl.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/nn.js"
        }, {
            "lang": "nn",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/nn.js"
        }, {
            "lang": "pl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/pl.js"
        }, {
            "lang": "pt",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/pt.js"
        }, {
            "lang": "sr",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/sr.js"
        }, {
            "lang": "sl",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/sl.js"
        }, {
            "lang": "sk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/sk.js"
        }, {
            "lang": "sq",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/sq.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/sv.js"
        }, {
            "lang": "uk",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/layerselector2/resources/locale/uk.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "layerselector2",
            "Bundle-Name": "layerselector2",
            "Bundle-Author": [{
                "Name": "jjk",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2009",
                    "End": "2011"
                },
                "Copyleft": {
                    "License": {
                        "License-Name": "EUPL",
                        "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale": {
                "fi": {
                    "Name": " style-1",
                    "Title": " style-1"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari", "jquery"],
            "Import-Bundle": {}

            /**
             *
             */

        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"]

});

Oskari.bundle_manager.installBundleClass("layerselector2", "Oskari.mapframework.bundle.layerselector2.LayerSelectorBundle");
