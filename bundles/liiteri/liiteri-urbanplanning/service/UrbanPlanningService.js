/**
 * Bunch of methods dealing with user's indicators.
 * Handles fetching, creating, updating and deleting indicators.
 *
 * @class Oskari.statistics.bundle.statsgrid.UserIndicatorsService
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-urbanplanning.service.UrbanPlanningService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance) {
        var me = this;
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.urls = {
            "initial": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlans&limit=0",
            "startingData": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlanningStartingData",
            "regionData": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlanningRegionDetailData",
            "urbanPlans": function(filters) {
                var url = me.sandbox.getAjaxUrl() + "action_route=GetUrbanPlans" + me._mapUrbanPlansFilter(filters);
                return url;
            },
            "urbanPlanDetail": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlan&id=",
            "urbanPlanSummary": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlanSummary",
            "markingsInitial": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlans&limit=0",
            "markingsStartingData": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlanMarkingsStartingData",
            "markings": function (type, areaType, name, municipalityId, mainMarkName) {
                var url = me.sandbox.getAjaxUrl() + "action_route=GetUrbanPlanMarkings&type=" + type +
                    "&areaType=" + encodeURIComponent(areaType) +
                    "&name=" + encodeURIComponent(name) +
                    "&municipalityId=" + encodeURIComponent(municipalityId) +
                    "&mainMarkName=" + encodeURIComponent(mainMarkName);
                return url;
            },
            "people": function (personType, ely, municipality, search, authorizedOnly) {
                var url = me.sandbox.getAjaxUrl() +
                    "action_route=GetUrbanPlanPeople&personType=" + encodeURIComponent(personType) +
                    "&ely=" + encodeURIComponent(ely) +
                    "&municipality=" + encodeURIComponent(municipality) +
                    "&search=" + encodeURIComponent(search) +
                    "&authorizedOnly=" + encodeURIComponent(authorizedOnly);
                return url;
            },
            "peopleInitial": this.sandbox.getAjaxUrl() + "action_route=GetUrbanPlans&limit=0"
        }
    }, {
        __name: "Liiteri.UrbanPlanningService",
        __qname: "Oskari.liiteri.bundle.liiteri-urbanplanning.service.UrbanPlanningService",

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
        _mapUrbanPlansFilter : function(filter) {
            var result = "";
            if (filter.planName != null && filter.planName != "")
                result += "&planName=" + encodeURIComponent(filter.planName);
            if (filter.keyword.length > 0)
                result += "&keyword=" + encodeURIComponent(filter.keyword.join(","));
            if (filter.planType.length > 0)
                result += "&planType=" + encodeURIComponent(filter.planType.join(","));
            if (filter.approver.length > 0)
                result += "&approver=" + encodeURIComponent(filter.approver.join(","));
            if (filter.date) {
                for (var dateKey in filter.date) {
                    if (filter.date[dateKey] != null && filter.date[dateKey] != "") {
                        result += "&" + dateKey + "=" + encodeURIComponent(filter.date[dateKey]);
                    }
                }
            }
            if (filter.area) {
                for (var areaKey in filter.area) {
                    if (filter.area[areaKey] != null && filter.area[areaKey].length > 0) {
                        result += "&" + areaKey + "=" + encodeURIComponent(filter.area[areaKey].join(","));
                    }
                }
            }

            return result;
        },
        hasRightToSeeContactPeople: function () {
            //TODO: it should be handled by server
            var user = this.instance.getSandbox().getUser();

            if (user == null || user.getRoles() == null)
                return false;

            var adminRoles = ["liiteri_env_user", "liiteri_groupings_admin", "liiteri_admin", "liiteri_admin_light"];
            var roles = user.getRoles();

            for (var i = 0; i < roles.length; i++) {
                var role = roles[i];
                if ($.inArray(role.name, adminRoles) != -1)
                    return true;
            }

            return false;
        },
        getUrbanPlanStartingData: function (successCb, errorCb) {
            var url = this.urls.startingData;
            this._get(url, successCb, errorCb);
        },
        getUrbanPlanSummaryData: function (ids, successCb, errorCb) {
            var url = this.urls.urbanPlanSummary;
            var data = {"ids": ids.join()};
            this._post(url, data, successCb, errorCb);
        },
        getUrbanPlanDetailData: function (id, successCb, errorCb) {
            var url = this.urls.urbanPlanDetail + id;
            return this._get(url, successCb, errorCb);
        },
        getRegionData: function (regionType, greaterAreaValues, administrativeCourtValues, elyValues, countyValues, subRegionValues, successCb, errorCb) {
            var url =  this.urls.regionData +  "&regionType=" + regionType
                    + "&greaterArea=" + greaterAreaValues.join()
                    + "&administrativeCourt=" + administrativeCourtValues.join()
                    + "&ely=" + elyValues.join()
                    + "&county=" + countyValues.join()
                    + "&subRegion=" + subRegionValues.join();
            this._get(url, successCb, errorCb);
        },
        getMarkingsStartingData: function (successCb, errorCb) {
            var url = this.urls.markingsStartingData;
            this._get(url, successCb, errorCb);
        },
        getMunicipalityConsultData: function(
                ely, municipality, search,
                successCb, errorCb) {
            var url = this.instance.service.urls.people(
                "MunicipalityConsult", ely, municipality, search);
            this._get(url, successCb, errorCb);
        },
        saveUserIndicator: function (indicator, successCb, errorCb) {
            var me = this,
                url = this.sandbox.getAjaxUrl() + 'action_route=SaveUserIndicator',
                sandbox = this.sandbox,
                eventName = this.eventName,
                cbWrapper = function (response) {
                    var eventBuilder = sandbox.getEventBuilder(eventName);
                    if (eventBuilder) {
                        var event = eventBuilder('create', me._objectifyIndicator(indicator, response));
                        sandbox.notifyAll(event);
                    }
                    successCb(response);
                };

            this._post(url, indicator, cbWrapper, errorCb);
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

        _objectifyIndicator: function (indicator, response) {
            var retIndicator = {
                id: response.id,
                title: JSON.parse(indicator.title),
                description: JSON.parse(indicator.description),
                organization: JSON.parse(indicator.source),
                year: indicator.year
            };

            return retIndicator;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });