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
        this.stateRestored = true;
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
		    var me = this;
		    if ((id == null) || (me.instance.packagesById[id] == null)) {
		        return;
		    }
		    var servicePackage = me.instance.packagesById[id];
		    me.service.raiseServicePackageSelectedEvent(servicePackage);
            if (restoreState) {
                this.stateRestored = false;
                if (servicePackage.mapState != null) {
                    this.restoreServicePackageState(JSON.parse(servicePackage.mapState));
                }
            }
		},
        restoreServicePackageState: function(state) {
            var sandbox = this.instance.sandbox;
            var selectors = {
                statistics: '.statsgrid-100',
                mapLegend: '#oskari-flyout-maplegend',
                layerSelector: '#oskari-flyout-layerselector'
            };
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
                if ((state.windows == null) || ((state.windows != null) && (state.windows.indexOf(selectors.statistics) >= 0))) {
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

            var zIndexOffsets = {};
            zIndexOffsets[selectors.statistics] = 1;
            zIndexOffsets[selectors.mapLegend] = 2;
            zIndexOffsets[selectors.layerSelector] = 3;
            var flyoutBaseZIndex = jQuery('.oskari-flyout, '+selectors.statistics).get().reduce(function(maxZIndex, flyout) {
                var flyoutZIndex = Number(jQuery(flyout).css('z-index'));
                return (jQuery.isNumeric(flyoutZIndex)) ? Math.max(maxZIndex, flyoutZIndex) : maxZIndex;
            }, 0)+1;
            if (state.windows != null) {
                var maxZIndexOffset = state.windows.reduce(function(maxZIndexOffset, id) {
                    var zIndexOffset = zIndexOffsets[id];
                    return (jQuery.isNumeric(zIndexOffset)) ? Math.max(maxZIndexOffset, zIndexOffset) : maxZIndexOffset;
                }, 0);
                state.windows.forEach(function(selector, index) {
                    var flyout = jQuery(selector);
                    if (flyout.length === 0) {
                        return;
                    }
                    flyout.removeClass('oskari-attached');
                    flyout.removeClass('oskari-closed');
                    flyout.addClass('oskari-detached');
                    var zIndexOffset = (jQuery.isNumeric(zIndexOffsets[selector])) ? zIndexOffsets[selector] : 0;
                    var baseWidth = parseInt(flyout.css('min-width'));
                    if (jQuery.isNumeric(baseWidth)) {
                        baseWidth = flyout.width();
                    }
                    flyout.css('z-index', flyoutBaseZIndex+zIndexOffset);
                    flyout.width(baseWidth+(maxZIndexOffset-zIndexOffset)*80);
                });
            }
            this.stateRestored = dataAvailable;
        }
    }, {
        "protocol": ["Oskari.userinterface.View"],
        "extend": ["Oskari.userinterface.extension.DefaultView"]
    });