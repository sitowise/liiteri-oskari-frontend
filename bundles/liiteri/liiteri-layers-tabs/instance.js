/**
 *
 * @class Oskari.liiteri.bundle.liiteri-layers-tabs.LiiteriLayersTabsBundleInstance
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-layers-tabs.LiiteriLayersTabsBundleInstance',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.layersTabs = [];
        this.servicePackageTab = null;
        this.servicePackage = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'liiteri-layers-tabs',
        /**
         * Module protocol method
         *
         * @method getName
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *     JSON object for complete data depending on localization
         *     structure and if parameter key is given
         */
        getLocalization: function (key) {
            //"use strict";
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            //"use strict";
            return this.sandbox;
        },

        eventHandlers: {
            'MapLayerEvent': function (event) {
                var me = this;
                me._populateLayersFromServicePackage();
            },
            'liiteri-servicepackages.ServicePackageSelectedEvent': function (event) {
                var me = this;
                var cb = function (layers) {
                    me._selectLayers(layers);
                };
                me._populateLayersFromServicePackage(event.getThemes(), cb);
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this._unselectLayer(event.getMapLayer());
            }
        },
        _selectLayers: function (layers) {
            var me = this;
            for (var idx in layers) {
                var layerItem = layers[idx].layer;
                me.sandbox.postRequestByName('AddMapLayerRequest', [layerItem.getId(), false, layerItem.isBaseLayer(), false, layers[idx].groupName]);
            }
        },
        /**
         * DefaultExtension method for doing stuff after the bundle has started.
         *
         * @method start
         */
        start: function () {
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                localization = me.getLocalization('filter'),
                request;

            me.sandbox = sandbox;
            /* Register to sandbox in order to be able to listen to events */
            sandbox.register(me);

            //Register event handlers
            for (var eventHandler in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(eventHandler)) {
                    sandbox.registerForEventByName(me, eventHandler);
                }
            }

            //Add service package tab TODO: now by default, maybe later based on config
            //if (me.conf && me.conf.showServicePackage === true) {
            me.servicePackageTab = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-layers-tabs.view.LayersTab", me, localization.servicePackage);
            me.servicePackageTab.servicePackage = true;
            me.layersTabs.push(me.servicePackageTab);
            //}

            //Add tabs to the hierarchical-layerlist flyout view
            for (var layersTab of me.layersTabs) {
                request = me.sandbox.getRequestBuilder('hierarchical-layerlist.AddTabRequest')(layersTab, false);
                sandbox.request(me, request);
            }
        },

        _populateLayersFromServicePackage: function (themesDataArray, cb) {
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request;

            var themesData = themesDataArray;
            if ((themesData == null) && (me.servicePackage != null)) {
                themesData = me.servicePackage.themesData;
            }
            var callback = cb;
            if ((callback == null) && (me.servicePackage != null)) {
                callback = me.servicePackage.callback;
            }
            if (themesData) {
                var groupList = [];
                var layers = [];
                var mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                me.servicePackage = {
                    themesData: themesData,
                    callback: callback,
                    dataAvailable: false
                };

                if (!mapLayerService.isAllLayersLoaded()) {
                    return;
                }
                me.servicePackage.dataAvailable = true;
                for (var j = 0; j < themesData.length; j++) {
                    if (themesData[j].type === 'map_layers' && themesData[j].elements) {

                        var group = Oskari.clazz.create("Oskari.liiteri.bundle.liiteri-layers-tabs.model.LayerGroup", themesData[j].name);

                        for (var k = 0; k < themesData[j].elements.length; k++) {
                            var layerData = themesData[j].elements[k];
                            var layer = me.sandbox.findMapLayerFromAllAvailable(layerData.id);
                            if (layer) {
                                group.addLayer(layer);
                                if (layerData.status === 'drawn')
                                    layers.push({ "layer": layer, "groupName": themesData[j].name });
                            }
                        }
                        groupList.push(group);
                    }
                }
                me.servicePackageTab.showLayerGroups(groupList);

                request = me.sandbox.getRequestBuilder('hierarchical-layerlist.SelectTabRequest')(me.servicePackageTab);
                sandbox.request(me, request);

                if (callback) {
                    callback(layers);
                }
            }
        },

        _unselectLayer: function (layer) {
            var me = this;
            var layerId = layer.getId();

            for (var i = 0; i < me.layersTabs.length; i++) {
                var tab = me.layersTabs[i];
                var tabPanel = tab.getTabPanel();

                var layerToUnselect = tabPanel.getContainer().find('[layer_id="' + layerId + '"]');
                if (layerToUnselect) {
                    for (var i = 0; i < layerToUnselect.length; i++) {
                        layerToUnselect.find('input').prop('checked', false);
                    }
                }
            }
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });