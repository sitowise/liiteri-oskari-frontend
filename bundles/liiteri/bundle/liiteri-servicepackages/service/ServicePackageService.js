/**
 * Bunch of methods dealing with user's indicators.
 * Handles fetching, creating, updating and deleting indicators.
 *
 * @class Oskari.statistics.bundle.statsgrid.UserIndicatorsService
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.service.ServicePackageService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.ajaxUrl = this.sandbox.getAjaxUrl();
    }, {
        __name: "Liiteri.ServicePackageService",
        __qname: "Oskari.liiteri.bundle.liiteri-servicepackages.service.ServicePackageService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () { },
        raiseServicePackageSelectedEvent: function (servicePackageJson, restoreState) {
            var themes = [];
            var servicePackageId = 0;

            if (servicePackageJson) {
                if (servicePackageJson.themes && servicePackageJson.themes.length > 0) {
                    themes = servicePackageJson.themes;
                    servicePackageId = servicePackageJson.id;
                }

                if (restoreState && servicePackageJson.mapState) {
                    this._restoreServicePackageState(JSON.parse(servicePackageJson.mapState));
                }
            }

            var eventBuilder = this.sandbox.getEventBuilder('liiteri-servicepackages.ServicePackageSelectedEvent');
            var event = eventBuilder(themes, servicePackageId);

            this.sandbox.notifyAll(event);
        },
        getUserThemes: function(successCb, errorCb) {
            var successCbWrapper = function (data) {
                if (!(typeof successCb === 'function')) {
                    return;
                }

                var result = {};

                if (data != null && data.groupings != null) {
                    var themesDataArray = data.groupings;

                    for (var j = 0; j < themesDataArray.length; j++) {
                        if (themesDataArray[j].type == 'map_layers' && themesDataArray[j].elements) {
                            var groupName = themesDataArray[j].name;
                            var groupArray = [];                            

                            for (var k = 0; k < themesDataArray[j].elements.length; k++) {
                                groupArray.push(themesDataArray[j].elements[k].id);
                            }

                            result[groupName] = groupArray;
                        }
                    }
                }

                successCb(result);
            };
            this.getGroupings(successCbWrapper, errorCb);
        },
        getGroupings: function (successCb, errorCb) {
            var url = this.ajaxUrl + 'action_route=GetPermittedGroupings';
            this._get(url, successCb, errorCb);
        },
        getServicePackages: function (successCb, errorCb) {
            var successWrapper = function (response) {
                var filteredResponse = [];
                var packages = response.groupings;
                if (typeof packages !== 'undefined' && packages !== null && packages.length > 0) {
                    for (var i = 0; i < packages.length; ++i) {
                        if (packages[i].mainType !== 'package')
                            continue;

                        filteredResponse.push(packages[i]);
                    }
                }
                if (typeof successCb === 'function') {
                    successCb(filteredResponse);
                }
            }
            this.getGroupings(successWrapper, errorCb);
        },

        _restoreServicePackageState: function (state) {
            var sandbox = this.sandbox;

            if (state.selectedLayers) {

                var previousSelectedLayers = sandbox.findAllSelectedMapLayers();

                for (var i = 0; i < previousSelectedLayers.length; i++) {
                    var itemLayer = previousSelectedLayers[i];
                    sandbox.postRequestByName('RemoveMapLayerRequest', [itemLayer.getId()]);
                }

                for (var i = 0; i < state.selectedLayers.length; i++) {
                    //add map layer
                    sandbox.postRequestByName('AddMapLayerRequest', [state.selectedLayers[i].id, false, state.selectedLayers[i].baseLayer]);
                    //set opacity
                    sandbox.postRequestByName('ChangeMapLayerOpacityRequest', [state.selectedLayers[i].id, state.selectedLayers[i].opacity]);
                    //add custom style
                    if (state.selectedLayers[i].customStyle) {
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
                if (state.statsVisibility == true) {
                    sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, null]);
                } else if (state.statistics.state && state.statistics.state.layerId) {
                    var eventBuilder = sandbox.getEventBuilder('StatsGrid.SotkadataChangedEvent');
                    var layer = sandbox.findMapLayerFromAllAvailable(state.statistics.state.layerId);
                    if (eventBuilder && layer) {
                        var event = eventBuilder(layer, null);
                        window.setTimeout(function () {
                            sandbox.notifyAll(event);
                        }, 500);
                    }
                }
            }

            //Current position on the screen (zoom and coordinates)
            if (state.map) {
                sandbox.postRequestByName('MapMoveRequest', [state.map.x, state.map.y, state.map.zoomLevel]);
            }
        },

        _get: function (url, successCb, errorCb) {
            this._ajax("GET", url, successCb, errorCb);
        },
        _post: function (url, data, successCb, errorCb) {
            this._ajax("POST", url, successCb, errorCb, data);
        },
        _ajax: function (method, url, successCb, errorCb, data) {
            var params = {
                url: url,
                type: method,
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                },
                success: function (response) {
                    if (typeof successCb === 'function') {
                        successCb(response);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (typeof errorCb === 'function' && jqXHR.status !== 0) {
                        errorCb(jqXHR, textStatus);
                    }
                }
            };

            if(method === "GET") {
                params.cache = false;
            }
            
            if (data) {
                params.data = data;
            }

            jQuery.ajax(params);
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
