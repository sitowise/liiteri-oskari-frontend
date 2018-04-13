Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanPeopleFilterForm",
    function (instance, baseView) {
        this.view = baseView;
        this.instance = instance;
        this.locale = instance.getLocalization('view');
        this.container = null;
        this.templates = {
            'container': '<div id="urbanPlansPeopleFilterContainer" class="filterContainer"></div>',
            'panel': '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title"></h3></div><div class="panel-body"></div></div>',
            'peopleFilterHeader': '<div class="filterRow urbanPlansHeader">' + this.locale.peoplesearch.searchTitle + '</div>',
            'peopleFilterType': '<div><div class="filterRow">' + this.locale.peoplesearch.personType + '</div></div>',
            "input" : function(name, value, text, checked) {
                return '<div><input type="radio" name="' + name +
                    '" value="' + value + '" ' + (checked ? 'checked="checked"' : '') + '>'
                    + text + '</input></div>';
            },
            "select": function (id, text) {
                    return '<select id="' + id +
                        '" name="' + id +
                        '" data-placeholder="' + text +
                        '"><option value></option></select>';
                },
        };
    }, {
        getForm: function() {
            if (this.container == null) {
                this._createUI();
            }
            return this.container;
        },

        _createUI: function() {
            var me = this;

            var container = jQuery(this.templates.container);
            var mainPanel = jQuery(this.templates.panel);

            mainPanel.find('h3.panel-title').text(
                this.locale.peoplesearch.searchTitle);
            container.append(mainPanel);

            var panelBody = mainPanel.find('div.panel-body');

            var rowContainer = jQuery(this.templates.peopleFilterType);
            var showButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            var filterEly;
            var selectEly;
            var filterMunicipality;
            var selectMunicipality;
            var filterConsult;
            var selectConsult;

            rowContainer.append(jQuery(this.templates.input("urbanPlanPeopleType", "MunicipalityContact", this.locale.peoplesearch.municipalityContact, true)));
            rowContainer.append(jQuery(this.templates.input("urbanPlanPeopleType", "MunicipalityConsult", this.locale.peoplesearch.municipalityConsult)));            

            //Callbacks for filling dropdowns
            var fillElySelectCb = function(data) {
                data.data.sort(function(a, b) {
                    if(a.hasOwnProperty("orderNumber") && b.hasOwnProperty("orderNumber") && a.orderNumber !== b.orderNumber) {
                        return a.orderNumber - b.orderNumber;
                    } else {
                        return a.name.localeCompare(b.name, "fi");
                    }
                });
                $.each(data.data, function(idx, item) {
                    selectEly.append(jQuery(
                        '<option value="' + item.id + '">' +
                        item.name + '</option>'));
                });
                selectEly.chosen({ allow_single_deselect: true, no_results_text: me.locale.search.noResultText });

                me._selectFilter('ely');
            };

            var fillMunicipalitySelectCb = function(data) {
                data.data.sort(function(a, b) {
                    if(a.hasOwnProperty("orderNumber") && b.hasOwnProperty("orderNumber") && a.orderNumber !== b.orderNumber) {
                        return a.orderNumber - b.orderNumber;
                    } else {
                        return a.name.localeCompare(b.name, "fi");
                    }
                });
                selectMunicipality.find('option').remove();
                selectMunicipality.append(jQuery("<option value></option>"));
                $.each(data.data, function(idx, item) {
                    selectMunicipality.append(jQuery(
                        '<option value="' + item.id + '">' +
                        item.name + '</option>'));
                });

                if (typeof fillMunicipalitySelectCb.initialized == 'undefined' ||
                        fillMunicipalitySelectCb.initialized == false) {
                    selectMunicipality.chosen({ allow_single_deselect: true, no_results_text: me.locale.search.noResultText });
                    fillMunicipalitySelectCb.initialized = true;
                } else {
                    selectMunicipality.trigger('chosen:updated');
                }

                me._selectFilter('municipality');
            };

            var fillConsultSelectCb =  function(data) {
                selectConsult.find('option').remove();
                selectConsult.append(jQuery("<option value></option>"));

                var consults = {};
                $.each(data, function(idx, item) {
                    consults[item.vatNumber] =
                         item.organizationName + ' ' + item.vatNumber;
                });
                var l = $.map(consults, function(val, key) {
                    return key;
                });
                l.sort();
                $.each(l, function(idx, item) {
                    selectConsult.append(jQuery(
                        '<option value="' + item + '">' +
                        consults[item] + '</option>'));
                });
                if (typeof fillConsultSelectCb.initialized == 'undefined' ||
                        fillConsultSelectCb.initialized == false) {
                    selectConsult.chosen({ allow_single_deselect: true, no_results_text: me.locale.search.noResultText });
                    fillConsultSelectCb.initialized = true;
                } else {
                    selectConsult.trigger('chosen:updated');
                }

                me._selectFilter('consult');
            };

            //Filter: ELY
            filterEly = jQuery("<div class='filterRow'></div>");
            selectEly = jQuery(this.templates.select(
                'peopleElyInput', this.locale.peoplesearch.ely));

            selectEly.change(function(e) {
                var selectedElyValues = [$("#peopleElyInput").val()];
                me.instance.service.getRegionData(
                    "municipality", [], [], selectedElyValues, [], [],
                    fillMunicipalitySelectCb, me.view.errorCb);

                selectMunicipality.find('option').remove();
                selectMunicipality.trigger('chosen:updated');

                me.instance.addFilterToUrl('ely', $(e.target).val());
            });
            filterEly.append(selectEly);
            rowContainer.append(filterEly);

            //Filter: Municipality
            filterMunicipality = jQuery("<div class='filterRow'></div>");
            selectMunicipality = jQuery(this.templates.select(
                'peopleMunicipalityInput',
                this.locale.peoplesearch.municipality));
            selectMunicipality.change(function (e) {
                me.instance.addFilterToUrl('municipality', $(e.target).val());
            });
            filterMunicipality.append(selectMunicipality);
            rowContainer.append(filterMunicipality);

            rowContainer.append(jQuery(this.templates.input("urbanPlanPeopleType", "MunicipalityConsultDetailed", this.locale.peoplesearch.municipalityConsultDetailed)));

            // Filter: Consult name
            filterConsult = jQuery("<div class='filterRow'></div>");            
            selectConsult = jQuery(this.templates.select(
                'peopleConsultInput', this.locale.peoplesearch.consult));
            selectConsult.change(function (e) {
                me.instance.addFilterToUrl('consult', $(e.target).val());
            });
            filterConsult.append(selectConsult);
            rowContainer.append(filterConsult);

            rowContainer.find("input:radio[name='urbanPlanPeopleType']").change(function () {
                me.instance.addFilterToUrl('personType', $(this).prop('value'));
            });


            //Filter: Free word search
            //filterFreeWordSearch = jQuery("<div class='filterRow'>" + this.locale.peoplesearch.search + "</div>");
            //inputfreeWordSearch = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'peopleFreeWordSearchInput');
            //inputfreeWordSearch.getField().find('input').attr('id', 'peopleFreeWordSearchInput');
            //filterFreeWordSearch.append(inputfreeWordSearch.getField());
            //panelBody.append(filterFreeWordSearch);

            showButton.setTitle(this.locale.peoplesearch.show);
            showButton.setHandler(function () {
                var selections = me._gatherSelections();
                if (me._validateSelections(selections)) {
                    $('#urbanPlansPeopleList .urbanPlansHeader').text(me.locale.peopletable.title[selections.resultType]);
                    me._raiseFilterChanged(selections);
                } else {
                     me._showError("invalid_selection");
                }
            });

            var buttonsContainer = jQuery('<div class="buttons filterRow"></div>');            
            showButton.insertTo(buttonsContainer);

            rowContainer.append(buttonsContainer);
            panelBody.append(rowContainer);

            this.container = container;

            // Fill the dropdowns
            this.instance.service.getRegionData(
                "ely", [], [], [], [], [],
                fillElySelectCb, this.view.errorCb);
            this.instance.service.getRegionData(
                "municipality", [], [], [], [], [],
                fillMunicipalitySelectCb, this.view.errorCb);
            this.instance.service.getMunicipalityConsultData(
                [], [], [],
                fillConsultSelectCb, this.view.errorCb);

            me._selectFilter('personType');
        },
        _validateSelections: function (selections) {
            return true;
        },
        _gatherSelections: function () {
            var result = {
                'personType': '',
                'ely': '',
                'municipality': '',
                'search' : '',
                'authorizedOnly': '',
                'resultType': ''
            }
            result.resultType = result.personType = $("input:radio[name='urbanPlanPeopleType']:checked").val();
            
            if (result.personType == 'MunicipalityContact') {
                result.ely = $("#peopleElyInput").val();
                result.municipality = $("#peopleMunicipalityInput").val();
                $("#peopleConsultInput").val('').change().trigger('chosen:updated');
            } else if (result.personType == 'MunicipalityConsult') {
                result.ely = $("#peopleElyInput").val();
                result.municipality = $("#peopleMunicipalityInput").val();
                result.authorizedOnly = true;
                $("#peopleConsultInput").val('').change().trigger('chosen:updated');
            } else if (result.personType == 'MunicipalityConsultDetailed') {
                result.personType = 'MunicipalityConsult';
                result.search = $("#peopleConsultInput").val();
                $("#peopleElyInput").val('').change().trigger('chosen:updated');
                $("#peopleMunicipalityInput").val('').change().trigger('chosen:updated');
            }

            return result;
        },
        _showError: function (errorMsg) {
            var me = this;
            var message = me.locale.error[errorMsg] ? me.locale.error[errorMsg] : errorMsg;
            me.view.showMessage(me.locale.error.title, message);
        },
        _raiseFilterChanged: function (filter) {
            var me = this;
            $(this).trigger("UrbanPlanPeopleFilterForm.FilterChanged", [me, filter]);
        },

        _selectFilter: function (filterName) {
            var param;
            //person type
            if (filterName == 'personType') {
                param = this.instance.getUrlParameter('personType');
                if (param != null) {
                    this.container.find('input:radio[name="urbanPlanPeopleType"][value="' + param + '"]').prop('checked', true).change();
                }
            }
            
            //ely
            if (filterName == 'ely') {
                param = this.instance.getUrlParameter('ely');
                if (param != null) {
                    this.container.find('#peopleElyInput').val(param).trigger("chosen:updated");;
                }
            }

            //municipality
            if (filterName == 'municipality') {
                param = this.instance.getUrlParameter('municipality');
                if (param != null) {
                    this.container.find('#peopleMunicipalityInput').val(param).trigger("chosen:updated");;
                }
            }

            //consult
            if (filterName == 'consult') {
                param = this.instance.getUrlParameter('consult');
                if (param != null) {
                    this.container.find('#peopleConsultInput').val(param).trigger("chosen:updated");;
                }
            }
        }
    });