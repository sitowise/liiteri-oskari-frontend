Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-urbanplanning.NewModeView',
/**
 * @static constructor function
 */
function (instance) {
    var me = this;
    this.filtersActionRoute = "GetUrbanPlanningStartingData";
    this.conf = instance.conf;
    this.regionPanels = new Object();
    this.dataTable = null;
    this.markingsDataTable = null;
    this.peopleDataTable = null;
    //this.toolbar = null;
    this.datatableLocaleLocation = Oskari.getSandbox().getService('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService').getDataTablesLocaleLocation();
    this.errorCb = function(jqxhr, textStatus) { me.showMessage("Virhe", jqxhr.statusText); };
    this.templates = {
        'table': '<table id="urbanplanning-table" class="cell-border stripe" cellspacing="0" width="100%"><thead><tr>' +
            '<th>' + '<input type="checkbox" id="tableSelectAll">' + '</input>' + '</th>' +
            '<th>' + this.locale.table.fillDate + '</th>' +
            '<th>' + this.locale.table.municipality + '</th>' +
            '<th>' + this.locale.table.name + '</th>' +            
            '<th>' + this.locale.table.municipalityPlanId + '</th>' +
            '<th>' + this.locale.table.generatedPlanId + '</th>' +
            '<th>' + this.locale.table.tyviId + '</th>' +
            '<th>' + this.locale.table.approvalDate + '</th>' +
            '<th>' + this.locale.table.proposalDate + '</th>' +
            '<th>' + this.locale.table.initialDate + '</th>' +
            '<th></th>' +
            '</tr></thead><tbody></tbody></table>',
        'tableDisclaimer' : '<div class="disclaimer">' + this.locale.planDetail.disclaimer + '</div>',
        'markingsFilterContainer': '<div id="urbanPlansMarkingsFilter" class="filterContainer"></div>',
        'markingsFilterHeader': '<div class="filterRow urbanPlansHeader">' + this.locale.markingssearch.parameters + '</div>',
        'markingsFilterType': '<div class="filterRow">' + this.locale.markingssearch.type + '</div>',
        'markingsAreaType': '<div class="filterRow">' + this.locale.markingssearch.areatype + '</div>',
        'markingsTypeChoose': '<div>' +
            '<div><input type="radio" name="urbanPlanMarkingsType" value="municipality" checked="checked">' + this.locale.markingssearch.municipalityType + '</input></div>' +
            '<div><input type="radio" name="urbanPlanMarkingsType" value="standard">' + this.locale.markingssearch.standardtype + '</input></div>' +
            '</div>',
        'areaTypeChoose': '<div>' +
            '<div><input type="checkbox" name="urbanPlanMarkingsAreaType" value="undergroundAreas" checked="checked">' + this.locale.markingssearch.undergroundareas + '</input></div>' +
            '<div><input type="checkbox" name="urbanPlanMarkingsAreaType" value="areaReservations" checked="checked">' + this.locale.markingssearch.areareservations + '</input></div>' +
            '</div>'        
    };
}, {
    startPlugin: function() {
		var me = this,
			sandbox = this.instance.getSandbox();

//        this.toolbar = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanningToolbar', {
//                title: this.getTitle()
//            }, this.instance);

        jQuery.fn.dataTableExt.oSort['fi_date-pre'] = function (a) {
            // this is already rendered by the columnDefs->render, so we
            // don't have the original format
            var s = jQuery(a).text(); // date is rendered inside a <span/>
            if (s.length == 0) return 0;
            var parts = s.split('.'); // d.m.yyyy
            var d = new Date(parts[2], parts[1]-1, parts[0]);
            return d.getTime(); // milliseconds
        };

        jQuery.fn.dataTableExt.oSort['fi_date-asc'] = function(a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        };

        jQuery.fn.dataTableExt.oSort['fi_date-desc'] = function(a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        };
		
		//enable or disable buttons for creating summary and exporting to CSV
		$(document).on('change', 'input[name=urbanPlanCheckBox]', function() {
			me._updateUrbanPlansListToolButtons();
		});



        // The extension bundle instance routes request
        // to enter / exit mode by listening to and responding to userinterface.ExtensionUpdatedEvent
        //this.requestHandler = Oskari.clazz.create('Oskari.<mynamespace>.bundle.<bundle-identifier>.request.MyRequestHandler', this);
        //sandbox.addRequestHandler('<bundle-identifier>.MyRequest', this.requestHandler);
    },
    stopPlugin: function() {
        //this.toolbar.destroy();
        //this.instance.getSandbox().removeRequestHandler('<bundle-identifier>.MyRequest', this.requestHandler);
    },
    showMode: function(isShown, madeUpdateExtensionRequest, subPageName) {
        var sandbox = this.instance.getSandbox(),
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
            map = mapModule.getMap(),
            elCenter = this.getCenterColumn(),
            elLeft = this.getLeftColumn();
        //this.toolbar.show(isShown);

        if (isShown) {
            elLeft.removeClass('oskari-closed');
            elCenter.addClass('oskari-closed');
            elLeft.empty();
            
            if (subPageName != null && subPageName != '') {
                this.showSubpage(subPageName);
            } else {
                this.showSubpage('plans');
            }
            
        } else {
            elLeft.addClass('oskari-closed').removeClass('span12');
            elCenter.removeClass('oskari-closed').addClass('span12');
            elLeft.empty();
            if (!madeUpdateExtensionRequest) {
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
            }
        }
        map.updateSize();
    },
    getLeftColumn : function() {
        return jQuery('.oskariui-left');
    },
    getCenterColumn : function() {
        return jQuery('.oskariui-center');
    },
    getRightColumn : function() {
        return jQuery('.oskariui-right');
    },
    resize: function () {

        
            if (this.dataTable && this.urbanPlansContainer && this.urbanPlansContainer.is(":visible")) {
                console.log('urban plans resizing');
//                try {
                    this.dataTable.columns.adjust();
//                } catch (err) {
//                    /* data tables raise style error */
//                    /* ignore */
//                }
            }
            if (this.markingsDataTable && this.markingsContainer && this.markingsContainer.is(":visible")) {
                console.log('markings resizing');
//                try {
                    this.markingsDataTable.columns.adjust();
//                } catch (err) {
//                    /* data tables raise style error */
//                    /* ignore */
//                }
            }
            if (this.peopleDataTable && this.peopleContainer && this.peopleContainer.is(":visible")) {
                console.log('people resizing');
                //try {
                    this.peopleDataTable.columns.adjust();
                //} catch (err) {
                    /* data tables raise style error */
                    /* ignore */
                  //  throw err;
                //}
            }
        
    },

    /**
    * CUSTOM FUNCTIONS
    */

    _prepareView: function (containerElement) {
        var container = jQuery("<div id='urbanPlansContainer'></div>");
        var filterContainer = this._prepareLeftContainer();
        container.append(filterContainer);

        var listContainer = this._prepareRightContainer();
        container.append(listContainer);

        container.append(jQuery('<div style="clear: both"></div>'));

        containerElement.append(container);        

        //listContainer.width(container.width() - filterContainer.width() - 20);

        return container;
    },

    _prepareRightContainer: function() {
        var me = this;
        var container = jQuery("<div id='urbanPlansListContainer' class='listContainer'></div>");

        var listHeader = jQuery("<div class='urbanPlansHeader'>" +  this.locale.table.searchresult + "</div>");
        container.append(listHeader);

        var buttons = jQuery("<div class='urbanPlansHeader'></div>");
        var summaryButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
        summaryButton.setTitle(this.locale.table.summary);
        summaryButton.addClass('urbanPlansListToolButton');
        summaryButton.setEnabled(false);
        summaryButton.setHandler(function() {
            var selections = new Array();
            $('input[type="checkbox"][name="urbanPlanCheckBox"]:checked').each(function() {
                selections.push(this.value);
            });
            if (selections.length > 0) {
                if (selections.length > 2100) {
                    me.showMessage("Virhe", "Yhteenvedon maksimimäärä kaavoille on 2100 kpl");
                    return;
                }
//                var url = me.conf.planDetailsUrl + '?id=' + selections.join(",") + "&summary=true";
//                window.open(url, "_blank");

//                //get data from table
                var rawUrbanPlans = me.dataTable.data();
                var summaryElements = [];
                for (var i = 0; i < selections.length; i++) {
                    for (var j = 0; j < rawUrbanPlans.length; j++) {
                        if (selections[i] == rawUrbanPlans[j].id) {
                            summaryElements.push(rawUrbanPlans[j]);
                            break;
                        }
                    }
                }

                me.showUrbanPlanDetails(selections, true, summaryElements);
            }
        });
        summaryButton.insertTo(buttons);

        var csvButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
        csvButton.setTitle(this.locale.table.download);
        csvButton.addClass('urbanPlansListToolButton');
        csvButton.setEnabled(false);
        csvButton.setHandler(function() {
            me._showCreatingCsvPopUp();
        });
        csvButton.insertTo(buttons);

        container.append(buttons);

        this._prepareRightTableElement(container);

        return container;
    },

    _prepareRightTableElement: function (container) {
        var me = this;
        var tableElement = jQuery(me.templates.table);
        container.append(tableElement);
        var tableDisclaimerElement = jQuery(me.templates.tableDisclaimer);
        container.append(tableDisclaimerElement);
        var height = $("#contentMap").height() - $("#menutoolbar").height() - 300;

        var dataTable = tableElement.DataTable({
            "ajax": {
                "url": this.instance.service.urls.initial,
                "dataSrc": "",
            },
            "dom": '<<"info-wrapper"if<"clearfix">><rt>>',
            "deferRender": true,
            "searchDelay": 350,
            "columns": [
                { "data": null },
                { "data": "fillDate" },
                { "data": "municipality" },
                { "data": "name" },                
                { "data": "municipalityPlanId" },
                { "data": "generatedPlanId" },
                { "data": "tyviId" },
                { "data": "approvalDate" },
                { "data": "proposalDate" },
                { "data": "initialDate" },
                { "data": null }
            ],
            "columnDefs": [
                {
                    "render": function (data, type, row) {
                        var name = data;
                        //return '<span class="idlink" title="Näytä seurantalomake">' + id + '</span>';
                        return '<a href="' + me.conf.planDetailsUrl + '?id=' + row.id + '" target="_blank" title="Näytä seurantalomake">' + name + '</a>';
                    },
                    "targets": [3] // "name"
                },
                {
                    "targets": 0,
                    "data": null,
                    "sortable": false,
                    "render": function (data, type, row) {
                        var id = row.id;
                        var inputx = jQuery('<input type="checkbox" name="urbanPlanCheckBox" value="' + id + '"></input>');
                        return inputx[0].outerHTML;
                    }
                },
                {
                    "targets": [1, 7, 8, 9],
                    "type": "fi_date",
                    "data": null,
                    "sortable": true,
                    "render": function (data, type, row) {
                        var result = jQuery("<span/>");
                        if (data !== null && data.length > 0) {
                            var d = new Date(data);
                            result.text($.datepicker.formatDate("d.m.yy", d));
                        }
                        return result[0].outerHTML;
                    }
                },
                {
                    /* invisible column for providing the initial sorting */
                    "type": "fi_date",
                    "targets": [10],
                    "data": null,
                    "sortable": true,
                    "visible": false,
                    "render": function (data, type, row) {
                        var result = jQuery("<span/>");
                        var val = "";
                        if (data.approvalDate != null) {
                            val = data.approvalDate;
                        } else if (data.proposalDate != null) {
                            val = data.proposalDate;
                        } else if (data.initialDate != null) {
                            val = data.initialDate;
                        }
                        if (val.length > 0) {
                            var d = new Date(val);
                            val = $.datepicker.formatDate("dd.mm.yy", d);
                        }
                        result.text(val);
                        return result[0].outerHTML;
                    }
                }
            ],
            "language": {
                "url":
                    this.datatableLocaleLocation +
                    this.locale.datatablelanguagefile,
                "sThousands": ""
            },
            "scrollY": height + "px",
            "scrollX": true,
            "scrollCollapse": true,
            "paging": false,
            "processing": true,
            "initComplete": function(settings, json) {
                $('#urbanplanning-table_filter input').attr("placeholder", me.locale.table.searchPlaceHolder);
                $('#urbanplanning-table_filter input').unbind();
                $('#urbanplanning-table_filter input').bind('keyup', function (e) {
                    if (e.keyCode == 13 || (this.value != null && (this.value.length > 2 || this.value.length == 0))) {
                        dataTable.search(this.value).draw();
                    }
                });
            },
            "autoWidth": true
        });

//        tableElement.find('tbody').on('click', 'span.idlink', function () {
//            var data = dataTable.row($(this).parents('tr')).data();            
//            me.showUrbanPlanDetails(data);
//        });

        tableElement.find('#tableSelectAll').click(function () {
            var selectAll = $(this).is(":checked");
            tableElement.find('tbody input[type=checkbox]').each(function() {
                $(this).prop('checked', selectAll);
            });

			me._updateUrbanPlansListToolButtons();
        });

        me.dataTable = dataTable;
    },

    _prepareLeftContainer: function() {
        var me = this;
        var form = Oskari.clazz.create(
            'Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanFilterForm',
            me.instance, me);
        var fillDataCb = function (data) {
            form.update(data);
        };
        this.instance.service.getUrbanPlanStartingData(fillDataCb, me.errorCb);

        $(form).on('UrbanPlanFilterForm.FilterChanged', function(event, sender, filter) {
            var url = me.instance.service.urls.urbanPlans(filter);
			
            me._updateUrbanPlansListToolButtons(true);
            $('#tableSelectAll').prop('checked', false);

            me.dataTable.order([[7, "desc"], [8, "desc"], [9, "desc"], [1, "desc"]]);
            me.dataTable.search('');
            me.dataTable.ajax.url(url).load();
        });

        return form.getForm();
    },

    updatePlanTypeContent: function(container, data){
        var selectTypePanelContent = jQuery("<div></div>");

        for (var i = 0; i<data.data.length; i++) {
            var inputEl = jQuery("<div><input type='radio' name='planType' value='" + data.data[i].value + "'>" + data.data[i].name + "</input></div>");
            selectTypePanelContent.append(inputEl);
        }

        container.setContent(selectTypePanelContent);
        container.setTitle(this.locale.search.selecttype + " (" + data.count + ")");
    },

    updateAreaContent: function(container, data, allRegionCount) {
        var me = this;
        var selectAreaPanelContent = jQuery("<div></div>");
        var regionsAccordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');

        container.setTitle(this.locale.search.selectarea + " (" + allRegionCount + ")");

        var selectContainer = jQuery("<div class='regionPanelContent'></div>");

        //Creating panels for all region types
        for (var i = 0; i < data.data.length; i++) {

            var selectEl = jQuery('<select name="' + data.data[i].type + '" multiple></select>');
            for (var j = 0; j < data.data[i].data.data.length; j++) {
                selectEl.append('<option value="' + data.data[i].data.data[j].id + '">' + data.data[i].data.data[j].name + '</option>');
            }

            selectContainer.append(selectEl);

            var regionTypeAccordionPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var regionTypeAccordionPanelContent = jQuery("<div class='regionPanelContent'></div>");

            me.regionPanels[data.data[i].type] = regionTypeAccordionPanel;

            //Creating content for the panel
            for (var j = 0; j<data.data[i].data.data.length; j++) {
                var inputEl = jQuery("<div><input class='" + data.data[i].type + "' type='checkbox' name='" + data.data[i].type + "' value='" + data.data[i].data.data[j].id + "'>" + data.data[i].data.data[j].name + "</input></div>");
                inputEl.find('input').click(function() {
                    var greaterAreaChkArray = new Array();
                    $(".greaterArea:checked").each(function() {
                        greaterAreaChkArray.push($(this).val());
                    });

                    var administrativeCourtChkArray = new Array();
                    $(".administrativeCourt:checked").each(function() {
                        administrativeCourtChkArray.push($(this).val());
                    });

                    var elyChkArray = new Array();
                    $(".ely:checked").each(function() {
                        elyChkArray.push($(this).val());
                    });

                    var countyChkArray = new Array();
                    $(".county:checked").each(function() {
                        countyChkArray.push($(this).val());
                    });

                    var subRegionChkArray = new Array();
                    $(".subRegion:checked").each(function() {
                        subRegionChkArray.push($(this).val());
                    });

                    if (this.name != "municipality") {
                        me.instance.service.getRegionData("municipality", greaterAreaChkArray, administrativeCourtChkArray, elyChkArray, countyChkArray, subRegionChkArray,
                            function (resp) { me.updateRegionPanels(resp, "municipality"); }, me.errorCb);
                    }
                    if (this.name != "county") {
                        me.instance.service.getRegionData("county", greaterAreaChkArray, administrativeCourtChkArray, elyChkArray, countyChkArray, subRegionChkArray,
                            function (resp) { me.updateRegionPanels(resp, "county"); }, me.errorCb);
                    }
                    if (this.name != "subRegion") {
                        me.instance.service.getRegionData("subRegion", greaterAreaChkArray, administrativeCourtChkArray, elyChkArray, countyChkArray, subRegionChkArray,
                            function (resp) { me.updateRegionPanels(resp, "subRegion"); }, me.errorCb);
                    }
                });

                regionTypeAccordionPanelContent.append(inputEl);
            }

            regionTypeAccordionPanel.setTitle(data.data[i].name + "(" + data.data[i].data.count + ")");
            regionTypeAccordionPanel.setContent(regionTypeAccordionPanelContent);
            regionTypeAccordionPanel.setContent(selectContainer);
            regionTypeAccordionPanel.setVisible(true);
            regionTypeAccordionPanel.close();

            regionsAccordion.addPanel(regionTypeAccordionPanel);

            $(regionTypeAccordionPanel).on("AccordionPanel.opened", function (event, panel) {
                $.each(me.regionPanels, function (key, value) {
                    if (value != panel) {
                        value.close();
                    }
                });
            });
        }
        //regionsAccordion.insertTo(selectAreaPanelContent);

        container.setContent(selectContainer);

        selectContainer.find("select").chosen({
            no_results_text: me.locale.search.noResultText,
        });
    },

    updateAcceptorContent: function(container, data) {
        var acceptedByPanelContent = jQuery("<div></div>");

        for (var i = 0; i<data.data.length; i++) {
            var inputEl = jQuery("<div><input type='radio' name='acceptor' value='" + data.data[i].value + "'>" + data.data[i].name + "</input></div>");
            acceptedByPanelContent.append(inputEl);
        }

        container.setContent(acceptedByPanelContent);
        container.setTitle(this.locale.search.acceptedby + " (" + data.count + ")");
    },

    updateTimeContent: function(container, data) {
        var filteredByTimePanelContent = jQuery("<div></div>");

        for (var i = 0; i<data.data.length; i++) {
            var inputEl = jQuery("<div><input type='radio' name='time' value='" + data.data[i].value + "'>" + data.data[i].name + "</input></div>");
            filteredByTimePanelContent.append(inputEl);
        }

        //Time From
        var timeFieldsContainer = jQuery("<div id='urbanPlansFilterTimeFields' class='filterRow'></div>");

        var timeFromInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'timeFromInput');
        timeFromInput.setLabel(this.locale.search.from);
        timeFromInput.setPlaceholder(this.locale.search.dateFormat);
        var value = timeFromInput.getField().find('input').attr('id', 'timeFromInput');
        timeFieldsContainer.append(timeFromInput.getField());
        timeFieldsContainer.append(jQuery('<input type="hidden" id="actualTimeFromInput" />'));

        //Time To
        var timeToInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'timeToInput');
        timeToInput.setLabel(this.locale.search.to);
        timeToInput.setPlaceholder(this.locale.search.dateFormat);
        timeToInput.getField().find('input').attr('id', 'timeToInput');
        timeFieldsContainer.append(timeToInput.getField());
        timeFieldsContainer.append(jQuery('<input type="hidden" id="actualTimeToInput" />'));

        filteredByTimePanelContent.append(timeFieldsContainer);

        filteredByTimePanelContent.find("#timeFromInput").datepicker({ dateFormat: "dd.mm.yy", altField: "#actualTimeFromInput", altFormat: "yy-mm-dd" }, $.datepicker.regional['fi']);
        filteredByTimePanelContent.find("#timeToInput").datepicker({ dateFormat: "dd.mm.yy", altField: "#actualTimeFromInput", altFormat: "yy-mm-dd" }, $.datepicker.regional['fi']);

        container.setContent(filteredByTimePanelContent);
        container.setTitle(this.locale.search.filterbytime + " (" + data.count + ")");
    },

    updateRegionPanels: function(pResp, regionType) {
        if (this.regionPanels[regionType]) {
            this._updateOneRegionContent(this.regionPanels[regionType], pResp, regionType);
        }
    },

    _updateOneRegionContent: function (container, data, regionType) {
        var me = this;
        var contentForContent = container.getContainer();
        contentForContent.empty();
        var regionTypeAccordionPanelContent = jQuery("<div class='regionPanelContent'></div>");

        for (var i = 0; i<data.data.length; i++) {
            var inputEl = jQuery("<div><input class='" + regionType + "' type='checkbox' name='" + regionType + "' value='" + data.data[i].id + "'>" + data.data[i].name + "</input></div>");
            inputEl.find('input').click(function() {
                var greaterAreaChkArray = new Array();
                $(".greaterArea:checked").each(function() {
                    greaterAreaChkArray.push($(this).val());
                });

                var administrativeCourtChkArray = new Array();
                $(".administrativeCourt:checked").each(function() {
                    administrativeCourtChkArray.push($(this).val());
                });

                var elyChkArray = new Array();
                $(".ely:checked").each(function() {
                    elyChkArray.push($(this).val());
                });

                var countyChkArray = new Array();
                $(".county:checked").each(function() {
                    countyChkArray.push($(this).val());
                });

                var subRegionChkArray = new Array();
                $(".subRegion:checked").each(function() {
                    subRegionChkArray.push($(this).val());
                });

                if (this.name != "municipality") {
                    me.instance.service.getRegionData("municipality", greaterAreaChkArray, administrativeCourtChkArray, elyChkArray, countyChkArray, subRegionChkArray,
                            function (resp) { me.updateRegionPanels(resp, "municipality"); }, me.errorCb);
                }
                if (this.name != "county") {
                    me.instance.service.getRegionData("county", greaterAreaChkArray, administrativeCourtChkArray, elyChkArray, countyChkArray, subRegionChkArray,
                            function (resp) { me.updateRegionPanels(resp, "county"); }, me.errorCb);
                }
                if (this.name != "subRegion") {
                    me.instance.service.getRegionData("subRegion", greaterAreaChkArray, administrativeCourtChkArray, elyChkArray, countyChkArray, subRegionChkArray,
                            function (resp) { me.updateRegionPanels(resp, "subRegion"); }, me.errorCb);
                }
            });

            regionTypeAccordionPanelContent.append(inputEl);
        }

        //TODO: temporary protection
        var dataname;
        if (data.name != null) {
            dataname = data.name;
        } else {
            dataname = regionType;
        }

        container.setContent(regionTypeAccordionPanelContent);
        container.setTitle(dataname + "(" + data.count + ")");
    },

    getFilterSelections: function() {
        var filters = new Object();
        filters.planName = document.getElementById("enterNameIdInput").value;

        filters.planType = $('input[type="radio"][name="planType"]:checked').val();
        if (filters.planType == 1) {
            filters.planType = "T";
        } else if (filters.planType == 2) {
            filters.planType = "R";
        } else if (filters.planType == 3) {
            filters.planType = "M";
        }

        filters.ely = $('input[type="checkbox"][name="ely"]:checked').val();
        filters.subRegion = $('input[type="checkbox"][name="subRegion"]:checked').val();
        filters.county = $('input[type="checkbox"][name="county"]:checked').val();
        filters.greaterArea = $('input[type="checkbox"][name="greaterArea"]:checked').val();
        filters.administrativeCourt = $('input[type="checkbox"][name="administrativeCourt"]:checked').val();
        filters.municipality = $('input[type="checkbox"][name="municipality"]:checked').val();

        filters.approver = $('input[type="radio"][name="acceptor"]:checked').val();
        if (filters.approver == 1) {
            filters.approver = "V";
        } else if (filters.approver == 2) {
            filters.approver = "H";
        } else if (filters.approver == 3) {
            filters.approver = "L";
        }

        var selectedTime = $('input[type="radio"][name="time"]:checked').val();
        var timeFrom = document.getElementById("actualTimeFromInput").value;
        var timeTo = document.getElementById("actualTtimeToInput").value;

        if (selectedTime == 'ACCEPTDATE') {
            filters.approvalDateWithin = timeFrom + "," + timeTo;
        } else if (selectedTime == 'SUGGESTIONDATE') {
            filters.proposalDateWithin = timeFrom + "," + timeTo;
        } else if (selectedTime == 'ANNOUNCEDATE') {
            filters.initialDateWithin = timeFrom + "," + timeTo;
        } else if (selectedTime == 'UPDATETIME') {
            filters.fillDateWithin = timeFrom + "," + timeTo;
        }

        return filters;
    },

    showUrbanPlanDetails: function (data, summary, summaryElements) {
        var me = this;
        summary = summary == true ? true : false;

        if (summary && data.length > 2100) {
            me.showMessage(me.locale.error.title, me.locale.error.max_limit_reached);
            return;
        }

        var container = jQuery('<div class="ajax-loader-big"></div>');
        var cancelled = false;
        var closeAndCancelCb = function() {
            cancelled = true;
            dialog.close(true);
        };
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.addClass('urbanPlansDialog');

        var title = summary ? 'Asemakaavojen seurantalomakkeet' : 'Asemakaavan seurantalomake';
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.addClass('primary');
        cancelBtn.setTitle(me.locale.table.cancel);
        cancelBtn.setHandler(closeAndCancelCb);
        dialog.show(title, container, [cancelBtn]);
        dialog.makeDraggable();
        dialog.makeResizable({'minWidth': 300});
        dialog.makeModal();

        var fillCb = function (resp) {
            if (cancelled)
                return;
            var form = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanDetailsForm', me.instance);
            container = form.getFormFor(resp, summary, summaryElements);
            var btn = dialog.createCloseButton(me.locale.table.close);
            btn.addClass('primary');
            var printBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            printBtn.addClass('primary');
            printBtn.setTitle(me.locale.table.print);
            printBtn.setHandler(function () {
                var options = {
                    'mode': 'popup',
                    'popClose': true,
                };
                $(container).printArea(options);
            });
            if (cancelled)
                return;
            dialog.show(title, container, [btn, printBtn]);
        };
        if (summary) {
            me.instance.service.getUrbanPlanSummaryData(data, fillCb, me._mergeErrorCbs([closeAndCancelCb, me.errorCb]));
        } else {
            me.instance.service.getUrbanPlanDetailData(data.id, fillCb, me._mergeErrorCbs([closeAndCancelCb, me.errorCb]));
        }       
    },
    _mergeErrorCbs: function(array) {
        return function(jqxhr, textStatus) {
            for (var i = 0; i < array.length; i++) {
                array[i](jqxhr, textStatus);
            }    
        };
    },
    showSubpage: function (pageName) {
        var me = this;
        var elLeft = this.getLeftColumn();
        var isResizeNeeded = false;

        //show proper page
        if (pageName == 'plans') {         
            if (this.markingsContainer != null)
                this.markingsContainer.hide();
            if (this.peopleContainer != null)
                this.peopleContainer.hide();

            if (this.urbanPlansContainer == null) {
                this.urbanPlansContainer = this._prepareView(elLeft);
                isResizeNeeded = true;
            }
            this.urbanPlansContainer.show();
        } else if (pageName == 'markings') {
            if (this.urbanPlansContainer != null)
                this.urbanPlansContainer.hide();
            if (this.peopleContainer != null)
                this.peopleContainer.hide();
            if (this.markingsContainer == null) {
                this.markingsContainer = this._prepareMarkingsContainer(elLeft);
                isResizeNeeded = true;
            }
            this.markingsContainer.show();
        } else if (pageName == 'people' && this.instance.service.hasRightToSeeContactPeople()) {
            if (this.urbanPlansContainer != null)
                this.urbanPlansContainer.hide();
            if (this.markingsContainer != null)
                this.markingsContainer.hide();
            if (this.peopleContainer == null) {
                this.peopleContainer = this._preparePeopleContainer(elLeft);
                isResizeNeeded = true;
            }
            this.peopleContainer.show();
        }

        //if (isResizeNeeded) {
            window.setTimeout(function() {
                me.resize();
            }, 50);
        //}
            
    },

    _prepareMarkingsContainer: function(containerElement) {
        var me = this;

        var container = jQuery('<div id=urbanPlansMarkingsContainer></div>');

        var filter = this._prepareMarkingsLeftContainer();
        var list = this._prepareMarkingsRightContainer();

        container.append(filter);
        container.append(list);
        container.append(jQuery('<div style="clear: both"></div>'));

        containerElement.append(container);

        //list.width(container.width() - filter.width() - 20);

        return container;
    },

    _prepareMarkingsLeftContainer: function () {
        var me = this;
        var form = Oskari.clazz.create(
            'Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanMarkingsFilterForm',
            me.instance, this);
        return form.getForm();
    },

    _prepareMarkingsRightContainer: function() {
        var me = this;
        var form = Oskari.clazz.create(
                'Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanMarkingsDetailsForm',
                me.instance, this);
        return form.getForm();
    },

    _preparePeopleContainer: function(containerElement) {
        var container = jQuery('<div id=urbanPlansPeopleContainer></div>');

        var leftForm = Oskari.clazz.create(
            'Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanPeopleFilterForm',
            this.instance, this);
        var rightForm = Oskari.clazz.create(
            'Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanPeopleDetailsForm',
            this.instance, this);

        $(leftForm).on('UrbanPlanPeopleFilterForm.FilterChanged', function (event, sender, filter) {
            rightForm.onFilterChanged(filter);
        });

        var filter = leftForm.getForm();
        var list = rightForm.getForm();

        container.append(filter);
        container.append(list);
        container.append(jQuery('<div style="clear: both"></div>'));

        containerElement.append(container);

        //list.width(container.width() - filter.width() - 20);

        //filter.height(container.height() - disclaimer.height());
        //list.height(container.height() - disclaimer.height());

        return container;
    },
    showMessage: function (title, message, buttons, options) {
        var me = this,
            loc = this._locale,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        options = options || {};
        if (buttons) {
            dialog.show(title, message, buttons);
        } else {
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            //okBtn.setTitle(loc.buttons.ok);
            okBtn.setTitle("Sulje");
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close(true);
                me.dialog = null;
            });
            dialog.show(title, message, [okBtn]);
            me.dialog = dialog;
        }
        if(options.draggable) {
            dialog.makeDraggable();
        }
    },

    _showCreatingCsvPopUp: function() {
        var me = this,
            sandbox = this.instance.getSandbox(),
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            cancelBtn = dialog.createCloseButton(this.locale.csv.delete),
            saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

        var content = jQuery('<div id="urban-plans-csv-container"></div>');

        //Field separator
        var fieldSeparator = jQuery("<div class='csv-format-row'>" + this.locale.csv.fieldSeparator + "</div>");
        var fieldSeparatorSelect = jQuery("<select id='field-separator-csv-format' class='csv-format-select'></select>");
        fieldSeparatorSelect.append("<option value=';'>" + this.locale.csv.semicolon + "</option>");
        fieldSeparatorSelect.append("<option value=','>" + this.locale.csv.comma + "</option>");
        fieldSeparatorSelect.append("<option value=':'>" + this.locale.csv.colon + "</option>");
        fieldSeparatorSelect.append("<option value='\t'>" + this.locale.csv.tabulator + "</option>");
        fieldSeparatorSelect.append("<option value='|'>" + this.locale.csv.pipe + "</option>");
        fieldSeparator.append(fieldSeparatorSelect);
        content.append(fieldSeparator);

        //Null symbolizer
        var nullSymbolizer = jQuery("<div class='csv-format-row'>" + this.locale.csv.nullSymbolizer + "</div>");
        var nullSymbolizerSelect = jQuery("<select id='null-symbolizer-csv-format' class='csv-format-select'></select>");
        nullSymbolizerSelect.append("<option value=''>" + this.locale.csv.empty + "</option>");
        nullSymbolizerSelect.append("<option value='.'>" + this.locale.csv.dot + "</option>");
        nullSymbolizerSelect.append("<option value='-1'>" + this.locale.csv.negative1 + "</option>");
        nullSymbolizerSelect.append("<option value='-99'>" + this.locale.csv.negative99 + "</option>");
        nullSymbolizerSelect.append("<option value='-99999'>" + this.locale.csv.negative99999 + "</option>");
        nullSymbolizer.append(nullSymbolizerSelect);
        content.append(nullSymbolizer);

        //Decimal separator
        var decimalSeparator = jQuery("<div class='csv-format-row'>" + this.locale.csv.decimalPointSeparator + "</div>");
        var decimalSeparatorSelect = jQuery("<select id='decimal-separator-csv-format' class='csv-format-select'></select>");
        decimalSeparatorSelect.append("<option value=','>" + this.locale.csv.comma + "</option>");
        decimalSeparatorSelect.append("<option value='.'>" + this.locale.csv.dot + "</option>");
        decimalSeparator.append(decimalSeparatorSelect);
        content.append(decimalSeparator);

        saveBtn.addClass('primary');
        saveBtn.setTitle(this.locale.csv.file);

        saveBtn.setHandler(function () {
            //Generating CSV
            //Get selected urban plans
            var selections = new Array();
            $('input[type="checkbox"][name="urbanPlanCheckBox"]:checked').each(function () {
                selections.push(this.value);
            });
            var options = {
                'fieldSeparator': $("#field-separator-csv-format").val(),
                'quoteSymbol': '"',
                'nullSymbolizer': $("#null-symbolizer-csv-format").val(),
                'decimalSeparator': $("#decimal-separator-csv-format").val()
            };

            dialog.close(true);
            me._generateCsv(selections, options);
        });

        dialog.show('Tallennettavan tiedoston muotoilu', content, [saveBtn, cancelBtn]); //TODO localization
        //dialog.makeModal();*/
    },
    _generateCsv: function (selections, options) {
        var me = this;
        var basicData = [];
        var areaData = [];
        var dataCounter = 0;
        var TOTAL_DESCRIPTION = "Yhteensä";
        var i, x, ix;
        var cancelled = false, errors = false, requests = [];

        var container = jQuery('<div id="urban-plans-csv-loading-container">' + me.locale.csv.loadingMessage.replace('{1}', 1).replace('{2}', selections.length) + '</div>');        
        var closeAndCancelCb = function () {
            cancelled = true;
            dialog.close(true);
            for (ix = 0; ix < requests.length; ++ix) {
                if (requests[ix]) {
                    requests[ix].abort();
                }
            }
        };
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.addClass('urbanPlansDialog');
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.addClass('primary');
        cancelBtn.setTitle(me.locale.table.cancel);
        cancelBtn.setHandler(closeAndCancelCb);
        dialog.show(me.locale.csv.loadingTitle, container, [cancelBtn]);
        dialog.makeDraggable();
        dialog.makeResizable();
        dialog.makeModal();

        var errorCallback = function (jqXHR, textStatus) {
            errors = true;
            cancelled = true;
            dialog.close();
            var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeBtn = errorDialog.createCloseButton(me.locale.csv.close);

            var content = jQuery('<div id="urban-plans-csv-loading-error-container">' + me.locale.error.csvLoadingError + '</div>');

            closeBtn.addClass('primary');
            errorDialog.show(me.locale.error.title, content, [closeBtn]);
            errorDialog.makeModal();
            for (ix = 0; ix < requests.length; ++ix) {
                if (requests[ix]) {
                    requests[ix].abort();
                }
            }
        }

        for (i = 0; i < selections.length; i++) {
            if (cancelled)
                return;

            var fillCb = function (data) {
                if (cancelled)
                    return;

                $('#urban-plans-csv-loading-container').empty().append(me.locale.csv.loadingMessage.replace('{1}', dataCounter + 1).replace('{2}', selections.length));

                var basicDataRow = {};
                basicDataRow.Asemakaava_Id = data.id;
                basicDataRow.Tyvi_Id = data.tyviId;
                basicDataRow.Kunta_Id = data.municipalityId;
                basicDataRow.Kunta = data.municipalityName;
                basicDataRow.Tayttamispvm = data.fillDate;
                basicDataRow.KaavanNimi = data.name;
                basicDataRow.Hyvaksymispvm = data.approvalDate;
                basicDataRow.Ehdotuspvm = data.proposalDate;
                basicDataRow.Hyvaksyja = data.decisionMaker;
                basicDataRow.VireilletulostaIlmPvm = data.initialDate;
                basicDataRow.Hyvaksymispykala = data.decisionNumber;
                basicDataRow.KunnanKaavatunnus = data.municipalityPlanId;
                basicDataRow.GeneroituKaavatunnus = data.generatedPlanId;
                basicDataRow.KestoKK = data.duration;
                basicDataRow.KaavaAlueenPintaAlaHa = data.planArea;
                basicDataRow.UusiAsemakaavanPintaAlaHa = data.planAreaNew;
                basicDataRow.MaanalaistenTilojenPintaAlaHa = data.undergroundArea;
                basicDataRow.AsemakaavanMuutoksenPintaAlaHa = data.planAreaChange;
                basicDataRow.RantaviivanPituusKm = data.coastlineLength;
                basicDataRow.RakennuspaikatOmarantaisetlkm = data.buildingCountOwn;
                basicDataRow.RakennuspaikatEiOmarantaisetlkm = data.buildingCountOther;
                basicDataRow.LomarakennuspaikatOmarantaisetlkm = data.buildingCountOwnHoliday;
                basicDataRow.LomarakennuspaikatEiOmarantaisetlkm = data.buildingCountOtherHoliday;

                //initializing some properties
                basicDataRow.SuojellutRakennuksetAsemakaavalkm = null;
                basicDataRow.SuojellutRakennuksetAsemakaavaKm2 = null;
                basicDataRow.SuojeltujenRakennustenMuutosAsemakaavalkm = null;
                basicDataRow.SuojeltujenRakennustenMuutosAsemakaavaKm2 = null;
                basicDataRow.SuojellutRakennuksetEiAsemakaavalkm = null;
                basicDataRow.SuojellutRakennuksetEiAsemakaavaKm2 = null;
                basicDataRow.SuojeltujenRakennustenMuutosEiAsemakaavalkm = null;
                basicDataRow.SuojeltujenRakennustenMuutosEiAsemakaavaKm2 = null;
                basicDataRow.SuojellutRakennuksetEiEroteltulkm = null;
                basicDataRow.SuojellutRakennuksetEiEroteltuKm2 = null;
                basicDataRow.SuojeltujenRakennustenMuutosEiEroteltulkm = null;
                basicDataRow.SuojeltujenRakennustenMuutosEiEroteltuKm2 = null;

                var bc = data.BuildingConservations.sub;
                if (bc != null) {
                    for (x = 0; x < bc.length; x++) {
                        if (bc[x].conservationTypeId === 1) { //'Asemakaava
                            basicDataRow.SuojellutRakennuksetAsemakaavalkm = bc[x].buildingCount;
                            basicDataRow.SuojellutRakennuksetAsemakaavaKm2 = bc[x].floorSpace;
                            basicDataRow.SuojeltujenRakennustenMuutosAsemakaavalkm = bc[x].changeCount;
                            basicDataRow.SuojeltujenRakennustenMuutosAsemakaavaKm2 = bc[x].changeFloorSpace;
                        } else if (bc[x].conservationTypeId === 2) { //'Ei asemakaava'
                            basicDataRow.SuojellutRakennuksetEiAsemakaavalkm = bc[x].buildingCount;
                            basicDataRow.SuojellutRakennuksetEiAsemakaavaKm2 = bc[x].floorSpace;
                            basicDataRow.SuojeltujenRakennustenMuutosEiAsemakaavalkm = bc[x].changeCount;
                            basicDataRow.SuojeltujenRakennustenMuutosEiAsemakaavaKm2 = bc[x].changeFloorSpace;
                        } else if (bc[x].conservationTypeId === 3) { //'Suojellut rak.'
                            basicDataRow.SuojellutRakennuksetEiEroteltulkm = bc[x].buildingCount;
                            basicDataRow.SuojellutRakennuksetEiEroteltuKm2 = bc[x].floorSpace;
                            basicDataRow.SuojeltujenRakennustenMuutosEiEroteltulkm = bc[x].changeCount;
                            basicDataRow.SuojeltujenRakennustenMuutosEiEroteltuKm2 = bc[x].changeFloorSpace;
                        }
                    }
                }

                basicData.push(basicDataRow);

                var ar = data.AreaReservations;
                if (ar != null) {
                    for (x = 0; x < ar.length; x++) {
                        if (ar[x].data != null) {
                            for (var y = 0; y < ar[x].data.length; y++) {
                                var myDataRow = {};
                                myDataRow.Asemakaava_Id = data.id;
                                myDataRow.Tyvi_Id = data.tyviId;
                                myDataRow.Paaluokka = me._fixDescriptionForCsv(ar[x].description);
                                myDataRow.Alamerkinta = ar[x].data[y].description;
                                myDataRow.Pinta_ala_ha = ar[x].data[y].areaSize;
                                myDataRow.Pinta_ala_pe = ar[x].data[y].areaPercent;
                                myDataRow.Kerrosala = ar[x].data[y].floorSpace;
                                myDataRow.Tehokkuus = ar[x].data[y].efficiency;
                                myDataRow.Pinta_alan_muut = ar[x].data[y].areaChange;
                                myDataRow.Kerrosalan_muut = ar[x].data[y].floorSpaceChange;
                                areaData.push(myDataRow);
                            }
                        } else if(ar[x].description !== TOTAL_DESCRIPTION) {
                            if(typeof ar[x].areaSize === 'undefined'
                                && typeof ar[x].areaPercent === 'undefined'
                                    && typeof ar[x].floorSpace === 'undefined'
                                        && typeof ar[x].efficiency === 'undefined'
                                            && typeof ar[x].areaChange === 'undefined'
                                                && typeof ar[x].floorSpaceChange === 'undefined') {
                                continue;
                            }
                            var myDataRow = {};
                            myDataRow.Asemakaava_Id = data.id;
                            myDataRow.Tyvi_Id = data.tyviId;
                            myDataRow.Paaluokka = me._fixDescriptionForCsv(ar[x].description);
                            myDataRow.Alamerkinta = "";
                            myDataRow.Pinta_ala_ha = ar[x].areaSize;
                            myDataRow.Pinta_ala_pe = ar[x].areaPercent;
                            myDataRow.Kerrosala = ar[x].floorSpace;
                            myDataRow.Tehokkuus = ar[x].efficiency;
                            myDataRow.Pinta_alan_muut = ar[x].areaChange;
                            myDataRow.Kerrosalan_muut = ar[x].floorSpaceChange;
                            areaData.push(myDataRow);
                        }
                    }
                }

                var underground = data.UndergroundAreas;
                if (underground != null && underground.sub != null) {
                    for (x = 0; x < underground.sub.length; x++) {
                        if (underground.sub[x].description == TOTAL_DESCRIPTION && underground.sub.length > 1)
                            continue;
                        
                        if(typeof underground.sub[x].areaSize === 'undefined'
                            && typeof underground.sub[x].areaPercent === 'undefined'
                                && typeof underground.sub[x].floorSpace === 'undefined'
                                    && typeof underground.sub[x].efficiency === 'undefined'
                                        && typeof underground.sub[x].areaChange === 'undefined'
                                            && typeof underground.sub[x].floorSpaceChange === 'undefined') {
                            continue;
                        }
                        
                        var myDataRow = {};
                        myDataRow.Asemakaava_Id = data.id;
                        myDataRow.Tyvi_Id = data.tyviId;
                        myDataRow.Paaluokka = 'ma';
                        myDataRow.Alamerkinta = underground.sub[x].description == TOTAL_DESCRIPTION ? "" : underground.sub[x].description;
                        myDataRow.Pinta_ala_ha = underground.sub[x].areaSize;
                        myDataRow.Pinta_ala_pe = underground.sub[x].areaPercent;
                        myDataRow.Kerrosala = underground.sub[x].floorSpace;
                        myDataRow.Tehokkuus = underground.sub[x].efficiency;
                        myDataRow.Pinta_alan_muut = underground.sub[x].areaChange;
                        myDataRow.Kerrosalan_muut = underground.sub[x].floorSpaceChange;
                        areaData.push(myDataRow);
                    }
                }
                dataCounter++;

                //check if response from last selected plan is proceeded and try generate CSVs
                if (dataCounter == selections.length) {
                    if (cancelled)
                        return;

                    var fieldSeparator = options.fieldSeparator;
                    var quoteSymbol = options.quoteSymbol;
                    var nullSymbolizer = options.nullSymbolizer;
                    var decimalSeparator = options.decimalSeparator;
                    var disclaimer = [];
                    var disclaimerBase = me.locale.csv.disclaimer;
                    var formattedDate = $.datepicker.formatDate("d.m.yy", new Date());
                    for (i = 0; i < disclaimerBase.length; i++) {
                        disclaimer.push(disclaimerBase[i].replace("{DATE}", formattedDate));
                    }

                    var comparer = function (a, b) {
                        return (a.Asemakaava_Id == b.Asemakaava_Id) ? 0 : ((a.Asemakaava_Id > b.Asemakaava_Id) ? 1 : -1);
                    };

                    basicData.sort(comparer);
                    areaData.sort(comparer);

                    //convert json to csv
                    var perusCsv = me._convertJsonToCsv(
                        basicData,
                        fieldSeparator,
                        quoteSymbol,
                        nullSymbolizer,
                        decimalSeparator,
                        ["Asemakaava_Id", "Tyvi_Id", "Kuntakoodi", "Kuntanimi", "Täyttämispvm", "Kaavan nimi", "Hyväksymispvm", "Ehdotuspvm", "Hyväksyjä", "Vireilletulosta ilm. pvm", "Hyväksymispykälä", "Kunnan kaavatunnus", "Generoitu kaavatunnus", "Kesto [kk]", "Kaava-alueen pinta-ala [ha]", "Uusi asemakaavan pinta-ala [ha]", "Maanalaisten tilojen pinta-ala [ha]", "Asemakaavan muutoksen pinta-ala [ha]", "Rantaviivan pituus [km]", "Rakennuspaikat, omarantaiset [lkm]", "Rakennuspaikat, ei-omarantaiset [lkm]", "Lomarakennuspaikat, omarantaiset [lkm]", "Lomarakennuspaikat, ei-omarantaiset [lkm]", "Suojellut rakennukset, asemakaava [lkm]", "Suojellut rakennukset, asemakaava [k-m2]", "Suojeltujen rakennusten muutos, asemakaava [lkm +/-]", "Suojeltujen rakennusten muutos, asemakaava [k-m2 +/-]", "Suojellut rakennukset, ei-asemakaava [lkm]", "Suojellut rakennukset, ei-asemakaava [k-m2]", "Suojeltujen rakennusten muutos, ei-asemakaava [lkm +/-]", "Suojeltujen rakennusten muutos, ei-asemakaava [k-m2 +/-]", "Suojellut rakennukset, ei eroteltu [lkm]", "Suojellut rakennukset, ei eroteltu [k-m2]", "Suojeltujen rakennusten muutos, ei eroteltu [lkm +/-]", "Suojeltujen rakennusten muutos, ei eroteltu [k-m2 +/-]"],
                        disclaimer
                        );

                    var alaCsv = me._convertJsonToCsv(
                        areaData,
                        fieldSeparator,
                        quoteSymbol,
                        nullSymbolizer,
                        decimalSeparator,
                        ["Asemakaava_Id", "Tyvi_Id", "Pääluokka", "Alamerkintä", "Pinta-ala [ha]", "Pinta-ala [%]", "Kerrosala [k-m2]", "Tehokkuus [e]", "Pinta-alan muut. [ha+/-]", "Kerrosalan muut. [k-m2+/-]"],
                        disclaimer
                        );

                    //create link to download the file
                    var perusLink = $('<a>perus.csv</a>')
                        .attr('class', 'urban-plans-download-csv-file')
                        .attr('download', 'perus.csv');

                    var alaLink = $('<a>ala.csv</a>')
                        .attr('class', 'urban-plans-download-csv-file')
                        .attr('download', 'ala.csv');

                    var ua = window.navigator.userAgent;

                    if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0) {
                        perusLink.click(function () {
                            var blob = new Blob(['\uFEFF' + perusCsv], {
                                type: "text/csv;charset=utf-8;"
                            });

                            navigator.msSaveBlob(blob, 'perus.csv');
                        });

                        alaLink.click(function () {
                            var blob = new Blob(['\uFEFF' + alaCsv], {
                                type: "text/csv;charset=utf-8;"
                            });

                            navigator.msSaveBlob(blob, 'ala.csv');
                        });
                    } else {
                        perusLink.attr('href', 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(perusCsv));
                        alaLink.attr('href', 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(alaCsv));
                    }

                    //get 10 first lines of the CSV for presentation on the page
                    var startPos = 0;
                    var length = 10;
                    if (disclaimer != null) {
                        startPos = disclaimer.length;
                    }
                    
                    var lines = perusCsv.split('\r\n').slice(startPos, startPos + length);
                    var perusList = '';
                    for (i = 0; i < lines.length; i++) {
                        if (lines != '') {
                            perusList += lines[i] + '<br />';
                        }
                    }

                    var lines = alaCsv.split('\r\n').slice(startPos, startPos + length);
                    var alaList = '';
                    for (i = 0; i < lines.length; i++) {
                        if (lines != '') {
                            alaList += lines[i] + '<br />';
                        }
                    }

                    //show dialog with information about created CSV files
                    me._showCsvInfoPopUp(dialog, perusLink, perusList, alaLink, alaList);
                }
            };

            if (!errors) {
                requests.push(me.instance.service.getUrbanPlanDetailData(selections[i], fillCb, errorCallback));
            }
        }
    },
    _fixDescriptionForCsv: function (str) {
        return str.replace(" yhteensä", "");
    },
    _showCsvInfoPopUp: function (dialog, perusLink, perusList, alaLink, alaList) {
        var me = this,
            sandbox = this.instance.getSandbox(),
            closeBtn = dialog.createCloseButton(this.locale.csv.close);

        var content = jQuery('<div id="urban-plans-csv-info-container"></div>');
        content.append('<div><p>' + this.locale.csv.createdInfo + '</p></div>');

        var paragraph = jQuery('<p></p>');
        paragraph.append(perusLink);
        paragraph.append('<div>' + this.locale.csv.createdExample + '</div>');
        paragraph.append('<pre class="no-wrap">' + perusList + '</pre>');
        content.append(paragraph);

        var paragraph = jQuery('<p></p>');
        paragraph.append(alaLink);
        paragraph.append('<div>' + this.locale.csv.createdExampleMarkings + '</div>');
        paragraph.append('<pre class="no-wrap">' + alaList + '</pre>');
        content.append(paragraph);

        closeBtn.addClass('primary');

        dialog.show(this.locale.csv.createdTitle, content, [closeBtn]);
        //dialog.makeModal();*/
    },

    _convertJsonToCsv: function(
            jsonData, fieldSeparator, quoteSymbol,
            nullSymbolizer, decimalSeparator, headerValues, 
            disclaimer) {
        var array = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

        var str = '',i, newline = '\r\n';

        if (disclaimer != null) {
            for (i = 0; i < disclaimer.length; i++) {
                str += disclaimer[i] + newline;
            }
        }

        if (headerValues) {
            var headerLine = '';
            for(i = 0; i < headerValues.length; i++) {
                headerLine += this._quoteValue(headerValues[i], quoteSymbol, fieldSeparator) + fieldSeparator;
            }
            str += headerLine.slice(0, -1) + newline;
        }

        for (i = 0; i < array.length; i++) {
            var line = '';

            //if ($("#quote").is(':checked')) {
            for (var index in array[i]) {
                if (array[i][index] != null) {
                    if (typeof array[i][index] === 'string') {
                        var value = array[i][index] + "";
                        line += this._quoteValue(value, quoteSymbol, fieldSeparator) + fieldSeparator;
                    } else if (typeof array[i][index] === 'number') {
                        var value = array[i][index] + "";
                        line += this._quoteValue(value.replace(".", decimalSeparator), quoteSymbol, fieldSeparator) + fieldSeparator;
                    } else {
                        var value = array[i][index] + "";
                        line += this._quoteValue(value, quoteSymbol, fieldSeparator) + fieldSeparator;
                    }
                } else {
                    line += nullSymbolizer + fieldSeparator;
                }
            }

            line = line.slice(0, -1);
            str += line + newline;
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
	
	_updateUrbanPlansListToolButtons: function(forceDisable) {
		//enable or disable buttons for creating summary and exporting to CSV		
		var n = $('input[name=urbanPlanCheckBox]:checked').length;
		if (n > 0 && !forceDisable) {
			$('.urbanPlansListToolButton').removeAttr('disabled');
		} else {
			$('.urbanPlansListToolButton').attr('disabled', 'disabled');
		}
	},
}, {
    "protocol": ["Oskari.userinterface.View"],
    "extend": ["Oskari.userinterface.extension.DefaultView"]
});
