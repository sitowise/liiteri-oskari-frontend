Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-urbanplanning.LiiteriUrbanPlanningBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.conf = {
            "name": "liiteri-urbanplanning",
            "sandbox": "sandbox",
            "stateful": false,
            "tileClazz": "Oskari.liiteri.bundle.liiteri-urbanplanning.Tile",
            "flyoutClazz": null,
            "viewClazz": "Oskari.liiteri.bundle.liiteri-urbanplanning.NewModeView",
            "isFullScreenExtension": true,
            "mapView": false,
            "planDetailsUrl" : "loader/urbanplans.html",
        };
        this.state = {};
        this.service = null;
        var me = this;
        $.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
            var xhr = settings.jqXHR;
            var errorKey = xhr.statusText;
            try {
                var jsonError = $.parseJSON(xhr.responseText);
                if (jsonError.hasOwnProperty('error')) {
                    errorKey = jsonError['error'];
                }
            } catch (exception) {
                /* ignore */
            }
            var msg = errorKey;
            if (me.getLocalization('error').hasOwnProperty(errorKey))
                msg = me.getLocalization('error')[errorKey];
            me.showMessage(me.getLocalization('error').title, msg);
        };
    }, {
        __name: 'liiteri-urbanplanning',
        getName: function () {
            return this.__name;
        },
        eventHandlers: {
            'liiteri-ui.UISizeChangedEvent': function (event) {
                if (this.plugins['Oskari.userinterface.View'])
                    this.plugins['Oskari.userinterface.View'].resize();
            }

            /*'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    view = me.plugins['Oskari.userinterface.View'];
                
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== "close";
                view.showMode(isShown, true);
            }*/
        },
        start: function () {
            //console.log("Bundle", this.getName(), 'starting');            

            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request;

            this.sandbox = sandbox;
            sandbox.register(this);

            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            var service = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.service.UrbanPlanningService', this);
            sandbox.registerService(service);
            this.service = service;

            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
            sandbox.request(this, request(this));            
            
            if (conf && conf.mapView === false) {
                this.tilePlugin = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.plugin.TilePlugin',
                this.plugins['Oskari.userinterface.View'], this._getTilePluginConfig(), this.getLocalization('tilePlugin'));
                this.tilePlugin.start();
                this.plugins['Oskari.userinterface.View'].showMode(true, true);
            }
        },
        _getTilePluginConfig: function () {
            var defaultConf = {
                "tiles": {
                    "urbanPlans": {
                        "subPage": "plans",
                        "isSelected" : true
                    },
                    "markings" : {
                        "subPage": "markings"
                    }
                }
            }

            if (this.service.hasRightToSeeContactPeople()) {
                defaultConf.tiles["people"] = {
                    "subPage": "people"
                };
            }

            return defaultConf;
        },
        showMessage: function (title, message, buttons) {
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if (buttons) {
                dialog.show(title, message, buttons);
            } else {
                var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                okBtn.setTitle("OK");
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    dialog.close(true);
                    me.dialog = null;
                });
                dialog.show(title, message, [okBtn]);
                me.dialog = dialog;
            }
        },

        addFilterToUrl: function (filterName, filterValue, avoidOverwriting) {
            //Get currentUrl params and change them to object
            var currentFilters = this.getUrlParameters();
            //Replace value or add new one
            if (avoidOverwriting && currentFilters[filterName] != null && currentFilters[filterName] != '') {
                var values = currentFilters[filterName].split(',');
                values.push(filterValue);
                var uniqueValues = [];
                $.each(values, function(i, el){
                    if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
                });
                currentFilters[filterName] = uniqueValues.join();
            } else {
                currentFilters[filterName] = filterValue;
            }
            //Change object to URL query string and exclude null properties
            var resultFiltersUri = _.reduce(currentFilters, function(result, value, key) {
                if (value != null && value != '') {
                    if (result != '?') {
                        result += '&';
                    }
                    result += key + '=' + value;
                }
                return result;
            }, '?');
            //Add new state
            window.history.pushState(null, '', encodeURI(resultFiltersUri));
        },

        removeFilterFromUrl: function (filterName, filterValue) {
            if (filterValue != null) {
                var currentParameter = this.getUrlParameter(filterName);
                if (currentParameter != null) {
                    var values = currentParameter.split(',');
                    var position = values.indexOf(filterValue);
                    if (position > -1) {
                        values.splice(position, 1);
                        this.addFilterToUrl(filterName, values.join());
                    }
                }
            } else {
                this.addFilterToUrl(filterName, null);
            }
        },

        getUrlParameters: function () {
            var urlParams = {};
            window.location.search.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) {
                urlParams[$1] = decodeURI($3);
                }
            );

            return urlParams;
        },

        getUrlParameter: function(paramName) {
            paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + paramName + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(decodeURI(window.location.href));
            
            return results == null ? null : results[1];
        }

    }, {
        "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });