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
            var state = {};

            if (servicePackageJson) {
                if (servicePackageJson.themes && servicePackageJson.themes.length > 0) {
                    themes = servicePackageJson.themes;
                    servicePackageId = servicePackageJson.id;
                }

                if (restoreState) {
                    if (servicePackageJson.mapState != null) {
                        state = JSON.parse(servicePackageJson.mapState);
                    }
                    this._restoreServicePackageState(state);
                }
            }

            var eventBuilder = this.sandbox.getEventBuilder('liiteri-servicepackages.ServicePackageSelectedEvent');
            var event = eventBuilder(themes, state, servicePackageId);

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

        _sendRequest: function(name, params) {
            var reqBuilder = this.sandbox.getRequestBuilder(name);
            if (reqBuilder) {
                var request = reqBuilder.apply(this.sandbox, params);
                this.sandbox.request(this.instance, request);
            }
        },

        _restoreServicePackageState: function (state) {
            var sandbox = this.sandbox;

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
