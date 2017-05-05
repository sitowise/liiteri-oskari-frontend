/**
 * @class Oskari.mapframework.bundle.liiteri-servicepackages.view.ServicePackageView
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageView',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackagesInstance} instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.service = instance.service;
        this.servicePackage = null;
        this.mapState = null;
        this.stateRestored = true;
        this.flyoutBaseWidth = null;
        this.flyouts = {
            statistics: {
                selector: null,
                zIndexOffset: 0
            },
            mapLegends: {
                selector: '#oskari-flyout-maplegend',
                zIndexOffset: 1
            },
            layerSelector: {
                selector: '#oskari-flyout-layerselector',
                zIndexOffset: 2
            }
        };
    }, {
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-servicepackages.view.ServicePackageView';
        },
        startPlugin: function () {
        },
        stopPlugin: function () {
        },
        containsLayer: function(item, id) {
            if (id == null) {
                return false;
            }
            var numSubThemes = (item.themes != null) ? item.themes.length : 0;
            for (var i=0; i<numSubThemes; i++) {
                if (this.containsLayer(item.themes[i], id)) {
                    return true;
                }
            }
            var numElements = (item.elements != null) ? item.elements.length : 0;
            for (var j=0; j<numElements; j++) {
                if (item.elements[j].id === id) {
                    return true;
                }
            }
            return false;
        },
        containsStatistics: function(item) {
            var numSubThemes = (item.themes != null) ? item.themes.length : 0;
            for (var i=0; i<numSubThemes; i++) {
                if (this.containsStatistics(item.themes[i])) {
                    return true;
                }
            }
            var numElements = (item.elements != null) ? item.elements.length : 0;
            for (var j=0; j<numElements; j++) {
                if (item.elements[j].type === 'statistic') {
                    return true;
                }
            }
            return false;
        },
        checkAutoLoadServicePackage: function () {
            var me = this;
            var autoLoadId = me.instance.autoLoad;
            if (autoLoadId != null) {
                var autoLoadPackage = me.instance.packagesById[autoLoadId];
                if (autoLoadPackage != null) {
                    me.setServicePackage(autoLoadId);
                }
                me.instance.autoLoad = null;
            }
        },
		setServicePackage: function (id, restoreState) {
		    if ((id == null) || (this.instance.packagesById[id] == null)) {
		        return;
		    }
		    var servicePackage = this.instance.packagesById[id];
            var reset = ((this.servicePackage == null) || (this.servicePackage.id != id));
            this.servicePackage = servicePackage;
            this.stateRestored = false;
            if (servicePackage.mapState != null) {
                this.mapState = JSON.parse(servicePackage.mapState);
            }
            this.restoreServicePackage(reset, restoreState == null ? true : restoreState);
		},
        _sendRequest: function(name, params) {
            var reqBuilder = this.instance.sandbox.getRequestBuilder(name);
            if (reqBuilder) {
                var request = reqBuilder.apply(this.instance.sandbox, params);
                this.instance.sandbox.request(this.instance, request);
            }
        },
        restoreServicePackage: function(reset, restoreState) {
            var me = this;
            var sandbox = this.instance.sandbox;
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var dataAvailable = mapLayerService.isAllLayersLoaded();
            if (dataAvailable) {
                this.service.raiseServicePackageSelectedEvent(this.servicePackage);
            }
            if ((restoreState != null)&&(!restoreState)) {
                return;
            }
            var state = this.mapState;
            if (state == null) {
                return;
            }
            var statsLoaded = false;
            if (state.selectedLayers) {
                var previousSelectedLayers = sandbox.findAllSelectedMapLayers();
                for (var j = 0; j < previousSelectedLayers.length; j++) {
                    var previousSelectedLayer = previousSelectedLayers[j];
                    var layerId = previousSelectedLayer.getId();
                    if (previousSelectedLayers[j].getLayerType() === 'stats') {
                        statsLoaded = true;
                        continue;
                    }
                    if ((layerId != null)&&(!me.containsLayer(me.servicePackage, layerId))) {
                        me._sendRequest('RemoveMapLayerRequest', [layerId]);
                    }
                }
                for (var i = 0; i < state.selectedLayers.length; i++) {
                    var id = state.selectedLayers[i].id;
                    if ((id == null)||((state.selectedLayers[i].type !== 'stats')&&(!me.containsLayer(me.servicePackage, id)))) {
                        continue;
                    }
                    //add map layer
                    me._sendRequest('AddMapLayerRequest', [id, true, state.selectedLayers[i].baseLayer]);
                    //set opacity
                    me._sendRequest('ChangeMapLayerOpacityRequest', [id, state.selectedLayers[i].opacity]);
                    //add custom style
                    if (state.selectedLayers[i].customStyle && state.selectedLayers[i].style._name === "oskari_custom") {
                        me._sendRequest('ChangeMapLayerOwnStyleRequest', [id, state.selectedLayers[i].customStyle]);
                    }
                    //change style
                    if (state.selectedLayers[i].style) {
                        me._sendRequest('ChangeMapLayerStyleRequest', [id, state.selectedLayers[i].style._name]);
                    }
                    //set visibility
                    me._sendRequest('MapModulePlugin.MapLayerVisibilityRequest', [id, state.selectedLayers[i].visible]);
                }
            }
            if ((!statsLoaded)||(reset)) {
                me._sendRequest('StatsGrid.SetStateRequest', []);
                me._sendRequest('StatsGrid.StatsGridRequest', [false, null]);
            }
            if ((state.statistics != null)&&(me.containsStatistics(me.servicePackage))) {
                if ((state.windows == null) || (state.windows.indexOf('statistics') >= 0)) {
                    var layer = sandbox.findMapLayerFromAllAvailable(state.statistics.state.layerId);
                    if ((!statsLoaded)||(reset)) {
                        me._sendRequest('StatsGrid.SetStateRequest', [state.statistics.state]);
                        me._sendRequest('StatsGrid.StatsGridRequest', [true, layer]);
                    }
                }
            }
            if (state.map) {
                me._sendRequest('MapMoveRequest', [state.map.x, state.map.y, state.map.zoomLevel]);
            }
            var flyoutBaseZIndex = jQuery('.oskari-flyout').get().reduce(function(maxZIndex, element) {
                var flyout = jQuery(element);
                var flyoutZIndex = Number(flyout.css('z-index'));
                flyout.removeClass('oskari-attached');
                flyout.removeClass('oskari-detached');
                flyout.addClass('oskari-closed');
                return (jQuery.isNumeric(flyoutZIndex)) ? Math.max(maxZIndex, flyoutZIndex) : maxZIndex;
            }, 0)+1;
            if (state.windows != null) {
                state.windows.sort(function(a,b) {
                    if ((me.flyouts[a] == null)||(me.flyouts[b] == null)) {
                        return 0;
                    }
                    return me.flyouts[a].zIndexOffset-me.flyouts[b].zIndexOffset;
                });
                var flyoutCount = 0;
                state.windows.forEach(function(flyoutType, index) {
                    var selector = me.flyouts[flyoutType].selector;
                    if (selector == null) {
                        return;
                    }
                    var flyout = jQuery('div.oskari-flyout'+selector);
                    if (flyout.length === 0) {
                        return;
                    }
                    var zIndexOffset = me.flyouts[flyoutType].zIndexOffset;
                    flyout.removeClass('oskari-attached');
                    flyout.removeClass('oskari-closed');
                    flyout.addClass('oskari-detached');
                    if (me.flyoutBaseWidth == null) {
                        me.flyoutBaseWidth = flyout.width();
                    }
                    if ((flyoutCount === 0)&&(index === 0)&&(state.windows.length > 1)) {
                        flyout.width(me.flyoutBaseWidth+50);
                    }
                    flyout.css('z-index', flyoutBaseZIndex+zIndexOffset);
                    flyoutCount++;
                });
            }
            me.stateRestored = dataAvailable;
        }
    }, {
        "protocol": ["Oskari.userinterface.View"],
        "extend": ["Oskari.userinterface.extension.DefaultView"]
    });