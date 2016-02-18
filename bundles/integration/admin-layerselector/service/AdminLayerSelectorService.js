/**
 * Bunch of methods dealing with user's indicators.
 * Handles fetching, creating, updating and deleting indicators.
 *
 * @class Oskari.statistics.bundle.statsgrid.UserIndicatorsService
 */
Oskari.clazz.define('Oskari.integration.bundle.admin-layerselector.View.service.AdminLayerSelectorService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (sandbox) {
        this.sandbox = sandbox;
        this.ajaxUrl = this.sandbox.getAjaxUrl();
        this.supportedLanguages = Oskari.getSupportedLanguages();
    }, {
        __name: "Liiteri.AdminLayerSelectorService",
        __qname: "Oskari.integration.bundle.admin-layerselector.View.service.AdminLayerSelectorService",

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
        getCapabilities: function (layerType, serviceUrl, successCb, errorCb) {
            var url, data, me = this;
            if (layerType == "arcgislayer") {
                url = this.ajaxUrl + 'action_route=GetArcgisMapServerConfiguration';
                data = { mapServerUrl: serviceUrl };

                var successCbWrapper = function (resp) {
                    if (typeof successCb === 'function') {
                        var mappedResp = me._mapMapServerConfigurationToCapabilities(resp);
                        successCb(mappedResp);
                    }
                };

                this._post(url, data, successCbWrapper, errorCb);
            }
            else if (layerType == "wms") {
                url = this.ajaxUrl + 'action_route=GetWSCapabilities';
                data = { wmsurl: serviceUrl };
                this._post(url, data, successCb, errorCb);
            }
        },
        _mapMapServerConfigurationToCapabilities: function (conf) {
            var i, layerConf, me = this;
            var result = {
                'groups': [],
                'type': 'grouplayer',
                'title': 'Layers',
                'layers' : [],
            };
            //var layers = [];
            var layersMap = {};
            var groupsMap = {};
            var leafLayers = [];

            for (i = 0; i < conf.layers.length; i ++) {
                layerConf = conf.layers[i];
                var layerObj = {
                    'realtime': false,
                    'isQueryable': false,
                    'type': 'arcgislayer',
                    'params': {},
                    'title': layerConf.name,
                    'wmsUrl': conf.serverUrl,
                    'refreshRate': 0,
                    'baseLayerId': -1,
                    'wmsName': layerConf.id,
                    'subtitle': me._getLanguageObject(''),
                    'name': me._getLanguageObject(layerConf.name),
                    'options': {},
                    'styles': [],
                    'opacity': 1000,
                    'minScale': layerConf.minScale,
                    'maxScale': layerConf.maxScale
                };

                if (!conf.supportsDynamicLayers)
                    layerObj.options['hasNoStyles'] = true;

                //layers.push(layerObj);
                layersMap[layerConf.id] = layerObj;

                if (layerConf.subLayerIds.length > 0) {
                    groupsMap[layerConf.id] = {
                        'groups': [],
                        'type': 'grouplayer',
                        'title': layerConf.name,
                        'layers': [layerObj],
                    };
                } else {
                    leafLayers.push(layerConf);
                }
            }

            for (i = 0; i < leafLayers.length; i++) {
                layerConf = leafLayers[i];

                if (layerConf.parentLayerId != -1) {
                    groupsMap[layerConf.parentLayerId].layers.push(layersMap[layerConf.id]);
                } else {
                    result.layers.push(layersMap[layerConf.id]);
                }
            }

            $.each(groupsMap, function (id, groupVal) {
                result.groups.push(groupVal);
            });

            //result.layers = layers;
            return result;
        },
        _getLanguageObject: function (value) {
            var result = {};
            $.each(this.supportedLanguages, function(idx, lang) {
                result[lang] = value;
            });
            return result;
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

            if (data) {
                params.data = data;
            }

            jQuery.ajax(params);
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
