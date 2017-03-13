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
        checkAutoLoadServicePackage: function () {
            var me = this;
            var autoLoadId = me.instance.autoLoad;
            if (autoLoadId != null) {
                var autoLoadPackage = me.instance.packagesById[autoLoadId];
                if (autoLoadPackage != null) {
                    me.service.raiseServicePackageSelectedEvent(autoLoadPackage, true);
                }
                me.instance.autoLoad = null;
            }
        },
		setServicePackage: function (id, restoreState) {
		    if ((id == null) || (this.instance.packagesById[id] == null)) {
		        return;
		    }
		    var servicePackage = this.instance.packagesById[id];
		    this.service.raiseServicePackageSelectedEvent(servicePackage);
            if (restoreState) {
                this.stateRestored = false;
                if (servicePackage.mapState != null) {
                    this.mapState = JSON.parse(servicePackage.mapState);
                    this.restoreServicePackageState();
                }
            }
		},
        restoreServicePackageState: function() {
            var me = this;
            var state = this.mapState;
            if (state == null) {
                return;
            }
            var sandbox = this.instance.sandbox;
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var dataAvailable = mapLayerService.isAllLayersLoaded();
            if (state.selectedLayers) {
                var previousSelectedLayers = sandbox.findAllSelectedMapLayers();
                for (var i = 0; i < previousSelectedLayers.length; i++) {
                    var itemLayer = previousSelectedLayers[i];
                    sandbox.postRequestByName('RemoveMapLayerRequest', [itemLayer.getId()]);
                }
                for (var i = 0; i < state.selectedLayers.length; i++) {
                    //add map layer
                    sandbox.postRequestByName('AddMapLayerRequest', [state.selectedLayers[i].id, true, state.selectedLayers[i].baseLayer]);
                    //set opacity
                    sandbox.postRequestByName('ChangeMapLayerOpacityRequest', [state.selectedLayers[i].id, state.selectedLayers[i].opacity]);
                    //add custom style
                    if (state.selectedLayers[i].customStyle && state.selectedLayers[i].style._name === "oskari_custom") {
                        sandbox.postRequestByName('ChangeMapLayerOwnStyleRequest', [state.selectedLayers[i].id, state.selectedLayers[i].customStyle]);
                    }
                    //change style
                    if (state.selectedLayers[i].style) {
                        sandbox.postRequestByName('ChangeMapLayerStyleRequest', [state.selectedLayers[i].id, state.selectedLayers[i].style._name]);
                    }
                    //set visibility
                    sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [state.selectedLayers[i].id, state.selectedLayers[i].visible]);
                }
            }
            //What statistics user had chosen and what thematic maps had he made from those
            if (state.statistics) {
                sandbox.postRequestByName('StatsGrid.SetStateRequest', [state.statistics.state]);
                if ((state.windows == null) || ((state.windows != null) && (state.windows.indexOf('statistics') >= 0))) {
                    sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, null]);
                } else if (state.statistics.state && state.statistics.state.layerId) {
                    var eventBuilder = sandbox.getEventBuilder('StatsGrid.StatsDataChangedEvent');
                    var layer = sandbox.findMapLayerFromAllAvailable(state.statistics.state.layerId);
                    if (eventBuilder && layer) {
                        var event = eventBuilder(layer, null);
                        window.setTimeout(function () {
                            sandbox.notifyAll(event);
                        }, 500);
                    }
                }
            } else {
                sandbox.postRequestByName('StatsGrid.SetStateRequest', []);
                sandbox.postRequestByName('StatsGrid.StatsGridRequest', [false, null]);
            }
            if (state.map) {
                sandbox.postRequestByName('MapMoveRequest', [state.map.x, state.map.y, state.map.zoomLevel]);
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
            this.stateRestored = dataAvailable;
        }
    }, {
        "protocol": ["Oskari.userinterface.View"],
        "extend": ["Oskari.userinterface.extension.DefaultView"]
    });