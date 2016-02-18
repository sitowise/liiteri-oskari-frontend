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
                this.container = this._createUI();
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
                me.fillMarkNames(areaCheckbox.is(':checked'), undergroundCheckbox.is(':checked'), $('#markingsMainMarkNameInput').val());
            });
            
            areaCheckbox.change(function() {
                me.fillMarkNames(areaCheckbox.is(':checked'), undergroundCheckbox.is(':checked'), $('#markingsMainMarkNameInput').val());
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
            filterMunicipalityId.append(municipalityId);
            filterMunicipalityId.hide();
            panelBody.append(filterMunicipalityId);

            // MainMarkId
            var filterMainMarkName = jQuery("<div class='filterRow'></div>");
            var mainMarkName = jQuery(this.templates.select(
                'markingsMainMarkNameInput',
                this.locale.markingssearch.mainmarkname));
            filterMainMarkName.append(mainMarkName);
            filterMainMarkName.hide();
            panelBody.append(filterMainMarkName);

            // Hide/show stuff based on selection
            typeFilter.find("input:radio[value='municipality']").click(function () {
                if ($(this).is(':checked')) {
                    //filterName.show();
                    filterMunicipalityId.show();
                    filterMainMarkName.show();
                }
            });
            typeFilter.find("input:radio[value='standard']").click(function () {
                if ($(this).is(':checked')) {
                    //filterName.hide();
                    filterMunicipalityId.hide();
                    filterMainMarkName.hide();
                }
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
            }
            this.instance.service.getMarkingsStartingData(fillCb, this.errorCb);

            return container;
        },
        
        fillMarkNames: function(area, underground, selected) {
            if(this.markNames === null) {
                return;
            }
            $('#markingsMainMarkNameInput').find('option').remove();
            $('#markingsMainMarkNameInput').append($('<option value=""/>'));
            $.each(this.markNames, function(idx, item) {
                if(area && item !== 'ma' || underground && item === 'ma') {
                    $('#markingsMainMarkNameInput').append($('<option/>', {
                        'value':    item,
                        'text':     item
                        }));
                    if(item === selected) {
                        $('#markingsMainMarkNameInput').val(selected);
                    }
                }
            });
            $('#markingsMainMarkNameInput').trigger("liszt:updated");
            
        }
    });