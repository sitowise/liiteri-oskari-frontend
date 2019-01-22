/**
 * @class Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin
 * Creates the indicator selection ui and the actual grid where the stats data will be displayed.
 * Handles sending the data out to create a visualization which then can be displayed on the map.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin',
    /**
     * @method create called automatically on construction
     * @params {Object} config
     *  {
     *   'published': {Boolean}, // optional, defaults to false
     *   'state':     {Object},  // optional, defaults to an empty object
     *   'layer':     {Object}   // optional, can be set later with #setLayer
     *  }
     * @params {Object} locale   localization strings
     *
     * @static
     */
    function(config, locale, instance) {
        this.instance = instance;
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._layer = null;
        this._state = null;
        this.element = undefined;
        this.statsService = null;
        // indicators (meta data)
        this.indicators = [];
        this.stateIndicatorsLoaded = false;
        // object to hold the data for each indicators.
        // Used in case the user changes the region category.
        this.indicatorsData = {};
        this.flatIndicatorsdata;
        this.treeIndicatorsdata;
        this.mode = 'all';
        // indicators meta for data sources
        this.indicatorsMeta = {};
        this.selectedMunicipalities = {};
        // Array of open popups so we can easily get rid of them when the UI is hidden.
        // stored as [{'name': 'somePopup', 'popup': popupObject, 'content', contentElement}]
        this.popups = [];
        //    this.conf = config || {};
        var defaults = {
            "statistics": [
                {
                    "id": "min",
                    "visible": true
                }, {
                    "id": "max",
                    "visible": true
                }, {
                    "id": "avg",
                    "visible": true
                }, {
                    "id": "mde",
                    "visible": true
                }, {
                    "id": "mdn",
                    "visible": true
                }, {
                    "id": "std",
                    "visible": true
                }, {
                    "id": "sum",
                    "visible": true
                }
            ],
            "additionalItems" : [
                {
                    "id": "copyright",
                    "visible": true
                }
            ]
        };
        this.conf = jQuery.extend(true, config, defaults);
        this._locale = locale || {};
        this.templates = {
            'csvButton': '<span class="statsgrid-csv-button action-link"></span>',
            'statsgridTotalsVar': '<span class="statsgrid-variable"></span>',
            'subHeader': '<span class="statsgrid-grid-subheader"></span>',
            'gridHeaderMenu': '<li><input type="checkbox" /><label></label></li>',
            'groupingHeader': '<span style="font-weight: bold"></span>',
            'toolbarButton': '<button class="statsgrid-select-municipalities"></button>',
            'filterPopup': '<div class="indicator-filter-popup"><p class="filter-desc"></p><div class="filter-container"></div></div>',
            'filterRow': '<div class="filter-row"><div class="filter-label"></div><div class="filter-value"></div></div>',
            'filterSelect': '<div><select class="filter-select"></select><div class="filter-inputs-container"></div></div>',
            'filterOption': '<option></option>',
            'filterInputs': '<input type="text" class="filter-input filter-input1" /><span class="filter-between" style="display:none;">-</span><input type="text" class="filter-input filter-input2" style="display:none;" />',
            'filterLink': '<a href="javascript:void(0);"></a>',
            'filterByRegion': '<div id="statsgrid-filter-by-region"><p class="filter-desc"></p><div class="filter-container"><div class="layerFilterContainer"></div></div></div>',
            'regionCatSelect': '<div class="filter-region-category-select"><select></select></div>',
            'regionSelect': '<div class="filter-region-select"><select class="filter-region-select" multiple tabindex="3"></select></div>',
            'addOwnIndicator': '<div class="new-indicator-cont"><input type="button"/></div>',
            'cannotDisplayIndicator': '<p class="cannot-display-indicator"></p>',
            'filterRegionCategorySelector': '<select name="filterCategorySelector" class="innerSelector"></select>',
            'regionCategorySelector': '<select name="categorySelector" class="innerSelector"></select>',
            'sortingSelector': '<select name="sortingSelector" class="innerSelector"></select>',
            'filterInput': '<input type="text" class="innerSelector" value="Syötä alueen nimi..."/>',
            'selectorContainer': '<div class="selector"></div>',
            'indicatorHeader': '<div></div>',
            'leftMenuSelector': '<div class="selectors-container"><h5 class="open"><span class="glyphicon"></span>' + this._locale.areaRestrictions + '</h5><div id="selectors-area"></div><h5><span class="glyphicon"></span>' + this._locale.presentationLevel + '</h5><div id="level-area"></div><h5><span class="glyphicon"></span>' + this._locale.selectIndicator + '</h5><div id="selectors-statistic"><div style="text-align: center"><img src="/Oskari/resources/ajax-loader-small.gif"/></div></div><h5><span class="glyphicon"></span>' + this._locale.yearSelector + '</h5><div id="selectors-year"></div><h5 class="selectors-functional-area"><span class="glyphicon"></span>' + this._locale.functionalAreas + '</h5><div id="selectors-functional-area"></div></div>',
            'columnComparisonPopup': '<div></div>',
            'columnComparisonPopupInstructions': '<div class="stats-compare-instructions"></div>'
        };

        this.regionCategories = {};
        this._selectedRegionCategory = undefined;
        this._defaultRegionCategory = 'KUNTA';

        this.servicePackageIndicatorIds = null;

        this.geometryFilter = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.domain.GeometryFilter');
        this.currentAreaFilter = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.domain.AreaFilter');

        this.container = null;

        this.data = null;
        this.ignoreCache = false;

        this.collapse = null;

        this.geomFilterIdAttributes = [];

        this.WFSLayerService = null;

        this.columnComparisonOptions = [{
            type: 'difference',
            selected: true,
            getValue: function(a, b) {
                return b-a;
            }
        }, {
            type: 'division',
            decimalCount: 3,
            unit: '',
            getValue: function(a, b) {
                return Math.round(b/a*1e3)/1e3;
            }
        }, {
            type: 'relativeChange',
            unit: '%',
            decimalCount: 1,
            getValue: function(a, b) {
                return Math.round((b-a)/a*1e3)/10;
            }
        }, {
            type: 'sum',
            getValue: function(a, b) {
                return a+b;
            }
        }];
    }, {
        /**
         * @property __name module name
         * @static
         */
        __name: 'ManageStatsPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function() {
            return this.pluginName;
        },

        getFlatIndicatorsdata: function() {
            return this.flatIndicatorsdata;
        },

        setFlatIndicatorsdata: function(flatIndicatorsdata) {
            this.flatIndicatorsdata = flatIndicatorsdata;
            if (typeof this.getTreeIndicatorsdata() !== 'undefined') {
                this.mergeIndicatorsData();
            }
        },

        getTreeIndicatorsdata: function() {
            return this.treeIndicatorsdata;
        },

        setTreeIndicatorsdata: function(treeIndicatorsdata) {
            this.treeIndicatorsdata = treeIndicatorsdata;
            if (typeof this.getFlatIndicatorsdata() !== 'undefined') {
                this.mergeIndicatorsData();
            }
        },
        mergeIndicatorsData: function() {
            var me = this;
            var addThemesToIndicators = function(themes, treeNode) {
                if (typeof treeNode.indicators !== 'undefined') {
                    //add themes to indicators
                    for (var i = 0; i < treeNode.indicators.length; ++i) {
                        for (var j = 0; j < me.getFlatIndicatorsdata().length; ++j) {
                            if (me.getFlatIndicatorsdata()[j].id === treeNode.indicators[i]) {
                                me.getFlatIndicatorsdata()[j].themes = themes;
                            }
                        }
                    }
                }

                if (typeof treeNode.themes !== 'undefined') {
                    for (var i = 0; i < treeNode.themes.length; ++i) {
                        addThemesToIndicators(themes.concat({ 'fi': treeNode.themes[i].fi, 'id': treeNode.themes[i].id }), treeNode.themes[i]);
                    }
                }
            };
            for (var i = 0; i < this.getTreeIndicatorsdata().themes.length; ++i) {
                addThemesToIndicators([{ 'fi': this.getTreeIndicatorsdata().themes[i].fi, 'id': this.getTreeIndicatorsdata().themes[i].id }], this.getTreeIndicatorsdata().themes[i]);
            }

            for (var i = 0; i < this.getFlatIndicatorsdata().length; ++i) {
                if (typeof this.getFlatIndicatorsdata()[i].themes === 'undefined') {
                    delete this.getFlatIndicatorsdata()[i]; //remove indicators without themes
                }
            }


        },

        _geometryFilterDrawn: function (event) {
            this.geometryFilter.reset(true);
            for (var i = 0; i < event.getDrawing().components.length; ++i) {
                var drawnAreaFilterId = this._locale.geometryFilter.drawnAreaFilterId.replace('{0}', i + 1);
                this.geometryFilter.addGeometry(event.getDrawing().components[i].toString(), drawnAreaFilterId);
            }
            this._updateGeometryFilter();
        },

        _updateGeometryFilter: function() {
            var years = [];
            var indicator = this.indicators[this.indicators.length - 1];

            if (!this.geometryFilter.isEmpty()) {
                jQuery('#area-info-container').text(this._locale.geometryFilterSet.replace('{0}', this.geometryFilter.getSize()));
                if (typeof indicator !== 'undefined') {
                    if (typeof indicator.timePeriods !== 'undefined') {
                        for (var i = 0; i < indicator.timePeriods.length; ++i) {
                            var year = indicator.timePeriods[i].Id;
                            for (j = 0; j < indicator.timePeriods[i].AreaTypes.length; ++j) {
                                if (indicator.timePeriods[i].AreaTypes[j].Id == 'grid250m') {
                                    years.push(year);
                                }
                            }
                        }
                    } else {
                        years = indicator.years.slice();
                    }
                }
            } else {
                jQuery('#area-info-container').text(this.instance.conf.gridDataAllowed ? this._locale.noAreaFilterSet : this._locale.noAreaFilterSetNoGrid);
                if (typeof indicator !== 'undefined') {
                    years = indicator.years;
                }
                if(!this._published) {
                    var request = this._sandbox.getRequestBuilder('BackgroundDrawPlugin.StopDrawingRequest')('StatsGrid', true);
                    this._sandbox.request(this.instance.getName(), request);
                }
            }

            this.updateYearSelectorValues(jQuery('.selectors-container .selectors-year .yearsel select.year'), years.sort(function(a, b) { return b - a; }));
            this.updateFilterRegionCategorySelector();
        },

        updateFilterRegionCategorySelector: function(indicator, year) {
            var timePeriods = {};
            var selector = 'select.innerSelector[name="filterCategorySelector"]';

            if (typeof indicator !== 'undefined' && indicator.constructor !== Array) {
                indicator = [indicator];
            }

            if (typeof indicator !== 'undefined') {
                for (var j = 0; j < this.indicators.length; ++j) {
                    for (var i = 0; i < indicator.length; ++i) {
                        if (this.indicators[j].id == indicator[i].id && typeof this.indicators[j].timePeriods !== 'undefined') {
                            for (var k = 0; k < this.indicators[j].timePeriods.length; ++k) {
                                if(typeof timePeriods[j] === 'undefined') {
                                    timePeriods[j] = [];
                                }
                                timePeriods[j] = timePeriods[j].concat(this.indicators[j].timePeriods[k].AreaTypes);
                                timePeriods[j] = _.uniq(timePeriods[j]);
                            }
                        }
                    }
                }
            }

            var commonRegions = null;

            $.each(timePeriods, function(key, timePeriod) {
                if (commonRegions == null) {
                    commonRegions = [];
                    for (var j = 0; j < timePeriod.length; ++j) {
                        commonRegions.push(timePeriod[j].Id);
                    }
                } else {
                    var regions = [];
                    for (var j = 0; j < timePeriod.length; ++j) {
                        regions.push(timePeriod[j].Id);
                    }
                    commonRegions = $.grep(commonRegions, function(element) {
                        return $.inArray(element, regions) !== -1;
                    });
                }
            });

            var me = this,
                areaFilterLevels = [];

            if (!me.geometryFilter.isEmpty() && me.mode !== 'twoway') {
                areaFilterLevels.push("FINLAND");
            } else if (!me.currentAreaFilter.isEmpty()) {
                $.each(me.currentAreaFilter.getData(), function(index, value) {
                    if(me.mode === 'twoway' && index < 1) {
                        return;
                    }
                    var levels = [];
                    if (value.hasOwnProperty("key")) {
                        levels.push(value.key);
                        var v = me._categoriesHierarchy[value.key];
                        while (v.child) {
                            levels.unshift(v.child);
                            v = me._categoriesHierarchy[v.child];
                        }

                        if (areaFilterLevels.length == 0 || levels.length < areaFilterLevels.length) {
                            areaFilterLevels = levels;
                        }
                    }
                });
            }

            var elems = jQuery(selector);

            elems.find('option').attr('disabled', false);

            if (Object.keys(timePeriods).length > 0) {
                jQuery.each(elems.find('option'), function(index, value) {
                    if (jQuery.inArray(me._categoriesGroupKeys[value.value], commonRegions) == -1) {
                        jQuery(value).attr('disabled', true);
                    }
                });
            }

            if (areaFilterLevels.length != 0) {
                jQuery.each(elems.find('option'), function(index, value) {
                    if (jQuery.inArray(value.value, areaFilterLevels) == -1) {
                        jQuery(value).attr('disabled', true);
                    }
                });
            }

            if (elems.find('option:selected').attr('disabled') === "disabled") {
                var oldCategory = elems.find('option:selected').val();
                if(typeof elems.find("option:not([disabled]):first").val() !== 'undefined') {
                    elems.find('option:selected').removeAttr("selected");
                    elems.val(elems.find("option:not([disabled]):first").val()).change();
                    me.displayFilterCategoryChangedNotification(oldCategory, elems.val());
                } else {
                    me.displayFilterCategoryChangedNotification(oldCategory);
                }
            }
        },

        displayFilterCategoryChangedNotification: function(oldCategory, newCategory) {
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content,
                contentLevelChanged = jQuery('<div>Kaikkia valittuja tilastoja ei voida näyttää valitulla esitystasolla ' + me._locale.regionSelectorCategories[oldCategory] + '. Esitystasoksi on vaihdettu ' + me._locale.regionSelectorCategories[newCategory] + '.</div>').clone(),
                contentNotPossible = jQuery('<div>Tilastoja ei voida näyttää tehdyillä valinnoilla. Tilastojen laskenta voi olla mahdollista vaihtamalla valittu vuosi, valitsemalla vähemmän tilastoja tai poistamalla mahdollinen aluerajaus käytöstä.</div>').clone(),
                dialogButtons = [];

            if(newCategory === oldCategory || typeof newCategory === 'undefined' || newCategory === null) {
                content = contentNotPossible;
            } else {
                content = contentLevelChanged;
            }

            // destroy possible open instance
            me._destroyPopup('filterCategoryNotAvailable');

            continueBtn.setTitle(continueLoc);
            continueBtn.addClass('primary');
            continueBtn.setHandler(function (e) {
                me._destroyPopup('filterCategoryNotAvailable');
            });

            dialogButtons.push(continueBtn);

            dialog.show(dialogTitle, content, dialogButtons);
            me.popups.push({
                name: 'filterCategoryNotAvailable',
                popup: dialog,
                content: content
            });
        },

        updateGridRegionCategorySelector: function() {
            var timePeriods = [];
            var selector = 'select.innerSelector[name="categorySelector"]';

            for (var j = 0; j < this.indicators.length; ++j) {
                for (var i = 0; i < this._state.indicators.length; ++i) {
                    if (this.indicators[j].id == this._state.indicators[i].id && typeof this.indicators[j].timePeriods !== 'undefined') {
                        for (var k = 0; k < this.indicators[j].timePeriods.length; ++k) {
                            if (this.indicators[j].timePeriods[k].Id == this._state.indicators[i].year) {
                                timePeriods.push(this.indicators[j].timePeriods[k].AreaTypes);
                            }
                        }
                    }
                }
            }

            var commonRegions = null;

            for (var i = 0; i < timePeriods.length; ++i) {
                if (commonRegions == null) {
                    commonRegions = [];
                    for (var j = 0; j < timePeriods[i].length; ++j) {
                        commonRegions.push(timePeriods[i][j].Id);
                    }
                } else {
                    var regions = [];
                    for (var j = 0; j < timePeriods[i].length; ++j) {
                        regions.push(timePeriods[i][j].Id);
                    }
                    commonRegions = $.grep(commonRegions, function(element) {
                        return $.inArray(element, regions) !== -1;
                    });
                }
            }

            var me = this,
                areaFilterLevels = [];

            var isEmpty = function(value) {
                if(typeof value === 'undefined')
                    return true;

                if(value === null)
                    return true;

                if(value.length === 0)
                    return true;
            }

            if(me._state.indicators.length > 0) {
                if (!isEmpty(me._state.indicators[0].geometry) && me.mode !== 'twoway') {
                    areaFilterLevels.push("FINLAND");
                } else if (!isEmpty(me._state.indicators[0].filter)) {
                    $.each(JSON.parse(me._state.indicators[0].filter), function(index, value) {
                        if(me.mode === 'twoway' && index < 1) {
                            return;
                        }
                        var levels = [];
                        if (value.hasOwnProperty("key")) {
                            levels.push(value.key);
                            var v = me._categoriesHierarchy[value.key];
                            while (v.child) {
                                levels.push(v.child);
                                v = me._categoriesHierarchy[v.child];
                            }

                            if (areaFilterLevels.length == 0 || levels.length < areaFilterLevels.length) {
                                areaFilterLevels = levels;
                            }
                        }
                    });
                }
            }
            var elems = jQuery(selector);

            elems.find('option').attr('disabled', false);

            if (timePeriods.length > 0) {
                jQuery.each(elems.find('option'), function(index, value) {
                    if (jQuery.inArray(me._categoriesGroupKeys[value.value], commonRegions) == -1) {
                        jQuery(value).attr('disabled', true);
                    }
                });
            }

            if (areaFilterLevels.length != 0) {
                jQuery.each(elems.find('option'), function(index, value) {
                    if (jQuery.inArray(value.value, areaFilterLevels) == -1) {
                        jQuery(value).attr('disabled', true);
                    }
                });
            }

            if (elems.find('option:selected').attr('disabled') === "disabled") {
                elems.find('option:selected').removeAttr("selected");
                if (areaFilterLevels.length != 0) {
                    elems.val(areaFilterLevels[0]);
                    if (elems.find('option:selected').attr('disabled') !== "disabled") {
                        elems.change();
                    }
                } else {
                    elems.val(elems.find("option:not([disabled]):first").val()).change();
                }
            }
        },

        /**
         * @method getMapModule
         * Returns reference to map module this plugin is registered to
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function() {
            return this.mapModule;
        },

        /**
         * @method setMapModule
         * Sets reference to reference to map module
         * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
         */
        setMapModule: function(mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },

        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function() {},

        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function() {},

        /**
         * @method init
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function(sandbox) {},

        /**
         * @method startPlugin
         *
         * Interface method for the plugin protocol. Should registers requesthandlers and
         * eventlisteners.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function(sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();
            sandbox.register(this);
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            this.statsService = sandbox.getService('Oskari.statistics.bundle.statsgrid.StatisticsService');
            this._published = (this.conf.published || false);
            this._state = (this.conf.state || {});
            this._layer = (this.conf.layer || null);
            this.selectMunicipalitiesMode = false;
            this.WFSLayerService = sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        },

        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol. Should unregisters requesthandlers and
         * eventlisteners.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function(sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            // remove ui
            if (this.element) {
                this.element.remove();
                this.element = undefined;
                delete this.element;
            }
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'MapStats.FeatureHighlightedEvent': function(event) {
                if (this.selectMunicipalitiesMode) {
                    this._featureSelectedEvent(event);
                } else {
                    this._featureHighlightedEvent(event);
                }
            },
            'BackgroundDrawPlugin.FinishedDrawingEvent': function(event) {
                this._geometryFilterDrawn(event);
            },
            'BackgroundDrawPlugin.AddedFeatureEvent': function(event) {
                this._geometryFilterDrawn(event);
            },
            'liiteri-groupings.GroupingUpdatedEvent': function(event) {
                //refreshing stat's themes after changing them in grouping administration
                if (this.container) {
                    this.ignoreCache = true;
                    this.getSotkaIndicators(this.container);
                    this.ignoreCache = false;
                }
            },
            'StatsGrid.GridVisualizationRowChanged': function(event) {
                this._state.visualizationAreaCategory = event.getFunctionalArea();
                this.sendStatsData(event.getIndicator());
            },
            'liiteri-servicepackages.ServicePackageSelectedEvent': function (event) {
                var me = this;
                var indicatorsSourceSelect = jQuery('.indicatorsSource select.indicatorsSourceSelect');
                var servicePackageData = event.getThemes();
                if (servicePackageData) {
                    var statsThemes = $.grep(servicePackageData, function(item) {
                        return item.type == "statistics";
                    });

                    if (statsThemes.length > 0) {
                        me.stateIndicatorsLoaded = false;
                        me._setStateFromServicePackage(servicePackageData);
                        var exists = 0 != indicatorsSourceSelect.find("option[value='servicePackage']").length;
                        if (!exists) {
                            var servicePackageIndicatorsOption = jQuery("<option value='servicePackage'>Palvelupaketin tilastot</option>"); //TODO: to locale file
                            indicatorsSourceSelect.prepend(servicePackageIndicatorsOption);
                        }

                        indicatorsSourceSelect.show();
                        indicatorsSourceSelect.val('servicePackage').change();
                        //me.instance.changeMode('servicePackage');
                    } else {
                        indicatorsSourceSelect.find("option[value='servicePackage']").remove();
                        indicatorsSourceSelect.val('all').change();
                        indicatorsSourceSelect.hide();
                        //me.instance.changeMode('all');
                    }
                } else {
                    indicatorsSourceSelect.find("option[value='servicePackage']").remove();
                    indicatorsSourceSelect.val('all').change();
                    indicatorsSourceSelect.hide();
                    //me.instance.changeMode('all');
                }


            },
            'WFSFeaturesSelectedEvent': function (event) {
                //update the status of selected geometries in the geometry filter popup
                var me = this,
                    index = me._getPopupIndex('filterBySelectedAreaPopup'),
                    popup = null,
                    layerFilterContainer = null,
                    filterBtn = null,
                    clickedGeometries = 0;

                if (index != null) {
                    popup = me.popups[index];
                }

                if (popup && popup.content && popup.popup && popup.popup.dialog) {
                    layerFilterContainer = popup.content.find('.filter-container .layerFilterContainer'),

                    layerFilterContainer.empty();
                    layerFilterContainer.append(me._locale.areaFilterNoItemsSelected);
                }
            },
            'WFSFeatureGeometriesEvent': function (event) {
                //update the status of selected geometries in the geometry filter popup
                var me = this,
                    index = me._getPopupIndex('filterBySelectedAreaPopup'),
                    popup = null,
                    layerFilterContainer = null,
                    filterBtn = null,
                    clickedGeometries = 0;

                if (index != null) {
                    popup = me.popups[index];
                }

                if (popup && popup.content && popup.popup && popup.popup.dialog) {
                    layerFilterContainer = popup.content.find('.filter-container .layerFilterContainer'),
                    filterBtn = popup.popup.dialog.find('div.actions input.filterBtn');

                    clickedGeometries = me._updateGeometriesInfoInPopup(layerFilterContainer);

                    if (clickedGeometries > 0) {
                        filterBtn.removeAttr('disabled');
                    } else {
                        filterBtn.attr('disabled', 'disabled');
                    }
                }
            }
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function(event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

        /**
         * @method getLayer
         * @return {Object} layer
         */
        getLayer: function() {
            return this._layer;
        },

        /**
         * @method setLayer
         * @param {Object} layer
         */
        setLayer: function(layer) {
            this._layer = layer;
        },

        setState: function(state, stateIndicatorsLoaded) {
            this.clearIndicators();
            this.indicators = [];
            this.indicatorsMeta = {};
            this.indicatorsData = {};
            if (stateIndicatorsLoaded == null) {
                stateIndicatorsLoaded = false;
            }
            this.stateIndicatorsLoaded = stateIndicatorsLoaded;
            this._state = state;
            if(this._state && this._state.oldIndicators) {
                this.indicators = this._state.oldIndicators.slice();
                delete this._state.oldIndicators;
            }
        },
        getState: function() {
            return this._state;
        },
        changeMode: function (mode) {
            var me = this;
            var newmode = mode;
            var oldmode = me.mode;
            var container = me.container;
            if (newmode !== oldmode && (newmode === 'twoway' || oldmode === 'twoway')) {
                me.clearDataFromGrid();
                me._state.indicators = [];
            }
            me.mode = newmode;
            me.resetState(me);
            me.prepareIndicatorParams(container, false);

            if (newmode == 'twoway') {
                $('.indicatorsSourceSelect').hide();
                $('.slick-spanheader-columns').hide();
            } else if (newmode == 'all') {
                if (me.instance.servicePackageData != null) {
                    $('.indicatorsSourceSelect').show();
                    $('.indicatorsSourceSelect').val('all');
                } else {
                    $('.indicatorsSourceSelect').hide();
                }

                $('.slick-spanheader-columns').show();
            } else if (newmode == 'servicePackage') {
                if (me.instance.servicePackageData != null) {



                    $('.indicatorsSourceSelect').show();
                    $('.indicatorsSourceSelect').val('servicePackage');
                } else {
                    $('.indicatorsSourceSelect').hide();
                }
                $('.slick-spanheader-columns').show();
            }
        },
        /**
         * @method createStatsOut
         * Get Sotka data and show it in SlickGrid
         * @param {Object} container to where slick grid and pull downs will be appended
         */
        createStatsOut: function(container) {
            var me = this;
            var layer = this.getLayer();
            this.container = container;
            if (layer === null || layer === undefined) {
                return;
            }

            if (!this._published) {
                var indicatorsSourceDiv = jQuery("<div class='indicatorsSource'></div>");
                var indicatorsSourceSelect = jQuery("<select class='indicatorsSourceSelect'></select>");

                indicatorsSourceSelect.change(function () {
                    me.instance.changeMode($(this).val());
                });

                if (me.instance.servicePackageData != null && me.instance.servicePackageData.length > 0) {
                    var servicePackageIndicatorsOption = jQuery("<option value='servicePackage'>Palvelupaketin tilastot</option>"); //TODO: to locale file
                    indicatorsSourceSelect.append(servicePackageIndicatorsOption);
                    if (me.mode !== 'servicePackage') {
                        me.instance.changeMode('servicePackage');
                    }
                }

                var allIndicatorsOption = jQuery("<option value='all'>Kaikki tilastot</option>"); //TODO: to locale file
                indicatorsSourceSelect.append(allIndicatorsOption);

                if (me.mode !== 'servicePackage') {
                    indicatorsSourceSelect.hide();
                }
                indicatorsSourceDiv.append(indicatorsSourceSelect);
                container.append(indicatorsSourceDiv);
            }

            this._acceptedRegionCategories = layer.getCategoryMappings().categories;
            this._categoriesHierarchy = layer.getCategoryMappings().categoriesHierarchy;
            this._categoriesGroupKeys = layer.getCategoryMappings().groupKeys;

            // indicator params are select-elements
            // (indicator drop down select and year & gender selects)
            this.prepareIndicatorParams(container, true);

            // stop events so that they don't affect other parts of the site (i.e. map)
            container.on("keyup", function(e) {
                e.stopPropagation();
            });
            container.on("keydown", function(e) {
                e.stopPropagation();
            });

        },
        /**
         * @method resetState
         * Reset filters when changing mode
         */
        resetState: function(me) {
            me.geometryFilter.reset();
            me._updateGeometryFilter();
            me.currentAreaFilter.reset();
        },
        /**
         * @method prepareIndicatorParams
         * @param {Object} container element where indicator-selector should be added
         */
        prepareIndicatorParams: function(container, initial) {
            // Do not load the indicators for a published map.
            if (!this._published) {

                if (initial) {
                    var selectors = jQuery(this.templates.leftMenuSelector);
                    container.find('.indicatorsSource').append(selectors);
                    this.collapse = new jQueryCollapse(selectors, {
                        accordion: true
                    });
                    selectors.append(jQuery('<div class="parameters-cont"></div>'));
                }

                // Indicators
                // success -> createIndicators
                switch (this.mode) {
                case 'servicePackage':
                    if(this.instance.conf.gridDataAllowed) {
                        jQuery('.selectors-functional-area').show();
                    } else {
                        jQuery('.selectors-functional-area').hide();
                    }
                    this.getServicePackageIndicators(container);
                    break;
                case 'twoway':
                    jQuery('.selectors-functional-area').hide();
                    this.getTwowayIndicators(container);
                    break;
                case 'all':
                    if(this.instance.conf.gridDataAllowed) {
                        jQuery('.selectors-functional-area').show();
                    } else {
                        jQuery('.selectors-functional-area').hide();
                    }
                    this.getSotkaIndicators(container);
                    break;
                default:
                    alert("unknown mode " + this.mode);
                }
                if (this.collapse) {
                    this.collapse.close();
                    this.collapse.open(0);
                }
            }

            if (initial) {
                //this.getSotkaIndicators(container);
                this.getSotkaRegionData(container);
            }
        },
        /**
         * Fetch region data - we need to know all the regions / municipalities
         * @method getSotkaRegionData
         * @param {Object} container element where indicator-selector should be added
         */
        getSotkaRegionData: function(container) {
            var me = this;
            me.statsService.fetchRegionData(
                function(regionData) {
                    if (regionData) {
                        me.setRegionCategories(regionData);
                        // get the actual data
                        //me.createMunicipalitySlickGrid(container, indicator, genders, years, indicatorMeta, regionData);
                        me.createMunicipalitySlickGrid(container, regionData);

                        // Data loaded and grid created, now it's time to load the indicators from the state if any.
                        if (me._state) {
                            me.loadStateIndicators(me._state, container);
                            me.loadStateComparisons(me._state);
                        }
                    } else {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.regionDataError);
                    }
                },
                function(jqXHR, textStatus) {
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.regionDataXHRError);
                });
        },

        setRegionCategories: function(regionData) {
            var me = this,
                lang = Oskari.getLang(),
                categories = me._acceptedRegionCategories;
            this.regionCategories = _.foldl(regionData, function(result, region) {
                if (_.contains(categories, region.category)) {
                    if (!result[region.category]) {
                        result[region.category] = [];
                    }

                    result[region.category].push({
                        id: region.id,
                        code: region.code,
                        title: region.title[lang],
                        municipality: region.title[lang],
                        category: region.category,
                        memberOf: region.memberOf,
                        orderNumber: region.orderNumber,
                        availabilityYears: region.availability
                    });
                }
                return result;
                //}, this.regionCategories || {});
            }, {});
        },

        /**
         * Create initial grid using just one column: municipality
         * @method createMunicipalitySlickGrid
         * @param {Object} container element where indicator-selector should be added
         */
        createMunicipalitySlickGrid: function(container, regiondata) {
            var me = this,
                grid,
                gridContainer = jQuery('<div id="municipalGrid" class="municipal-grid"></div>'),
                checkboxSelector;
            // clear and append municipal-grid container
            container.find('.municipal-grid').remove();
            container.append(gridContainer);
            // set initially selected region category
            this._selectedRegionCategory = this._state.regionCategory || this._defaultRegionCategory;
            this._setLayerToCategory(this._selectedRegionCategory);
            // add initial columns

            //This modified plugin adds checkboxes to grid
            checkboxSelector = new Slick.CheckboxSelectColumn2({
                cssClass: "slick-cell-checkboxsel"
            });
            this.checkboxSelector = checkboxSelector;

            // initial columns
            var columns = [
                me.checkboxSelector.getColumnDefinition(), {
                    id: "municipality",
                    name: this._locale.regionCategories[this._selectedRegionCategory],
                    field: "municipality",
                    sortable: true,
                    selectable: false
                }
            ];
            // options
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: false,
                multiColumnSort: false,
                showHeaderRow: true,
                showHeaderRowAsFooter: true,
                headerRowHeight: 128
            };

            var data = _.foldl(regiondata, function(result, indicator) {
                if (indicator.category === me._selectedRegionCategory) {
                    result.push({
                        id: indicator.id,
                        code: indicator.code,
                        municipality: indicator.title[Oskari.getLang()],
                        memberOf: indicator.memberOf,
                        sel: 'checked',
                        category: indicator.category
                    });
                }
                return result;
            }, []);
            // metadata provider for data view

            // metadata provider for data view
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            // dataview for the grid
            var dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: groupItemMetadataProvider,
                inlineFilters: false
            });
            // when the row changes re-render that row
            dataView.onRowsChanged.subscribe(function(e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
                grid.updateRowCount();
                grid.resizeCanvas();
            });

            // To use aggregators we need to define a group
            dataView.setGrouping({
                getter: "sel",
                comparer: function(a, b) {
                    //checkbox columns values are 'checked' and 'empty'
                    var ret = -1;
                    if (a.groupingKey === 'checked' && a.groupingKey === b.groupingKey) {
                        ret = 0;
                    } else if (a.groupingKey < b.groupingKey) {
                        // 'empty' is the first group
                        ret = 1;
                    }
                    return ret;
                },
                formatter: function(g) {
                    //a hack to name the groups
                    var text = (g.groupingKey === "checked" ?
                        me._locale.included :
                        me._locale.not_included) + " (" + g.count + ")";
                    return "<span style='font-weight: bold'>" + text + "</span>";
                },
                aggregateCollapsed: false
            });

            // Grid
            grid = new Slick.Grid(gridContainer, dataView, columns, options);

            grid.onHeaderClick.subscribe(function(e, args) {
                // Don't do anything in case the clicked column is the one in the state.
                if (args.column.id === me._state.currentColumn) {
                    return false;
                }
                me.sendStatsData(args.column);
            });

            // when headerRow cells are rendered
            // add placeholder
            grid.onHeaderRowCellRendered.subscribe(function(e, args) {
                jQuery(args.node).empty();
                jQuery(me.templates.subHeader)
                    .appendTo(args.node);
            });

            var cont;
            grid.onHeaderCellRendered.subscribe(function(e, args) {
                if (args.column.id == "municipality") {
                    cont = jQuery(args.node);
                    cont.empty();
                    me._renderMunicipalityColumn(cont, args.column);
                } else if (/^indicator/.test(args.column.id)) {
                    cont = jQuery(args.node);
                    cont.empty();
                    me._renderIndicatorColumn(cont, args.column);
                }
            });

            grid.onColumnsReordered.subscribe(function(e, args) {
                me.dataView.refresh();
            });

            var expanderPlugin = new Slick.Plugins.Expander({
                titleColumnId: "municipality",
                loadDataCallback: function(item) { return me._loadSubregions(me, item); },
                hasSubElementsCallback: function(item) { return me._hasSubElements(me, item); }
            });
            grid.registerPlugin(expanderPlugin);
            me.expanderPlugin = expanderPlugin;

            // register checboxSelector plugin
            grid.registerPlugin(checkboxSelector);
            // register groupItemMetadataProvider plugin (if not registered group toggles won't work)
            grid.registerPlugin(groupItemMetadataProvider);
            // Our new event to subscripe - this is called when checkbox is clicked
            checkboxSelector.onSelectRowClicked.subscribe(function(e, args) {
                var data = args.grid.getData(),
                    item = data.getItem(args.row),
                    groupsBeforeUpdate = data.getGroups().length;

                //doesn't allow to click if item has got parent
                if (item._parent != null)
                    return;

                //update item values (groupingkey is created from these)
                var selValue = jQuery(e.target).is(':checked') ? 'checked' : 'empty';
                item.sel = selValue;
                data.updateItem(item.id, item);

                var idx = data.getIdxById(item.id);
                var i = 1;
                var nextItem = null;
                while ((nextItem = data.getItemByIdx(idx + i)) && nextItem._parent != null) {
                    nextItem.sel = selValue;
                    data.updateItem(nextItem.id, nextItem);
                    i++;
                }

                // collapse group empty if it is created for the first time
                var groups = data.getGroups();
                if (groups.length > 1) {
                    var i,
                        group;
                    for (i = 0; i < groups.length; i++) {
                        group = groups[i];
                        if (group.groupingKey === 'empty' && group.count < 2 && groupsBeforeUpdate === 1) {
                            data.collapseGroup('empty');
                        }
                    }
                }
                // sendstats
                var column = me._getColumnById(me._state.currentColumn);
                me.sendStatsData(column);
                /*
                //TODO find a way to tell openlayers that some area should be hilighted without clicking them
                me.selectedMunicipalities[column.code] = (item.sel == "checked");
                */

                // resize grid (content/rows does not show extra rows otherwise. i.e. group headers & footers)
                args.grid.setColumns(me._fixColumns(args.grid.getColumns()));
                data.refresh();

            });

            //if header checkbox is clicked, update map
            checkboxSelector.onSelectHeaderRowClicked.subscribe(function(e, args) {

                // sendstats
                var column = me._getColumnById(me._state.currentColumn);
                me.sendStatsData(column);

            });

            me._initHeaderPlugin(columns, grid);

            // register header buttons plugin
            var headerButtonsPlugin = new Slick.Plugins.HeaderButtons();
            grid.registerPlugin(headerButtonsPlugin);

            // notify dataview that we are starting to update data
            dataView.beginUpdate();
            // set municipality data
            dataView.setItems(data);
            dataView.sort(function (a, b) { return a['municipality'] > b['municipality'] ? 1 : -1; });
            // notify data view that we have updated data
            dataView.endUpdate();
            // invalidate() -> the values in the grid are not correct -> invalidate
            grid.invalidate();
            // render the grid
            grid.render();
            // remember the grid object.
            me.grid = grid;
            me.dataView = dataView;

            // AH-885, we want the municipality column to fill 50% or so of the available space if it's the only column.
            //me.autosizeColumns();
            columns = grid.getColumns();
            columns[1].width = 250;
            me.setGridHeight();

            //window resize!
            var resizeGridTimer;
            jQuery(window).resize(function() {
                clearTimeout(resizeGridTimer);
                resizeGridTimer = setTimeout(function() {
                    me.setGridHeight();
                }, 100);
            });

            // Hackhack, initialoly sort by municipality column (slickgrid doesn't have an easy way to do this...)
            jQuery('.slick-header-columns').children().eq(1).trigger('click');
        },
        _renderMunicipalityColumn: function(cont, column) {
            var me = this;
            var regionSelectorContainer = jQuery(me.templates.selectorContainer);
            var selector = jQuery(me.templates.regionCategorySelector);
            var categoriesHierarchy =
                _.each(me._acceptedRegionCategories, function(category) {
                    if (me._categoriesHierarchy[category].type === "administrative") {
                        var categorySelector = jQuery('<option></option>');
                        categorySelector.html(me._locale.regionSelectorCategories[category]);
                        categorySelector.attr({
                            'id': 'category_' + category,
                            'value': category,
                            'selected': (category === me._selectedRegionCategory ? 'selected' : false)
                        });

                        categorySelector.appendTo(selector);
                    }
                });

            selector.change(function() {
                var selectedOptions = selector.find('option:selected');
                if (selectedOptions.length == 1) {
                    var selectedOption = selectedOptions[0];
                    me.changeGridRegion(selectedOption.value);
                }
            });

            regionSelectorContainer.append(selector);
            cont.append(regionSelectorContainer);

            var categoryIconContainer = jQuery("<div class='iconContainer'></div>");
            var hideEmptyItemsElement = jQuery('<span class="glyphicon glyphicon-upload" title="Piilota tyhjät rivit"></span>');
            hideEmptyItemsElement.click(function() {
                me._hideEmptyItemsInGrid();
            });
            categoryIconContainer.append(hideEmptyItemsElement);

            cont.append(categoryIconContainer);

            //                    var sortingSelectorContainer = jQuery(me.templates.selectorContainer);
            //                    sortingSelectorContainer.append(jQuery('<option value>Järjestä taulukko</option>'));
            //                    var sortingSelector = jQuery(me.templates.sortingSelector);
            //
            //                    sortingSelectorContainer.append(sortingSelector);
            //                    cont.append(sortingSelectorContainer);
            //
            //                    var filterInputContainer = jQuery(me.templates.selectorContainer);
            //                    var filterInput = jQuery(me.templates.filterInput);
            //
            //                    filterInputContainer.append(filterInput);
            //                    cont.append(filterInputContainer);
        },
        _renderIndicatorColumn: function(cont, column) {
            var me = this;
            var loc = me._locale;
            var nameElement = jQuery("<div class='statistic-name-header'></div>");
            nameElement.html(column.name);
            cont.append(nameElement);

            if (column.filter || column.geometry) {
                var filterContainer = jQuery("<div></div>");
                if (column.filter && JSON.parse(column.filter).length > 0) {
                    var filterByAreaElement = jQuery('<span class="glyphicon glyphicon-filter" title="Aluerajaus käytössä"></span>');
                    filterContainer.append(filterByAreaElement);
                }
                if (column.geometry) {
                    var filterByGeometryElement = jQuery('<span class="glyphicon glyphicon-picture" title="Karttarajaus käytössä"></span>');
                    filterContainer.append(filterByGeometryElement);
                }
                cont.append(filterContainer);
            }

            var iconContainer = jQuery("<div class='iconContainer'></div>");
            var trashElement = jQuery('<span class="glyphicon glyphicon-trash" title="Poista taulukosta"></span>');
            var sortElement = jQuery('<span class="glyphicon glyphicon-sort sorter" title="Järjestä"></span>');
            var chartElement = jQuery('<span class="glyphicon glyphicon-stats" title="Luo diagrammi"></span>');
            var infoElement = jQuery("<span style='display: inline-block;vertical-align: top;' class='icon-info' title='Taustatiedot'></span>");
            var tasksElement = jQuery('<span class="glyphicon glyphicon-tasks" id=' + column.id + ' title="'+loc.columnComparison.tasksElementTitle+'"></span>');
            if (column.indicatorData.columnComparison) {
                tasksElement.addClass('hidden');
            }

            trashElement.click(function(event) {
                if (column.deleteHandler) {
                    column.deleteHandler();
                    event.stopPropagation(); //prevent error from sorting column that has been removed
                }
            });

            tasksElement.click(function(event) {
                me._showColumnComparisonDialog(column);
            });

            chartElement.click(function(event) {
                me.sendChartRequest([column]);
            });

            infoElement.click(function(e) {
                me._showIndicatorInfoDialog(column.indicatorData.id);
            });

            iconContainer.append(trashElement);
            iconContainer.append(sortElement);
            iconContainer.append(tasksElement);
            iconContainer.append(chartElement);
            iconContainer.append(infoElement);

            cont.append(iconContainer);
        },
        _parseGridId: function(id) {
            var result = {};
            if (id == null || typeof id != "string")
                throw "Incorrect id format [" + id + "]";
            var array = id.split(":");
            if (array == null || array.length != 2)
                throw "Incorrect id format [" + id + "]";

            result.region = array[0];
            var functionalArray = array[1].split("_");
            if (functionalArray.length == 1) {
                result.id = Number(functionalArray[0]);
            } else if (functionalArray.length == 3) {
                result.id = Number(functionalArray[0]);
                result.functional = {
                    "id": Number(functionalArray[2]),
                    "name": functionalArray[1]
                };
            } else {
                throw "Incorrect id format [" + id + "]";
            }

            return result;
        },
        _hasSubElements: function(me, item) {
            if (me.mode === 'twoway') { //twoway commuting statistics do not need drilling down
                return false;
            }
            var regionCategory = item.category;
            return (me._categoriesHierarchy[regionCategory] && me._categoriesHierarchy[regionCategory].type === "administrative" && me._state.functionalRows && me._state.functionalRows.length > 0) || (me._categoriesHierarchy[regionCategory] && me._categoriesHierarchy[regionCategory].child != null);
        },
        _loadSubregions: function(me, item) {
            var items = [];
            var regionCategory = item.category;

            if (me._categoriesHierarchy[regionCategory] && me._categoriesHierarchy[regionCategory].type === "administrative" && me._state.functionalRows && me._state.functionalRows.length > 0) {
                $.each(me._state.functionalRows, function (index, functionalRow) {
                    if (functionalRow.key !== 'intersection') {
                        $.each(me.regionCategories[functionalRow.key], function (index, category) {
                            if (category.id.split(":")[1] == functionalRow.id) {
                                var newCategory = $.extend(true, {}, category);
                                newCategory.sel = item.sel;
                                newCategory.id = item.id + "_" + functionalRow.key + "_" + functionalRow.id + "_" + functionalRow.areaYear;
                                newCategory.code = item.code;

                                me._setIndicatorValuesForIndicatorsInGrid(newCategory);

                                newCategory.memberOf.push(item.id);
                                if (typeof newCategory.municipality !== 'string') {
                                    newCategory.municipality = newCategory.title;
                                }
                                newCategory.municipality = newCategory.municipality + " (" + functionalRow.areaYear + ")";

                                items.push(newCategory);
                            }
                        });
                    } else {
                        var newCategory = {};
                        newCategory.sel = item.sel;
                        newCategory.id = item.id + "_" + functionalRow.key + "_" + functionalRow.id + "_" + functionalRow.areaYear;

                        me._setIndicatorValuesForIndicatorsInGrid(newCategory);

                        newCategory.memberOf = [item.id];
                        newCategory.municipality = 'Leikkaus';
                        items.push(newCategory);
                    }
                });
            } else if (me._categoriesHierarchy[regionCategory] && me._categoriesHierarchy[regionCategory].child != null) {

                var childRegionCategory = me._categoriesHierarchy[regionCategory].child;
                var regionId = item.id;
                var subRegions = _.clone(me.regionCategories[childRegionCategory], true);
                var i = 0;
                for (; i < subRegions.length; i++) {
                    var subRegion = subRegions[i];
                    if (me._itemBelongsToAnyRegions(subRegion, [regionId])) {

                        /* set additional parameters to data */
                        subRegion.sel = item.sel;
                        me._setIndicatorValuesForIndicatorsInGrid(subRegion);

                        items.push(subRegion);
                    }
                }
            }

            items.sort(function (a, b) {
                if(a['municipality'] === 'Leikkaus') {
                    return 1;
                } else if (b['municipality'] === 'Leikkaus') {
                    return -1;
                } else {
                    return a['municipality'] > b['municipality'] ? 1 : -1;
                }
            });

            return items;
        },
        _setIndicatorValuesForIndicatorsInGrid: function(item) {
            var columns = this.grid.getColumns();
            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                var columnId = column.id;
                if (columnId.indexOf('indicator') < 0 || this.indicatorsData[columnId] == null)
                    continue;
                for (var k = 0; k < this.indicatorsData[columnId].length; k++) {
                    var indData = this.indicatorsData[columnId][k];
                    if (indData.region == item.id) {
                        var value = indData['primary value'];
                        if(typeof value !== 'undefined' && value !== null) {
                            value = value.replace(',', '.');
                        }
                        var numValue = Number(value);
                        item[columnId] = isNaN(numValue) ? value : numValue;
                        break;
                    }
                }
            }
        },
        _expandAllSubitemsInGrid: function () {
            var me = this;
            me.expanderPlugin.expandAll();
            me._hideEmptyItemsInGrid();
        },
        _hideEmptyItemsInGrid: function() {
            var data = this.grid.getData(),
                columns = this.grid.getColumns(),
                items = data.getItems(),
                item,
                i,
                j,
                newSel,
                id;
            var columnIds = [];
            for (j = 0; j < columns.length; j++) {
                if (columns[j].id.indexOf('indicator') < 0)
                    continue;
                columnIds.push(columns[j].id);
            }

            data.beginUpdate();
            for (i = 0; i < items.length; i++) {
                item = items[i];
                newSel = 'empty';

                for (j = 0; j < columnIds.length; j++) {
                    var columnId = columnIds[j];
                    if (item.hasOwnProperty(columnId) && (item[columnId] != null || item[columnId + "_PrivacyLimitTriggered"] == true || item[columnId + "_NullValue"] == true)) {
                        newSel = 'checked';
                        break;
                    }
                }

                if (item.sel != newSel) {
                    item.sel = newSel;
                    data.updateItem(item.id, item);
                }
            }
            for (i = 0; i < items.length; i++) {
                item = items[i];
                //FIXME: works only in one level of drilling down
                if (item._parent != null) {
                    if(!item.category || this._categoriesHierarchy[item.category].type === "functional") {
                        continue;
                    }
                    var parentItem = data.getItemById(item._parent);
                    if (item.sel != parentItem.sel) {
                        item.sel = parentItem.sel;
                        data.updateItem(item.id, item);
                    }
                }
            }
            data.collapseGroup('empty');
            data.endUpdate();
            data.refresh();
        },
        /**
         * Sets the height of the grid container and handles resizing of the SlickGrid.
         *
         * @method setGridHeight
         */
        setGridHeight: function() {
            if (typeof this.grid === 'undefined')
                return;
            // size of top element
            var heightOffset = 0;
            var gridDiv = jQuery("#municipalGrid"),
                parent = gridDiv.parent(),
                selectorsCont = parent.find('.selectors-container'),
                tabMenuHeight = 0,
                selectorsHeight = 0;
            if (selectorsCont.length > 0) {
                selectorsHeight = selectorsCont.outerHeight();
            }
            var tabMenu = parent.find('div.indicatorsSource');
            if (tabMenu.length > 0) {
                tabMenuHeight = tabMenu.outerHeight();
            }

            gridDiv.height(parent.height() - heightOffset);

            this.grid.resizeCanvas();
        },

        /**
         * Returns the index of the item with the code provided.
         *
         * @method getIdxByCode
         * @param {String} code
         */
        getIdxByCode: function(code) {
            var returnItem = this.getItemByCode(code);

            if (returnItem) {
                var row = this.dataView.getRowById(returnItem.id);
                return (row || -1);
            }
            return null;
        },

        getItemByCode: function(code) {
            var items = this.dataView ? this.dataView.getItems() : [];

            return _.find(items, function(item) {
                return code === item.code;
            });
        },

        /**
         * Fetch all Sotka indicators
         *
         * @method getSotkaIndicators
         * @param container element
         */
        getSotkaIndicators: function(container) {
            var me = this,
                sandbox = me._sandbox;

            if(typeof container === 'undefined' || container === null) {
                return;
            }
            // make the AJAX call
            me.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=indicators&version=1.1&format=tree',
                //success callback
                function(indicatorsdata) {
                    if(me.mode !== 'all') {
                        //user changed mode while loading, cancel operation
                        return;
                    }
                    if (indicatorsdata) {
                        me.setTreeIndicatorsdata(indicatorsdata);
                        //if fetch returned something we create drop down selector
                        me.createDemographicsSelects(container, null);
                        me.getSotkaFlatIndicators(container);

                        // update slick grid
                        me.setGridHeight();
                    } else {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorsDataError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorsDataXHRError);
                },
                me.ignoreCache);
        },
        _setStateFromServicePackage: function (servicePackageData) {
            var me = this;
            me._state.indicators = [];
            var stack = [];
            var el, i;

            for (i = 0; i < servicePackageData.length; i++) {
                if (servicePackageData[i].type == 'statistics')
                    stack.push(servicePackageData[i]);
            }

            while ((el = stack.pop()) != null) {
                if (el.themes != null) {
                    for (i = 0; i < el.themes.length; i++) {
                        stack.push(el.themes[i]);
                    }
                }
                if (el.elements != null) {
                    for (i = 0; i < el.elements.length; i++) {
                        if (el.elements[i].type == 'statistic') {
                            if (el.elements[i].status == 'drawn') {
                                var elementId = el.elements[i].id;
                                //get metadata and get the newest year
                                var cb = function(metadata) {
                                    if (metadata != null && metadata.years != null && metadata.years.length > 0) {
                                        var newestYear = metadata.years.sort(function (a, b) { return b - a; })[0];
                                        me._state.indicators.push({
                                            'direction': undefined,
                                            'filter': "[]",
                                            'gender': "total",
                                            'geometry': null,
                                            'group': null,
                                            'id': metadata.id,
                                            'mode': "all",
                                            'type': undefined,
                                            'year': newestYear,
                                        });
                                        var indicator = me._state.indicators[me._state.indicators.length - 1];
                                    }
                                }
                                var metadataUrl = me._sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=indicator_metadata&indicator=' + elementId + '&version=1.1';
                                me.statsService.fetchStatsData(metadataUrl, cb);
                            }
                        }
                    }
                }
            }
        },
        getServicePackageIndicators: function(container) {
            var me = this;

            var servicePackageData = me.instance.servicePackageData;
            if (servicePackageData) {
                var indicatorsdata = me.translateServicePackagetoIndicatorsData(servicePackageData);

                if (indicatorsdata) {
                    me.setTreeIndicatorsdata(indicatorsdata);
                    //if fetch returned something we create drop down selector
                    me.createDemographicsSelects(container, null);

                    me.getSotkaFlatIndicators(container, true);

                    // update slick grid
                    me.setGridHeight();
                } else {
                    //me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorsDataError);
                    //filter indicators
                    me.updateIndicatorsSelectByIds(container, me.servicePackageIndicatorIds);
                }
            }
        },
        /**
         * Temporary method for translating data incoming from service package to data which is expected in methods creating dropdowns with statistics.
         * TODO: change incoming data to make this translation not needed
         */
        translateServicePackagetoIndicatorsData: function(servicePackageData) {
            this.servicePackageIndicatorIds = new Array();

            var indicatorsdata = { themes: [] };

            function createTreeData(parent, data) {
                var node = {
                    fi: data.name,
                    themes: [],
                    indicators: [],
                    id: data.name
                };
                var subThemes = $.extend($.extend([], data.themes), data.elements);

                for (var i = 0; i < subThemes.length; ++i) {
                    if (subThemes[i].type == "statistics") {
                        createTreeData(node, subThemes[i]);
                    } else if (subThemes[i].type == "statistic") {
                        node.indicators.push(subThemes[i].id);
                    }
                }

                parent.themes.push(node);
            }

            for (var t0 = 0; t0 < servicePackageData.length; t0++) {
                if (servicePackageData[t0].type == "statistics") {
                    createTreeData(indicatorsdata, servicePackageData[t0]);
                }
            }
            return indicatorsdata;
        },

        getTwowayIndicators: function(container) {
            var me = this;

            me.statsService.fetchTwowayIndicators(function(data) {
                    if (data && me.mode === 'twoway') {
                        me.createTwowayUI(container, data);
                    }
                },
                function() { alert("error"); },
                true);
        },

        createTwowayUI: function(container, data) {
            var me = this;
            // Indicators' select container etc.
            var indi = jQuery('<br /><div class="indicator-cont"><div class="indisel selector-cont"><label for="indi">' + this._locale.indicators + '</label><select id="indi" name="indi" class="indi"></select></div></div>'),
                sel = indi.find('select'),
                indicData,
                lastVal;

            for (var i = 0; i < data.length; i++) {
                indicData = data[i];

                var value = lastVal = indicData["id"];
                var name = indicData.name[Oskari.getLang()];
                var themes = new Array();
                if (indicData.hasOwnProperty("themes")) {
                    for (var j = 0; j < indicData.themes.length; j++) {
                        themes.push(indicData.themes[j][Oskari.getLang()]);
                    }
                }
                var title = name + ' ' + themes.join(' ');
                var opt = jQuery('<option value="' + value + '">' + title + '</option>');
                //append option
                sel.append(opt);
                data[i].titlename = title;
            }

            // if the value changes, fetch indicator meta data
            sel.change(function(e) {
                var indicator = sel.find('option:selected').val();
                me.deleteIndicatorInfoButton(container);
                me.deleteDemographicsSelect(container);
                me.getTwowayIndicatorMeta(container, indicator);
            });

            var selectorsContainer = container.find('#selectors-statistic');
            selectorsContainer.empty().append(indi);

            selectorsContainer.append(me.getGenderSelectorHTML([]));
            selectorsContainer.append(me.getTypeSelectorHTML([]));
            selectorsContainer.append(me.getDirectionSelectorHTML([]));

            selectorsContainer.find('select.gender').chosen({disable_search: true,
                width: "210px"});
            selectorsContainer.find('select.type').chosen({placeholder_text: me._locale.selectIndicatorPlaceholder,
                width: "210px"});
            me.createDemographicsSelects(container, null);
            // we use chosen to create autocomplete version of indicator select element.
            sel.chosen({
                disable_search: true,
                width: "210px"
            });

            sel.val(lastVal).change();
            sel.trigger("chosen:updated");
        },

        getTwowayIndicatorMeta: function(container, indicator) {
            var me = this,
                sandbox = me._sandbox;
            // fetch meta data for given indicator
            me.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetTwowayData&action=indicator_metadata&indicator=' + indicator + '&version=v1',
                // success callback
                function(indicatorMeta) {
                    if (indicatorMeta) {
                        //if fetch returned something we create drop down selector
                        me.createIndicatorInfoButton(container, indicatorMeta);

                        if (me._hasRegionCategoryValues(indicatorMeta)) {
                            me.createDemographicsSelects(container, indicatorMeta);
                        } else {
                            me._warnOfInvalidIndicator(container, indicatorMeta);
                        }
                    } else {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaXHRError);
                },
                me.ignoreCache);
        },
        /*
         * Temporary method to get indicator's name based on ID
         */

        getIndicatorName: function(id) {
        },

        getSotkaFlatIndicators: function(container, isSservicePackage) {
            var me = this,
                sandbox = me._sandbox;
            // make the AJAX call
            me.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=indicators&version=1.1',
                //success callback
                function(flatIndicatorsdata) {

                    if (flatIndicatorsdata) {
                        if (me.mode === 'twoway') {
                            return;
                        }
                        me.setFlatIndicatorsdata(flatIndicatorsdata);
                        //if fetch returned something we create drop down selector
                        me.createStatsTree(container, me.getTreeIndicatorsdata(), flatIndicatorsdata);
                        //me.createIndicatorsSelect(container, flatIndicatorsdata);
                        me.createDemographicsSelects(container, null);

                        me.setGridHeight();

                        if (isSservicePackage) {
                            //filter indicators
                            me.updateIndicatorsSelectByIds(container, me.servicePackageIndicatorIds);
                        }

                    } else {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorsDataError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.setFlatIndicatorsdata('asd');
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorsDataXHRError);
                },
                me.ignoreCache);
        },

        updateIndicatorsSubthemeSelect: function(container, selectName, indicData) {
            var me = this;
            var sel = container.find(selectName),
                indicData,
                opt;

            sel.empty();

            //append empty option
            var opt = jQuery('<option value="">' + me._locale.indicatorFilters.selectTheme + '</option>');
            sel.append(opt);

            var onlyEmptyValue = true;

            if (typeof indicData !== 'undefined' && indicData.hasOwnProperty("themes")) {
                for (var j = 0; j < indicData.themes.length; j++) {
                    themeName = indicData.themes[j][Oskari.getLang()];
                    opt = jQuery('<option value="' + j + '">' + themeName + '</option>');
                    sel.append(opt);

                    if (themeName != "") {
                        onlyEmptyValue = false;
                    }
                }
            }

            if (onlyEmptyValue) {
                $(selectName).parent().hide();
                //no more themes to show
            } else {
                $(selectName).parent().show();
            }
        },

        updateIndicatorsSelect: function(container, id) {
            var me = this;
            var sel = container.find('#indi');

            sel.empty();

            //append empty option
            var opt = jQuery('<option value="">' + me._locale.indicatorFilters.selectTheme + '</option>');
            sel.append(opt);

            data = this.getFlatIndicatorsdata();

            for (var i = 0; i < data.length; i++) {
                indicData = data[i];

                for (key in indicData) {
                    if (indicData.hasOwnProperty(key)) {
                        if (key === "id" && indicData[key] == id) {
                            var value = indicData[key];
                            var name = indicData.name[Oskari.getLang()];
                            var themes = new Array();
                            for (var j = 0; j < indicData.themes.length; j++) {
                                themes.push(indicData.themes[j][Oskari.getLang()]);
                            }
                            var title = name + ' ' + themes.join(' ');
                            var opt = jQuery('<option value="' + value + '">' + title + '</option>');
                            //append option
                            sel.append(opt);
                            data[i].titlename = title;
                        }
                    }
                }
            }

            sel.trigger("chosen:updated");
        },

        updateIndicatorsSelectByIds: function(container, ids) {
            var me = this;
            var sel = container.find('#indi');

            sel.empty();

            //append empty option
            var opt = jQuery('<option value="">' + me._locale.indicatorFilters.selectTheme + '</option>');
            sel.append(opt);

            var data = this.getFlatIndicatorsdata();

            for (var z = 0; z < ids.length; z++) {
                var id = ids[z];
                for (var i = 0; i < data.length; i++) {
                    var indicData = data[i];

                    for (key in indicData) {
                        if (indicData.hasOwnProperty(key)) {
                            if (key === "id" && indicData[key] == id) {
                                var value = indicData[key];
                                var name = indicData.name[Oskari.getLang()];
                                var themes = new Array();
                                for (var j = 0; j < indicData.themes.length; j++) {
                                    themes.push(indicData.themes[j][Oskari.getLang()]);
                                }
                                var title = name + ' ' + themes.join(' ');
                                var opt = jQuery('<option value="' + value + '">' + title + '</option>');
                                //append option
                                sel.append(opt);
                                data[i].titlename = title;
                            }
                        }
                    }
                }
            }

            sel.trigger("chosen:updated");
        },

        updateIndicatorsSelectByThemes: function(container, themesFilter) {
            var me = this;
            var sel = container.find('#indi');

            var ids = [];

            var getAllIndicators = function(data) {
                var ret = [].concat(data.indicators);
                if (typeof data.themes != 'undefined') {
                    for (var i = 0; i < data.themes.length; ++i) {
                        ret = ret.concat(getAllIndicators(data.themes[i]));
                    }
                }
                return ret;
            };
            var findIndicators = function(data, themeFilter) {
                for (var i = 0; i < data.length; ++i) {
                    if (themeFilter.length == 0) {
                        ids = ids.concat(getAllIndicators(data[i]));
                    } else if (data[i].fi == themeFilter[0]) {
                        if (themeFilter.length > 1) {
                            findIndicators(data[i].themes, themeFilter.slice(1));
                        } else {
                            ids = getAllIndicators(data[i]);
                        }
                    }
                }
            };
            sel.empty();

            //append empty option
            var opt = jQuery('<option value="">' + me._locale.indicatorFilters.selectTheme + '</option>');
            sel.append(opt);

            var iData = this.getTreeIndicatorsdata();

            findIndicators(iData.themes, themesFilter);

            //one indicator can be in multiple themes, remove duplicates
            var uniqueIds = [];
            $.each(ids, function(i, el) {
                if ($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
            });

            me.updateIndicatorsSelectByIds(container, uniqueIds);

            sel.trigger("chosen:updated");
        },

        /**
         * Create indicators drop down select
         *
         * @method createIndicatorsSelect
         * @param container parent element
         * @param data contains all the indicators
         */
        createIndicatorsSelect: function(container, data) {

        },

        createStatsTree: function(container, treeData, indicatorData) {
            var me = this;
            var lang = Oskari.getLang();
            var statsTree = jQuery('<div class="statsTreeContainer"><div class="info">Valitse haettavat tilastot listasta. Tilastot haetaan, kun olet painanut alhaalta Laske. <span id="selectedStatsInfo"></span></div><span class="expandTree"><i class="expand-icon"></i></span> <span class="collapseTree"><i class="collapse-icon"></i></span><div class="oskarifield"><input type="text" name="statsTreeFilter" placeholder="Suodata" id="statsTreeFilterInput" class="filterRow"></div><div id="statsTree"></div></div>');
            var selectorsContainer = container.find('#selectors-statistic').empty();
            selectorsContainer.append(statsTree);
            var info = $('#selectedStatsInfo');
            info.text(me._locale.numberOfSelectedIndicators.replace('{0}', '0'));

            var tree = { children: [] };
            var comparerByOrderNumber = function (a, b) { return a.orderNumber - b.orderNumber; };
            var comparerById = function (a, b) { return a.id - b.id; };
            var comparerByName = function(a, b) {
                var aName = a.title.toLowerCase();
                var bName = b.title.toLowerCase();
                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
            };

            function createTreeNode(parent, themes, indicators, searchKey) {
                $.each(themes, function(index, value) {
                    var node = {
                        title: value['fi'],
                        folder: true,
                        children: [],
                        key: "theme." + value.id,
                        icon: false,
                        orderNumber: Number.MAX_VALUE,
                    };

                    if (searchKey) {
                        node.searchKey = searchKey + " " + node.title.toUpperCase();
                    } else {
                        node.searchKey = node.title.toUpperCase();
                    }
                    createTreeNode(node, value.themes, value.indicators, node.searchKey);

                    //do not include in tree if branch is empty
                    if (node.children.length > 0) {
                        parent.children.push(node);
                        if (parent.orderNumber > node.orderNumber) {
                            parent.orderNumber = node.orderNumber;
                        }
                    }
                });
                $.each(indicators, function(index, value) {
                    var item = $.grep(indicatorData, function(item) {
                        return item.id == value;
                    });
                    if (item.length > 0 && item[0].name) {
                        var node = {
                            //title: item[0].name[lang] + " " + item[0].orderNumber,
                            title: item[0].name[lang],
                            key: value,
                            icon: false,
                            orderNumber: item[0].orderNumber
                        };

                        if (searchKey) {
                            node.searchKey = searchKey + " " + node.title.toUpperCase();
                        } else {
                            node.searchKey = node.title.toUpperCase();
                        }

                        parent.children.push(node);
                        if (parent.orderNumber > node.orderNumber) {
                            parent.orderNumber = node.orderNumber;
                        }
                    }
                });
                //parent.title = parent.title + " " + parent.orderNumber;
            }

            createTreeNode(tree, treeData.themes, []);

            var stack = [tree];
            var currentElement;
            while ((currentElement = stack.pop()) != null) {
                if (currentElement.hasOwnProperty('children')) {
                    currentElement.children.sort(comparerByOrderNumber);
                    for (var ix = 0; ix < currentElement.children.length; ix++) {
                        stack.push(currentElement.children[ix]);
                    }
                }
            }
            tree.children.sort(comparerByName);

            statsTree.find("#statsTree").fancytree({
                select: function(event, data) {
                    var nodes = statsTree.find("#statsTree").fancytree("getTree").getSelectedNodes();
                    var keys = [];
                    for (var i = 0; i < nodes.length; ++i) {
                        if (nodes[i].key.indexOf("theme.") === -1) {
                            keys.push(nodes[i].key);
                        }
                    }

                    info.text(me._locale.numberOfSelectedIndicators.replace('{0}', keys.length));

                    if (data.node.isSelected()) {
                        /* expand node and subnodes */
                        var stack = [data.node];
                        while (stack.length > 0) {
                            var node = stack.pop();
                            node.setExpanded(true);
                            if (node.hasChildren()) {
                                var children = node.getChildren();
                                for (var ix = 0; ix < children.length; ix++) {
                                    stack.push(children[ix]);
                                }
                            }
                        }
                    }

                    var indicators = [];

                    if (keys.length == 0) {
                        me.updateFilterRegionCategorySelector();
                        me.updateYearSelectorValues(jQuery('.statsgrid').find('.yearsel').find('.year'), []);
                    } else {
                        for (var i = 0; i < keys.length; ++i) {
                            me.statsService.fetchStatsData(me._sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=indicator_metadata&indicator=' + keys[i] + '&version=1.1',
                                // success callback
                                function(indicatorMeta) {
                                    if (indicatorMeta) {

                                        indicators.push(indicatorMeta);

                                        if (me._hasRegionCategoryValues(indicatorMeta)) {
                                            if (keys.length === indicators.length) {
                                                me.createDemographicsSelects(container, indicators);
                                            }
                                        } else {
                                            me._warnOfInvalidIndicator(container, indicatorMeta);
                                        }
                                    } else {
                                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaError);
                                    }
                                },
                                // error callback
                                function(jqXHR, textStatus) {
                                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaXHRError);
                                },
                                me.ignoreCache);
                        }
                    }
                },
                source: tree.children,
                imagePath: "/skin-liiteri/",
                extensions: ["filter"],
                renderNode: function(event, data) {
                    var node = data.node;
                    if (!node.folder) {
                        var $span = $(node.span);
                        if (!$span.find("span.icon-info").length) {
                            var infoIcon = $("<span style='display: inline-block;vertical-align: top;' class='icon-info'></span>");
                            infoIcon.click(function(e) {
                                me._showIndicatorInfoDialog(node.key);
                            });
                            $span.append(infoIcon);
                        }
                    }
                },
                expand: function (event, data) {
                    /* remove default style because it sets overlflow: hidden */
                    if (data.node && data.node.ul) {
                        $(data.node.ul).removeAttr('style');
                    }
                },
                checkbox: true,
                clickFolderMode: 3,
                selectMode: 3,
                autoScroll: true,
                filter: {
                    mode: "hide"
                }
            });

            statsTree.find(".collapseTree").click(function() {
                statsTree.find("#statsTree").fancytree("getRootNode").visit(function(node) {
                    node.setExpanded(false);
                });
                return false;
            });

            statsTree.find(".expandTree").click(function() {
                statsTree.find("#statsTree").fancytree("getRootNode").visit(function(node) {
                    if (!$(node.span).hasClass("fancytree-hide") || ($(node.span).hasClass("fancytree-match") || $(node.span).hasClass("fancytree-submatch"))) {
                        node.setExpanded(true, { noAnimation: true });
                    }
                });
                return false;
            });

            statsTree.find("#statsTreeFilterInput").keyup(function(e) {
                var n,
                    leavesOnly = false,
                    match = $(this).val().toUpperCase();

                if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                    statsTree.find("#statsTree").fancytree("getTree").clearFilter();
                    return;
                }

                // Pass a string to perform case insensitive matching
                n = statsTree.find("#statsTree").fancytree("getTree").filterNodes(function(node) {
                    return node.data.searchKey.indexOf(match) > -1;
                }, leavesOnly);

            }).focus();

        },

        createFunctionalAreasTree: function(container) {
            var me = this,
                params = [];
            _.each(me.regionCategories, function(values, name) {
                if (me._categoriesHierarchy[name].type === "functional" && me._categoriesHierarchy[name].child !== null) {
                    _.each(values, function(value) {
                        var children = $.grep(me.regionCategories[me._categoriesHierarchy[name].child], function(item) {
                            return _.contains(item.memberOf, value.id);
                        });

                        if(children.length > 0) {
                            params.push({
                                'folder': true,
                                'key': value.id,
                                'title': value.title,
                                'icon': false,
                                'children': value.availabilityYears.map(function(y) {
                                    return {
                                        'folder': true,
                                        'key': y,
                                        'title': y,
                                        'icon': false,
                                        'orderNumber': -y,
                                        'children': children.map(function(v) {
                                            return {
                                                'key': v.category + ":" + v.id.split(":")[1] + ":" + y,
                                                'categoryKey': v.category,
                                                'categoryId': v.id.split(":")[1],
                                                'year': y,
                                                'title': v.municipality,
                                                'icon': false,
                                                'orderNumber': v.orderNumber
                                            }
                                        })
                                    }
                                })

                            });
                        }
                    });
                }
            });

            params.sort(function(a, b) {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });

            _.each(params, function(item, index) {
                item.children.sort(function(a, b) {
                    if (a.hasOwnProperty("orderNumber") && b.hasOwnProperty("orderNumber")
                            && typeof a.orderNumber !== 'undefined' && typeof b.orderNumber !== 'undefined'
                                && a.orderNumber - b.orderNumber != 0)
                        return a.orderNumber - b.orderNumber;
                    if (a.title < b.title) return -1;
                    if (a.title > b.title) return 1;
                    return 0;
                });

                _.each(item.children, function(children, index) {
                    children.children.sort(function(a, b) {
                        if (a.hasOwnProperty("orderNumber") && b.hasOwnProperty("orderNumber")
                                && typeof a.orderNumber !== 'undefined' && typeof b.orderNumber !== 'undefined'
                                    && a.orderNumber - b.orderNumber != 0)
                            return a.orderNumber - b.orderNumber;
                        if (a.title < b.title) return -1;
                        if (a.title > b.title) return 1;
                        return 0;
                    });
                });
            });

            container.fancytree({
                checkbox: true,
                clickFolderMode: 3,
                selectMode: 3,
                autoScroll: true,
                source: params,
                imagePath: "/skin-liiteri/",
                select: function(event, data) {
                    var nodes = container.fancytree("getTree").getSelectedNodes();
                    var checkbox = $('#functionalAreasIntersection');
                    var allowed = true;

                    var selectedTypes = [];
                    var selectedYears = [];

                    $.each(nodes, function(index, item) {
                        if (!item.folder) {
                            if ($.inArray(item.parent.parent.key, selectedTypes) > -1) {
                                allowed = false;
                                return false;
                            }
                            selectedTypes.push(item.parent.parent.key);
                            selectedYears.push(item.parent.key);
                            selectedYears = _.uniq(selectedYears);
                            if(selectedTypes.length > 2 || selectedYears.length > 1) {
                                allowed = false;
                                return false;
                            }
                        }
                    });

                    if (allowed) {
                        checkbox.removeAttr("disabled");
                    } else {
                        checkbox.attr("disabled", true).attr('checked', false);
                    }

                    if (data.node.isSelected()) {
                        /* expand node and subnodes */
                        var stack = [data.node];
                        while (stack.length > 0) {
                            var node = stack.pop();
                            node.setExpanded(true);
                            if (node.hasChildren()) {
                                var children = node.getChildren();
                                for (var ix = 0; ix < children.length; ix++) {
                                    stack.push(children[ix]);
                                }
                            }
                        }
                    }
                },
                expand: function (event, data) {
                    /* remove default style because it sets overlflow: hidden */
                    if (data.node && data.node.ul) {
                        $(data.node.ul).removeAttr('style');
                    }
                }
            });
        },

        /**
         *
         */
        _addOwnIndicatorButton: function(paramCont, container) {
            var me = this,
                button = jQuery(me.templates.addOwnIndicator);

            button.find('input').val(me._locale.addDataButton);

            paramCont.append(button);
            button.find('input').click(function(e) {
                // Warn the user if they're not logged in
                if (!me._sandbox || !me._sandbox.getUser().isLoggedIn()) {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okBtn.setTitle(me._locale.buttons.ok);
                    okBtn.addClass('primary');
                    okBtn.setHandler(function() {
                        dialog.close(true);
                        me.createIndicatorForm(container);
                    });
                    dialog.show(me._locale.addDataTitle, me._locale.loginToSaveIndicator, [okBtn]);
                } else {
                    me.createIndicatorForm(container);
                }
            });
        },
        createIndicatorForm: function(container) {
            var me = this,
                form = Oskari.clazz.create(
                    'Oskari.statistics.bundle.statsgrid.AddOwnIndicatorForm',
                    me._sandbox, me._locale, me.regionCategories,
                    me._layer.getWmsName(), me._layer.getId(),
                    me._selectedRegionCategory);

            container.find('.selectors-container').hide();
            container.find('#municipalGrid').hide();
            form.createUI(container, function(data) {
                me._addUserIndicatorToGrid(data, container, me);
            });
        },
        _addUserIndicatorToGrid: function(data, container, me) {
            var indicator = {};
            indicator.title = JSON.parse(data.title);
            indicator.organization = {
                'title': {
                    'fi': 'Käyttäjän tuomaa dataa'
                }
            };
            indicator.description = JSON.parse(data.title);
            // me.indicators.push(indicator);
            data.data = JSON.parse(data.data);

            var state = me.getState();
            (state.indicators = state.indicators || []).push({
                id: data.indicatorId,
                gender: 'total',
                year: data.year,
                data: data.data,
                title: JSON.parse(data.title),
                description: JSON.parse(data.description),
                organization: {
                    'title': JSON.parse(data.source)
                },
                category: data.category,
                'public': data.published,
                ownIndicator: true
            });

            if (me._selectedRegionCategory !== data.category) {
                me.changeGridRegion(data.category);
            }

            // Show the data in the grid.
            me.addIndicatorDataToGrid(container, data.indicatorId, 'total', data.year, data.geometry, data.filter, data.type, data.direction, data.data, indicator);
        },
        /**
         * Get Sotka indicator meta data
         *
         * @method getSotkaIndicatorMeta
         * @param container parent element.
         * @param indicator id
         */
        getSotkaIndicatorMeta: function(container, indicator) {
            var me = this,
                sandbox = me._sandbox;
            // fetch meta data for given indicator
            me.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
                // success callback
                function(indicatorMeta) {
                    if (indicatorMeta) {
                        //if fetch returned something we create drop down selector
                        me.createIndicatorInfoButton(container, indicatorMeta);

                        if (me._hasRegionCategoryValues(indicatorMeta)) {
                            me.createDemographicsSelects(container, indicatorMeta);
                        } else {
                            me._warnOfInvalidIndicator(container, indicatorMeta);
                        }
                    } else {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaXHRError);
                },
                me.ignoreCache);

        },
        /**
         * Checks if the indicator has values on the current category.
         * If it does not, we cannot display it in the grid at the moment.
         *
         * @method _hasRegionCategoryValues
         * @param  {Object} metadata indicator metadata from SOTKAnet
         * @return {Boolean}
         */
        _hasRegionCategoryValues: function(metadata) {
            var regions = metadata.classifications;
            regions = regions && regions.region;
            regions = regions && regions.values;
            regions = regions || [];
            var rLen = regions.length,
                currentCategory = (this._selectedRegionCategory ? this._selectedRegionCategory.toLowerCase() : ""),
                i;

            for (i = 0; i < rLen; ++i) {
                if (regions[i].toLowerCase() === currentCategory) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Displays a warning of invalid indicator for the grid
         * if the indicator does not have values on the current category.
         *
         * @method _warnOfInvalidIndicator
         * @param  {jQuery} container
         * @param  {Object} metadata
         * @return {undefined}
         */
        _warnOfInvalidIndicator: function(container, metadata) {
            var regions = metadata.classifications,
                warnTxt = this._locale.cannotDisplayIndicator;
            regions = regions && regions.region;
            regions = regions && regions.title;
            regions = regions && regions[Oskari.getLang()];


            if (regions) {
                warnTxt += (this._locale.availableRegions + regions);
            }
            this.disableDemographicsSelect(container);
            this.showMessage(this._locale.indicators, warnTxt, null);
        },
        /**
         * Create indicator meta info button
         *
         * @method createIndicatorInfoButton
         * @param container parent element
         * @param indicator meta data
         */
        createIndicatorInfoButton: function(container, indicator) {
            var me = this,
                infoIcon = jQuery('<div class="icon-info"></div>'),
                indicatorCont = container.find('.indicator-cont');
            // clear previous indicator
            indicatorCont.find('.icon-info').remove();
            // append this indicator
            indicatorCont.append(infoIcon);
            // show meta data
            infoIcon.click(function(e) {
                var lang = Oskari.getLang();
                var themeNames = [];

                if (indicator.hasOwnProperty('themes')) {
                    for (var i = 0; i < indicator.themes.length; i++) {
                        if (indicator.themes[i][lang] != null) {
                            themeNames.push(indicator.themes[i][lang]);
                        }
                    }
                }

                me.createIndicatorInfoDialog(themeNames.join(" | "), indicator);

            });
        },

        createIndicatorInfoDialog: function(themes, indicator) {
            var me = this;
            var lang = Oskari.getLang();
            var gridYearsPart = "";
            if(me.instance.conf.gridDataAllowed) {
                gridYearsPart = me._locale.stats.gridYearsTitle + '</td><td>' + indicator.gridYears.sort(function (a, b) {return b - a;}).join(", ") + '</td></tr><tr><td>'
            }
            var desc = themes + '<table class="table"><tr><td>' +
                me._locale.stats.descriptionTitle + '</td><td>' + indicator.description[lang] + '</td></tr><tr><td>' +
                me._locale.stats.sourceTitle + '</td><td>' + me._getDataSourcesInfo(indicator.dataSources) + '</td></tr><tr><td>' +
                me._locale.stats.additionalInfoTitle + '</td><td>' + indicator.additionalInfo[lang] + '</td></tr><tr><td>' +
                me._locale.stats.privacyLimitTitle + '</td><td>' + (indicator.privacyLimit !== null ? indicator.privacyLimit.Description : "") + '</td></tr><tr><td>' +
                me._locale.stats.lifeCycleStateTitle + '</td><td>' + indicator.lifeCycleState[lang] + '</td></tr><tr><td>' +
                me._locale.stats.unitTitle + '</td><td>' + indicator.unit + '</td></tr><tr><td>' +
                me._locale.stats.yearsTitle + '</td><td>' + indicator.years.sort(function (a, b) {return b - a;}).join(", ") + '</td></tr><tr><td>' +
                gridYearsPart +
                me._locale.stats.annotationsTitle + '</td><td>' + me._getAnnotationsInfo(indicator.timePeriods) + '</td></tr>' +
                '</table>';
            var dialog = me.showMessage(indicator.title[lang], desc);
            dialog.makeDraggable();
        },
        _getAnnotationsInfo: function (timePeriods) {
            var me = this;
            var i, j;
            var result = "";
            if (timePeriods != null) {
                timePeriods.sort(function (a, b) {
                    return b.Id - a.Id;
                });
                for (i = 0; i < timePeriods.length; i++) {
                    if (timePeriods[i].Annotations != null) {
                        timePeriods[i].Annotations.sort(function (a, b) {
                            if (a.OrganizationShort > b.OrganizationShort) return 1;
                            if (a.OrganizationShort < b.OrganizationShort) return -1;
                            return 0;
                        });
                        for (j = 0; j < timePeriods[i].Annotations.length; j++) {
                            result += "<tr>";
                            result += "<td>" + timePeriods[i].Id + "</td>";
                            result += "<td>" + timePeriods[i].Annotations[j].OrganizationShort + "</td>";
                            result += "<td>" + timePeriods[i].Annotations[j].Description + "</td>";
                            result += "</tr>";
                        }
                    }
                }
            }

            if (result.length > 0) {
                result = "<table class='table-bordered table-condensed table-striped'>" + "<tr><th>" + me._locale.stats.annotations.year
                    + "</th><th>" + me._locale.stats.annotations.organization
                    + "</th><th>" + me._locale.stats.annotations.description + "</th></tr>" + result + "</table>";
            }

            return result;
        },
        _getDataSourcesInfo: function(dataSources) {
            var result = "";
            var ds = [];
            if(typeof dataSources !== 'undefined') {
                for (var i = 0; i < dataSources.length; i++) {
                    dataSources[i].years.sort();

                    ds.push({"name": dataSources[i].name,
                            "yearStart": dataSources[i].years[0],
                            "yearEnd": dataSources[i].years[dataSources[i].years.length - 1]});
                }
            }

            ds.sort(function(a,b) { return b.yearStart - a.yearStart});

            for(var i = 0; i < ds.length; ++i) {
                if (i != 0)
                    result += "<br/>";
                result += ds[i].name;
                result += " : ";
                result += ds[i].yearStart + " - ";
                if (i != 0)
                    result += ds[i].yearEnd;
            }

            return result;
        },
        deleteIndicatorInfoButton: function(container) {
            container.find('.indicator-cont').find('.icon-info').remove();
        },

        _showIndicatorInfoDialog: function(id) {
            var me = this;
            var url = 'action_route=GetSzopaData&action=indicator_metadata&indicator=' + id + '&version=1.1';
            if (me.mode === 'twoway') {
                url = 'action_route=GetTwowayData&action=indicator_metadata&indicator=' + id + '&version=v1';
            }
            me.statsService.fetchStatsData(Oskari.getSandbox().getAjaxUrl() + url,
                // success callback
                function(indicatorMeta) {
                    if (indicatorMeta) {
                        var themes = "",
                            indicator = null;
                        if(typeof me.getFlatIndicatorsdata() !== 'undefined') {
                            indicator = $.grep(me.getFlatIndicatorsdata(), function(item, index) {
                                return item.id == id;
                            });
                        } else {
                            indicator = $.grep(me._state.indicators, function(item, index) {
                                return item.id == id;
                            });
                        }
                        if (indicator && indicator.length > 0) {
                            $.each(indicator[0].themes, function(index, item) {
                                themes = themes + item.fi;
                                if (index < indicator[0].themes.length - 1) {
                                    themes = themes + " / ";
                                }
                            });
                        }
                        me.createIndicatorInfoDialog(themes, indicatorMeta);
                    } else {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorMetaXHRError);
                },
                me.ignoreCache);
        },

        /**
         * Compares column values using the given method.
         *
         * @method _createColumnComparison
         * @param comparisonOption Comparison method.
         * @param columns Columns to use in the comparison.
         */
        _createColumnComparison: function(comparisonOption, columns) {
            var me = this;
            var loc = me._locale;
            var indicator = columns[1].indicatorData;
            var meta = {
                title: {
                },
                decimalCount: comparisonOption.decimalCount == null ? Math.max(indicator.decimalCount, columns[0].indicatorData.decimalCount) : comparisonOption.decimalCount,
                privacyLimit: indicator.privacyLimit,
                orderNumber: indicator.orderNumber,
                unit: comparisonOption.unit,
                columnComparison: true,
                comparisonType: comparisonOption.type
            };
            if(isNaN(meta.decimalCount)) {
                meta.decimalCount = 0;
            }
            var lang = Oskari.getLang();
            meta.title[lang] = indicator.name;
            if ([null, indicator.name].indexOf(columns[0].indicatorData.name) === -1) {
                meta.title[lang] = columns[0].indicatorData.name+', '+meta.title[lang];
            }
            meta.title[lang] = loc.columnComparison[comparisonOption.type+'Title']+': '+meta.title[lang];
            if (meta.unit == null) {
                meta.unit = indicator.unit;
                if ([null, indicator.unit].indexOf(columns[0].indicatorData.unit) === -1) {
                    meta.unit = columns[0].indicatorData.unit+', '+meta.unit;
                }
            }
            var year = columns[0].indicatorData.year.trim() + ' &#9658; ' + indicator.year.trim();
            var indicatorId = indicator.id;
            var gender = indicator.gender;
            var geometry = indicator.geometry;
            var filter = indicator.filter;
            var type = indicator.type;
            var direction = indicator.direction;
            var resultColumnId = me._getIndicatorColumnId(indicatorId, gender, year, geometry, filter, type, direction, comparisonOption.type);
            var gridColumns = me.grid.getColumns();
            var numGridColumns = gridColumns.length;
            // Remove existing duplicate column
            for (var i = 0; i < numGridColumns; i++) {
                if (resultColumnId === gridColumns[i].id) {
                    if (gridColumns[i].deleteHandler) {
                        gridColumns[i].deleteHandler();
                    }
                }
            }
            var data = [];
            _.each(me.regionCategories, function(regions, category) {
                regions.forEach(function(region) {
                    var items = [];
                    var values = [];
                    var privacyLimitTriggered = false;
                    for (var j=0; j<2; j++) {
                        var item = _.find(me.indicatorsData[columns[j].id], function(dataItem) {
                            return region.id === dataItem.region;
                        });
                        if (item == null) {
                            return;
                        }
                        if (item.PrivacyLimitTriggered) {
                            privacyLimitTriggered = true;
                        }
                        items.push(item);
                        values.push(item['primary value'] == null ? NaN : parseFloat(item['primary value']));
                    }
                    var dataItem = {
                        indicator: items[1].indicator,
                        gender: items[1].gender,
                        region: items[1].region,
                        year: year
                    };
                    if (privacyLimitTriggered) {
                        dataItem.PrivacyLimitTriggered = true;
                    } else if ((!isNaN(values[0]))&&(!isNaN(values[1]))) {
                        dataItem['primary value'] = (Math.round(comparisonOption.getValue(values[0], values[1])*Math.pow(10, meta.decimalCount))/Math.pow(10, meta.decimalCount)).toString();
                    }
                    data.push(dataItem);
                });
            });
            // Save comparisons to the state
            var comparisons = me.getState().comparisons;
            if (comparisons == null) {
                comparisons = [];
            }
            var found = false;
            var numComparisons = comparisons.length;
            for (var j=0; j<numComparisons; j++) {
                if ((comparisons[j].indicatorId === indicatorId)&&
                    (comparisons[j].comparisonOption.type === comparisonOption.type)&&
                    (comparisons[j].year === year)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                comparisons.push({
                    indicatorId: indicatorId,
                    comparisonOption: comparisonOption,
                    year: year,
                    columnIds: [columns[0].id, columns[1].id]
                });
                me.getState().comparisons = comparisons;
            }
            me.addIndicatorDataToGrid(null, indicatorId, gender, year, geometry, filter, type, direction, data, meta);
        },

        /**
         * Lets the user to select column comparison method.
         *
         * @method _showColumnComparisonDialog
         * @param column Column to add to the comparison.
         */
        _showColumnComparisonDialog: function(column) {
            var me = this;
            var loc = me._locale;
            var showErrorMessage = function(error) {
                var guideDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            	var closeBtn = guideDialog.createCloseButton(loc.btnCancel);
                guideDialog.addClass('stats-compare-dialog');
                guideDialog.show('', loc.columnComparison[error], [closeBtn]);
                guideDialog.moveTo('span#'+column.id, 'bottom');
                guideDialog.makeModal();
            };

            // Parameter validity checks
            var currentColumnId = this.getState().currentColumn;
            if ((column == null)||(column.indicatorData == null)||(column.indicatorData.id == null)||(currentColumnId == null)) {
                showErrorMessage('unknown');
                return;
            }
            var currentColumnIndex = me.grid.getColumnIndex(currentColumnId);
            if ((currentColumnIndex == null)||(currentColumnId === column.id)) {
                showErrorMessage('notValid');
                return;
            }
            var columns = me.grid.getColumns();
            if (currentColumnIndex > columns.length) {
                showErrorMessage('unknown');
                return;
            }
            var currentColumn = columns[currentColumnIndex];
            if (currentColumn.indicatorData.columnComparison) {
                showErrorMessage('compared');
                return;
            }
            // Create option dialog
            var optionDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            optionDialog.addClass('stats-compare-dialog');
        	var cancelBtn = optionDialog.createCloseButton(loc.btnCancel);
        	cancelBtn.setTitle(loc.columnComparison.cancel);
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
            okBtn.setTitle(loc.columnComparison.ok);
            okBtn.setHandler(function () {
                var selectedCompareOption = _.find(me.columnComparisonOptions, {
                    selected: true
                });
                optionDialog.close(true);
                me._createColumnComparison(selectedCompareOption, [currentColumn, column]);
            });
        	var popupContent = jQuery(me.templates.columnComparisonPopup).clone();
        	var popupInstructions = jQuery(me.templates.columnComparisonPopupInstructions).clone();
        	popupInstructions.append(loc.columnComparison.instructions);
        	popupContent.append(popupInstructions);
            var radioButtonGroup = Oskari.clazz.create('Oskari.userinterface.component.RadioButtonGroup');
            radioButtonGroup.setName('stats-compare-option');
            radioButtonGroup.setOptions(me.columnComparisonOptions.map(function (option) {
                return {
                    title: loc.columnComparison[option.type],
                    value: option.type
                };
            }));
            var defaultComparison = me.columnComparisonOptions[0].type;
            radioButtonGroup.setValue(defaultComparison);
            var updateSelectedComparison = function(selectedValue) {
                me.columnComparisonOptions.forEach(function (option) {
                    option.selected = option.type === selectedValue;
                });
            };
            updateSelectedComparison(defaultComparison);
            radioButtonGroup.setHandler(function (value) {
                updateSelectedComparison(value)
            });
            radioButtonGroup.insertTo(popupContent);
            optionDialog.show('', popupContent, [cancelBtn, okBtn]);
            optionDialog.moveTo('span#'+column.id, 'bottom');
            optionDialog.makeModal();
        },

        /**
         * Create drop down selects for demographics (year & gender)
         *
         * @method createDemographicsSelects
         * @param container parent element
         * @param indicator meta data
         */
        createDemographicsSelects: function(container, indicator) {
            var me = this;

            var selectors = container.find('.selectors-container');
            // year & gender are in a different container than indicator select
            var parameters = selectors.find('.parameters-cont'),
                newIndicator = parameters.find('.new-indicator-cont'),
                year = null,
                gender = null,
                type = null,
                columnId,
                includedInGrid,
                fetchButton,
                fetchFromAreaButton,
                fetchByRegionFilterButton,
                createChartButton,
                functionalAreasSelector;

            if (indicator) {
                // We have an indicator, create the selects with its data
                if (indicator.constructor !== Array) {
                    indicator = [indicator];
                }

                var combinedIndicator = {
                    years: [],
                    classifications: {
                        sex: { values: [] },
                        type: [],
                        direction: { values: [] }
                    }
                };

                for (var i = 0; i < indicator.length; ++i) {
                    me.indicators.push(indicator[i]);
                    combinedIndicator.years = _.union(combinedIndicator.years, indicator[i].years);
                    if (indicator[i].classifications) {
                        if (indicator[i].classifications.sex) {
                            combinedIndicator.classifications.sex.values = _.union(combinedIndicator.classifications.sex.values, indicator[i].classifications.sex.values);
                        }
                        if (indicator[i].classifications.type) {
                            combinedIndicator.classifications.type = _.union(combinedIndicator.classifications.type, indicator[i].classifications.type);
                        }
                        if (indicator[i].classifications.direction) {
                            combinedIndicator.classifications.direction.values = _.union(combinedIndicator.classifications.direction.values, indicator[i].classifications.direction.values);
                        }
                    }
                }

                combinedIndicator.years.sort(function(a, b) { return b - a; });

                // get years for select control
                if (combinedIndicator.years !== null && combinedIndicator.years !== undefined) {
                    me.updateYearSelectorValues(container.find('select.year'), combinedIndicator.years);
                    year = combinedIndicator.years[0];
                }

                // if there is a classification.sex we can create gender select
                if (combinedIndicator.classifications && combinedIndicator.classifications.sex && combinedIndicator.classifications.sex.values.length > 0) {
                    me.updateGenderSelectorValues(container.find('select.gender'), combinedIndicator.classifications.sex.values);
                    // by default the last value is selected in getGenderSelectorHTML
                    gender = combinedIndicator.classifications.sex.values[combinedIndicator.classifications.sex.values.length - 1];
                }

                gender = gender !== null && gender !== undefined ? gender : 'total';

                // if there is a classification.type we can create type select
                if (combinedIndicator.classifications && combinedIndicator.classifications.type && combinedIndicator.classifications.type.length > 0) {
                    me.updateTypeSelectorValues(container.find('select.type'), combinedIndicator.classifications.type);
                    type = combinedIndicator.classifications.type[1].id;
                }

                // if there is a classification.direction we can create direction select
                if (combinedIndicator.classifications && combinedIndicator.classifications.direction && combinedIndicator.classifications.direction.values.length > 0) {
                    me.updateDirectionSelectorValues(container.find('select.direction'), combinedIndicator.classifications.direction.values);
                    me._updateDirectionSelector();
                    direction = container.find('select.direction').val();
                }

                fetchButton = parameters.find('button.fetch-data');
                fetchFromAreaButton = container.find('button.fetch-data-area');
                fetchByRegionFilterButton = container.find('button.fetch-data-region-filter');

                me.updateFilterRegionCategorySelector(indicator, year);
            } else {
                var areaInfoContainer = jQuery('<div id="area-info-container" class="info"></div>');
                areaInfoContainer.text(me.instance.conf.gridDataAllowed ? me._locale.noAreaFilterSet : me._locale.noAreaFilterSetNoGrid);
                fetchFromAreaButton = jQuery('<button class="fetch-data-area selector-button small-button"><span class="glyphicon glyphicon-filter"></span> ' + this._locale.addColumnFromArea + '</button>');
                fetchByRegionFilterButton = jQuery('<div id="fetch-data-region-filter-value"></div><button class="fetch-data-region-filter selector-button small-button"><span class="glyphicon glyphicon-filter"></span> ' + this._locale.addColumnFromRegionFilter + '</button>');
                functionalAreaSelector = jQuery('<div id="functionalAreasSelector"><div id="functionalAreasTree"></div><label class="longLabel"><input type="checkbox" disabled="disabled" name="functionalAreasIntersection" id="functionalAreasIntersection">' + this._locale.createIntersection + '</label></div>');
                container.find('#selectors-area').empty().append(areaInfoContainer);
                container.find('#selectors-area').append(fetchByRegionFilterButton).append('<br/>');
                if(me.instance.conf.gridDataAllowed) {
                    container.find('#selectors-area').append(fetchFromAreaButton);
                }

                var regionSelectorContainer = jQuery(me.templates.selectorContainer);
                var selector = jQuery(me.templates.filterRegionCategorySelector);
                selector.attr("id", "selectors-area-regionCategory");

                _.each(me._acceptedRegionCategories, function(category) {
                    if (me._categoriesHierarchy[category].type === "administrative") {
                        var categorySelector = jQuery('<option></option>');
                        categorySelector.html(me._locale.regionSelectorCategories[category]);
                        categorySelector.attr({
                            'id': 'category_' + category,
                            'value': category,
                            'selected': (category === me._selectedRegionCategory ? 'selected' : false)
                        });

                        categorySelector.appendTo(selector);
                    }
                });
                regionSelectorContainer.append($('<label for="selectors-area-regionCategory">Näytä</label>'));
                regionSelectorContainer.append(selector);
                container.find('#level-area').empty().append('<div class="info">Valitse hallinnollinen esitystaso, jolla tilastojen tulokset esitetään.</div>').append(regionSelectorContainer);

                container.find('#selectors-year').empty().append('<div class="info">Valitse vuodet, joilta haluat hakea tilastot. Voit myös valita jokaisesta tilastosta uusimman vuoden.</div>').append(me.getYearSelectorHTML(0, -1));
                container.find('#selectors-functional-area').empty().append('<div class="info">Mikäli haluat tarkastella tilastoja myös toiminnallisiin alueisiin jaettuna, valitse ne listasta.</div>').append(functionalAreaSelector);
                parameters.empty();
                me.createFunctionalAreasTree(functionalAreaSelector.find("#functionalAreasTree"));

                if (me.instance.conf.functionalIntersectionAllowed) {
                    functionalAreaSelector.find('#functionalAreasIntersection').removeAttr("disabled");
                    functionalAreaSelector.find('input,label').show();
                } else {
                    functionalAreaSelector.find('#functionalAreasIntersection').attr("disabled", true).attr('checked', false);
                    functionalAreaSelector.find('input,label').hide();
                }

                var sel = container.find('select.year');

                sel.chosen({
                    disable_search: true,
                    placeholder_text: "Valitse vuosi",
                    width: "210px"
                });

                sel.chosen().change(function(e) {
                    me.updateDemographicsButtons(null, null, e.target.value);
                });

                includedInGrid = false;
                fetchButton = jQuery('<button class="fetch-data' + (includedInGrid ? ' hidden' : '') + ' selector-button"><span class="glyphicon glyphicon-plus"></span> ' + this._locale.addColumn + '</button>');
                var clearButton = jQuery('<button class="selector-button"><span class="glyphicon glyphicon-remove"></span> ' + this._locale.clearColumn + '</button>');
                clearButton.click(function(e) {
                    me.clearButtonClickHandler(container);
                });

                var fetchButtonRow = jQuery('<div></div>');
                fetchButtonRow.append(fetchButton);
                fetchButtonRow.append(clearButton);
                parameters.append(fetchButtonRow);

                var additionalButtonsRow = jQuery('<div></div>');
                createChartButton = jQuery('<span class="create-chart' + (includedInGrid ? ' hidden' : '') + ' action-link"><span class="glyphicon glyphicon-stats"></span> ' + this._locale.createChart + ' &gt;</span>');
                createChartButton.click(function(e) {
                    var element = jQuery(e.currentTarget);
                    element.loadingOverlay();
                    if (me.isIndicatorPresent()) {
                        me.sendChartRequest(me.grid.getColumns());
                    } else {
                        me.showMessage(me._locale.errorTitle, me._locale.noIndicator);
                    }
                    element.loadingOverlay('remove');
                });
                additionalButtonsRow.append(createChartButton);

                //Adding csv button
                var csvLink = jQuery(me.templates.csvButton);
                csvLink.append(this._locale.csv.downloadFile + " &gt;");
                csvLink.click(function() {
                    me._showCreatingCsvPopUp();
                });
                additionalButtonsRow.append(csvLink);

                var additionalButtonsRow2 = jQuery('<div></div>');
                var printLink = jQuery('<span class="create-chart' + (includedInGrid ? ' hidden' : '') + ' action-link"><span class="glyphicon glyphicon-print"></span> ' + this._locale.print + ' &gt;</span>');
                printLink.click(function() {
                    var request = me._sandbox.getRequestBuilder('printout.PrintMapRequest')();
                    me._sandbox.request(me, request);
                });
                additionalButtonsRow2.append(printLink);

                parameters.append(additionalButtonsRow);
                parameters.append(additionalButtonsRow2);

                fetchFromAreaButton.unbind('click');
                fetchFromAreaButton.click(function(e) {
                    if (!me.currentAreaFilter.isEmpty()) {
                        me._createFilterExistsPopup('area', function() { me._createFilterBySelectedAreaPopup(); });
                    } else {
                        me._createFilterBySelectedAreaPopup();
                    }
                });
                fetchByRegionFilterButton.unbind('click');
                fetchByRegionFilterButton.click(function(e) {
                    if (!me.geometryFilter.isEmpty()) {
                        me._createFilterExistsPopup('region', function() { me._createFilterByAllRegionsPopup(); });
                    } else {
                        me._createFilterByAllRegionsPopup();
                    }
                });

                if (!me.currentAreaFilter.isEmpty()) {
                    $('#area-info-container').text(me._locale.areaFilterSet + me._areaFilterToString(me.currentAreaFilter.getText()));
                } else {
                    $('#area-info-container').text(me.instance.conf.gridDataAllowed ? me._locale.noAreaFilterSet : me._locale.noAreaFilterSetNoGrid);
                }

                me._updateButtons();
            }

            if (indicator) {
                // click listener
                fetchButton.unbind('click');
                fetchButton.click(function(e) {
                    if(me.mode === 'twoway') {
                        me._updateDirectionSelector();
                    }
                    me.fetchButtonClickHandler(container, indicator);
                });
            }
        },

        //in two way statistics the direction is always the opposite of the direction of the first filter
        _updateDirectionSelector: function() {
            var me = this,
                filterDirection = me.container.find('select.direction').val();

            if(me.currentAreaFilter.hasFilterDirection()) {
                filterDirection = me.currentAreaFilter.getFilterDirection();
            }

            if (typeof me.geometryFilter.getDirection() !== 'undefined') {
                filterDirection = me.geometryFilter.getDirection();
            }

            $.each(this.container.find('select.direction option'), function(index, item) {
                if(item.value !== filterDirection) {
                    me.container.find('select.direction').val(item.value);
                }
            });
        },

        _updateButtons: function() {
            var me = this,
                items = [$("span.create-chart"), $('span.statsgrid-csv-button')];
            $.each(items, function(index, item) {
                if (me.isIndicatorPresent()) {
                    item.css("pointer-events", "initial").removeClass("disabled");
                } else {
                    item.css("pointer-events", "none").addClass("disabled");
                }
            });
        },
        clearButtonClickHandler: function(container) {
            var me = this;
            me.resetSelections();
            //clear map and reset state to initial
            me.instance.classifyPlugin.administrative_sendEmptyValues();
            me.instance.setState({indicators: [], oldIndicators: me.indicators, layerId: null}, false, true);
        },
        resetSelections: function () {
            var me = this;
            $('#selectors-area-regionCategory').val(me._defaultRegionCategory);
            if(me.mode !== 'twoway') {
                $('#functionalAreasTree').fancytree("getTree").visit(function(node) {
                    node.setSelected(false);
                });
                $('#statsTree').fancytree("getTree").visit(function (node) {
                    node.setSelected(false);
                });
            } else {
                $('#indi').val('-2').trigger("chosen:updated");
                $('select.gender').val('total').trigger("chosen:updated");
                $('select.type').val([]).trigger("chosen:updated");
            }
            var yearSelect = $('.yearsel').find('select');
            yearSelect.val("newest");
            yearSelect.trigger("chosen:updated");

            me._setCurrentAreaFilter();
            me.geometryFilter.reset();
            me._updateGeometryFilter();
        },
        clearIndicators: function() {
            var me = this;
            //clear indicators
            if (me.grid) {
                var columns = me.grid.getColumns();
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].field.indexOf('indicator') >= 0) {
                        columns[i].deleteHandler();
                    }
                }
            }
        },
        fetchButtonClickHandler: function (container, indicator) {
            var me = this,
            year = jQuery('.statsgrid').find('.yearsel').find('.year').val(),
            gender = jQuery('.statsgrid').find('.gendersel').find('.gender').val(),
            types = jQuery('.statsgrid').find('.typesel').find('.type').val(),
            direction = jQuery('.statsgrid').find('.directionsel').find('.direction').val(),
            grp = jQuery('#selectors-area-regionCategory').val(),
            group = me._categoriesGroupKeys[grp],
            gender = gender !== null && gender !== undefined ? gender : 'total',
            functionalRows = [];

            if (me.isIndicatorPresent()) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelLoc = "Peruuta",
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content = jQuery('<div>Tilastotaulukko tyhjennetään ennen uusien tilastojen näyttämistä.</div>').clone(),
                dialogButtons = [];

                // destroy possible open instance
                me._destroyPopup('IndicatorPresent');

                cancelBtn.setTitle(cancelLoc);
                cancelBtn.setHandler(function () {
                    me._destroyPopup('IndicatorPresent');
                });

                continueBtn.setTitle(continueLoc);
                continueBtn.addClass('primary');
                continueBtn.setHandler(function (e) {
                    me.clearIndicators();
                    me._destroyPopup('IndicatorPresent');
                    me.fetchButtonClickHandler(container, indicator);
                });

                dialogButtons.push(continueBtn);
                dialogButtons.push(cancelBtn);

                dialog.show(dialogTitle, content, dialogButtons);
                me.popups.push({
                    name: 'IndicatorPresent',
                    popup: dialog,
                    content: content
                });

                return;
            } else {
                var leftWidth = 60;

                $('.oskariui-center').width((100 - leftWidth) + '%');
                $('.oskariui-left').width(leftWidth + '%');

                $('.hideSelectorsButton').show();
                /** a hack to notify openlayers of map size change */
                me.instance.getSandbox().findRegisteredModuleInstance('MainMapModule').updateSize();
            }

            if (me.mode === 'twoway' && me.geometryFilter.isEmpty() && me.currentAreaFilter.isEmpty()) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content = jQuery('<div>Valitse vähintään yksi alue- tai karttarajaus, jotta tulokset voidaan laskea.</div>').clone(),
                dialogButtons = [];

                // destroy possible open instance
                me._destroyPopup('noFilterSelected');

                continueBtn.setTitle(continueLoc);
                continueBtn.addClass('primary');
                continueBtn.setHandler(function (e) {
                    me._destroyPopup('noFilterSelected');
                });

                dialogButtons.push(continueBtn);

                dialog.show(dialogTitle, content, dialogButtons);
                me.popups.push({
                    name: 'noFilterSelected',
                    popup: dialog,
                    content: content
                });

                return;
            }

            if(me.mode === 'twoway' && types === null) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content = jQuery('<div>Valitse vähintään yksi tilasto.</div>').clone(),
                dialogButtons = [];

                // destroy possible open instance
                me._destroyPopup('noTypeSelected');

                continueBtn.setTitle(continueLoc);
                continueBtn.addClass('primary');
                continueBtn.setHandler(function (e) {
                    me._destroyPopup('noTypeSelected');
                });

                dialogButtons.push(continueBtn);

                dialog.show(dialogTitle, content, dialogButtons);
                me.popups.push({
                    name: 'noTypeSelected',
                    popup: dialog,
                    content: content
                });

                return;
            }

            if(year === null) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content = jQuery('<div>Valitse vähintään yksi vuosi, joilta tilastot haetaan.</div>').clone(),
                dialogButtons = [];

                // destroy possible open instance
                me._destroyPopup('noYearSelected');

                continueBtn.setTitle(continueLoc);
                continueBtn.addClass('primary');
                continueBtn.setHandler(function (e) {
                    me._destroyPopup('noYearSelected');
                });

                dialogButtons.push(continueBtn);

                dialog.show(dialogTitle, content, dialogButtons);
                me.popups.push({
                    name: 'noYearSelected',
                    popup: dialog,
                    content: content
                });

                return;
            }

            var nodes = $('#functionalAreasTree').fancytree("getTree").getSelectedNodes();

            $.each(nodes, function(index, item) {
               if(!item.folder) {
                   functionalRows.push({key: item.data.categoryKey, id: item.data.categoryId, title: item.title + " (" + item.data.year + ")", areaYear: item.data.year});
               }
            });

            if($('#functionalAreasIntersection').is(':checked')) {
                functionalRows.push({key: "intersection", id: 1, title: 'Leikkaus', areaYear: functionalRows[0].areaYear});
            }

            me._state.functionalRows = functionalRows;

            var indicatorYearPairs = [],
                totalSelected = 0,
                impossibleIndicatorYearPairs = [],
                possibleRegions = [];

            for(var i = 0; i < indicator.length; ++i) {
                var indi = indicator[i];
                var selectedYears = year.slice();
                var indicatorYears = indi.years.slice();
                var arrayYears = [];
                var impossibleYears = [];
                var newestPos = $.inArray("newest", selectedYears);
                if(newestPos > -1) {
                    if (!me.geometryFilter.isEmpty()) {
                        var filterYears = [];
                        if(typeof indi.timePeriods !== 'undefined') {
                             for (var ix = 0; ix < indi.timePeriods.length; ++ix) {
                                var yearId = indi.timePeriods[ix].Id+'';
                                for (j = 0; j < indi.timePeriods[ix].AreaTypes.length; ++j) {
                                    if (indi.timePeriods[ix].AreaTypes[j].Id == 'grid250m') {
                                        filterYears.push(yearId);
                                    }
                                }
                            }
                            indicatorYears = filterYears;
                        }
                    }
                    var newestYear = indicatorYears.sort(function(a, b){return b-a;})[0]+'';
                    selectedYears.splice(newestPos, 1, newestYear);
                    selectedYears = _.uniq(selectedYears);
                    selectedYears.sort(function(a, b){return b-a; });
                }
                for(var j = 0; j < selectedYears.length; ++j) {
                    if($.inArray(selectedYears[j], indicatorYears) > -1) {
                        arrayYears.push(selectedYears[j]);
                    } else {
                        impossibleYears.push(selectedYears[j]);
                    }
                }

                indicatorYearPairs.push({indicator: indi, selectedYears: arrayYears});
                if(impossibleYears.length > 0) {
                    impossibleIndicatorYearPairs.push({indicator: indi, impossibleYears: impossibleYears});
                }
                if(me.mode !== 'twoway') {
                    totalSelected += arrayYears.length;
                } else {
                    totalSelected += arrayYears.length * types.length;
                }

                if(typeof indi.timePeriods !== 'undefined') {
                    for (var ix = 0; ix < indi.timePeriods.length; ++ix) {
                       if($.inArray(""+indi.timePeriods[ix].Id, arrayYears) > -1 || $.inArray(indi.timePeriods[ix].Id, arrayYears) > -1) {
                           possibleRegions.push(indi.timePeriods[ix].AreaTypes);
                       }
                   }
               }
            }

            var commonRegions = null;

            for (var i = 0; i < possibleRegions.length; ++i) {
                if (commonRegions == null) {
                    commonRegions = [];
                    for (var j = 0; j < possibleRegions[i].length; ++j) {
                        commonRegions.push(possibleRegions[i][j].Id);
                    }
                } else {
                    var regions = [];
                    for (var j = 0; j < possibleRegions[i].length; ++j) {
                        regions.push(possibleRegions[i][j].Id);
                    }
                    commonRegions = $.grep(commonRegions, function(element) {
                        return $.inArray(element, regions) !== -1;
                    });
                }
            }


            if(commonRegions !== null && (!me.geometryFilter.isEmpty() || !me.currentAreaFilter.isEmpty())) {
                if(!me.geometryFilter.isEmpty()) {
                    commonRegions = $.grep(commonRegions, function(element) {
                        return element === 'finland';
                    });
                } else if (!me.currentAreaFilter.isEmpty()) {
                    var areaFilterLevels = [];
                    $.each(me.currentAreaFilter.getData(), function(index, value) {
                        var levels = [];
                        if (value.hasOwnProperty("key")) {
                            levels.push(me._categoriesGroupKeys[value.key]);
                            var v = me._categoriesHierarchy[value.key];
                            while (v.child) {
                                levels.push(me._categoriesGroupKeys[v.child]);
                                v = me._categoriesHierarchy[v.child];
                            }

                            if (areaFilterLevels.length == 0 || levels.length < areaFilterLevels.length) {
                                areaFilterLevels = levels;
                            }
                        }
                    });

                    commonRegions = $.grep(commonRegions, function(element) {
                        return $.inArray(element, areaFilterLevels) !== -1;
                    });
                }
            }

            if(me.mode !== 'twoway' && (possibleRegions.length === 0 || commonRegions === null || commonRegions.length === 0)) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content = jQuery('<div>Tilastoja ei voida näyttää tehdyillä valinnoilla. Tilastojen laskenta voi olla mahdollista vaihtamalla valittu vuosi, valitsemalla vähemmän tilastoja tai poistamalla mahdollinen aluerajaus käytöstä.</div>').clone(),
                dialogButtons = [];

                // destroy possible open instance
                me._destroyPopup('impossibleSelections');

                continueBtn.setTitle(continueLoc);
                continueBtn.addClass('primary');
                continueBtn.setHandler(function (e) {
                    me._destroyPopup('impossibleSelections');
                });

                dialogButtons.push(continueBtn);

                dialog.show(dialogTitle, content, dialogButtons);
                me.popups.push({
                    name: 'impossibleSelections',
                    popup: dialog,
                    content: content
                });

                return;
            }

            if(commonRegions !== null && $.inArray(group, commonRegions) < 0) {
                var elems = $('select.innerSelector[name="filterCategorySelector"]');
                var oldCategory = elems.val();
                var newCategory = null;
                $.each(me._categoriesGroupKeys, function(key, value) {
                    if(value === commonRegions[0]) {
                        newCategory = key;
                        return false;
                    }
                });

                if(newCategory !== null) {
                    grp = newCategory;
                    group = me._categoriesGroupKeys[grp];
                }

                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content,
                contentLevelChanged = jQuery('<div>Kaikkia valittuja tilastoja ei voida näyttää valitulla esitystasolla ' + me._locale.regionSelectorCategories[oldCategory] + '. Esitystasoksi on vaihdettu ' + me._locale.regionSelectorCategories[newCategory] + '.</div>').clone(),
                contentNotPossible = jQuery('<div>Valittuja tilastoja ei voida näyttää yhtäaikaa, koska niille ei ole saatavilla yhteistä esitystasoa. Tilastojen laskenta voi olla mahdollista vaihtamalla valittu vuosi tai valitsemalla vähemmän tilastoja.</div>').clone(),
                dialogButtons = [];

                if(oldCategory !== null && typeof oldCategory !== 'undefined') {
                    if(newCategory === null) {
                        content = contentNotPossible;
                    } else {
                        content = contentLevelChanged;
                    }

                    // destroy possible open instance
                    me._destroyPopup('categoryNotAvailable');

                    continueBtn.setTitle(continueLoc);
                    continueBtn.addClass('primary');
                    continueBtn.setHandler(function (e) {
                        me._destroyPopup('categoryNotAvailable');
                    });

                    dialogButtons.push(continueBtn);

                    dialog.show(dialogTitle, content, dialogButtons);
                    me.popups.push({
                        name: 'categoryNotAvailable',
                        popup: dialog,
                        content: content
                    });

                    if(newCategory === null) {
                        return;
                    }
                }
            }


            if(totalSelected > 25) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content = jQuery('<div>Tilastotaulukkoon voi lisätä korkeintaan 25 saraketta kerrallaan. Valitse vähemmän tilastoja tai vuosia.</div>').clone(),
                dialogButtons = [];

                // destroy possible open instance
                me._destroyPopup('over25Selected');

                continueBtn.setTitle(continueLoc);
                continueBtn.addClass('primary');
                continueBtn.setHandler(function (e) {
                    me._destroyPopup('over25Selected');
                });

                dialogButtons.push(continueBtn);

                dialog.show(dialogTitle, content, dialogButtons);
                me.popups.push({
                    name: 'over25Selected',
                    popup: dialog,
                    content: content
                });

                return;
            } else if (impossibleIndicatorYearPairs.length > 0) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = 'Virhe',
                continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                continueLoc = "Jatka",
                content = jQuery('<div>Kaikkia valittuja tilastoja ei ole saatavilla kaikilta valituilta vuosilta.<br/>Tilastotaulukkoon ei tuoda mittareita:<br/><div id="impossibleIndicatorYearPairsPopupContent"><div></div>').clone(),
                dialogButtons = [];

                var list = content.find('#impossibleIndicatorYearPairsPopupContent');

                $.each(impossibleIndicatorYearPairs, function(index, item) {
                   var indi = item.indicator;
                   var years = item.impossibleYears;
                   list.append(indi.title[Oskari.getLang()]);
                   $.each(years, function(index, item) {
                       if(typeof item !== 'undefined') {
                           if(index > 0) {
                               list.append(",");
                           }
                           list.append(" " + item);
                       }
                   });
                   list.append('<br/>');
                });

                // destroy possible open instance
                me._destroyPopup('impossibleIndicatorYearPairs');

                continueBtn.setTitle(continueLoc);
                continueBtn.addClass('primary');
                continueBtn.setHandler(function (e) {
                    me._destroyPopup('impossibleIndicatorYearPairs');
                });

                dialogButtons.push(continueBtn);

                dialog.show(dialogTitle, content, dialogButtons);
                me.popups.push({
                    name: 'impossibleIndicatorYearPairs',
                    popup: dialog,
                    content: content
                });
            }

            jQuery('.statsgrid').find('.slick-header').find('.selector').find('.innerSelector').val(grp).change();

            var loadedIndicators = 0;
            for (var ix = 0; ix < indicatorYearPairs.length; ++ix) {
                var indicatorItem = indicatorYearPairs[ix].indicator;
                var selectedYears = indicatorYearPairs[ix].selectedYears;
                for (j = 0; j < selectedYears.length; ++j) {
                    var eventBuilder = me._sandbox.getEventBuilder('StatsGrid.IndicatorAdded');

                    if (eventBuilder) {
                        var event = eventBuilder(indicatorItem.id, selectedYears[j]);
                        me._sandbox.notifyAll(event);
                    }
                    if(me.mode !== 'twoway') {
                        me.getSotkaIndicatorData(container,
                            indicatorItem,
                            //indicatorItem.id, gender, selectedYears[j], !me.geometryFilter.isEmpty() ? group : null, me.geometryFilter.getWktKey(), me.currentAreaFilter.getKey(), type, direction,
                            indicatorItem.id, gender, selectedYears[j], !me.geometryFilter.isEmpty() ? group : null, me.geometryFilter.getGeometries(), me.currentAreaFilter.getKey(), type, direction,
                            function (item) {
                                me.addIndicatorMeta(item);
                                if(++loadedIndicators >= totalSelected && me._state.functionalRows.length === 0) {
                                    me._hideOverlay();
                                    me._hideEmptyItemsInGrid();
                                }
                            });
                    } else {
                        for (var type in types) {
                            var geoms = me.geometryFilter.getGeometries().slice();
                            $.each(geoms, function(index, obj) {
                                obj.direction = me.geometryFilter.getDirection();
                            });

                            me.getSotkaIndicatorData(container,
                                indicatorItem,
                                //indicatorItem.id, gender, selectedYears[j], group, me.geometryFilter.getWktKey(), me.currentAreaFilter.getKey(), types[type], direction,
                                indicatorItem.id, gender, selectedYears[j], group, geoms, me.currentAreaFilter.getKey(), types[type], direction,
                                function (item) {
                                    me.addIndicatorMeta(item);
                                    if(++loadedIndicators >= totalSelected) {
                                        me._hideOverlay();
                                        me._hideEmptyItemsInGrid();
                                    }
                                });
                        }
                    }
                }
            }

            var eventBuilder = me._sandbox.getEventBuilder('StatsGrid.GridChanged');

            if (eventBuilder) {
                var event = eventBuilder(indicator, me._state.functionalRows);
                me._sandbox.notifyAll(event);
            }

            me._state.visualizationAreaCategory = {key: "administrative", id: 1};
        },

        isIndicatorPresent: function () {
            var me = this;
            var result = false;
            if(typeof me.grid === 'undefined' || me.grid === null) {
                return result;
            }
            var items = me.grid.getColumns();
            var len = items.length;
            for (var i = 0; i < len; i++) {
                var item = items[i];
                if (item.id.indexOf('indicator') === 0) {
                    result = true;
                }
            }
            return result;
        },
        sendChartRequest: function (columns) {
            var me = this;
            var data = {
                series: [],
                categories: [],
                serieVariants: []
            };
            var serieVariantsIds = [];
            _.each(columns, function (item) {
                if (item.id.indexOf('indicator') === 0) {
                    var serieVariantName = item.fullName.replace(/<br\/*>/g, " / ");
                    if (item.indicatorData != null && item.indicatorData.dataSource != null && item.indicatorData.dataSource != "")
                        serieVariantName += " "+ me._locale.dataSource + ": " + item.indicatorData.dataSource;
                    data.serieVariants.push(serieVariantName);
                    serieVariantsIds.push(item.id);
                }
            });

            var noOfVariants = serieVariantsIds.length;
            for (var i = 0; i < noOfVariants; i++)
                data.series.push([]);

            _.each(me.dataView.getItems(), function (item) {
                //if element is selected and has no parent
                if (item.sel === 'checked' && item._parent == null) {
                    data.categories.push(item.municipality);
                    for (var j = 0; j < noOfVariants; j++) {
                        var serieId = serieVariantsIds[j];
                        data.series[j].push(item[serieId] != null ? item[serieId] : 0);
                    }
                }
            });
            var request = me._sandbox.getRequestBuilder('liiteri-chart.ShowChartRequest')(data);
            me._sandbox.request(me, request);
        },
        disableDemographicsSelect: function (container) {
            var parameters = container.find('.parameters-cont');
            parameters.find('button.fetch-data').prop('disabled', 'disabled');
            parameters.find('button.fetch-data-area').prop('disabled', 'disabled');
            parameters.find('select.year').prop('disabled', 'disabled');
            parameters.find('select.gender').prop('disabled', 'disabled');
            parameters.find('select.type').prop('disabled', 'disabled');
        },

        deleteDemographicsSelect: function (container) {
            container.find('.parameters-cont').find('select.year').empty();
            container.find('.parameters-cont').find('.select.gender').empty();
            container.find('.parameters-cont').find('.select.type').empty();
            //container.find('.parameters-cont').find('.cannot-display-indicator').remove(); //?
        },

        /**
         * Update Demographics buttons
         *
         * @method updateDemographicsSelects
         * @param container parent element
         * @param indicator meta data
         */
        updateDemographicsButtons: function (indicatorId, gender, year) {
            indicatorId = indicatorId || jQuery('.statsgrid').find('.indisel ').find('option:selected').val();
            gender = gender || jQuery('.statsgrid').find('.gendersel').find('.gender').val();
            gender = gender !== null && gender !== undefined ? gender : 'total';
            year = year || jQuery('.statsgrid').find('.yearsel').find('.year').val();

            var columnId = "indicator" + indicatorId + year + gender,
                includedInGrid = this.isIndicatorInGrid(columnId);

            // toggle fetch and remove buttons so that only one is visible and can only be selected once
            if (includedInGrid) {
                //jQuery('.statsgrid').find('.fetch-data').addClass("hidden");
                jQuery('.statsgrid').find('.fetch-data').prop('disabled', 'disabled');
            } else {
                //jQuery('.statsgrid').find('.fetch-data').removeClass("hidden");
                jQuery('.statsgrid').find('.fetch-data').removeProp('disabled');
            }
        },

        /**
         * Checks if the given indicator id data is in the grid.
         *
         * @method isIndicatorInGrid
         * @param columnId unique column id
         */
        isIndicatorInGrid: function (columnId) {
            if(typeof this.grid === 'undefined') {
                return false;
            }
            var columns = this.grid.getColumns(),
                found = false,
                i,
                ilen;

            for (i = 0, ilen = columns.length; i < ilen; i++) {
                if (columnId === columns[i].id) {
                    return true;
                }
            }
            return false;
        },
        _showOverlay: function () {
            if (!this._published) {
                $('#contentMap').loadingOverlay({ iconClass: 'liiteri-logo-icon' });
            } else {
                $('#contentMap .oskariui-mode-content').loadingOverlay({ iconClass: 'liiteri-logo-icon' });
            }

        },
        _hideOverlay: function () {
            if (!this._published) {
                $('#contentMap').loadingOverlay('remove');
            } else {
                $('#contentMap .oskariui-mode-content').loadingOverlay('remove');
            }
        },
        /**
         * Get Sotka data for one indicator
         *
         * @method getSotkaIndicatorData
         * @param container parent element
         * @param indicatorId id
         * @param gender (male / female / total)
         * @param year selected year
         * @param {Function} cb optional callback which gets executed after a successful fetch
         */
        getSotkaIndicatorData: function (container, indicatorItem, indicatorId, gender, year, group, wktGeometry, filter, type, direction, cb) {
            var me = this,
                gndrs = gender !== null && gender !== undefined ? gender : 'total';

            var filterParam = filter != null ? JSON.stringify(filter) : null;

            var errorCb = function(jqXHR, textStatus) {
                me._hideOverlay();
                me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataXHRError);
            };
            var successCb = function(data) {
                if (data) {
                    if (cb && typeof cb === 'function') {
                        cb(indicatorItem);
                    }
                    // Add indicator to the state.
                    if (me._state.indicators === null || me._state.indicators === undefined) {
                        me._state.indicators = [];
                    }

                    var themes = [];
                    if(me.getFlatIndicatorsdata()) {
                        var indicator = $.grep(me.getFlatIndicatorsdata(), function(item, index) {
                            return item.id == indicatorId;
                        });
                        if(indicator && indicator.length > 0) {
                            $.each(indicator[0].themes, function(index, item) {
                                themes.push({fi: item.fi,
                                             id: item.id});
                            });
                        }
                    } else if(me._state.indicators.length > 0) {//IS THIS NEEDED
                        var indicator = $.grep(me._state.indicators, function(item, index) {
                            return item.id == indicatorId;
                        });
                        themes = indicator[0].themes;
                    }

                    me._state.indicators.push({
                        id: indicatorId,
                        year: year,
                        gender: gndrs,
                        group: group,
                        geometry: wktGeometry,
                        filter: filterParam,
                        type: type,
                        direction: direction,
                        mode: me.mode,
                        themes: themes
                    });
                    // Show the data in the grid.
                    var indi = $.grep(me.indicators, function(item){
                        return item.id == indicatorId;
                    })[0];
                    me.addIndicatorDataToGrid(container, indicatorId, gndrs, year, wktGeometry, filterParam, type, direction, data, indi);

                    if(typeof me._state.loadState === 'undefined') {
                        me._state.loadState = {};
                    }

                    $.each(me._state.functionalRows, function(index, functionalArea) {
                        me._state.loadState[indicatorId + ":" + functionalArea.key + ":" + functionalArea.id + ":" + functionalArea.areaYear] = true;
                    });

                    $.each(me._state.functionalRows, function(index, functionalArea) {
                          var category = null;
                          for(key in me._categoriesGroupKeys) {
                              if(me._categoriesGroupKeys[key] === group) {
                                  category = key;
                                  break;
                              }
                          }
                          me.getFunctionalAreaIndicatorData(me._getIndicatorColumnId(indicatorId, gndrs, year, wktGeometry, filterParam, type, direction), category, functionalArea, function(columnId, data, columns, cat) {
                              me._updateIndicatorDataToGrid(columnId, data, columns, !(functionalArea.key === me._state.visualizationAreaCategory.key && functionalArea.id === me._state.visualizationAreaCategory.id));
                              delete me._state.loadState[indicatorId + ":" + cat];
                              if ($.isEmptyObject(me._state.loadState)) {
                                  me._hideOverlay();
                                  me._hideEmptyItemsInGrid();
                                  me._expandAllSubitemsInGrid();
                              }
                          });
                    });
                } else {
                    me._hideOverlay();
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataError);
                }
            };
            var params = {
                'indicator': indicatorId,
                'year': year,
                'group': group,
                'wktGeometry': wktGeometry,
                'filter': filterParam,
                'errorCb': errorCb,
                'successCb': successCb,
                'type': type,
                'direction': direction,
                'gender': gndrs
            };

            me._showOverlay();
            if(me.mode !== 'twoway') {
                me.statsService.fetchIndicatorData2(params);
            } else {
                me.statsService.fetchTwowayIndicatorData2(params);
            }
        },

        getAdditionalAreaIndicatorData: function(indicator, group, regionIds, cb) {
            var me = this,
                indi,
                gndrs;

            for(var i = 0; i < me._state.indicators.length; ++i) {
                if (indicator === me._getIndicatorColumnId(me._state.indicators[i].id, me._state.indicators[i].gender, me._state.indicators[i].year, me._state.indicators[i].geometry, me._state.indicators[i].filter, me._state.indicators[i].type, me._state.indicators[i].direction)) {
                    indi = me._state.indicators[i];
                    break;
                }
            }

            gndrs = indi.gender;

            var errorCb = function(jqXHR, textStatus) {
                me._hideOverlay();
                me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataXHRError);
            };
            var successCb = function(data) {
                var found = false;
                if (data) {
                    for(var i = 0; i < data.length; ++i) {
                        me.indicatorsData[indicator].push(data[i]);
                        if(!found) {
                            if(jQuery.inArray(data[i].region, regionIds) > -1) {
                                found = true;
                            }
                        }
                    }
                    if (cb && typeof cb === 'function') {
                        cb(found);
                    }
                } else {
                    me._hideOverlay();
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataError);
                }
            };
            var params = {
                'indicator': indi.id,
                'year': indi.year,
                'group': me._categoriesGroupKeys[group],
                'wktGeometry': indi.geometry,
                'filter': indi.filter,
                'errorCb': errorCb,
                'successCb': successCb,
                'type': indi.type,
                'direction': indi.direction,
                'gender': indi.gender
            };

            me._showOverlay();
            if(indi.mode !== 'twoway') {
                me.statsService.fetchIndicatorData2(params);
            } else {
                me.statsService.fetchTwowayIndicatorData2(params);
            }
        },

        getFunctionalAreaIndicatorData: function(indicator, group, functionalArea, cb) {
            var me = this,
                indi,
                gndrs;
            for(var i = 0; i < me._state.indicators.length; ++i) {
                if (indicator === me._getIndicatorColumnId(me._state.indicators[i].id, me._state.indicators[i].gender, me._state.indicators[i].year, me._state.indicators[i].geometry, me._state.indicators[i].filter, me._state.indicators[i].type, me._state.indicators[i].direction)) {
                    indi = me._state.indicators[i];
                    break;
                }
            }

            gndrs = indi.gender;

            var errorCb = function(jqXHR, textStatus) {
                me._hideOverlay();
                me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataXHRError);
                if (cb && typeof cb === 'function') {
                    cb(indicator, me.indicatorsData[indicator], me.grid.getColumns(), functionalArea.key + ":" + functionalArea.id + ":" + functionalArea.areaYear);
                }
            };
            var successCb = function(data) {
                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        data[i].region = data[i].region + "_" + functionalArea.key + "_" + functionalArea.id + "_" + functionalArea.areaYear;
                        me.indicatorsData[indicator].push(data[i]);
                    }
                    if (cb && typeof cb === 'function') {
                        cb(indicator, me.indicatorsData[indicator], me.grid.getColumns(), functionalArea.key + ":" + functionalArea.id + ":" + functionalArea.areaYear);
                    }
                } else {
                    me._hideOverlay();
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataError);
                }
            };

            var filter = [];

            if(functionalArea.key === "intersection") {
                $.each(me._state.functionalRows, function(index, item) {
                    if(item.key !== "intersection") {
                        if(filter.length > 0) {
                            filter.push({"boolean":"AND"});
                        }
                        filter.push({"key":item.key,"values":[item.id]});
                    }
                });
            } else {
                filter.push({"key":functionalArea.key,"values":[functionalArea.id]});
            }

            if(indi.filter) {
                var areaFilter = JSON.parse(indi.filter);
                if(areaFilter && areaFilter.length > 0) {
                    filter = filter.concat({"boolean":"AND"}, areaFilter);
                }
            }

            var params = {
                'indicator': indi.id,
                'year': indi.year,
                'group': me._categoriesGroupKeys[group],
                'wktGeometry': indi.geometry,
                'filter': JSON.stringify(filter),
                'errorCb': errorCb,
                'successCb': successCb,
                'type': indi.type,
                'direction': indi.direction,
                'gender': indi.gender,
                'areaYear': functionalArea.areaYear
            };

            me._showOverlay();
            if(indi.mode !== 'twoway') {
                me.statsService.fetchIndicatorData2(params);
            } else {
                me.statsService.fetchTwowayIndicatorData2(params);
            }
        },

        /**
         * Get indicator column id.
         *
         * @method _getIndicatorColumnId
         * @param indicatorId id
         * @param gender (male/female/total)
         * @param year selected year
         * @return String columnId unique column id
         */
        _getIndicatorColumnId: function (indicatorId, gender, year, geometry, filter, type, direction, comparisonType) {
            var comparison = typeof comparisonType === 'undefined' ? '' : comparisonType;
            return "indicator" + indicatorId + year.replace(/\D/g, '') + gender + geometry + filter + type + direction + comparison;
        },

        /**
         * Add indicator data to the grid.
         *
         * @method addIndicatorDataToGrid
         * @param container parent element
         * @param indicatorId id
         * @param gender (male/female/total)
         * @param year selected year
         * @param data related to the indicator
         */
        addIndicatorDataToGrid: function (container, indicatorId, gender, year, geometry, filter, type, direction, data, meta, silent) {

            var me = this,
                comparisonType = meta.columnComparison ? meta.comparisonType : '',
                columnId = me._getIndicatorColumnId(indicatorId, gender, year, geometry, filter, type, direction, comparisonType),
                columns = me.grid.getColumns(),
                indicatorName = meta.title[Oskari.getLang()],
                themes = [],
                orderNumber = meta.orderNumber;

            if (me.isIndicatorInGrid(columnId)) {
                return false;
            }

            if(me.getFlatIndicatorsdata()) {
                var indicator = $.grep(me.getFlatIndicatorsdata(), function(item, index) {
                    return item.id == indicatorId;
                });
                if(indicator && indicator.length > 0) {
                    $.each(indicator[0].themes, function(index, item) {
                        themes.push({fi: item.fi,
                                     id: item.id});
                    });
                }
            } else if(me._state.indicators.length > 0) {
                var indicator = $.grep(me._state.indicators, function(item, index) {
                    return item.id == indicatorId;
                });
                themes = indicator[0].themes;
            }

            var fullName = "",
                unit = meta.unit == null ? me.indicatorsMeta[indicatorId].unit : meta.unit,
                name = indicatorName + '<br/>';
            if (unit && unit != '') {
                name += '[' + unit + ']<br/>';
            }
            name += year;

            var columnComparison = meta.columnComparison == null ? false : meta.columnComparison;
            if ((me.mode === 'twoway')&&(!meta.columnComparison)) {
                var typename = $.grep(meta.classifications.type, function(item, index) {
                    return type === item.id;
                });
                if(typeof typename !== 'undefined' && typename.length > 0) {
                    name = typename[0].name + '<br/>' + year;
                    indicatorName = typename[0].name;
                    orderNumber = typename[0].orderNumber;
                }

            }

            if(themes) {
                for(var i = Math.max(0, themes.length - 2); i < themes.length; ++i) {
                    fullName = fullName + themes[i].fi + '<br/>';
                }
            }

            fullName = fullName + name;
            columns.push({
                indicatorData : {
                    id : indicatorId,
                    year: year,
                    geometry: geometry,
                    filter: filter,
                    type: type,
                    direction: direction,
                    name: indicatorName,
                    unit: unit,
                    themes: themes,
                    orderNumber: orderNumber,
                    decimalCount: meta.decimalCount,
                    privacyLimit: meta.privacyLimit,
                    columnComparison: columnComparison
                },
                id: columnId,
                name: name,
                fullName: fullName,
                filter: filter,
                geometry: geometry,
                field: columnId,
                toolTip: indicatorName,
                sortable: true,
                deleteHandler : function (e) {
                    me.removeIndicatorDataFromGrid(indicatorId, gender, year, geometry, filter, type, direction, columnComparison, comparisonType);
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var numValue = Number(value),
                        ret;
                    if(typeof dataContext[columnDef.field + "_PrivacyLimitTriggered"] !== undefined && dataContext[columnDef.field + "_PrivacyLimitTriggered"]) {
                        return "Piilotettu";
                    }
                    if (isNaN(numValue) || columnDef.decimals === null || columnDef.decimals === undefined) {
                        ret = value;
                    } else {
                        ret = me.statsService.formatThousandSeparators(numValue.toFixed(columnDef.decimals));
                    }
                    return ret;
                },
                groupTotalsFormatter: function (totals, columnDef) {
                    var text = "";
                    // create grouping footer texts. => how many values there is in different colums
                    var valueCount = 0,
                        rows = totals.group.rows,
                        row,
                        i;
                    for (i = 0; i < rows.length; i++) {
                        row = rows[i];
                        if (row[columnDef.field] !== null && row[columnDef.field] !== undefined) {
                            valueCount++;
                        }
                    }
                    text = valueCount + ' ' + me._locale.values;
                    return text;
                }
            });

            var newColumns = me._fixColumns(columns);

            me.grid.setColumns(newColumns);

            me.indicatorsData[columnId] = data;

            me._updateIndicatorDataToGrid(columnId, data, columns);

            me.autosizeColumns();

            // TODO do we still need this stuff?

            if (!silent) {
                // Show classification
                me.sendStatsData(columns[columns.length - 1]);
            }

            me.updateDemographicsButtons(indicatorId, gender, year);
            me.grid.setSortColumn(me._state.currentColumn, true);
            me.updateGridRegionCategorySelector();
            me._updateButtons();
        },

        _fixColumns: function(columns) {
            var newColumns = [];
            var staticColumns = columns.slice(0,2);
            columns = columns.slice(2);
            $.each(columns, function(index, column) {
                if(typeof column.indicatorData === 'undefined' || typeof column.indicatorData.themes === 'undefined' || column.indicatorData.themes.length <= 1) {
                    newColumns.push(column);
                } else {
                    var themes = column.indicatorData.themes;
                    var orderNumber = 0;
                    if(typeof column.indicatorData.orderNumber !== 'undefined') {
                        orderNumber = column.indicatorData.orderNumber;
                    }
                    var grandParent = $.grep(newColumns, function(item, index) {
                        return item.id === ""+themes[themes.length - 2].id;
                    });

                    if(grandParent.length > 0) {
                        grandParent = grandParent[0];
                    } else {
                        grandParent = {id: ""+themes[themes.length - 2].id,
                                  name: themes[themes.length - 2].fi,
                                  toolTip: themes[themes.length - 2].fi,
                                  orderNumber: orderNumber,
                                  columns: []};
                        newColumns.push(grandParent);
                    }

                    var parent = $.grep(grandParent.columns, function(item, index) {
                        return item.id === ""+themes[themes.length - 1].id;
                    });

                    if(parent.length > 0) {
                        parent = parent[0];
                    } else {
                        parent = {id: ""+themes[themes.length - 1].id,
                                  name: themes[themes.length - 1].fi,
                                  toolTip: themes[themes.length - 1].fi,
                                  orderNumber: orderNumber,
                                  columns: []};
                        grandParent.columns.push(parent);
                        if(grandParent.orderNumber > parent.orderNumber) {
                            grandParent.orderNumber = parent.orderNumber;
                        }
                    }

                    parent.columns.push(column);
                    if(parent.orderNumber > column.orderNumber) {
                        parent.orderNumber = column.orderNumber;
                    }
                }
            });

            var sortColumns = function(columns) {
                for(var i = 0; i < columns.length; ++i) {

                    if(typeof columns[i].columns !== 'undefined') {
                        sortColumns(columns[i].columns);
                    }
                    columns.sort(function(a,b) {
                        if(typeof a.indicatorData !== 'undefined' && typeof b.indicatorData !== 'undefined') {
                            if(a.indicatorData.orderNumber !== b.indicatorData.orderNumber) {
                                return a.indicatorData.orderNumber - b.indicatorData.orderNumber;
                            } else {
                                return a.indicatorData.year - b.indicatorData.year;
                            }
                        } else {
                            if(typeof a.orderNumber !== 'undefined' && typeof b.orderNumber !== 'undefined') {
                                return a.orderNumber - b.orderNumber;
                            } else if(typeof a.orderNumber === 'undefined' && typeof b.orderNumber === 'undefined') {
                                return 0;
                            } else if(typeof a.orderNumber === 'undefined') {
                                return -1;
                            } else if (typeof b.orderNumber === 'undefined') {
                                return 1;
                            }
                        }
                    });
                }
            }

            sortColumns(newColumns);

            return staticColumns.concat(newColumns);
        },

        _updateIndicatorDataToGrid: function (columnId, data, columns, silent) {
            var me = this,
                hasNoData = true,
                column = me._getColumnById(columnId),
                i,
                indicatorId,
                gender,
                year,
                numValue,
                category = this._state.regionCategory,
                regions = this.regionCategories[category],
                regionIds = [],
                dataMissing = true;

            data = data || me.indicatorsData[columnId];

            if(typeof regions !== 'undefined') {

                for(var i = 0; i < regions.length; ++i) {
                    regionIds.push(regions[i].id);
                }

                for(var i = 0; i < data.length; ++i) {
                    if(jQuery.inArray(data[i].region, regionIds) > -1) {
                        dataMissing = false;
                        break;
                    }
                }

                if(dataMissing) {
                    if(typeof me._state.loadState === 'undefined') {
                        me._state.loadState = {};
                    }

                    if(me._state.functionalRows.length == 0) {
                        me._state.loadState[columnId + ":administrative:1"] = true;
                    } else {
                        $.each(me._state.functionalRows, function(index, functionalArea) {
                            me._state.loadState[columnId+ ":" + functionalArea.key + ":" + functionalArea.id + ":" + functionalArea.areaYear] = true;
                        });
                    }

                    this.getAdditionalAreaIndicatorData(columnId, category, regionIds, function (found) {
                        if(me._state.functionalRows.length == 0) {
                            delete me._state.loadState[columnId + ":administrative:1"];
                            if(found) {
                                me._updateIndicatorDataToGrid(columnId, data, columns, false);
                            }
                            if($.isEmptyObject(me._state.loadState)) {
                                me._hideOverlay();
                                me._hideEmptyItemsInGrid();
                            }
                        } else {
                            var done = 0;
                            $.each(me._state.functionalRows, function(index, functionalArea) {
                                me.getFunctionalAreaIndicatorData(columnId, category, functionalArea, function(columnId, data, columns) {
                                    delete me._state.loadState[columnId+ ":" + functionalArea.key + ":" + functionalArea.id + ":" + functionalArea.areaYear];

                                    if($.isEmptyObject(me._state.loadState)) {
                                        me._hideOverlay();
                                        me._hideEmptyItemsInGrid();
                                    }

                                    if(++done == me._state.functionalRows.length) {
                                        if(found) {
                                            me._updateIndicatorDataToGrid(columnId, data, columns, functionalArea.key === me._state.visualizationAreaCategory.key && functionalArea.id === me._state.visualizationAreaCategory.id);
                                        }
                                    }
                                });
                            });
                        }
                    });

                    return;
                }
            }
            columns = columns || me.grid.getColumns();
            me.dataView.beginUpdate();

            // loop through data and get the values
            var indicData,
                regionId,
                value,
                item;
            if (data) {
                for (i = 0; i < data.length; i++) {
                    indicData = data[i];
                    regionId = indicData.region;
                    if(typeof indicData['primary value'] === 'undefined') {
                        value = indicData['primary value'];
                    } else {
                        value = indicData['primary value'].replace(',', '.');
                    }

                    if (regionId !== null && regionId !== undefined) {
                        // find region
                        // if region is whole Finland and geometry filter is turned on then add new item for each filter
                        if (regionId === "finland:-1" && column.indicatorData.geometry != null && column.indicatorData.geometry.length > 0) {

                            //check if the item for the current filter exists in the grid, if not - add it
                            //this checking is to prevent duplicating items in the grid
                            var items = me.dataView.getItems(),
                                geomFilterItemId = null;

                            for (var j = 0; j < items.length; j++) {
                                if (items[j].title == indicData['title']) {
                                    geomFilterItemId = items[j].id;
                                    break;
                                }
                            }

                            if (geomFilterItemId != null) {
                                item = me.dataView.getItemById(geomFilterItemId);
                            } else {
                                me.dataView.addItem({
                                    availabilityYears: undefined,
                                    category: "FINLAND",
                                    code: "",
                                    id: "geomFilter" + i,
                                    memberOf: Array[0],
                                    municipality: indicData['title'],
                                    orderNumber: 0,
                                    sel: "empty",
                                    title: indicData['title']
                                });
                                item = me.dataView.getItemById("geomFilter" + i);
                            }

                        } else {
                            item = me.dataView.getItemById(regionId);
                        }

                        if (item) {
                            hasNoData = false;
                            // update row
                            numValue = Number(value);
                            if (isFinite(numValue)) {
                                item[columnId] = numValue;
                            } else {
                                item[columnId] = '-';
                            }

                            if (item.id === "finland:-1") {
                                if(column.indicatorData.geometry != null && column.indicatorData.geometry.length > 0) {
                                    item.municipality = "Karttarajaus";
                                } else {
                                    item.municipality = item.title;
                                }
                            }

                            if(typeof indicData['PrivacyLimitTriggered'] !== 'undefined') {
                                item[columnId + "_PrivacyLimitTriggered"] = indicData['PrivacyLimitTriggered'];
                            } else {
                                item[columnId + "_PrivacyLimitTriggered"] = false;
                            }
                            if(typeof indicData['NullValue'] !== 'undefined') {
                                item[columnId + "_NullValue"] = indicData['NullValue'];
                            } else {
                                item[columnId + "_NullValue"] = false;
                            }
                            me.dataView.updateItem(item.id, item);
                        }
                    }
                }
            }
            column.decimals = column.indicatorData.decimalCount;

            // Display a warning if cannot be displayed in the selected region category
            if (column.header && column.header.buttons) {
                me._addHeaderWarning(hasNoData, column.header.buttons);
                me.grid.setColumns(me._fixColumns(columns));
            }

            // create all the aggregators we need
            var aggregators = [];

            for (i = 0; i < columns.length; i++) {
                var id = columns[i].id;
                aggregators.push(new Slick.Data.Aggregators.Avg(id));
                aggregators.push(new Slick.Data.Aggregators.Std(id));
                aggregators.push(new Slick.Data.Aggregators.Mdn(id));
                aggregators.push(new Slick.Data.Aggregators.Mde(id));
                aggregators.push(new Slick.Data.Aggregators.Sum(id));
                aggregators.push(new Slick.Data.Aggregators.Max(id));
                aggregators.push(new Slick.Data.Aggregators.Min(id));
            }
            me.dataView.setAggregators(aggregators, true);

            // Add callback function for totals / statistics
            me.dataView.setTotalsCallback(function (groups) {
                me._updateTotals(groups);
            });

            me.dataView.endUpdate();
            me.dataView.refresh();
            me.grid.invalidateAllRows();
            me.grid.render();

            me._hideEmptyItemsInGrid();

            if (!silent) {
                // Show classification
                me.sendStatsData(column);
            }

            me.updateDemographicsButtons(indicatorId, gender, year);
            me.grid.setSortColumn(me._state.currentColumn, true);
        },
        /**
         * Displays a warning in the header if the indicator data
         * cannot be displayed in the selected region category.
         *
         * @method _addHeaderWarning
         * @param {Boolean} noData
         * @param {Array[Object]} buttons
         */
        _addHeaderWarning: function (noData, buttons) {
            var addedAlready = _.any(buttons, function (item) {
                return item.id === 'no-data-warning';
            });

            if (noData && !addedAlready) {
                // If no data for current category and not yet displayed
                buttons.push({
                    id: 'no-data-warning',
                    cssClass: 'statsgrid-no-indicator-data backendstatus-maintenance-pending',
                    tooltip: this._locale.noIndicatorData
                });
            } else if (addedAlready) {
                // Remove if warning is there
                for (var i = 0, bLen = buttons.length; i < bLen; ++i) {
                    if (buttons[i].id === 'no-data-warning') {
                        buttons.splice(i, 1);
                        break;
                    }
                }
            }
        },

        /**
         * Remove indicator data to the grid.
         *
         * @method removeIndicatorDataFromGrid
         * @param indicatorId id
         * @param gender (male / female / total)
         * @param year selected year
         */
        removeIndicatorDataFromGrid: function (indicatorId, gender, year, geometry, filter, type, direction, columnComparison, comparisonType) {
            var comparison = columnComparison ? comparisonType : '',
                columnId = this._getIndicatorColumnId(indicatorId, gender, year, geometry, filter, type, direction, comparison),
                columns = this.grid.getColumns(),
                allOtherColumns = [],
                found = false,
                i = 0,
                ilen = 0,
                j = 0;

            for (i = 0, ilen = columns.length, j = 0; i < ilen; i++) {
                if (columnId === columns[i].id) {
                    // Skip the column that is to be deleted
                    found = true;
                } else {
                    allOtherColumns[j] = columns[i];
                    j++;
                }
            }

            // replace the columns with the columns without the column that was found
            if (found) {
                if (allOtherColumns.length === 2) {
                    // Only checkbox and municipality columns left, resize municipality column to ~50%
                    allOtherColumns[1].width = 250;
                }
                this.grid.setColumns(this._fixColumns(allOtherColumns));
                this.grid.render();
                this.dataView.refresh();
                if (allOtherColumns.length !== 2) {
                    this.autosizeColumns();
                }
            }

            // remove indicator also from to the state!
            if (this._state.indicators) {
                for (i = 0, ilen = this._state.indicators.length; i < ilen; i++) {
                    var statedIndicator = this._state.indicators[i];
                    if ((indicatorId === statedIndicator.id) &&
                        (year === statedIndicator.year) &&
                        (gender === statedIndicator.gender) &&
                        (geometry === statedIndicator.geometry) &&
                        (filter === statedIndicator.filter) &&
                        (type === statedIndicator.type) &&
                        (direction === statedIndicator.direction)) {
                        this._state.indicators.splice(i, 1);
                        break;
                    }
                }
            }
            if (this._state.comparisons) {
                for (i = 0, ilen = this._state.comparisons.length; i < ilen; i++) {
                    var statedComparison = this._state.comparisons[i];
                    if ((statedComparison.indicatorId === indicatorId)&&
                    (statedComparison.comparisonOption.type === comparisonType)&&
                    (statedComparison.year === year)) {
                        this._state.comparisons.splice(i, 1);
                        break;
                    }
                }
            }

            // remove from metadata hash as well
            if (!columnComparison) {
                this.removeIndicatorMeta(indicatorId);
            }

            delete this.indicatorsData[columnId];

            this.updateDemographicsButtons(indicatorId, gender, year);

            this.updateGridRegionCategorySelector();

            this.sendStatsData(undefined);

            this._updateButtons();
            /*
            if (columnId === this._state.currentColumn) {
                // hide the layer, as we just removed the "selected"
                this._setLayerVisibility(false);
                this._state.currentColumn = null;
            }
*/
        },

        resetLayer: function () {
            if ((this.instance.state.indicators == null || this.instance.state.indicators.length == 0) && this._layer) {
                this._sandbox.postRequestByName('RemoveMapLayerRequest', [this._layer.getId()]);
            }
        },

        autosizeColumns: function () {
            var grid = this.grid,
                columns = grid.getColumns();

            _.each(columns, function (column) {
                if (column.id !== '_checkbox_selector') {
                    column.width = 80;
                }
            });

            grid.autosizeColumns();
        },

        /**
         * Create HTML for year selector
         *
         * @method getYearSelectorHTML
         * @param startYear
         * @param endYear
         */
        getYearSelectorHTML: function (startYear, endYear) {
            var me = this;
            // Years
            var year = jQuery('<div class="yearsel selector-cont"><label for="year">' + this._locale.year + '</label><select name="year" class="year" multiple></select></div>'),
                sel = year.find('select'),
                i,
                opt;

            me.updateYearSelectorValues(sel, []);

            return year;
        },
        /**
         * Update values for year selector
         *
         * @method updateYearSelectorValues
         * @param sel
         * @param startYear
         * @param endYear
         */
        updateYearSelectorValues: function (sel, years) {
            var i,
                opt,
                oldValues = sel.val(),
                newValues = [];
            sel.empty();

            var extraOption = "newest",
                extraOptionTitle = "Uusin mahdollinen";

            if($.inArray(extraOption, oldValues) > -1) {
                newValues.push(extraOption);
            }

            opt = jQuery('<option value=' + extraOption + '>' + extraOptionTitle + '</option>');
            sel.append(opt);
            for (i = 0; i < years.length; i++) {
                opt = jQuery('<option value="' + years[i] + '">' + years[i] + '</option>');
                sel.append(opt);
                if($.inArray(years[i], oldValues) > -1) {
                    newValues.push(years[i]);
                }
            }

            if(newValues.length === 0) {
                newValues.push(extraOption);
            }

            sel.val(newValues);
            sel.prop('disabled', '');

            sel.trigger("chosen:updated");
        },
        /**
         * Create HTML for gender selector
         *
         * @method getGenderSelectorHTML
         * @param values for select element
         */
        getGenderSelectorHTML: function (values) {
            var me = this;
            //Gender
            var gender = jQuery('<div class="gendersel selector-cont"><label for="gender">' + this._locale.gender + '</label><select name="gender" class="gender"></select></div>'),
                sel = gender.find('select');

            if (values && values.length) {
                me.updateGenderSelectorValues(sel, values);
            }
            sel.change(function (e) {
                me.updateDemographicsButtons(null, e.target.value, null);
            });

            return gender;
        },
        getTypeSelectorHTML: function (values) {
            var me = this;
            //type
            var type = jQuery('<div class="typesel selector-cont"><label for="type">' + this._locale.type + '</label><select multiple name="type" class="type"></select></div>'),
                sel = type.find('select');

            if (values && values.length) {
                me.updateTypeSelectorValues(sel, values);
            }
            sel.change(function (e) {
                me.updateDemographicsButtons(null, null, null);
            });
            return type;
        },
        getDirectionSelectorHTML: function (values) {
            var me = this;
            //type
            var type = jQuery('<div class="directionsel selector-cont"><label for="direction">' + this._locale.direction + '</label><select name="direction" class="direction"></select></div>'),
                sel = type.find('select');

            if (values && values.length) {
                me.updateDirectionSelectorValues(sel, values);
            }
            sel.change(function (e) {
                me.updateDemographicsButtons(null, null, null);
            });
            return type;
        },
        /**
         * Update values for gender selector
         *
         * @method updateGenderSelectorValues
         * @param sel Select element
         * @param values Values for select element
         */
        updateGenderSelectorValues: function (sel, values) {
            var i,
                opt;
            sel.empty();
            for (i = 0; i < values.length; i++) {
                opt = jQuery('<option value="' + values[i] + '">' + this._locale.genders[values[i]] + '</option>');
                sel.append(opt);
            }
            sel.val(values[values.length - 1]);
            sel.prop('disabled', '');
            sel.trigger("chosen:updated");
        },
        updateTypeSelectorValues: function (sel, values) {
            var i,
                opt;
            sel.empty();
            for (i = 0; i < values.length; i++) {
                opt = jQuery('<option value="' + values[i].id + '">' + values[i].name + '</option>');
                sel.append(opt);
            }
            sel.val(values[values.length - 1]);
            sel.prop('disabled', '');
            sel.trigger("chosen:updated");
        },
        updateDirectionSelectorValues: function (sel, values) {
            var i,
                opt;
            sel.empty();
            for (i = 0; i < values.length; i++) {
                opt = jQuery('<option value="' + values[i] + '">' + this._locale.directions[values[i]] + '</option>');
                sel.append(opt);
            }
            sel.val(values[0]);
            sel.prop('disabled', '');
        },

        /**
         * Sends the selected column's data from the grid
         * in order to create the visualization.
         *
         * @method sendStatsData
         * @param curCol  Selected indicator data column
         */
        sendStatsData: function (curCol) {
            if (typeof curCol === 'undefined' || curCol === null || (curCol && (curCol.field == null || curCol.field.indexOf('indicator') < 0))) {
                // Not a valid current column nor a data value column
                return;
            }
            if (!this.stateIndicatorsLoaded) {
                // No use to be here without indicators
                return;
            }

            //Classify data
            var me = this,
                statArray = [],
                munArray = [],
                visArray = [],
                functionalRows = [],
                check = false,
                i,
                k,
                municipalities = me._state.municipalities = [],
                areaCategory;
            // Set current column to be stated
            me._state.currentColumn = curCol ? curCol.id : undefined;

            if(typeof me._state.visualizationAreaCategory === 'undefined' || !me._state.visualizationAreaCategory) {
                me._state.visualizationAreaCategory = {key: "administrative", id: 1};
            }

            areaCategory = me._state.visualizationAreaCategory;

            // Get values of selected column
            var data = this.dataView.getItems();
            if (curCol) {
                for (i = 0; i < data.length; i++) {
                    var row = data[i];
                    // Exclude null values
                    if (row.sel === "checked" && ((me._categoriesHierarchy[row.category] && me._categoriesHierarchy[row.category].type === areaCategory.key) || row.id.match(new RegExp("_" + areaCategory.key + "_" + areaCategory.id)))) {
                        municipalities.push(row.id);
                        if (row[curCol.field] !== null && row[curCol.field] !== undefined  && row[curCol.field] !== '-') {
                            statArray.push(row[curCol.field]);
                            // Municipality codes (kuntakoodit)
                            munArray.push(row.code);
                            visArray.push(row.municipality);
                        }
                    }
                }
            }

            var indicatorMetadata = null;
            for (i = 0; i < this.indicators.length; i++) {
                if (this.indicators[i].id == curCol.indicatorData.id) {
                    indicatorMetadata = this.indicators[i];
                    break;
                }
            }
            var datasource = null;
            if (indicatorMetadata != null) {
                datasource = this._findDataSourceForIndicator(indicatorMetadata);
            }

            curCol.indicatorData.dataSource = datasource;

            var timePeriod = [];

            if(indicatorMetadata.timePeriods) {
                timePeriod = $.grep(indicatorMetadata.timePeriods, function(item, index) {
                    return item.Id == curCol.indicatorData.year;
                });
            }

            if(timePeriod.length > 0) {
                var areaTypes = _.map(timePeriod[0].AreaTypes, function(item) {
                    return item.Id;
                });
                curCol.indicatorData.areaTypes = areaTypes;
            }

            // Send the data trough the stats service.
            me.statsService.sendStatsData(me._layer, {
                CHECKED_COUNT: this.getItemsByGroupingKey('checked').length, // how many municipalities there is checked
                CUR_COL: curCol,
                VIS_NAME: me._layer.getWmsName(), //"ows:kunnat2013",
                VIS_ATTR: me._layer.getFilterPropertyName(), //"kuntakoodi",
                VIS_CODES: munArray,
                VIS_NAMES: visArray,
                COL_VALUES: statArray
            });

            // Show the layer, if it happens to be invisible
            this._setLayerVisibility(true);
        },

        /**
         * Set layer visibility
         *
         * @method _setLayerVisibility
         * @param visibility for hiding by passing false, and revealing by passing true
         */
        _setLayerVisibility: function (visibility) {
            // show the layer, if not visible
            if (this._layer._visible !== visibility) {
                var sandbox = this._sandbox,
                    visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
                if (visibilityRequestBuilder) {
                    var request = visibilityRequestBuilder(this._layer.getId(), visibility);
                    sandbox.request(this, request);
                }
            }
        },


        /**
         * Get Sotka metadata for given indicators
         *
         * @method getSotkaIndicatorsMeta
         * @param indicators for which we fetch data
         * @param callback what to do after we have fetched metadata for all the indicators
         */
        getSotkaIndicatorsMeta: function (container, indicators, callback) {
            var me = this,
                fetchedIndicators = 0,
                i;
            me.indicators = [];

            for (i = 0; i < indicators.length; i++) {
                var indicatorData = indicators[i],
                    indicator = indicatorData.id;

                // ajax call
                me.statsService.fetchStatsData(
                    // url
                    me._sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
                    // success callback
                    // FIXME create function outside loop

                    function (data) {
                        //keep track of returned ajax calls
                        fetchedIndicators++;

                        if (data) {
                            me.addIndicatorMeta(data);
                            var j;
                            for (j = 0; j < indicators.length; j++) {
                                if (indicators[j].id === data.id) {
                                    me.indicators[j] = data;
                                }
                            }

                            // when all the indicators have been fetched
                            // fire callback
                            if (fetchedIndicators >= indicators.length) {
                                callback();
                            }

                        } else {
                            me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataError);
                        }
                    },
                    // error callback
                    // FIXME create function outside loop

                    function (jqXHR, textStatus) {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataXHRError);
                        //keep track of returned ajax calls
                        fetchedIndicators++;
                    },
                    me.ignoreCache
                );
            }
        },

        getTwowayIndicatorsMeta: function (container, indicators, callback) {
            var me = this,
                fetchedIndicators = 0,
                i;
            me.indicators = [];

            for (i = 0; i < indicators.length; i++) {
                var indicatorData = indicators[i],
                    indicator = indicatorData.id;

                // ajax call
                me.statsService.fetchStatsData(
                    // url
                    me._sandbox.getAjaxUrl() + 'action_route=GetTwowayData&action=indicator_metadata&indicator=' + indicator + '&version=v1',
                    // success callback
                    // FIXME create function outside loop

                    function (data) {
                        //keep track of returned ajax calls
                        fetchedIndicators++;

                        if (data) {
                            me.addIndicatorMeta(data);
                            var j;
                            for (j = 0; j < indicators.length; j++) {
                                if (indicators[j].id === data.id) {
                                    me.indicators[j] = data;
                                }
                            }

                            // when all the indicators have been fetched
                            // fire callback
                            if (fetchedIndicators >= indicators.length) {
                                callback();
                            }

                        } else {
                            me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataError);
                        }
                    },
                    // error callback
                    // FIXME create function outside loop

                    function (jqXHR, textStatus) {
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataXHRError);
                        //keep track of returned ajax calls
                        fetchedIndicators++;
                    },
                    me.ignoreCache
                );
            }
        },
        /**
         * Get Sotka data for given indicators
         *
         * @method getSotkaIndicatorsData
         * @param indicators for which we fetch data
         * @param callback what to do after we have fetched data for all the indicators
         */
        getSotkaIndicatorsData: function (container, indicators, callback) {
            var me = this,
                fetchedIndicators = 0,
                indicatorsData = {},
                i;

            for (i = 0; i < indicators.length; i++) {
                var indicatorData = indicators[i],
                    indicator = indicatorData.id,
                    year = indicatorData.year,
                    gender = indicatorData.gender || 'total';

                var successCb = function(data) {
                    fetchedIndicators++;
                    if (data && data.length > 0) {
                        var j,
                            ind,
                            indicatorColumnId;
                        //save the data to the right indicator for later use
                        for (j = 0; j < indicators.length; j++) {
                            ind = indicators[j];
                            // FIXME use ===
                            if (""+ind.id == ""+data[0].indicator &&
                                    ""+ind.year == ""+data[0].year &&
                                    ""+ind.gender === ""+data[0].gender) {

                                indicatorColumnId = me._getIndicatorColumnId(ind.id, ind.gender, ind.year, ind.geometry, ind.filter, ind.type, ind.direction);
                                indicatorsData[indicatorColumnId] = data;
                            }
                        }
                        // when all the indicators have been fetched
                        // add them to the grid and fire callback
                        if (fetchedIndicators >= indicators.length) {
                            //add these to the grid!!
                            for (j = 0; j < indicators.length; j++) {
                                ind = indicators[j];
                                if (ind) {
                                    indicatorColumnId = me._getIndicatorColumnId(ind.id, ind.gender, ind.year, ind.geometry, ind.filter, ind.type, ind.direction);
                                    var indData = indicatorsData[indicatorColumnId];
                                    me.addIndicatorDataToGrid(container, ind.id, ind.gender, ind.year, ind.geometry, ind.filter, ind.type, ind.direction, indData, me.indicators[j], true);
                                }
                            }
                            callback();
                        }
                        me._hideOverlay();
                    } else {
                        me._hideOverlay();
                        me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataError);
                    }
                };

                var errorCb = function (jqXHR, textStatus) {
                    me._hideOverlay();
                    me.showMessage(me._locale.connectionErrors.errorTitle, me._locale.connectionErrors.indicatorDataXHRError);
                    fetchedIndicators++;
                };
                var params = {
                    'indicator': indicatorData.id,
                    'year': indicatorData.year,
                    'group': indicatorData.group,
                    'wktGeometry': indicatorData.geometry,
                    'filter': indicatorData.filter,
                    'type': indicatorData.type,
                    'direction': indicatorData.direction,
                    'mode': indicatorData.mode,
                    'gender': indicatorData.gender,
                    'successCb' : successCb,
                    'errorCb' : errorCb,
                };
                me._showOverlay();
                if(indicatorData.mode !== 'twoway') {
                    me.statsService.fetchIndicatorData2(params);
                } else {
                    me.statsService.fetchTwowayIndicatorData2(params);
                }
            }
        },
        /**
         * Removes all indicator data from the grid
         *
         * @method clearDataFromGrid
         */
        clearDataFromGrid: function () {
            if (!this.grid) {
                return;
            }
            var columns = this.grid.getColumns(),
                newColumnDef = [],
                j = 0,
                i;
            for (i = 0; i < columns.length; i++) {
                var columnId = columns[i].id;
                if ((columnId === 'id' || columnId === 'municipality' || columnId === 'code' || columnId === '_checkbox_selector')) {
                    newColumnDef[j] = columns[i];
                    j++;
                }
            }
            this.grid.setColumns(this._fixColumns(newColumnDef));
            this.grid.render();
            this.dataView.refresh();
        },

        /**
         * @method showMessage
         * Shows user a message with ok button
         * @param {String} title popup title
         * @param {String} message popup message
         */
        showMessage: function (title, message, buttons) {
            if (this.dialog) {
                this.dialog.close(true);
                this.dialog = null;
            }

            var me = this,
                loc = this._locale,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if (buttons) {
                dialog.show(title, message, buttons);
            } else {
                var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                okBtn.setTitle(loc.buttons.ok);
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    dialog.close(true);
                    me.dialog = null;
                });
                dialog.show(title, message, [okBtn]);
                me.dialog = dialog;
            }

            return dialog;
        },

        /**
         * @method loadStateIndicators
         */
        loadStateIndicators: function (state, container) {
            var me = this,
                classifyPlugin = this._sandbox.findRegisteredModuleInstance('MainMapModuleManageClassificationPlugin');
            // First, let's clear out the old data from the grid.
            me.clearDataFromGrid();

            var indicators = _.groupBy(state.indicators || [], function (indicator) {
                return (indicator.ownIndicator ? 'user' : 'sotka');
            });

            // Add user's own indicators to grid.
            _.each(indicators.user, function (indicator) {
                me.addIndicatorDataToGrid(null, indicator.id, indicator.gender, indicator.year, indicator.geometry, indicator.filter, indicator.type, indicator.direction, indicator.data, {
                    'title': indicator.title
                });
                me.addIndicatorMeta(indicator);
            });

            if (indicators.sotka && indicators.sotka.length > 0) {
                //send ajax calls and build the grid
                if(indicators.sotka[0].mode !== 'twoway') {
                    me.getSotkaIndicatorsMeta(container, indicators.sotka, function () {
                        //send ajax calls and build the grid
                        me.getSotkaIndicatorsData(container, indicators.sotka, function () {

                            if (state.currentColumn !== null && state.currentColumn !== undefined) {
                                if (state.municipalities) {
                                    me._showSelectedAreas(state.municipalities);
                                }

                                // current column is needed for rendering map
                                // sendstats
                                var column = me._getColumnById(state.currentColumn);
                                // Filter
                                if ((state.filterMethod !== null) && (typeof state.filterMethod !== "undefined") &&
                                    (state.filterInput !== null) && (typeof state.filterInput !== "undefined") && (state.filterInput.length > 0)) {
                                    me.filterColumn(column, state.filterMethod, state.filterInput);
                                    state.filterInput = [];
                                }

                                // Area filter
                                if ((state.filterRegion !== null) && (typeof state.filterRegion !== "undefined") && (state.filterRegion.length > 0)) {
                                    me.filterColumnByRegion(column, state.filterRegion);
                                    state.filterRegion = [];
                                }

                                me.stateIndicatorsLoaded = true;
                                me.sendStatsData(column);
                                me.grid.setSortColumn(state.currentColumn, true);
                            }
                        });
                    });
                } else {
                    //TODO get two way data
                    me.mode = 'twoway';
                    if(!me._published)
                        me.instance.changeMode(me.mode);
                    me.changeMode(me.mode);
                    me.getTwowayIndicatorsMeta(container, indicators.sotka, function () {
                        //send ajax calls and build the grid
                        me.getSotkaIndicatorsData(container, indicators.sotka, function () {

                            if (state.currentColumn !== null && state.currentColumn !== undefined) {
                                if (state.municipalities) {
                                    me._showSelectedAreas(state.municipalities);
                                }

                                // current column is needed for rendering map
                                // sendstats
                                var column = me._getColumnById(state.currentColumn);
                                // Filter
                                if ((state.filterMethod !== null) && (typeof state.filterMethod !== "undefined") &&
                                    (state.filterInput !== null) && (typeof state.filterInput !== "undefined") && (state.filterInput.length > 0)) {
                                    me.filterColumn(column, state.filterMethod, state.filterInput);
                                    state.filterInput = [];
                                }

                                // Area filter
                                if ((state.filterRegion !== null) && (typeof state.filterRegion !== "undefined") && (state.filterRegion.length > 0)) {
                                    me.filterColumnByRegion(column, state.filterRegion);
                                    state.filterRegion = [];
                                }

                                me.stateIndicatorsLoaded = true;
                                me.sendStatsData(column);
                                me.grid.setSortColumn(state.currentColumn, true);
                            }
                        });
                    });
                }
            } else {
                me.stateIndicatorsLoaded = true;
            }
        },

        /**
         * Loads column comparisons from the plugin state.
         *
         * @method loadStateIndicators
         * @param state Current state.
         * @param container Grid container.
         */
        loadStateComparisons: function (state) {
            var me = this,
                comparisons = state.comparisons || [],
                columns = me.grid.getColumns();
            _.forEach(comparisons, function (comparison) {
                if ((comparison == null)||(comparison.columnIds == null)) {
                    return;
                }
                var comparedColumns = [];
                for (var i=0; i<2; i++) {
                    var id = comparison.columnIds[i];
                    if (id == null) {
                        return;
                    }
                    var index = me.grid.getColumnIndex(id);
                    if (index == null) {
                        return;
                    }
                    if (columns[index] == null) {
                        return;
                    }
                    comparedColumns.push(columns[index]);
                }
                me._createColumnComparison(comparison.comparisonOption, comparedColumns);
            });
        },

        /**
         * Loop through first group (municipalities) and create header row for
         * @private _updateTotals
         */
        _updateTotals: function (groups) {
            if (groups) {
                var columns = this.grid.getColumns(),
                    column,
                    i;
                // loop through columns
                for (i = 0; i < columns.length; i++) {
                    column = columns[i];

                    // group totals (statistical variables) should be calculated only for the checked/selected items
                    var group = groups[0],
                        key,
                        g;
                    for (key in groups) {
                        if (groups.hasOwnProperty(key)) {
                            g = groups[key];
                            if (g.groupingKey === "checked") {
                                group = g;
                            }
                        }
                    }

                    var gridTotals = group.totals,
                        sub = jQuery(this.templates.subHeader),
                        variableCount = 0,
                        j,
                        statistic, additionalItem, totalsItem;
                    // loop through statistical variables
                    for (j = 0; j < this.conf.statistics.length; j++) {
                        statistic = this.conf.statistics[j];
                        if (statistic.visible) {
                            sub.append(this._getStatistic(gridTotals, column.id, statistic.id));
                            variableCount++;
                        }
                    }


                    // add additional info
                    for (j = 0; j < this.conf.additionalItems.length; j++) {
                        additionalItem = this.conf.additionalItems[j];
                        if (additionalItem.visible) {
                            sub.append(this._getAdditionalItem(column, additionalItem.id));
                            variableCount++;
                        }
                    }


                    var columnDiv = jQuery(this.grid.getHeaderRowColumn(column.id)).empty(),
                        opts = this.grid.getOptions();
                    // TODO: 12 = font-size, 10 = padding...
                    var fontSize = columnDiv.css('line-height');
                    fontSize = (fontSize) ? fontSize.split('px')[0] : 12;
                    opts.headerRowHeight = variableCount * fontSize + 10;

                    //console.log("Header row " + opts.headerRowHeight);
                    this.grid.setOptions(opts);

                    sub.appendTo(columnDiv);
                }
            }
        },
        _getAdditionalItem: function (column, additionalItem) {
            var totalsItem = null;
            if (column.id.indexOf('indicator') >= 0) {
                var indicatorId = column.indicatorData.id;
                var organization;
                if (this.indicatorsMeta[indicatorId] != null) {
                    organization = this.indicatorsMeta[indicatorId].organization;
                }
                var indicator = $.grep(this.indicators, function(item, index) {
                    return item.id == indicatorId;
                });

                if(indicator && indicator.length > 0 && indicator[0].dataSources) {
                    var dataSource = $.grep(indicator[0].dataSources, function(item, index) {
                        return $.inArray(parseInt(column.indicatorData.year, 10), item.years) > -1;
                    });
                    if(dataSource && dataSource.length > 0) {
                        organization = dataSource[0].name;
                    }
                }
                totalsItem = jQuery(this.templates.statsgridTotalsVar);
                totalsItem.addClass('statsgrid-' + additionalItem).text(organization);
            } else if (column.id === 'municipality') {
                totalsItem = jQuery(this.templates.statsgridTotalsVar);
                totalsItem.attr('title', this._locale.additionalInfo.tooltip[additionalItem]);
                totalsItem.addClass('statsgrid-totals-label').text(this._locale.additionalInfo[additionalItem]);
            }
            return totalsItem;
        },
        /**
         * A method to get statistical variables
         * @private _getStatistic
         */
        _getStatistic: function (gridTotals, columnId, type) {
            var me = this,
                value = {},
                totalsItem = null,
                result = gridTotals[type],
                decimals = this._getColumnById(columnId).decimals,
                indicatorId;
            //loop through different indicator columns
            for (indicatorId in result) {
                if (result.hasOwnProperty(indicatorId)) {
                    if (!value[indicatorId]) {
                        value[indicatorId] = {};
                    }
                    if (indicatorId.indexOf('indicator') >= 0 && indicatorId === columnId) {
                        value[indicatorId][type] = result[indicatorId];
                        totalsItem = jQuery(this.templates.statsgridTotalsVar);
                        var val = value[columnId][type];
                        if (!isNaN(val)) {
                            if (this._isInt(val)) {
                                val = me.statsService.formatThousandSeparators(val);
                            } else {
                                val = val.toFixed && decimals !== null && decimals !== undefined ? me.statsService.formatThousandSeparators(val.toFixed(decimals)) : val;
                            }
                        }
                        if (_.isNaN(val)) {
                            val = '-';
                        }
                        totalsItem.addClass('statsgrid-' + type).text(val);
                        break;

                    } else if (columnId === 'municipality') {
                        totalsItem = jQuery(this.templates.statsgridTotalsVar);
                        totalsItem.attr('title', this._locale.statistic.tooltip[type]);
                        totalsItem.addClass(this._getCssClassForStatistic(type)).text(this._locale.statistic[type]);
                        break;
                    }
                }
            }
            return totalsItem;
        },
        _getCssClassForStatistic : function(type) {
            if (type == "sum") {
                return "statsgrid-totals-label-bold";
            }
            return "statsgrid-totals-label";
        },
        /**
         * A method to check if int is int instead of float
         * @private _isInt
         */
        _isInt: function (n) {
            return n % 1 === 0;
        },

        /**
         * A method to initialize header plugin
         * @private _initHeaderPlugin
         */
        _initHeaderPlugin: function (columns, grid) {

            var me = this,
                i;
            // lets create an empty container for menu items
            for (i = 0; i < columns.length; i++) {
                var column = columns[i];
                if (column.id === 'municipality') {
                    column.header = {
                        menu: {
                            items: []
                        }
                    };
                }
            }

            // new header menu plugin
            me.headerMenuPlugin = new Slick.Plugins.HeaderMenu2({});
            // lets create a menu when user clicks the button.
            me.headerMenuPlugin.onBeforeMenuShow.subscribe(function (e, args) {
                var menu = args.menu,
                    i,
                    input;
                if (args.column.id === 'municipality') {
                    menu.items = [];

//                    menu.items.push({
//                        element: '<div class="header-menu-subheading">' + me._locale.regionCategories.title + '</div>',
//                        disabled: true
//                    });
                    // Region category selects
                    _.each(me._acceptedRegionCategories, function (category) {
                        var categorySelector = jQuery('<li><input type="radio" name="categorySelector"></input><label></label></li>');
                        categorySelector.
                        find('input').
                        attr({
                            'id': 'category_' + category,
                            'checked': (category === me._selectedRegionCategory ? 'checked' : false)
                        }).
                        end().
                        find('label').
                        attr({
                            'for': 'category_' + category
                        }).
                        html(me._locale.regionCategories[category]);
                        menu.items.push({
                            element: categorySelector,
                            command: 'category_' + category
                        });
                    });

//                    menu.items.push({
//                        element: '<div class="header-menu-subheading subheading-middle">' + me._locale.statistic.title + '</div>',
//                        disabled: true
//                    });
//                    // Statistical variables
//                    for (i = 0; i < me.conf.statistics.length; i++) {
//                        var statistic = me.conf.statistics[i],
//                            elems = jQuery(me.templates.gridHeaderMenu).addClass('statsgrid-show-total-selects');
//
//                        // create input element with localization
//                        input = elems.find('input').attr({
//                            'id': 'statistics_' + statistic.id
//                        });
//                        // if variable is visible => check the checkbox
//                        if (statistic.visible) {
//                            input.attr({
//                                'checked': 'checked'
//                            });
//                        }
//                        // create label with localization
//                        elems.find('label').attr('for', 'statistics_' + statistic.id).text(me._locale.statistic[statistic.id]);
//                        // add item to menu
//                        menu.items.push({
//                            element: elems,
//                            command: statistic.id
//                        });
//                    }

                    // check if select rows checkbox should be checked
                    // we need to do something with current state of MVC which is non-existent
                    var columns = args.grid.getColumns(),
                        selectRowsChecked = false;
                    for (i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if (column.field === "sel") {
                            selectRowsChecked = true;
                        }
                    }
//                    // create checkbox for selecting rows toggle
//                    var showRows = jQuery(me.templates.gridHeaderMenu).addClass('statsgrid-show-row-selects');
//                    // create input element with localization
//                    input = showRows.find('input').attr({
//                        'id': 'statsgrid-show-row-selects'
//                    });
//                    if (selectRowsChecked) {
//                        input.attr('checked', 'checked');
//                    }
//                    // create label with localization
//                    showRows.find('label').attr('for', 'statsgrid-show-row-selects').text(me._locale.selectRows);
//                    menu.items.push({
//                        element: showRows,
//                        command: 'selectRows'
//                    });
                }

            });
            // when command is given shos statistical variable as a new "row" in subheader
            me.headerMenuPlugin.onCommand.subscribe(function (e, args) {
                var i;
                if (args.command === 'selectRows') {
                    var columns = args.grid.getColumns(),
                        newColumns = [],
                        shouldAddSel = true;
                    for (i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if (column.field !== "sel") {
                            newColumns.push(column);
                        }
                        if (column.field === "sel" && !jQuery(e.target).is(":checked")) {
                            shouldAddSel = false;
                        }
                    }
                    if (shouldAddSel) {
                        newColumns.unshift(me.checkboxSelector.getColumnDefinition());
                    }

                    args.grid.setColumns(me._fixColumns(newColumns));
                } else if (/^category_/.test(args.command)) {
                    me.changeGridRegion(_.last(args.command.split('_')));
                } else if (args.command == 'filter') {
                    me._createFilterPopup(args.column, this);
                } else {
                    for (i = 0; i < me.conf.statistics.length; i++) {
                        var statistic = me.conf.statistics[i];
                        if (statistic.id == args.command) {
                            statistic.visible = !statistic.visible;
                            break;
                        }
                    }

                    //FIXME
                    //TODO we need to create grouping for statistical variables
                    // instead of using subheader!

                    //reduce the number of variables
                    me.dataView.refresh();
                    // setColumns fires slickgrid resizing (cssrules etc.)
                    // => variables disappear
                    me.grid.setColumns(me._fixColumns(me.grid.getColumns()));
                    // this prints variables again.
                    me.dataView.refresh();
                }
            });
            //grid.registerPlugin(me.headerMenuPlugin);
        },

        /**
         * Changes the values of the region column in the grid
         * and updates each indicator column's values.
         *
         * @method changeGridRegion
         * @param  {String} category category name from SOTKAnet
         * @return {undefined}
         */
        changeGridRegion: function (category) {
            var me = this,
                dataView = this.dataView,
                grid = this.grid,
                regions = _.clone(this.regionCategories[category], true),
                currColumn;
            _.each(regions, function (item) {
                item.sel = 'checked';
            });
            this._setSelectedRegionCategory(category);

            // notify dataview that we are starting to update data
            dataView.beginUpdate();
            // empty the data view
            dataView.setItems([]);
            grid.invalidateAllRows();
            // set municipality data
            dataView.setItems(regions);
            dataView.sort(function (a, b) { return a['municipality'] > b['municipality'] ? 1 : -1; });
            // notify data view that we have updated data
            dataView.endUpdate();
            // invalidate() -> the values in the grid are not correct -> invalidate
            grid.invalidate();
            // render the grid
            grid.render();

            // update the data according to the current region category
            _.each(grid.getColumns(), function (column) {
                if (column.id.indexOf('indicator') >= 0) {
                    me._updateIndicatorDataToGrid(column.id, null, null, true);
                }
            });

            me.updateGridRegionCategorySelector();

            if (me._state.functionalRows != null && me._state.functionalRows.length > 0)
                me._expandAllSubitemsInGrid();

            if (me._layer._categoryMappings.hasVisualization[category] != true && this.geometryFilter.isEmpty())
                me.showMessage(me._locale.errors.title, me._locale.errors.regionWithoutVisualization);

            if (me._layer._categoryMappings.wmsNames[category]) {
                me._setLayerToCategory(category);

                // send the stats parameters for the visualization
                if (me._state.currentColumn) {
                    currColumn = me._getColumnById(me._state.currentColumn);
                    me.sendStatsData(currColumn);
                }
            }
        },

        _setLayerToCategory: function (category) {
            var layer = this.getLayer(),
                categoryMappings = layer.getCategoryMappings();

            layer.setWmsName(categoryMappings.wmsNames[category]);
            layer.setFilterPropertyName(categoryMappings.filterProperties[category]);
        },

        /**
         * Sets the selected region category to the one given
         * and changes the name of the region column.
         *
         * @method _setSelectedRegionCategory
         * @param {String} category category name from SOTKAnet
         */
        _setSelectedRegionCategory: function (category) {
            var column = this._getColumnById('municipality'),
                columns = this.grid.getColumns(),
                categoryName = this._locale.regionCategories[category];

            this._state.regionCategory = category;
            this._selectedRegionCategory = category;
            column.name = categoryName;
            this.grid.setColumns(this._fixColumns(columns));
        },

        /**
         * Creates filter popup
         * @private _createFilterPopup
         */
        _createFilterPopup: function (column, headerMenuPlugin) {
            var me = this,
                popup = jQuery(me.templates.filterPopup);
            // destroy possible open instance
            me._destroyPopup('filterPopup');
            popup.find('.filter-desc').text(me._locale.indicatorFilterDesc);

            //labels for condition
            var labels = jQuery(me.templates.filterRow);
            labels.find('.filter-label').text(me._locale.filterIndicator);
            labels.find('.filter-value').text(column.name);
            popup.find('.filter-container').append(labels);

            // condition (dropdown list of different types of filters + value)
            var condition = jQuery(me.templates.filterRow);
            condition.find('.filter-label').text(me._locale.filterCondition);
            var selectCont = jQuery(me.templates.filterSelect),
                select = selectCont.find('.filter-select');
            select.append(jQuery(me.templates.filterOption).val('')
                .text(me._locale.filterSelectCondition));
            select.append(jQuery(me.templates.filterOption).val('>')
                .text(me._locale.filterGT));
            select.append(jQuery(me.templates.filterOption).val('>=')
                .text(me._locale.filterGTOE));
            select.append(jQuery(me.templates.filterOption).val('=')
                .text(me._locale.filterE));
            select.append(jQuery(me.templates.filterOption).val('<=')
                .text(me._locale.filterLTOE));
            select.append(jQuery(me.templates.filterOption).val('<')
                .text(me._locale.filterLT));
            select.append(jQuery(me.templates.filterOption).val('...')
                .text(me._locale.filterBetween));
            condition.find('.filter-value').append(selectCont);

            // changing condition should show more input options
            select.change(function (e) {
                var element = jQuery(e.target),
                    selected = element.val(),
                    filterValue = element.parents('.filter-value');
                if (selected === '...') {
                    filterValue.find('.filter-between').css('display', 'block');
                    filterValue.find('.filter-input2').css('display', 'block');
                } else {
                    filterValue.find('.filter-input2').css('display', 'none');
                    filterValue.find('.filter-between').css('display', 'none');
                }
            });

            popup.find('.filter-container').append(condition);
            var filterInputs = jQuery(me.templates.filterInputs);
            popup.find('.filter-inputs-container').append(filterInputs);

            // dialog with cancel and filter buttons
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            // cancel
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me._locale.buttons.cancel);
            cancelBtn.setHandler(function () {
                //headerMenuPlugin.hide();
                me._destroyPopup('filterPopup');
            });

            // filter
            var filterBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            filterBtn.setTitle(me._locale.buttons.filter);
            filterBtn.addClass('primary');
            filterBtn.setHandler(function (e) {
                var inputArray = [];
                var divmanazerpopup = jQuery(e.target)
                    .parents('.divmanazerpopup');

                var input1 = divmanazerpopup.find('.filter-input1');
                inputArray.push(input1.val());

                if (select.val() === '...') {
                    var input2 = divmanazerpopup.find('.filter-input2');
                    inputArray.push(input2.val());
                }

                // me._state.filterMethod = select.val();
                // me._state.filterInput = inputArray;

                me.filterColumn(column, select.val(), inputArray);
                //headerMenuPlugin.hide();
                me._destroyPopup('filterPopup');
            });

            // show the dialog
            dialog.show(me._locale.filterTitle, popup, [cancelBtn, filterBtn]);
            // keydown
            popup.on('keydown', function (e) {
                e.stopPropagation();
            });
            me.popups.push({
                name: 'filterPopup',
                popup: dialog,
                content: popup
            });
        },

        _getPopupIndex: function (name) {
            var ret = null;
            for (i = 0; i < this.popups.length; i++) {
                if (this.popups[i].name === name) {
                    ret = i;
                    break;
                }
            }
            return ret;
        },

        _destroyPopup: function (name) {
            var i = this._getPopupIndex(name);
            popup = i === null ? null : this.popups[i];
            if (popup) {
                popup.content.off();
                popup.popup.close(true);
                this.popups.splice(i, 1);
            }
        },
        _createFilterByAllRegionsPopup: function () {
            var me = this;

            me._destroyPopup('filterByAllRegionsPopup');

            var form = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.component.FilterForm', this._locale.filterForm, {
                twoway: me.mode === 'twoway',
                isOneRowFilter : me.mode !== 'twoway',
                maxFilterRows: 2
            });
            var dialogTitle = me._locale.filterTitle;
            form.setTitle(dialogTitle);
            var params = [];

            _.each(this.regionCategories, function (values, name) {
                if(me._categoriesHierarchy[name].type === "administrative" && values.length > 1) {
                    params.push({
                        'name': {
                             'id' : name,
                             'name' : me._locale.regionCategories[name]
                            },
                        'values' : values.map(function(v) {
                            return {
                                 'id' : v.id.split(":")[1],
                                 'name': v.municipality
                            };
                        }),
                    });
                }
            });

            var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveButton.setTitle(me._locale.buttons.save);
            saveButton.setHandler(function (e) {
                var validationResult = form.validateSelections();
                var filterValues = form.getFilterValues();
                if(validationResult.validated || filterValues.data.length === 0) {
                    me._setCurrentAreaFilter(filterValues);
                    me._destroyPopup('filterByAllRegionsPopup');
                    me.updateFilterRegionCategorySelector();
                } else {
                    me.showMessage("Virhe", validationResult.message);
                }
            });

            form.setFilterParams(params);
            var dialog = form.displayAsPopup(dialogTitle, [saveButton]);

            if (!me.currentAreaFilter.isEmpty()) {
                form.setFilterValues(me.currentAreaFilter.getData());
            }

            me.popups.push({
                name: 'filterByAllRegionsPopup',
                popup: dialog,
                content: form.getContainer(),
            });

            dialog.moveTo('.fetch-data-region-filter.selector-button', 'bottom');
        },
        _setCurrentAreaFilter : function(filter) {
            var me = this;
            if (filter)
                me.currentAreaFilter.setFromObj(filter);
            else
                me.currentAreaFilter.reset();

            if (!me.currentAreaFilter.isEmpty()) {
                $('#area-info-container').text(me._locale.areaFilterSet + me._areaFilterToString(me.currentAreaFilter.getText()));
            } else {
                $('#area-info-container').text(me.instance.conf.gridDataAllowed ? me._locale.noAreaFilterSet : me._locale.noAreaFilterSetNoGrid);
            }
        },
        _areaFilterToString: function (filter) {
            var result = "";
            for (var i = 0; i < filter.length; ++i) {
                var item = filter[i];

                if (item.boolean) {
                    result += " " + item.boolean + " ";
                } else {
                    result += " (" + item.key + " = [" + item.values.join(", ") + "]" + ")";
                }
            }
            return result;
        },
        _createFilterBySelectedAreaPopup: function () {
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = me._locale.areaFilterDrawNew,
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelLoc = me._locale.buttons.cancel,
                filterBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                filterLoc = me._locale.areaFilterLimitBySelected,
                drawBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                drawLoc = me._locale.areaFilterDrawNewFromCrop,
                clearBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                clearLoc = me._locale.areaFilterRemove,
                content = jQuery(me.templates.filterByRegion),
                layerFilterContainer = content.find('.filter-container .layerFilterContainer'),
                selectionGeometries = [],
                dialogButtons = [],
                direction = null,
                clickedGeometries = 0;

            // destroy possible open instance
            me._destroyPopup('filterBySelectedAreaPopup');

            // hide theme map layer to make possible to select features from another map layers
            me._setLayerVisibility(false);

            cancelBtn.setTitle(cancelLoc);
            cancelBtn.setHandler(function () {
                //headerMenuPlugin.hide();
                me._destroyPopup('filterBySelectedAreaPopup');
                me._setLayerVisibility(true);
            });

            clearBtn.setTitle(clearLoc);
            clearBtn.setHandler(function () {
                me.geometryFilter.reset();
                me._updateGeometryFilter();
                var sandbox = me._sandbox;
                var rb = sandbox.getRequestBuilder('BackgroundDrawPlugin.StopDrawingRequest');
                if (rb) {
                    var request = rb(me.instance.getName(), true);
                    sandbox.request(me, request);
                }
                me._destroyPopup('filterBySelectedAreaPopup');
                // restore theme map layer
                me._setLayerVisibility(true);
            });

            filterBtn.setTitle(filterLoc);
            filterBtn.addClass('primary');
            filterBtn.addClass('filterBtn');
            filterBtn.setHandler(function (e) {
                me.geometryFilter.reset();

                var selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();
                var layerFilterContainer = content.find('.filter-container .layerFilterContainer');

                var allDropdownsSelected = true;
                //check if all dropdowns have selected value
                var dropdowns = layerFilterContainer.find('.attributeSelector');
                for (var i = 0; i < dropdowns.length; i++) {
                    if (jQuery(dropdowns[i]).val() == '') {
                        allDropdownsSelected = false;
                    }
                }
                
                var MAX_GEOMETRIES = (me.mode === 'twoway' ? 60 : 200);
                var OPT_GEOMETRIES = 5;
                var numberOfSelectedGeoms = 0;
                //check number of selected geometries of all layers
                //TODO do it in more efficient way - avoid looping layers 2 times
                for (var i = 0; i < selectedLayers.length; i++) {
                    var l = selectedLayers[i];
                    if (me.WFSLayerService.getSelectedFeatureIds(l.getId()) !== null && me.WFSLayerService.getSelectedFeatureIds(l.getId()) !== undefined && me.WFSLayerService.getSelectedFeatureIds(l.getId()).length > 0) {

                        numberOfSelectedGeoms += me.WFSLayerService.getSelectedFeatureIds(l.getId()).length;
                    }
                }

                if (numberOfSelectedGeoms > MAX_GEOMETRIES || !allDropdownsSelected) {
                    var errFilterDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        errFilterBtn = errFilterDialog.createCloseButton(me._locale.buttons.ok),
                        message = '';
                    errFilterBtn.addClass('primary');
                    if (!allDropdownsSelected) {
                        message = me._locale.geometryFilter.selectAttrWarn;
                    } else {
                        message = me._locale.geometryFilter.tooManyGeometries.replace('{0}', MAX_GEOMETRIES);
                    }
                    errFilterDialog.show(me._locale.geometryFilter.error, message, [errFilterBtn]);

                } else {

                    me.geomFilterIdAttributes = [];

                    if (numberOfSelectedGeoms > OPT_GEOMETRIES) {
                        var warnFilterDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        warnFilterBtn = warnFilterDialog.createCloseButton('OK');
                        warnFilterBtn.addClass('primary');
                        warnFilterDialog.show(me._locale.geometryFilter.warning, me._locale.geometryFilter.manyGeometries.replace('{0}', OPT_GEOMETRIES), [warnFilterBtn]);
                    }

                    for (var i = 0; i < selectedLayers.length; i++) {
                        var l = selectedLayers[i];

                        if (me.WFSLayerService.getSelectedFeatureIds(l.getId()) !== null && me.WFSLayerService.getSelectedFeatureIds(l.getId()) !== undefined && me.WFSLayerService.getSelectedFeatureIds(l.getId()).length > 0) {

                            var identifyingNameAttr = layerFilterContainer.find('#attributeSelector_' + l.getId()).val();

                            //adding info about selected attrubite, which identify geometries
                            me.geomFilterIdAttributes.push({
                                "id": l.getId(),
                                "attr": identifyingNameAttr
                            });

                            for (var j = 0; j < me.WFSLayerService.getSelectedFeatureIds(l.getId()).length; ++j) {
                                //me.geometryFilter.addGeometry(l.getClickedGeometries()[j][1]);

                                var fields = l.getFields();
                                var attrIndex = fields.indexOf(identifyingNameAttr);
                                var activeFeatures = l.getActiveFeatures();

                                for (var k = 0; k < activeFeatures.length; k++) {
                                    if (activeFeatures[k][0] == l.getClickedGeometries()[j][0]) {
                                        var id = null;
                                        if(attrIndex === -1 && identifyingNameAttr.startsWith("property_json.")) {
                                            var jsonIndex = fields.indexOf("property_json");
                                            var json = activeFeatures[k][jsonIndex];
                                            id = json[identifyingNameAttr.split(".")[1]];
                                        } else {
                                            id = activeFeatures[k][attrIndex];
                                        }
                                        me.geometryFilter.addGeometry(l.getClickedGeometries()[j][1], id);
                                    }
                                }
                            }
                        }
                    }
                }

                if (me.mode === 'twoway') {
                    me.geometryFilter.setDirection(content.find('.type').val());
                }
                me._updateGeometryFilter();
                me._destroyPopup('filterBySelectedAreaPopup');
                // restore theme map layer
                me._setLayerVisibility(true);
            });

            // Description text
            content.find('.filter-desc').text(me._locale.areaFilterDescription);

            clickedGeometries = me._updateGeometriesInfoInPopup(layerFilterContainer);

            if (clickedGeometries == 0) {
                filterBtn.setEnabled(false);
            }

            dialogButtons.push(filterBtn);

            if(me.mode === 'twoway') {
                var typeSelectDiv = jQuery('<div>' + me._locale.filterForm.selectType + ' </div>'),
                    typeSelector = jQuery('<select class="type"></select>'),
                    filterContainer = content.find('.filter-container');

                typeSelector.append(jQuery('<option value="home">' + me._locale.filterForm.typeHome + '</option>'));
                typeSelector.append(jQuery('<option value="work">' + me._locale.filterForm.typeWork + '</option>'));

                typeSelectDiv.append(typeSelector);
                filterContainer.append(typeSelectDiv);
            }
            drawBtn.setTitle(drawLoc);

            drawBtn.setHandler(function () {
                me._destroyPopup('filterBySelectedAreaPopup');
                me.instance.sandbox.findRegisteredModuleInstance('StatisticsButtonHandler').startNewDrawing({drawMode:"area"});
                if (me.mode === 'twoway') {
                    me.geometryFilter.setDirection(content.find('.type').val());
                }
                // restore theme map layer
                me._setLayerVisibility(true);
            });

            dialogButtons.push(drawBtn);

            if(!me.geometryFilter.isEmpty()) {
                dialogButtons.push(clearBtn);
            }

            dialogButtons.push(cancelBtn);

            dialog.show(dialogTitle, content, dialogButtons);
            me.popups.push({
                name: 'filterBySelectedAreaPopup',
                popup: dialog,
                content: content
            });

            dialog.moveTo('.fetch-data-area.selector-button', 'bottom');
        },

        /**
         * @method _updateGeometriesInfoInPopup
         * Updates DOM element with status of selected geometries
         * @param filterContainer
         * @return number of selected geometries
         */
        _updateGeometriesInfoInPopup: function (layerFilterContainer) {
            var me = this,
                selectedLayers = me.instance.sandbox.findAllSelectedMapLayers(),
                clickedGeometries = 0,
                layerRow = null;

            layerFilterContainer.empty();

            for (var i = 0; i < selectedLayers.length; i++) {
                var l = selectedLayers[i];
                if (me.WFSLayerService.getSelectedFeatureIds(l.getId()) !== null && me.WFSLayerService.getSelectedFeatureIds(l.getId()) !== undefined && me.WFSLayerService.getSelectedFeatureIds(l.getId()).length > 0) {

                    layerRow = jQuery("<div class='lfcRow'></div>");
                    layerRow.append(l.getName() + "  " + me.WFSLayerService.getSelectedFeatureIds(l.getId()).length + " " + me._locale.areaFilterItemsSelected + " ");

                    var attributeSelector = jQuery("<select id='attributeSelector_" + l.getId() + "' class='attributeSelector'></select>")

                    var attributes = me._getLayerAttributes(l).slice(0);

                    if(l.getLayerType() === "userlayer") {
                        //userlayer can have imported json attributes, allow user to select from those too
                        attributes = $.grep(attributes, function (elem) {
                            return elem.id !== "property_json";
                        });

                        var fields = l.getAttributes().fields;
                        $.each(fields, function(index, field) {
                            if(field !== 'the_geom') {
                                attributes.push({'id': 'property_json.' + field, 'name': field});
                            }
                        });
                    }

                    me._appendOptionValues(attributeSelector, me._locale.geometryFilter.selectAttrInstr, attributes);

                    var selectedAttr = me._getIdAttributeForSelectedLayer(l.getId());
                    if (selectedAttr != null) {
                        attributeSelector.val(selectedAttr);
                    }


                    layerRow.append(attributeSelector);

                    layerFilterContainer.append(layerRow);
                    clickedGeometries += me.WFSLayerService.getSelectedFeatureIds(l.getId()).length;
                }
            }

            if (clickedGeometries == 0) {
                layerFilterContainer.append(me._locale.areaFilterNoItemsSelected);
            }

            return clickedGeometries;
        },

        _getIdAttributeForSelectedLayer: function (layerId) {

            for (var i = 0; i < this.geomFilterIdAttributes.length; i++) {
                if (this.geomFilterIdAttributes[i].id == layerId) {
                    return this.geomFilterIdAttributes[i].attr;
                }
            }

            return null;
        },

        _appendOptionValues: function (select, placeHolder, values) {
            var option = jQuery("<option></option>"),
                i;
            // Append the first, empty value to work as a placeholder
            if (placeHolder) {
                option.attr('value', '');
                option.html(placeHolder);
                select.append(option);
            }

            // Iterate the list of given values
            for (i = 0; values && i < values.length; ++i) {
                option = jQuery("<option></option>");
                // Array of strings.
                if (typeof values[i] === 'string') {
                    option.attr('value', values[i]);
                    option.html(values[i]);
                } else {
                    // Otherwise we're assuming an array of objects.
                    option.attr('value', values[i].id);
                    option.html(values[i].name);
                }
                select.append(option);
            }
        },

        _getLayerAttributes: function (layer) {
            // Make copies of fields and locales
            var fields = (layer.getFields && layer.getFields()) ? layer.getFields().slice(0) : [],
                locales = (layer.getLocales && layer.getLocales()) ? layer.getLocales().slice(0) : [],
                attributes = [],
                i;

            for (i = 0; i < fields.length; i += 1) {
                // Get only the fields which originate from the service,
                // that is, exclude those which are added by Oskari (starts with '__').
                if (!fields[i].match(/^__/)) {
                    attributes.push({
                        id: fields[i],
                        name: (locales[i] || fields[i])
                    });
                }
            }

            if(attributes.length === 0) { //no attributes, add __fid so that user can select something
                attributes.push({
                    id: '__fid',
                    name: '__fid'
                });
            }

            return attributes;
        },

        _createFilterExistsPopup: function (type, callback) {
            var me = this,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            dialogTitle = 'Virhe',
            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            cancelLoc = "Peruuta",
            continueBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            continueLoc = "Jatka",
            content = jQuery('<div id="statsgrid-filter-exists"><p class="filter-desc"></p><div class="filter-container"></div></div>').clone(),
            dialogButtons = [];

        // destroy possible open instance
        me._destroyPopup('filterExists');

        if(type == 'area') {
            content.find('.filter-desc').text('Tilastoille on jo valittuna aluerajaus. Karttarajauksen lisääminen poistaa aiemman rajauksen.');
        } else {
            content.find('.filter-desc').text('Tilastoille on jo valittuna karttarajaus. Aluerajauksen lisääminen poistaa aiemman rajauksen.');
        }

        cancelBtn.setTitle(cancelLoc);
        cancelBtn.setHandler(function () {
            me._destroyPopup('filterExists');
        });

        continueBtn.setTitle(continueLoc);
        continueBtn.addClass('primary');
        continueBtn.setHandler(function (e) {
            me._destroyPopup('filterExists');
            if (type == 'area') {
                me._setCurrentAreaFilter();
            } else {
                me.instance.sandbox.findRegisteredModuleInstance('StatisticsButtonHandler').sendStopDrawRequest(true);
                me.geometryFilter.reset();
                me._updateGeometryFilter();
            }
            callback();
        });

        dialogButtons.push(continueBtn);
        dialogButtons.push(cancelBtn);

        dialog.show(dialogTitle, content, dialogButtons);
        me.popups.push({
            name: 'filterExists',
            popup: dialog,
            content: content
        });
        },

        destroyPopups: function () {
            // destroy header popups
            if (this.headerMenuPlugin) this.headerMenuPlugin.hide();
            // destroy filter popups created by _createFilterByRegionPopup and _createFilterPopup
            var i,
                popup;
            for (i = 0; i < this.popups.length; i++) {
                popup = this.popups[i];
                popup.content.off();
                popup.popup.close(true);
            }
            this.popups = [];
        },
        /**
         * Filters municipalities according to method and constraints (i.e. inputArray)
         * @param column Apply this filter to column
         * @method of filtering
         * @inputArray constraints
         */
        filterColumn: function (column, method, inputArray) {
            var data = this.grid.getData(),
                items = data.getItems(),
                item, itemVal,
                i;

            inputArray = _.map(inputArray, this._numerizeValue);

            for (i = 0; i < items.length; i++) {
                item = items[i];

                if (item.sel === 'checked') {
                    itemVal = item[column.id];
                    if (itemVal === null || itemVal === undefined) {
                        item.sel = 'empty';
                    } else {

                        switch (method) {
                        case '>':
                            if (itemVal <= inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '>=':
                            if (itemVal < inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '=':
                            if (itemVal !== inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '<=':
                            if (itemVal > inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '<':
                            if (itemVal >= inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '...':
                            if (inputArray[0] >= itemVal || itemVal >= inputArray[1]) {
                                item.sel = 'empty';
                            }
                            break;
                        }
                    }
                    data.updateItem(item.id, item);
                }

            }
            this.dataView.refresh();
            data.collapseGroup('empty');
            // sendstats ...update map
            this.sendStatsData(column);
            this.grid.updateRowCount();
            this.grid.resizeCanvas();
            this.grid.scrollRowToTop(0);
        },

        /**
         * Filters municipalities whether they belong to any of the
         * regions provided and updates the grid view accordingly.
         *
         * @method filterColumnByRegion
         * @param  {Object} column
         * @param  {Array} regionIds
         * @return {undefined}
         */
        filterColumnByRegion: function (column, regionIds) {
            if (!regionIds || regionIds.length === 0) {
                return;
            }

            var data = this.grid.getData(),
                items = data.getItems(),
                item,
                i;

            for (i = 0; i < items.length; i++) {
                item = items[i];
                if (item.sel === 'checked') {
                    if (item[column.id] === null || item[column.id] === undefined) {
                        item.sel = 'empty';
                    } else {
                        if (!this._itemBelongsToAnyRegions(item, regionIds)) {
                            item.sel = 'empty';
                        }
                    }
                    data.updateItem(item.id, item);
                }

            }
            this.dataView.refresh();
            data.collapseGroup('empty');
            // sendstats ...update map
            this.sendStatsData(column);
            this.grid.updateRowCount();
            this.grid.resizeCanvas();
            this.grid.scrollRowToTop(0);
        },

        /**
         * Returns true if the item belongs to any of the regions, false otherwise.
         *
         * @method _itemBelongsToAnyRegions
         * @param  {Object} item
         * @param  {Array} regionIds
         * @return {Boolean}
         */
        _itemBelongsToAnyRegions: function (item, regionIds) {
            var i,
                regionId;
            for (i = 0; i < regionIds.length; ++i) {
                regionId = regionIds[i];
                if (item.memberOf.indexOf(regionId) > -1) {
                    return true;
                }
            }
            return false;
        },

        _showCreatingCsvPopUp: function() {
            var me = this, lang = Oskari.getLang(),
                sandbox = this.instance.getSandbox(),
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                cancelBtn = dialog.createCloseButton(me._locale.buttons.cancel),
                saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                content = jQuery('<div id="statsgrid-csv-container"></div>');
            //Field separator
            var fieldSeparator = jQuery("<div class='csv-format-row'>" + me._locale.csv.fieldSeparator + "</div>");
            var fieldSeparatorSelect = jQuery("<select id='field-separator-csv-format' class='csv-format-select'></select>");
            fieldSeparatorSelect.append("<option value=';'>" + me._locale.csv.semicolon + "</option>");
            fieldSeparatorSelect.append("<option value=','>" + me._locale.csv.comma + "</option>");
            fieldSeparatorSelect.append("<option value=':'>" + me._locale.csv.colon + "</option>");
            fieldSeparatorSelect.append("<option value='\t'>" + me._locale.csv.tabulator + "</option>");
            fieldSeparatorSelect.append("<option value='|'>" + me._locale.csv.pipe + "</option>");
            fieldSeparator.append(fieldSeparatorSelect);
            content.append(fieldSeparator);

            //Null symbolizer
            var nullSymbolizer = jQuery("<div class='csv-format-row'>" + me._locale.csv.nullSymbolizer + "</div>");
            var nullSymbolizerSelect = jQuery("<select id='null-symbolizer-csv-format' class='csv-format-select'></select>");
            nullSymbolizerSelect.append("<option value=''>" + me._locale.csv.empty + "</option>");
            nullSymbolizerSelect.append("<option value='.'>" + me._locale.csv.dot + "</option>");
            nullSymbolizerSelect.append("<option value='-1'>" + me._locale.csv.negative1 + "</option>");
            nullSymbolizerSelect.append("<option value='-99'>" + me._locale.csv.negative99 + "</option>");
            nullSymbolizerSelect.append("<option value='-99999'>" + me._locale.csv.negative99999 + "</option>");
            nullSymbolizer.append(nullSymbolizerSelect);
            content.append(nullSymbolizer);

            //Decimal separator
            var decimalSeparator = jQuery("<div class='csv-format-row'>" + me._locale.csv.decimalSeparator + "</div>");
            var decimalSeparatorSelect = jQuery("<select id='decimal-separator-csv-format' class='csv-format-select'></select>");
            decimalSeparatorSelect.append("<option value=','>" + me._locale.csv.comma + "</option>");
            decimalSeparatorSelect.append("<option value='.'>" + me._locale.csv.dot + "</option>");
            decimalSeparator.append(decimalSeparatorSelect);
            content.append(decimalSeparator);

            saveBtn.addClass('primary');
            saveBtn.setTitle(me._locale.csv.toFile);

            //Generating CSV
            saveBtn.setHandler(function() {
                var columns = me.grid.getColumns(),
                    columnNames = [],
                    columnIds = [],
                    data = [],
                    fieldSeparator = $("#field-separator-csv-format").val(),
                    quoteSymbol = '"';
                nullSymbolizer = $("#null-symbolizer-csv-format").val(),
                    decimalSeparator = $("#decimal-separator-csv-format").val(),
                    headerRow = {};
                var indicatorMap = {}, i, maxThemeDepth = 0;

                _.each(columns, function (item) {
                    if (item.id.indexOf('indicator') === 0) {
                        //get the indicator's name
                        var indicatorName = "";
                        if (item.indicatorData) {

                            indicatorName = item.indicatorData.name;

                            var unit = item.indicatorData.unit == null ? me.indicatorsMeta[item.indicatorData.id].unit : item.indicatorData.unit;
                            if (unit && unit != '') {
                                indicatorName += ' [' + unit + ']';
                            }

                            indicatorName += ' (' + item.indicatorData.year.replace('&#9658;', '->') + ')';
                        }
                        columnNames.push(indicatorName);
                        columnIds.push(item.id);
                        indicatorMap[item.id] = item.indicatorData;
                        if (item.indicatorData.themes != null) {
                            if (item.indicatorData.themes.length > maxThemeDepth)
                                maxThemeDepth = item.indicatorData.themes.length;
                        }

                    } else if (item.id === 'municipality'){
                        //get name of area type
                        columnNames.push(item.name);
                        columnIds.push(item.id);
                        columnNames.push(item.name + ' id');
                        columnIds.push('code');
                    }
                });

                //add themes structure
                for (var themeIdx = 0; themeIdx < maxThemeDepth; themeIdx++) {
                    var row = {};
                    for (i = 0; i < columnIds.length; i++) {
                        var colId = columnIds[i];

                        if (colId == 'municipality' || colId == 'code') {
                            row[colId] = '';
                        }
                        else {
                            if (indicatorMap[colId].themes != null) {
                                var fixedIdx = indicatorMap[colId].themes.length - maxThemeDepth + themeIdx;
                                if (fixedIdx >= 0
                                    && indicatorMap[colId].themes[fixedIdx] != null
                                    && indicatorMap[colId].themes[fixedIdx][lang] != null) {
                                    row[colId] = indicatorMap[colId].themes[fixedIdx][lang];
                                } else {
                                    row[colId] = '';
                                }
                            } else {
                                row[colId] = '';
                            }
                        }
                    }
                    data.push(row);
                }



                //add header row
                for (i=0; i < columnIds.length; i++) {
                    headerRow[columnIds[i]] = columnNames[i];
                }
                data.push(headerRow);

                var functionalAreas = me._state.functionalRows != null && me._state.functionalRows.length > 0;

                //add data rows
                _.each(me.dataView.getItems(), function (item) {
                    var row = {};
                    //if element is selected and has no parent
                    if (item.sel === 'checked' && (functionalAreas || item._parent == null)) {
                        for (var i = 0; i < columnIds.length; i++) {
                            if (columnIds[i] == 'code') {
                                row[columnIds[i]] = me._zeroFill(item[columnIds[i]], 3);
                            } else {
                                row[columnIds[i]] = item[columnIds[i]];
                            }
                        }
                        data.push(row);
                    }
                });

                //convert json to csv
                var csvString = me._convertJsonToCsv(
                    data,
                    fieldSeparator,
                    quoteSymbol,
                    nullSymbolizer,
                    decimalSeparator
                );

                var csvLink = $('#statistics-download-csv-file');

                if (csvLink) {
                    csvLink.remove();
                }

                var ua = window.navigator.userAgent;

                if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0) {
                    var blob = new Blob(['\uFEFF' + csvString],{
                        type: "text/csv;charset=utf-8;"
                    });

                    navigator.msSaveBlob(blob, me._locale.csv.csvFileName + '.csv');
                } else {
                //create link to download the file
                    $('<a></a>')
                        .attr('id','statistics-download-csv-file')
                        .attr('href','data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvString))
                        .attr('download', me._locale.csv.csvFileName + '.csv')
                        .appendTo('body');

                    $('#statistics-download-csv-file').ready(function() {
                        $('#statistics-download-csv-file').get(0).click();
                    });
                }
                dialog.close();
            });

            dialog.show(me._locale.csv.formattingOfTheFile, content, [saveBtn, cancelBtn]);
        },
        _zeroFill: function (number, width)
        {
            width -= number.toString().length;
            if ( width > 0 )
            {
                return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
            }
            return number + ""; // always return a string
        },
        _convertJsonToCsv: function(jsonData, fieldSeparator, quoteSymbol, nullSymbolizer, decimalSeparator) {
            var array = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

            var str = '';

            //get toady's date and format it
            var today = new Date();
            var todayFormatted = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear(); //Finnish format: dd.mm.yyyy

            //find data sources of selected indicators
            var dataSources = [];
            for (var i = 0; i < this.indicators.length; i++) {
                var dataSource = this._findDataSourceForIndicator(this.indicators[i]);
                if (dataSource != '' && $.inArray(dataSource, dataSources) === -1) {
                    dataSources.push(dataSource);
                }
            }

            //add metadata to the file
            str += this._locale.csv.fileHeader + ', ' + todayFormatted + '\r\n';
            str += this._locale.csv.dataSources + ': ' + dataSources.join(', ') + '\r\n';

            for (var i = 0; i < array.length; i++) {
                var line = '';

                for (var j in array[i]) {
                    if (array[i][j] != null) {
                        if (typeof array[i][j] == 'string') {
                            var value = array[i][j] + "";
                            line += this._quoteValue(value, quoteSymbol, fieldSeparator) + fieldSeparator;
                        } else if (typeof array[i][j] == 'number') {
                            var value = array[i][j] + "";
                            line += this._quoteValue(value.replace(".", decimalSeparator), quoteSymbol, fieldSeparator) + fieldSeparator;
                        } else {
                            var value = array[i][j] + "";
                            line += this._quoteValue(value, quoteSymbol, fieldSeparator) + fieldSeparator;
                        }
                    } else {
                        line += nullSymbolizer + fieldSeparator;
                    }
                }

                line = line.slice(0, -1);
                str += line + '\r\n';
            }
            return str;
        },

        _quoteValue: function(value, quoteSymbol, fieldSeparator) {
            if(value.indexOf(quoteSymbol) > -1 || value.indexOf(fieldSeparator) > -1  || value.indexOf('\n') > -1  || value.indexOf('\r') > -1 ) {
                return quoteSymbol + value.replace(new RegExp(quoteSymbol, "g"), quoteSymbol+quoteSymbol) + quoteSymbol;
            } else {
                return value;
            }
        },

        _findDataSourceForIndicator: function (indicator) {
            var selectedAreaType = this._categoriesGroupKeys[this._selectedRegionCategory];

            //find selected time period for this indicator
            var selectedTimePeriod = '';
            for (var i = 0; i < this.getState().indicators.length; i++) {
                var stateIndicator = this.getState().indicators[i];
                if (stateIndicator.id == indicator.id) {
                    selectedTimePeriod = stateIndicator.year;
                    break;
                }
            }

            //find a proper data source based on selected time period and area type of current indicator
            if(indicator.timePeriods) {
                for (var t = 0; t < indicator.timePeriods.length; t++) {
                    var timePeriod = indicator.timePeriods[t];
                    if (timePeriod.Id == selectedTimePeriod) {
                        for (var a = 0; a < timePeriod.AreaTypes.length; a++) {
                            var areaType = timePeriod.AreaTypes[a];
                            if (areaType.Id == selectedAreaType && areaType.DataSource) {
                                return areaType.DataSource;
                            }
                        }
                    }
                }
            }
            return '';
        },

        /**
         * Highlights a municipality given by the event and scrolls to it in the grid
         *
         * @method _featureHighlightedEvent
         * @private
         * @param {Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent} event
         */
        _featureHighlightedEvent: function (event) {
            var featureAtts = event.getFeature().attributes,
                isHighlighted = event.isHighlighted(),
                property = this._getHilightPropertyName(),
                idx = this.getIdxByCode(featureAtts[property]),
                cssKey = 'highlight-row-' + featureAtts[property],
                cssHash = {};
            // if we have grid and idx => remembe selected area
            if (this.grid && idx) {
                // if we there are no checked areas => do nothing
                if (this.getItemsByGroupingKey('checked').length > 0) {
                    this.selectedMunicipalities[featureAtts[property]] = isHighlighted;

                    if (isHighlighted) {
                        //if a row is found => hilight it
                        if (idx !== -1) {
                            this.grid.scrollRowToTop(idx);
                            cssHash[idx] = {
                                'municipality': 'statsgrid-highlight-row'
                            };
                            this.grid.addCellCssStyles(cssKey, cssHash);
                            this.dataView.syncGridCellCssStyles(this.grid, cssKey);
                        }
                    } else {
                        this.grid.removeCellCssStyles(cssKey);
                        this.dataView.syncGridCellCssStyles(this.grid, cssKey);
                    }
                }
            }
        },

        /**
         * Highlights a municipality given by the event and shows only hilighted municipalities in the grid
         *
         * @method _featureSelectedEvent
         * @private
         * @param {Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent} event
         */
        _featureSelectedEvent: function (event) {
            var featureAtts = event.getFeature().attributes,
                isHighlighted = event.isHighlighted(),
                property = this._getHilightPropertyName(),
                item = this.getItemByCode(featureAtts[property]);

            if (this.grid && item) {
                //if area is hilighted => remember it and change grid item to 'checked' state
                this.selectedMunicipalities[featureAtts[property]] = isHighlighted;
                if (isHighlighted) {
                    item.sel = 'checked';
                } else {
                    item.sel = 'empty';
                }
                var data = this.grid.getData();
                data.updateItem(item.id, item);

                // sendstats ...update map
                var column = this._getColumnById(this._state.currentColumn);
                this.sendStatsData(column);
            }
        },

        _getHilightPropertyName: function () {
            var layer = this.getLayer(),
                categoryMappings = layer.getCategoryMappings() || {},
                propertyMappings = categoryMappings.filterProperties || {},
                property = propertyMappings[this._selectedRegionCategory || 'FINLAND'];

            return (property || 'kuntakoodi');
        },

        /**
         * Get items by GroupingKey
         *
         * @method getItemsByGroupingKey
         * @param grouping key (e.g. 'checked', 'empty')
         */
        getItemsByGroupingKey: function (sel) {
            var items = this.grid.getData().getItems(),
                itemsByGrouping = [],
                item,
                i;
            for (i = 0; i < items.length; i++) {
                item = items[i];
                if (item.sel === sel) {
                    itemsByGrouping.push(sel);
                }
            }
            return itemsByGrouping;
        },

        /**
         * Show only selected areas
         *
         * @method _showSelectedAreas
         * @private
         * @param array of ids
         */
        _showSelectedAreas: function (idArray) {
            var data = this.grid.getData(),
                items = data.getItems(),
                item,
                i,
                j,
                id;
            for (i = 0; i < items.length; i++) {
                item = items[i];
                item.sel = 'empty';
                for (j = 0; j < idArray.length; j++) {
                    id = idArray[j];
                    if (item.id == id) {
                        item.sel = 'checked';
                    }

                }
                data.updateItem(item.id, item);
            }
            data.collapseGroup('empty');
            data.refresh();
        },

        /**
         * Unselect all areas
         *
         * @method unselectAllAreas
         * @param leave hilighted areas to be selected in the grid
         */
        unselectAllAreas: function (leaveHilighted) {
            var _grid = this.grid,
                _data = _grid.getData(),
                items = _grid.getData().getItems(),
                item,
                i;
            for (i = 0; i < items.length; i++) {
                item = items[i];
                if (leaveHilighted && this.selectedMunicipalities[item.code]) {
                    item.sel = 'checked';
                } else {
                    item.sel = 'empty';
                }
            }

            _data.collapseGroup('empty');

            // sendstats
            var column = this._getColumnById(this._state.currentColumn);
            this.sendStatsData(column);


            //update data
            _data.setItems(items);
            _data.refresh();
            //render all the rows (and checkboxes) again
            _grid.invalidateAllRows();
            _grid.render();
        },

        /**
         * Get column by id
         *
         * @method _getColumnById
         * @private
         * @param column id
         */
        _getColumnById: function (columnId) {
            // sendstats
            var columns = this.grid.getColumns(),
                column,
                i;
            for (i = 0; i < columns.length; i++) {
                column = columns[i];
                if (column.id === columnId) {
                    return column;
                }
            }
            return null;
        },
        _getVisualizationAwareValue: function (item, columnId, areaCategory) {
            var me = this;
            var contentValue = item[columnId];
            if (areaCategory != null && areaCategory.key != "administrative") {
                var val = $.grep(me.indicatorsData[columnId], function (innerItem, index) {
                    return innerItem.region == item.id + "_" + areaCategory.key + "_" + areaCategory.id;
                });
                if (val.length == 0) {
                    contentValue = "";
                } else {
                    contentValue = val[0]['primary value'];
                }
            }
            return contentValue;
        },
        /**
         * Sends an event with HTML for tooltips as data.
         *
         * @method sendTooltipData
         * @param {OpenLayers.Feature} feature
         */
        sendTooltipData: function (feature) {
            var me = this,
                featAtts = feature.attributes,
                eventBuilder = this._sandbox.getEventBuilder('MapStats.HoverTooltipContentEvent'),
                currColumn = this._state.currentColumn,
                property = this._getHilightPropertyName(),
                item = this.getItemByCode(featAtts[property]),
                content = '<p>',
                areaCategory = this._state.visualizationAreaCategory;

            if(item) {
                content += item.municipality;
                if (currColumn && item[currColumn] !== null && item[currColumn] !== undefined) {
                    content += '<br />' + this._getVisualizationAwareValue(item, currColumn, areaCategory);
                } else if (currColumn && item[currColumn + "_PrivacyLimitTriggered"] !== null && item[currColumn + "_PrivacyLimitTriggered"] !== undefined && item[currColumn + "_PrivacyLimitTriggered"]) {
                    content +=  '<br />' + "Piilotettu";
                }
            }

            content += '</p>';

            if (eventBuilder) {
                var event = eventBuilder(content);
                this._sandbox.notifyAll(event);
            }
        },

        /**
         * Toggle select municipalities mode
         *
         * @method toggleSelectMunicipalitiesMode
         * @return true if mode is on
         */
        toggleSelectMunicipalitiesMode: function () {
            this.selectMunicipalitiesMode = !this.selectMunicipalitiesMode;
            return this.selectMunicipalitiesMode;
        },

        /**
         * Adds indicator title and organization info to the metadata hash
         * for data sources listing.
         *
         * @method addIndicatorMeta
         * @param {Object} indicator
         */
        addIndicatorMeta: function (indicator) {
            // push the indicator title and organization to the meta data hash
            var me = this,
                lang = Oskari.getLang(),
                indiId = indicator.id,
                indiMeta = me.indicatorsMeta[indiId];

            if (indiMeta) {
                indiMeta.count += 1;
            } else {
                me.indicatorsMeta[indiId] = {
                    count: 1,
                    title: indicator.title[lang],
                    organization: indicator.organization.title[lang],
                    additionalInfo: indicator.additionalInfo,
                    lifeCycleState: indicator.lifeCycleState,
                    stage: indicator.stage,
                    unit:indicator.unit
                };
            }
        },

        /**
         * Removes the indicator from the metadata hash if it's the last
         * one from the same id.
         *
         * @method removeIndicatorMeta
         * @param  {Number} indicatorId
         * @return {undefined}
         */
        removeIndicatorMeta: function (indicatorId) {
            var indiMeta = this.indicatorsMeta[indicatorId];
            if (indiMeta) {
                indiMeta.count -= 1;
                if (indiMeta.count === 0) {
                    delete this.indicatorsMeta[indicatorId];
                }
            }
        },

        /**
         * Returns the provided value as a number if it can be
         * casted to such. Otherwise just returns the given string.
         *
         * @method _numerizeValue
         * @private
         * @param  {String} val
         * @return {Number/String}
         */
        _numerizeValue: function (val) {
            var ret = val;
            if (val !== null && val !== undefined) {
                if (val.replace) {
                    ret = val.replace(',', '.');
                }
                ret = Number(ret);
            }
            if (isNaN(ret)) {
                ret = val;
            }
            return ret;
            //var numVal = Number((val || 'NaN').replace(',', '.'));
            //if (_.isNaN(numVal)) return val;
            //return numVal;
        },
        getTableElement: function() {
            return $('div.oskari-view.statsgrid').parent();
        },
        getMapElement: function() {
            return $('#mapdiv').parent();
        },
        toogleTableView: function () {
            var el = this.getTableElement();
            var mapEl = this.getMapElement();
            if (el.is(":visible")) {
                el.hide();
                if (mapEl.is(":visible")) {
                    mapEl.width("100%");
                }
            } else {
                if (mapEl.is(":visible")) {
                    mapEl.width("60%");
                    el.width("40%");
                }
                el.show();
            }
        },
        /**
         * @public @method hasUI
         * Override if need be.
         *
         *
         * @return {Boolean} false
         */
        hasUI: function () {
            return true;
        },
        toogleMapView: function () {
            var el = this.getMapElement();
            var tabEl = this.getTableElement();
            if (el.is(":visible")) {
                el.hide();
                if (tabEl.is(":visible")) {
                    tabEl.width("100%");
                }
            } else {
                if (tabEl.is(":visible")) {
                    tabEl.width("40%");
                    el.width("60%");
                }
                el.show();
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
