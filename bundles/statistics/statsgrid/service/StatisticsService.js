/**
 * @class Oskari.statistics.bundle.statsgrid.StatisticsService
 * Methods for sending out events to display data in the grid
 * and to create a visualization of the data on the map.
 * Has a method for sending the requests to backend as well.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatisticsService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.cache = {};
        this.cacheSize = 0;
    }, {
        __name: "StatsGrid.StatisticsService",
        __qname: "Oskari.statistics.bundle.statsgrid.StatisticsService",

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
        init: function () {

        },

        /**
         * @method sendStatsData
         * Sends an event with selected column and the data array.
         * @param {Object} layer Oskari layer which the visualization should be applied to
         * @param {Object} data The data which gets displayed in the grid
         */
        sendStatsData: function (layer, data) {
            var me = this;
            var eventBuilder = me.sandbox.getEventBuilder('StatsGrid.StatsDataChangedEvent');
            if (eventBuilder) {
                var event = eventBuilder(layer, data);
                me.sandbox.notifyAll(event);
            }
        },

        /**
         * @method sendVisualizationData
         * Sends an event with params to build the visualization from.
         * @param {Object} layer Oskari layer which the visualization should be applied to
         * @param {Object} data The data for creating the visualization
         */
        sendVisualizationData: function (layer, data) {
            var me = this,
                eventBuilder = me.sandbox.getEventBuilder('MapStats.StatsVisualizationChangeEvent');
            if (eventBuilder) {
                var event = eventBuilder(layer, data);
                me.sandbox.notifyAll(event);
            }
        },

        _cacheStatsData: function (url, data) {
            this.cache[url] = {
                accessed: new Date().getTime(),
                data: _.clone(data, true)
            };
            this.cacheSize++;
            this._pruneCache(20);
        },

        /**
         * @method _getStatsDataFromCache
         * Does some rudimentary cleanup so the cache doesn't grow huge.
         * param maxSize Maximum entry count for the cache.
         */
        _pruneCache: function (maxSize) {
            if (this.cacheSize > maxSize) {
                // cache has too many entries, remove older ones
                var pruneCount = this.cacheSize - maxSize,
                    entries = [],
                    pruned = [],
                    i,
                    p,
                    compare = function (a, b) {
                        if (a.accessed < b.accessed) {
                            return -1;
                        }
                        if (a.accessed > b.accessed) {
                            return 1;
                        }
                        return 0;
                    };
                // shove keys and access times to a sortable form
                for (p in this.cache) {
                    if (this.cache.hasOwnProperty(p)) {
                        entries.push({
                            accessed: this.cache[p].accessed,
                            url: p
                        });
                    }
                }
                entries.sort(compare);
                // push least recently accessed entries to prune list
                for (i = 0; i < pruneCount; i++) {
                    pruned.push(entries[i].url);
                }
                // prune
                for (i = 0; i < pruned.length; i++) {
                    delete this.cache[pruned[i]];
                }
                this.cacheSize = maxSize;
            }
        },

        /**
         * @method _getStatsDataFromCache
         * Tries to get the stats data from cache.
         *
         * param url to correct action route
         */
        _getStatsDataFromCache: function (url) {
            var cached = this.cache[url],
                ret = null;
            if (cached) {
                cached.accessed = new Date().getTime();
                ret = _.clone(cached.data, true);
            }
            return ret;
        },
        fetchFeaturesData: function (layerId, attribute, successCb, errorCb) {
            var url = this.sandbox.getAjaxUrl() + 'action_route=GetStatsFeatures&LAYERID=' + layerId + '&LAYERATTRIBUTE=' + attribute;

            this._get(url, successCb, errorCb);
        },
        fetchClassificationData: function (params, successCb, errorCb) {
            var me = this;
            var url = me.sandbox.getAjaxUrl() + 'action_route=GetStatsClassification';
            var data = {};
            jQuery.each(params, function (key, value) {
                data[key.toUpperCase()] = value + "";
            });
            this._post(url, data, successCb, errorCb);
        },
        _get: function (url, successCb, errorCb) {
            return this._ajax("GET", url, successCb, errorCb);
        },
        _post: function (url, data, successCb, errorCb) {
            return this._ajax("POST", url, successCb, errorCb, data);
        },
        _ajax: function (method, url, successCb, errorCb, data) {
            var params = {
                url: url,
                type: method,
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
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

            return jQuery.ajax(params);
        },
        fetchRegionData: function (successCb, errorCb, ignoreCache) {
            var me = this;
            var url = me.sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=regions&version=1.1';
            me.fetchStatsData(url, successCb, errorCb, ignoreCache);
        },
        fetchRegionCategories : function(successCb, errorCb, ignoreCache) {
            var me = this;
            var url = me.sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=regionCategories&version=1.1';
            me.fetchStatsData(url, successCb, errorCb, ignoreCache);
        },
        fetchIndicatorData2: function(params) {
            var me = this;
            var url = me.sandbox.getAjaxUrl() +
                    'action_route=GetSzopaData&action=data&version=1.0';
            var data = {
                        indicator: params.indicator,
                        years: params.year,
                        group: ((params.group == null) ? "" : params.group),
                        //geometryFilter: ((params.wktGeometry == null) ? "" : params.wktGeometry),
                        geometryFilter: ((params.wktGeometry == null || params.wktGeometry.length == 0) ? "" : JSON.stringify(params.wktGeometry)),
                        filter : ((params.filter == null || params.filter == []) ? "" : params.filter),
                        areaYear : params.areaYear
            };
            me.fetchStatsData2(url, data, params.successCb, params.errorCb, params.ignoreCache);
        },
        fetchIndicatorData: function (indicator, year, successCb, errorCb, ignoreCache) {
            var me = this;
            var url = me.sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=data&version=1.0&indicator=' + indicator + '&years=' + year;
            me.fetchStatsData(url, successCb, errorCb, ignoreCache);
        },
        fetchTwowayIndicatorData2: function(params) {
            var me = this;
            var url = me.sandbox.getAjaxUrl() +
                    'action_route=GetTwowayData&action=data&version=v1';
            var data = {
                        type: params.type,
                        indicator: params.indicator,
                        years: params.year,
                        group: params.direction + ":" + params.group,
                        filter : ((params.filter == null || params.filter == []) ? "" : params.filter),
                        //geometryFilter : params.wktGeometry,
                        geometryFilter: ((params.wktGeometry == null || params.wktGeometry.length == 0) ? "" : JSON.stringify(params.wktGeometry)),
                        gender: params.gender
            };
            me.fetchStatsData2(url, data, params.successCb, params.errorCb, params.ignoreCache);
        },
        fetchTwowayIndicators: function(successCb, errorCb, ignoreCache) {
            var me = this;
            var url = me.sandbox.getAjaxUrl() + 'action_route=GetTwowayData&action=indicators&version=v1';
            me.fetchStatsData(url, successCb, errorCb, ignoreCache);
        },
        /**
         * @method fetchStatsData
         * Make the AJAX call. This method helps
         * if we need to do someting for all the calls to backend.
         * Calls are now cached, cache can be ignored/refreshed for the given URL if need be.
         * Only a successful fetch will be cached.
         *
         * param url to correct action route
         * param successCb (success callback)
         * param errorCb (error callback)
         * param ignoreCache (ignore & refres cache)
         */
        fetchStatsData: function (url, successCb, errorCb, ignoreCache) {
            var me = this;
            if (!ignoreCache) {
                var cachedResp = me._getStatsDataFromCache(url);
                if (cachedResp) {
                    if (successCb) {
                        successCb(cachedResp);
                    }
                    return;
                }
            }
            jQuery.ajax({
                type: "GET",
                cache: false,
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: url,
                success: function (pResp) {
                    me._cacheStatsData(url, pResp);
                    if (successCb) {
                        successCb(pResp);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (errorCb && jqXHR.status !== 0) {
                        errorCb(jqXHR, textStatus);
                    }
                }
            });
        },
        fetchStatsData2: function (url, data, successCb, errorCb, ignoreCache) {
            var me = this;
            var key = url + JSON.stringify(data);
            if (!ignoreCache) {                
                var cachedResp = me._getStatsDataFromCache(key);
                if (cachedResp) {
                    if (successCb) {
                        successCb(cachedResp);
                    }
                    return;
                }
            }
            jQuery.ajax({
                type: "POST",
                dataType: 'json',
                data: data,
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: url,
                success: function (pResp) {
                    me._cacheStatsData(key, pResp);
                    if (successCb) {
                        successCb(pResp);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (errorCb && jqXHR.status !== 0) {
                        errorCb(jqXHR, textStatus);
                    }
                }
            });
        },

        formatThousandSeparators: function (inputNumber) {
            var formattedNumber = ('' + Math.abs(inputNumber)).split('.');
            formattedNumber[0] = formattedNumber[0].replace(new RegExp("^(\\d{" + (formattedNumber[0].length % 3 ? formattedNumber[0].length % 3 : 0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
            if (inputNumber < 0) {
                formattedNumber[0] = "-" + formattedNumber[0];
            }
            return formattedNumber.join('.');
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
