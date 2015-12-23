/**
 * Bunch of methods dealing with user's indicators.
 * Handles fetching, creating, updating and deleting indicators.
 *
 * @class Oskari.statistics.bundle.statsgrid.UserIndicatorsService
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-groupings.service.GroupingsService',

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
        __name: "Liiteri.GroupingsService",
        __qname: "Oskari.liiteri.bundle.liiteri-groupings.service.GroupingsService",

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
        saveGrouping: function (grouping, successCb, errorCb) {
            var me = this;
            var url = this.ajaxUrl + 'action_route=SaveGrouping';
            var data = {
                "grouping": JSON.stringify(grouping),
                "type": grouping.mainType
            };
            var successCbWrapper = function (result) {
                var eventBuilder = me.sandbox.getEventBuilder('liiteri-groupings.GroupingUpdatedEvent');
                var event = eventBuilder(data.type);
                me.sandbox.notifyAll(event);

                if (!(typeof successCb === 'function')) {
                    return;
                }
                successCb(result);
            };
            this._post(url, data, successCbWrapper, errorCb);
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
