/**
 * Getting tokens for arc gis server
 *
 * @class Oskari.arcgis.bundle.maparcgis.service.ArcGisService
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.service.ArcGisService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance._sandbox;
        this.cache = {};
        this.cacheSize = 0;
        this.urls = {
            "gettoken": this.sandbox.getAjaxUrl() + "action_route=GetArcgisToken",
        }
    }, {
        __name: "arcgis.ArcGisService",
        __qname: "Oskari.arcgis.bundle.maparcgis.service.ArcGisService",

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
        _getTokenFromServer: function (serverUrl) {
            var tokenUrl = this.urls.gettoken;
            var data = {
                'serverUrl' : serverUrl
            };

            var result = {};
            var cb = function(response) {
                result.token = response.token;
                result.expires = response.expires;
            }
            var errorCb = function (jqXHR, textStatus) {
                result.token = null;
                result.expires = 0;
            };
            this._syncPost(tokenUrl, data, cb, errorCb);

            return result;
        },
        getTokenForLayer: function (id, url) {         
            var serverUrl = this._getServerFromUrl(url);
            if (serverUrl == null) {
                return null;
            }

            var data = this._getDataFromCache(serverUrl);

            if (data == null || (new Date).getTime() > data.expires) {
                console.log("Get from server for " + serverUrl);
                data = this._getTokenFromServer(serverUrl);
                this._cacheData(serverUrl, data);
            }

            return data.token;
        },
        _getServerFromUrl: function (url) {
            var regex = /^(.*)\/arcgis.*$/g;
            var match = regex.exec(url);
            if (match != null) {
                return match[1];
            }

            console.log("Cannot find server for url " + url);
            return null;
        },
        _getDataFromCache: function (url) {
            var cached = this.cache[url],
                ret = null;
            if (cached) {
                console.log("Get from cache for " + url);
                cached.accessed = new Date().getTime();
                ret = cached.data;
            }
            return ret;
        },
        _cacheData: function (url, data) {
            this.cache[url] = {
                accessed: new Date().getTime(),
                data: data
            };
            this.cacheSize++;
            //this._pruneCache(20);
        },
        _syncPost: function (url, data, successCb, errorCb) {
            this._ajax("POST", url, successCb, errorCb, { 'data': data, 'async' : false});
        },
        _get: function (url, successCb, errorCb) {
            this._ajax("GET", url, successCb, errorCb);
        },
        _post: function (url, data, successCb, errorCb) {
            this._ajax("POST", url, successCb, errorCb, { 'data': data });
        },
        _ajax: function (method, url, successCb, errorCb, additionalParams) {
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

            jQuery.extend(params, additionalParams);

            jQuery.ajax(params);
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
