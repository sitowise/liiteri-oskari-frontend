Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanMarkingsFilterForm",
    function (instance, parent) {
        this.instance = instance;
        this.locale = instance.getLocalization('view');
        this.container = null;
        this.templates = {
            "container": "<div id='urbanPlansMarkingsFilterContainer' class='filterContainer'></div>",
            "panel": '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title"></h3></div><div class="panel-body"></div></div>',
            'markingsFilterType': '<div class="filterRow">' + this.locale.markingssearch.type + '</div>',
            'markingsMarkingType': '<div class="filterRow">' + this.locale.markingssearch.markingtype + '</div>',
            'markingsTypeChoose': '<div>' +
                '<div><input type="radio" name="urbanPlanMarkingsType" value="standard" checked="checked">' + this.locale.markingssearch.standardtype + '</input></div>' +
                '<div><input type="radio" name="urbanPlanMarkingsType" value="municipality">' + this.locale.markingssearch.municipalityType + '</input></div>' +
                '</div>',
            "select": function (id, text) {
                return '<select id="' + id +
                    '" name="' + id +
                    '" data-placeholder="' + text +
                    '"><option value></option></select>';
                },
        };
        this.parent = parent;
        this.markNames = null;
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
                this.locale.markingssearch.parameters);
            container.append(mainPanel);

            var panelBody = mainPanel.find('div.panel-body');

            // Type (municipality markings / standard markings)
            var filterRowType = jQuery(this.templates.markingsFilterType);
            var typeFilter = jQuery(this.templates.markingsTypeChoose);
            filterRowType.append(typeFilter);

            panelBody.append(filterRowType);

            // Marking type (underground / area)
            var filterRowMarkingType = jQuery(this.templates.markingsMarkingType);
            var undergroundCheckbox = jQuery('<input type="checkbox" name="urbanPlanMarkingsMarkingType" value="undergroundAreas" checked="checked"/>' + this.locale.markingssearch.undergroundareas + '</input>');
            var areaCheckbox = jQuery('<input type="checkbox" name="urbanPlanMarkingsMarkingType" value="areaReservations" checked="checked"/>' + this.locale.markingssearch.areareservations + '</input>');

            undergroundCheckbox.click(function() {
                if (!undergroundCheckbox.is(':checked') &&
                        !areaCheckbox.is(':checked')) {
                    areaCheckbox.prop('checked', true).change();
                }
            });
            areaCheckbox.click(function () {
                if (!undergroundCheckbox.is(':checked') &&
                        !areaCheckbox.is(':checked')) {
                    undergroundCheckbox.prop('checked', true).change();
                }
            });
            
            undergroundCheckbox.change(function() {
                me.fillMarkNames();
            });
            
            areaCheckbox.change(function() {
                me.fillMarkNames();
            });

            filterRowMarkingType.append(jQuery("<br/>"));
            filterRowMarkingType.append(areaCheckbox);
            filterRowMarkingType.append(jQuery("<br/>"));
            filterRowMarkingType.append(undergroundCheckbox);

            panelBody.append(filterRowMarkingType);

            // Municipality
            var filterMunicipalityId = jQuery("<div class='filterRow'></div>");
            var municipalityId = jQuery(this.templates.select(
                'markingsMunicipalityIdInput',
                this.locale.markingssearch.municipalityid));
            municipalityId.change(function (e) {
                me.instance.addFilterToUrl('municipalityId', $(e.target).val());
            });
            filterMunicipalityId.append(municipalityId);
            filterMunicipalityId.hide();
            panelBody.append(filterMunicipalityId);

            // MainMarkId
            var filterMainMarkName = jQuery("<div class='filterRow'></div>");
            var mainMarkName = jQuery(this.templates.select(
                'markingsMainMarkNameInput',
                this.locale.markingssearch.mainmarkname));
            mainMarkName.change(function (e) {
                me.instance.addFilterToUrl('mainMarkName', $(e.target).val());
            });
            filterMainMarkName.append(mainMarkName);
            filterMainMarkName.hide();
            panelBody.append(filterMainMarkName);

            // Hide/show stuff based on selection
            typeFilter.find("input:radio[value='municipality']").change(function () {
                if ($(this).is(':checked')) {
                    //filterName.show();
                    filterMunicipalityId.show();
                    filterMainMarkName.show();
                }

                me.instance.addFilterToUrl('type', $(this).prop('value'));
            });
            typeFilter.find("input:radio[value='standard']").change(function () {
                if ($(this).is(':checked')) {
                    //filterName.hide();
                    filterMunicipalityId.hide();
                    filterMainMarkName.hide();
                }

                me.instance.addFilterToUrl('type', $(this).prop('value'));
            });

            // by default 'standard' radio value is selected
            typeFilter.find("input:radio[value='standard']")
                .attr('checked', 'checked');

            // Button
            var filterRowShow = jQuery("<div class='buttons filterRow'></div>");
            var showButton = Oskari.clazz.create(
                'Oskari.userinterface.component.Button');
            showButton.setTitle(this.locale.markingssearch.show);
            showButton.setHandler(function() {
                var type = $("input:radio[name='urbanPlanMarkingsType']:checked").val();
                var areaTypes = [];
                $("input:checkbox[name='urbanPlanMarkingsMarkingType']:checked").each(function() {
                    areaTypes.push($(this).val());
                });

                var name = "";
                var municipalityId = "";
                var mainMarkName = "";

                if (type == "municipality") {
                    municipalityId = $("#markingsMunicipalityIdInput").val();
                    mainMarkName = $("#markingsMainMarkNameInput").val();
                }

                var url = me.instance.service.urls.markings(type, areaTypes, name, municipalityId, mainMarkName);
                var defaultOrder = (type == "municipality") ? [[1, "asc"], [2, "asc"]] : [[2, "asc"], [6, "asc"]];

                me.parent.markingsDataTable.order(defaultOrder);
                me.parent.markingsDataTable.ajax.url(url).load(function() {
                    me.parent.markingsDataTable.search('');
                    var show = (type == "municipality") ? true : false;
                    var desc = (type == "municipality") ? me.locale.markingstable.customDescription : me.locale.markingstable.standardDescription;
                    jQuery("#markingsDescription").html(desc);
                    me.parent.markingsDataTable.column(0).visible(show);
                    me.parent.markingsDataTable.column(1).visible(show);
                    me.parent.markingsDataTable.columns.adjust().draw();
                });
            });
            showButton.insertTo(filterRowShow);
            panelBody.append(filterRowShow);

            // fill select boxes with data
            var fillCb = function(data) {
                $("input:checkbox[name='urbanPlanMarkingsMarkingType']").prop('checked', true);
                
                $.each(data.municipalities, function(idx, item) {
                    $('#markingsMunicipalityIdInput').append($('<option/>', {
                        'value':    item.id,
                        'text':     item.name
                    }));
                });
                $('#markingsMunicipalityIdInput').chosen(
                    { allow_single_deselect: true, no_results_text: me.locale.search.noResultText });

                me.markNames = data.markNames;
                $.each(data.markNames, function(idx, item) {
                    $('#markingsMainMarkNameInput').append($('<option/>', {
                        'value':    item,
                        'text':     item
                        }));
                });
                $('#markingsMainMarkNameInput').chosen(
                    { allow_single_deselect: true, no_results_text: me.locale.search.noResultText });

                //select filters based on URL params
                me._selectFilters();
            };
            var errorCb = function() {
                //select filters based on URL params
                me._selectFilters();
            };

            this.container = container;

            this.instance.service.getMarkingsStartingData(fillCb, errorCb);
        },
        
        fillMarkNames: function(area, underground, selected) {
            var area = this.container.find('input:checkbox[name="urbanPlanMarkingsMarkingType"][value="areaReservations"]'),
                underground = this.container.find('input:checkbox[name="urbanPlanMarkingsMarkingType"][value="undergroundAreas"]'),
                selected = $('#markingsMainMarkNameInput').val();

            if(this.markNames === null) {
                return;
            }
            $('#markingsMainMarkNameInput').find('option').remove();
            $('#markingsMainMarkNameInput').append($('<option value=""/>'));
            $.each(this.markNames, function(idx, item) {
                if(area.is(':checked') && item !== 'ma' || underground.is(':checked') && item === 'ma') {
                    $('#markingsMainMarkNameInput').append($('<option/>', {
                        'value':    item,
                        'text':     item
                        }));
                    if(item === selected) {
                        $('#markingsMainMarkNameInput').val(selected);
                    }
                }
            });
            $('#markingsMainMarkNameInput').trigger("chosen:updated");
            
            if (area.is(':checked')) {
                this.instance.addFilterToUrl('areaType', area.prop('value'), true);    
            } else {
                this.instance.removeFilterFromUrl('areaType', area.prop('value'));
            }

            if (underground.is(':checked')) {
                this.instance.addFilterToUrl('areaType', underground.prop('value'), true);    
            } else {
                this.instance.removeFilterFromUrl('areaType', underground.prop('value'));
            }
        },

        _selectFilters: function () {
            var param,
                splittedParam,
                i;
                
            //type
            param = this.instance.getUrlParameter('type');
            if (param != null) {
                this.container.find('input:radio[name="urbanPlanMarkingsType"][value="' + param + '"]').prop('checked', true).change();

                param = this.instance.getUrlParameter('municipalityId');
                if (param != null) {
                    this.container.find('#markingsMunicipalityIdInput').val(param).trigger("chosen:updated");;
                }
                param = this.instance.getUrlParameter('mainMarkName');
                if (param != null) {
                    this.container.find('#markingsMainMarkNameInput').val(param).trigger("chosen:updated");;
                }
            }
            
            //area type
            param = this.instance.getUrlParameter('areaType');
            if (param != null) {
                this.container.find('input:checkbox[name="urbanPlanMarkingsMarkingType"]').prop('checked', false);
                splittedParam = param.split(',');
                for (i = 0; i < splittedParam.length; i++) {
                    this.container.find('input:checkbox[name="urbanPlanMarkingsMarkingType"][value="' + splittedParam[i] + '"]').prop('checked', true).change();
                }
            }
        }
    });