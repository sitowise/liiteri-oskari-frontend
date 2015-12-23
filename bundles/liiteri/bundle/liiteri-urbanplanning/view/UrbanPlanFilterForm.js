﻿Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanFilterForm",
    function (instance, baseView) {
        this.view = baseView;
        this.instance = instance;
        this.locale = instance.getLocalization('view');
        this.container = null;
        this.template = {
            "container": "<div id='urbanPlansFilterContainer' class='filterContainer'></div>",
            "header": "<div class='filterRow urbanPlansHeader'>" + this.locale.search.searchtitle + "</div>",
            "panel": '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title"></h3></div><div class="panel-body"></div></div>',
            "panelContent" : '<div></div>',
            "select": function (id, text) {
                return '<select id="' + id +
                    '" name="' + id +
                    '" data-placeholder="' + text +
                    '"><option value></option></select>';
                },
            "select_multiple": function (id) {
                return '<select id="' + id +
                    '" name="' + id +
                    '" multiple><option value></option></select>';
                }
            };
        this.timeFromInput = null;
        this.timeToInput = null;
        this.areaFilterParams = [];
        this.currentAreaFilter = null;
        this.filterCloud = null;
    }, {
        start: function () { },
        getForm: function () {
            if (this.container == null) {
                this.container = this._createUI();
            }
            return this.container;
        },
        _createUI: function () {
            var me = this;
            var container = jQuery(this.template.container);

            var mainPanel = jQuery(this.template.panel);
            mainPanel.find("h3.panel-title").text(this.locale.search.searchtitle);
            container.append(mainPanel);

            var mainPanelBody = mainPanel.find("div.panel-body");

            var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');

            var selectedFilterPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            selectedFilterPanel.addClass("urbanplan-panel");
            var selectedFilter = jQuery(this.template.panelContent);

            this.filterCloud = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.component.FilterCloud');
            this.filterCloud.insertTo(selectedFilter);

            var buttonsContainer = jQuery("<div class='filterRow buttons'></div>");
            var showButton = jQuery('<button>' + this.locale.search.show + '</button>');
            showButton.click(function () {
                if (me.validateForm()) {
                    var filter = me._getFilterSelections();
                    if (me.validateFilter(filter)) {
                        me.raiseFilterChanged(filter);
                    } else {
                        me._showError("empty_filter");
                    }
                }
            });
            buttonsContainer.append(showButton);
            
            var clearButton = jQuery('<button>' + this.locale.search.clear + '</button>');
            clearButton.click(function () {
                me.clearFilter();
            });
            buttonsContainer.append(clearButton);

            selectedFilter.append(buttonsContainer);

            selectedFilterPanel.setContent(selectedFilter);
            selectedFilterPanel.setTitle(this.locale.search.selectedfilter);
            selectedFilterPanel.addHeaderButton({ 'cssClass': 'info-button', 'handler': function (event) { me._showInfo(event, 'selectedFilter'); } });
            selectedFilterPanel.isVisible(true);
            selectedFilterPanel.open();

            accordion.addPanel(selectedFilterPanel);

            var formatFilterPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            formatFilterPanel.addClass("urbanplan-panel");
            var formatFilter = jQuery(this.template.panelContent);

            var nameFilter = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'enterNameIdInput');
            nameFilter.setPlaceholder(this.locale.search.entername);
            nameFilter.getField().find('input').attr('id', 'enterNameIdInput');
            nameFilter.getField().find('input').attr('class', 'filterRow');
            nameFilter.bindChange(function(e) {
                me._addTextToFilter($(e.target));
            }, true);

            formatFilter.append(nameFilter.getField());

            var typeFilter = jQuery(this.template.select("typeFilter", this.locale.search.selecttype));
            typeFilter.change(function (e) {
                me._addToFilter($(e.target));
            });
            formatFilter.append(typeFilter);

            var acceptorFilter = jQuery(this.template.select("acceptorFilter", this.locale.search.acceptedby));
            acceptorFilter.change(function (e) {
                me._addToFilter($(e.target));
            });
            formatFilter.append(acceptorFilter);

            formatFilterPanel.setContent(formatFilter);
            formatFilterPanel.setTitle(this.locale.search.filterbyformat);
            formatFilterPanel.addHeaderButton({ 'cssClass': 'info-button', 'handler': function (event) { me._showInfo(event, 'formatFilter'); } });
            formatFilterPanel.isVisible(true);
            formatFilterPanel.open();

            accordion.addPanel(formatFilterPanel);

            var timeFilterPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            timeFilterPanel.addClass("urbanplan-panel");

            var timeFilter = jQuery(this.template.panelContent);
            var timeFilterSelect = jQuery(this.template.select("timeFilter", this.locale.search.filterbytime));
            timeFilter.append(timeFilterSelect);

            var timeFieldsContainer = jQuery("<div id='urbanPlansFilterTimeFields' class='filterRow'></div>");
            var timeFromInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'timeFromInput');
            timeFromInput.setLabel(this.locale.search.from);
            timeFromInput.setRequired(true, 'Pakollinen kenttä'); //TODO localization
            timeFromInput.setPlaceholder(this.locale.search.dateFormat);
            timeFromInput.getField().find('input').attr('id', 'timeFromInput');
            timeFromInput.setEnabled(false);
            this.timeFromInput = timeFromInput;
            timeFieldsContainer.append(timeFromInput.getField());
            timeFieldsContainer.append(jQuery('<input type="hidden" id="actualTimeFromInput" />'));
            var timeToInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'timeToInput');
            timeToInput.setLabel(this.locale.search.to);
            timeToInput.setRequired(true, 'Pakollinen kenttä'); //TODO localization
            timeToInput.setPlaceholder(this.locale.search.dateFormat);
            timeToInput.getField().find('input').attr('id', 'timeToInput');
            timeToInput.setEnabled(false);
            this.timeToInput = timeToInput;
            timeFieldsContainer.append(timeToInput.getField());
            timeFieldsContainer.append(jQuery('<input type="hidden" id="actualTimeToInput" />'));
            timeFilter.append(timeFieldsContainer);

            var addTimeFilterContainer = jQuery('<div></div>');
            var addTimeFilterButton = jQuery('<button>' + this.locale.search.apply + '</button>');
            addTimeFilterContainer.append(addTimeFilterButton);

            timeFilterSelect.change(function (e) {
                timeFromInput.setEnabled(true);
                timeToInput.setEnabled(true);
            });
            timeFilter.append(addTimeFilterContainer);

            addTimeFilterButton.click(function (e) {
                var timeFilterEl = $("#timeFilter");
                var selectedTime = timeFilterEl.find(':selected').val();

                if (selectedTime == "")
                    return;

                var timeFromText = $("#timeFromInput").val();
                var timeToText = $("#timeToInput").val();


                if ((timeFromText != '' && !me._validateDate('dd.mm.yy', timeFromText))
                    || (timeToText != '' && !me._validateDate('dd.mm.yy', timeToText))) {
                    me._showError("incorrectDateFormat");
                    return;
                }

                var timeFromEl = $("#actualTimeFromInput");
                var timeToEl = $("#actualTimeToInput");

                var selectedTimeText = timeFilterEl.find(':selected').text();
                var timeFrom = timeFromText === '' ? '' : timeFromEl.val();
                var timeTo = timeToText === '' ? '' : timeToEl.val();
                

                if (timeFrom == '') {
                    timeFrom = '1753-01-01';
                    timeFromText = '';
                }

                if (timeTo == '') {
                    timeTo = '9999-01-01';
                    timeToText = '';
                }

                var item = {};
                item.id = "Date" + "__" + selectedTime;
                item.text = selectedTimeText + " : " + timeFromText + " - " + timeToText;
                item.data = {
                    'group': "dateFilter",
                    'value': {
                        'type': selectedTime,
                        'from': timeFrom,
                        'to': timeTo
                    }
                };

                if(me.filterCloud.addItem(item, {
                        'duplicateAction': 'callback',
                        'duplicateCallback': function (i) { me._showError('duplicate_date'); }
                        })) {
                    $("#actualTimeFromInput").val('');
                    $("#actualTimeToInput").val('');
                    $("#timeFromInput").val('');
                    $("#timeToInput").val('');
                    timeFilterEl.val('');
                    timeFilterEl.trigger("liszt:updated");
                    timeFromInput.setEnabled(false);
                    timeToInput.setEnabled(false);
                }

            });

            timeFilterPanel.setContent(timeFilter);
            timeFilterPanel.setTitle(this.locale.search.filterbytime);
            timeFilterPanel.addHeaderButton({ 'cssClass': 'info-button', 'handler': function (event) { me._showInfo(event, 'timeFilter'); } });
            timeFilterPanel.isVisible(true);
            timeFilterPanel.open();

            accordion.addPanel(timeFilterPanel);

            var areaFilterPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            areaFilterPanel.addClass("urbanplan-panel");
            var areaFilter = jQuery(this.template.panelContent);
            areaFilter.attr('id', "areaFilter");
            areaFilterPanel.setContent(areaFilter);
            areaFilterPanel.setTitle(this.locale.search.selectarea);
            areaFilterPanel.addHeaderButton({ 'cssClass': 'info-button', 'handler': function (event) { me._showInfo(event, 'areaFilter'); } });
            areaFilterPanel.isVisible(true);
            areaFilterPanel.open();

            accordion.addPanel(areaFilterPanel);

            accordion.insertTo(mainPanelBody);

            return container;
        },
        _validateDate: function (format, dateString) {
            var valid = false;
            try {
                $.datepicker.parseDate(format, dateString);
                valid = true;
            } catch (exception) {
                valid = false;
            }
            return valid;
        },
        validateFilter: function (filter) {
            return !filter.isEmpty();
        },
        validateForm: function() {
            var timeFromInputErrors = [],
                timeToInputErrors = [],
                selectedTime = $("#timeFilter").find(':selected').val();

            this.timeFromInput.clearErrors();
            this.timeToInput.clearErrors();

            if (selectedTime) {
                timeFromInputErrors = this.timeFromInput.validate();
                timeToInputErrors = this.timeToInput.validate();
            }

            if (timeFromInputErrors.length > 0 && timeToInputErrors.length > 0) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.show('Virhe', 'Syötä alku- tai loppupäivä'); //TODO localization
                dialog.fadeout();
                this.timeFromInput.showErrors(timeFromInputErrors);
                this.timeToInput.showErrors(timeToInputErrors);

                return false;
            }
            return true;
        },

        update: function (data) {
            if (this.container == null) {
                return;
            }
            this._addOptions("typeFilter", data.planType);
            this._addOptions("acceptorFilter", data.approver);
            this._addOptions("timeFilter", data.timeSelectorType);
            this._addMultiOptions("areaFilter", data.region);

            this._updateComponents();
        },
        _showError: function (errorMsg) {
            var me = this;
            var message = me.locale.error[errorMsg];
            me.view.showMessage(me.locale.error.title, message);
        },
        _showInfo: function (event, key) {
            var me = this;
            var message = me.locale.info[key];
            me.view.showMessage(me.locale.info.title, message, null, {"draggable": true});
        },
        _addTextToFilter: function (element) {
            var elementType = element.prop('id');
            var elementTypeText = element.attr('placeholder');
            var item = {};
            item.id = elementType;
            item.text = elementTypeText + " : " + element.val();
            item.data = {
                'group': elementType,
                'value': element.val(),
            };

            if (item.data.value == "") {
                this.filterCloud.removeItem(item);
            } else {
                this.filterCloud.addItem(item, { 'duplicateAction': 'replace' });
            }            
        },
        _addToFilter: function (element) {
            var option = element.find('option:selected');
            if (option == null || element.val() == "")
                return;

            var elementType = element.prop('id');
            var elementTypeText = element.attr('data-placeholder');

            var item = {};
            item.id = elementType + "__" + element.val();
            item.text = elementTypeText + " : " + option.text();
            item.data = {
                'group': elementType,
                'value' : element.val(),
            };

            this.filterCloud.addItem(item, { 'duplicateAction': 'replace' });

            element.val('');
            element.trigger("liszt:updated");
        },
        _showAreaFilter: function () {
            var me = this;
            var options = {
                'showBooleanOperators': true,
                'isFilterEditable': true,
                'showClearButton': false
            };
            var form = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.component.FilterForm', null, options);
            form.setFilterParams(me.areaFilterParams);
   
            var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveButton.setTitle('Save');
            saveButton.setHandler(function (e) {
                me.currentAreaFilter = form.getFilterValues();
                _.each(me.currentAreaFilter.data, function (i) {
                    if (i.boolean)
                        return;

                    _.each(i.values, function(val) {
                        var item = {
                            id: i.key + "__" + val,
                            text: i.key + " : " + val,
                            data: {
                                group: i.key,
                                value: i.val
                            },
                        };
                        me.filterCloud.addItem(item, { 'duplicateAction': 'replace' });
                    });                    
                });              
            });

            form.displayAsPopup("Filter by area", [saveButton]);
            if (me.currentAreaFilter != null) {
                form.setFilterValues(me.currentAreaFilter.data);
            }            
        },
        _areaFilterToText: function(filter) {
            var result = "";

            _.each(filter, function(i) {
                if (!i.key)
                    return;

                result += i.key + " = " + JSON.stringify(i.values) + '\n';
            });

            return result;
        },
        _updateAreaFilter: function (array) {
            var params = [];

            for (var i = 0; i < array.data.length; i++) {
                var item = array.data[i];
                var paramsItem = {};
                paramsItem.name = item.name;
                paramsItem.values = [];

                for (var j = 0; j < item.data.data.length; j++) {
                    paramsItem.values.push(item.data.data[j]);
                }

                params.push(paramsItem);
            }

            this.areaFilterParams = params;
        },
        _addOptions: function (id, array) {
            var select = this.container.find("#" + id);
            var i = 0;
            for (; i < array.data.length; i++) {
                select.append('<option value="' + array.data[i].value + '">' + array.data[i].name + '</option>');
            }
        },

        _addMultiOptions : function(id, array) {
            var content = this.container.find("#" + id);
            
            var subContainer = jQuery('<ul class="areas"><ul>');
            var me = this;

            var i = 0;
            for (; i < array.data.length; i++) {
                var item = array.data[i];
                var itemContainer = jQuery('<li></li>');
                var selectEl = jQuery(this.template.select(item.type, item.name));
                this._addMultiOptions_Single(selectEl, item.data);

                selectEl.change(function(e) {
                    var element = $(e.target);
                    var option = element.find('option:selected');
                    if (option == null || element.val() == "")
                        return;

                    var elementType = element.prop('id');
                    var elementTypeText = element.attr('data-placeholder');

                    var filterItem = {};
                    filterItem.id = elementType + "__" + element.val();
                    filterItem.text = elementTypeText + " : " + option.text();
                    filterItem.data = {
                        'group': 'area',
                        'value': {
                            'type': elementType,
                            'id': element.val()
                        },
                    };

                    me.filterCloud.addItem(filterItem, { 'duplicateAction': 'replace' });

                    element.val('');
                    element.trigger("liszt:updated");
                });

                itemContainer.append(selectEl);

                var countId = "__" + item.type + "_count";
                var countEl = jQuery('<div class="badge pull-right" id="' + countId + '">' + item.data.data.length + '</div>');
                itemContainer.append(countEl);

                subContainer.append(itemContainer);
            }

            content.append(subContainer);
        },

        _addMultiOptions_Single: function (el, array) {
            
            array.data.sort(function(a, b) {
               if(a.hasOwnProperty("orderNumber") && b.hasOwnProperty("orderNumber") && a.orderNumber !== b.orderNumber) {
                   return a.orderNumber - b.orderNumber;
               } else {
                   return a.name.localeCompare(b.name, "fi");
               }
            });
            
            var j = 0;
            for (; j < array.data.length; j++) {
                var innerItem = array.data[j];
                el.append('<option value="' + innerItem.id + '">' + innerItem.name + '</option>');
            }
        },

        _updateComponents: function () {
            var me = this;
            this.container.find("#timeFromInput").datepicker({ dateFormat: "dd.mm.yy", altField: "#actualTimeFromInput", altFormat: "yy-mm-dd" }, $.datepicker.regional['fi']);
            this.container.find("#timeToInput").datepicker({ dateFormat: "dd.mm.yy", altField: "#actualTimeToInput", altFormat: "yy-mm-dd" }, $.datepicker.regional['fi']);

            this.container.find("select").chosen({ allow_single_deselect: true, no_results_text: me.locale.search.noResultText });
        },

        _changeRegionType: function (name, greaterAreaChkArray, administrativeCourtChkArray, elyChkArray, countyChkArray, subRegionChkArray) {
            var me = this;
            me.instance.service.getRegionData(
                name,
                greaterAreaChkArray,
                administrativeCourtChkArray,
                elyChkArray,
                countyChkArray,
                subRegionChkArray,
                function (resp) { me.updateRegionPanels(resp, name); },
                me.instance.plugins['Oskari.userinterface.View'].errorCb);
        },

        updateRegionPanels: function (resp, name) {
            var id = "__" + name;
            var el = $('#' + id);
            el.empty();
            el.append(jQuery('<option value></option>'));
            this._addMultiOptions_Single(el, resp);
            el.trigger("liszt:updated");

            var countId = id + "_count";
            var countEl = $('#' + countId);
            countEl.text(resp.data.length);
        },

        clearFilter: function() {
            this.container.find("#enterNameIdInput").val("");
            this.container.find('option:selected').removeAttr("selected");
            this.container.find("select").val("");

            this.container.find("select").change();
            this.container.find("select").trigger("liszt:updated");

            this.container.find("#timeFromInput").val("");
            this.container.find("#timeToInput").val("");
            this.container.find("#actualTimeFromInput").val("");
            this.container.find("#actualTimeToInput").val("");

            this.filterCloud.clear();
        },

        raiseFilterChanged: function (filter) {
            var me = this;
            $(this).trigger("UrbanPlanFilterForm.FilterChanged", [me, filter]);
        },

        _getFilterSelections: function () {
            var filters = {
                'isEmpty' : function() {
                    return this.keyword == "" && this.planType.length == 0 && this.approver.length == 0
                        && $.isEmptyObject(this.area) && $.isEmptyObject(this.date);
                }
            };
            filters.keyword = "";
            filters.planType = [];
            filters.approver = [];
            filters.area = {};
            filters.date = {};

            var filterItems = this.filterCloud.getItems();
            _.each(filterItems, function (item) {
                if (item.data.group == "enterNameIdInput") {
                    filters.keyword = item.data.value;
                }

                if (item.data.group == "typeFilter") {
                    if (item.data.value == "1") {
                        filters.planType.push("T");
                    } else if (item.data.value == "2") {
                        filters.planType.push("R");
                    } else if (item.data.value == "3") {
                        filters.planType.push("M");
                    }
                }
                else if (item.data.group == "acceptorFilter") {
                    if (item.data.value == "1") {
                        filters.approver.push("V");
                    } else if (item.data.value == "2") {
                        filters.approver.push("H");
                    } else if (item.data.value == "3") {
                        filters.approver.push("L");
                    }
                }
                else if (item.data.group == "dateFilter") {
                    if (item.data.value.type == 'ACCEPTDATE') {
                        filters.date.approvalDateWithin = item.data.value.from + "," + item.data.value.to;
                    } else if (item.data.value.type == 'SUGGESTIONDATE') {
                        filters.date.proposalDateWithin = item.data.value.from + "," + item.data.value.to;
                    } else if (item.data.value.type == 'ANNOUNCEDATE') {
                        filters.date.initialDateWithin = item.data.value.from + "," + item.data.value.to;
                    } else if (item.data.value.type == 'UPDATETIME') {
                        filters.date.fillDateWithin = item.data.value.from + "," + item.data.value.to;
                    }
                }
                else if (item.data.group == "area") {
                    var key = item.data.value.type;
                    var id = item.data.value.id;
                    if (!filters.area[key])
                        filters.area[key] = [];
                    filters.area[key].push(id);
                }
            });

            return filters;
        },

        /**
         * @method destroy
         */
        destroy: function () {
            // remember to remove live bindings if any
            //jQuery('div.myplacescategoryform input.oskaricolor').off();
            if (this.dialog) {
                this.dialog.close();
            }
            var onScreenForm = this._getOnScreenForm();
            onScreenForm.remove();
        }
    });
