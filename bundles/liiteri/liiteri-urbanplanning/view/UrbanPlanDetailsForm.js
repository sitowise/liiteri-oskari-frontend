Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanDetailsForm",
    function (instance) {
        this.instance = instance;
        this.locale = instance.getLocalization('view');
        this.datatableLocaleLocation = "/Oskari/libraries/jquery/plugins/DataTables-1.10.7/locale/";
        this.template = {
            "container": "<div class='urbanPlanDetail'></div>",
            "header": "<div class='urbanPlanDetailHeader'></div>",
            "content": "<div class='urbanPlanDetailContent'></div>",
            "footer": "<div class='urbanPlanFooter'><div>",
            "disclaimer": "<div class='urbanPlanDisclaimer'>" + this.locale.disclaimer[0].replace("{DATE}", $.datepicker.formatDate("d.m.yy", new Date())) + "<br/>" + this.locale.disclaimer[1] + "<br/>" + this.locale.disclaimer[2] + "<div>",
            'summaryElementsTable': '<table id="urbanplanning-summary-table" class="display bordered" cellspacing="0" width="100%"><thead><tr>' +
            '<th>' + this.locale.table.municipality + '</th>' +
            '<th>' + this.locale.table.name + '</th>' +
            '<th>' + this.locale.table.municipalityPlanId + '</th>' +
            '<th>' + this.locale.table.generatedPlanId + '</th>' +
            '<th>' + this.locale.table.approvalDate + '</th>' +
            '</tr></thead><tbody></tbody></table>'
        };
    }, {
        start: function () { },
        getFormFor: function (data, summary, summaryElements) {
            var ui = this._createUI(data, summary, summaryElements);
            return ui;
        },
        _getTopContent: function(data, summary) {
            var basicDataListTop = jQuery("<dl class='contentBasicData toparea'></dl>");
            return basicDataListTop;
        },
        _addOneColumnRow: function (col) {
            return '<tr><td colspan="2">' + col + '</td></tr>';
        },
        _addTwoColumnRow: function(col1, col2) {
            return '<tr><td class="col1">' + col1 + '</td><td class="col2">' + col2 + '</td></tr>';
        },
        _getMainContent: function (data, summary) {
            var tmpData = {
                'municipalityName': data.municipalityId + " " + data.municipalityName
            };

            var result = '<table class="collapsed">';
            if (!summary) {

                result += this._addTwoColumnRow(this._formatDataForSummary(tmpData, this.locale.planDetail.main.municipality, "municipalityName"),
                                                this._formatDateForSummary(data, this.locale.planDetail.main.fillDate, "fillDate"));
                result += this._addOneColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.name, "name"));
                result += this._addTwoColumnRow(this._formatDateForSummary(data, this.locale.planDetail.main.approvalDate, "approvalDate"),
                                                this._formatDateForSummary(data, this.locale.planDetail.main.proposalDate, "proposalDate"));
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.decisionMaker, "decisionMaker"),
                                                this._formatDateForSummary(data, this.locale.planDetail.main.initialDate, "initialDate"));
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.decisionNumber, "decisionNumber"),
                                                this._formatDataForSummary(data, this.locale.planDetail.main.municipalityPlanId, "municipalityPlanId"));
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.generatedPlanId, "generatedPlanId"),
                                                this._formatDataForSummary(data, this.locale.planDetail.main.tyviId, "tyviId"));
                result += this._addOneColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.duration, "duration"));
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.planArea, "planArea", 4),
                                                this._formatDataForSummary(data, this.locale.planDetail.main.planAreaNew, "planAreaNew", 4));
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.undergroundArea, "undergroundArea", 4),
                                                this._formatDataForSummary(data, this.locale.planDetail.main.planAreaChange, "planAreaChange", 4));
            }
            else {
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.durationAverage, "durationAverage"),
                                                this._formatDataForSummary(data, this.locale.planDetail.main.durationMedian, "durationMedian"));
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.planArea, "planArea", 4),
                                                this._formatDataForSummary(data, this.locale.planDetail.main.planAreaNew, "planAreaNew", 4));
                result += this._addTwoColumnRow(this._formatDataForSummary(data, this.locale.planDetail.main.undergroundArea, "undergroundArea", 4),
                                                this._formatDataForSummary(data, this.locale.planDetail.main.planAreaChange, "planAreaChange", 4));
            }            

            result += "</table>";
            return jQuery(result);
        },
        _createUI : function(data, summary, summaryElements) {
            var container = jQuery(this.template.container);

            var header = jQuery(this.template.header);
            if (!summary) {
                header.append(this.locale.planDetail.detailTitle);
            } else {
                header.append('Asemakaavojen yhteenveto');
            }
            container.append(header);

            var content = jQuery(this.template.content);

            content.append(this._getTopContent(data, summary));
            content.append(this._getMainContent(data, summary));
//            content.append(this._getLeftContent(data, summary));
//            content.append(this._getRightContent(data, summary));
            content.append(jQuery('<div style="clear: both"></div>'));
            var basicDataList = jQuery("<dl class='contentBasicData bottomtable'></dl>");
            var basicDataListDiv = jQuery("<div></div>");
            basicDataListDiv.append("<span><dt>" + this.locale.planDetail.main.coastlinePlan + "</dt><dd>&nbsp;</dd></span>");
            basicDataListDiv.append($(this._formatDataForSummary(data, this.locale.planDetail.main.coastlineLength, "coastlineLength", 2)).addClass("longField"));
            basicDataList.append(basicDataListDiv);
            basicDataListDiv = jQuery("<div></div>");
            basicDataListDiv.append("<span><dt>" + this.locale.planDetail.main.buildingLocations + "</dt><dd>&nbsp;</dd></span>");
            basicDataListDiv.append(this._formatDataForSummary(data, this.locale.planDetail.main.buildingCountOwn, "buildingCountOwn"));
            basicDataListDiv.append(this._formatDataForSummary(data, this.locale.planDetail.main.buildingCountOther, "buildingCountOther"));
            basicDataList.append(basicDataListDiv);
            basicDataListDiv = jQuery("<div></div>");
            basicDataListDiv.append("<span><dt>" + this.locale.planDetail.main.buildingHolidayLocations + "</dt><dd>&nbsp;</dd></span>");
            basicDataListDiv.append(this._formatDataForSummary(data, this.locale.planDetail.main.buildingCountOwnHoliday, "buildingCountOwnHoliday"));
            basicDataListDiv.append(this._formatDataForSummary(data, this.locale.planDetail.main.buildingCountOtherHoliday, "buildingCountOtherHoliday"));
            basicDataList.append(basicDataListDiv);

            content.append(basicDataList);

            container.append(content);

            //Area reservations table
            if (data.AreaReservations != null) {
                data.AreaReservations.sort(function(a, b) {
                    if(a["mainMarkId"] == b["mainMarkId"]) {
                        return 0;
                    } else if(a["mainMarkId"] > b["mainMarkId"]) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                var areaReservationsTable = jQuery("<table class='bordered'></table>").addClass('areaReservations');;

                var hRow = $('<tr></tr>');

                hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.description));
                hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.areaSize));
                hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.areaPercent));
                hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.floorSpace));
                hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.efficiency));
                hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.areaChange));
                hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.floorSpaceChange));

                areaReservationsTable.append(hRow);

                for (var i = 0; i < data.AreaReservations.length; i++) {

                    var dRow = i == 0 ? $('<tr class="highlight"></tr>') : $('<tr></tr>');
                    var areaReservationsRow = data.AreaReservations[i];

                    this._formatTextForSummary(areaReservationsRow, "description");

                    dRow.append($('<td></td>').text(this._formatTextForSummary(areaReservationsRow, "description")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "areaSize", 4)));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "areaPercent", 1)));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "floorSpace")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "efficiency", 2)));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "areaChange", 4)));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "floorSpaceChange")));

                    areaReservationsTable.append(dRow);
                }

                container.append(areaReservationsTable);
            }

            //Underground space table
            if (data.UndergroundAreas.main != null && data.UndergroundAreas.main.length > 0) {
                var undergroundAreasTable = jQuery("<table class='bordered'></table>").addClass('undergroundAreas');

                var hRow = $('<tr></tr>');

                hRow.append($('<th></th>').text(this.locale.planDetail.underground.description));
                hRow.append($('<th></th>').text(this.locale.planDetail.underground.areaSize));
                hRow.append($('<th></th>').text(this.locale.planDetail.underground.areaPercent));
                hRow.append($('<th></th>').text(this.locale.planDetail.underground.floorSpace));
                hRow.append($('<th></th>').text(this.locale.planDetail.underground.areaChange));
                hRow.append($('<th></th>').text(this.locale.planDetail.underground.floorSpaceChange));

                undergroundAreasTable.append(hRow);

                for (var i = 0; i < data.UndergroundAreas.main.length; i++) {

                    var dRow = i == 0 ? $('<tr class="highlight"></tr>') : $('<tr></tr>');
                    var undergroundAreasRow = data.UndergroundAreas.main[i];

                    dRow.append($('<td></td>').text(this._formatTextForSummary(undergroundAreasRow, "description")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "areaSize", 4)));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "areaPercent", 1)));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "floorSpace")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "areaChange", 4)));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "floorSpaceChange")));

                    undergroundAreasTable.append(dRow);
                }

                container.append(undergroundAreasTable);
            }

            //Building conservation table
            if (data.BuildingConservations.main != null && data.BuildingConservations.main.length > 0) {
                var buildingConservationsTable = jQuery("<table class='bordered'></table>").addClass('buildingConservations');;

                var hRow = $('<tr></tr>');

                hRow.append($('<th></th>').text(this.locale.planDetail.conservation.name));
                hRow.append($('<th></th>').text(this.locale.planDetail.conservation.buildingCount));
                hRow.append($('<th></th>').text(this.locale.planDetail.conservation.floorArea));
                hRow.append($('<th></th>').text(this.locale.planDetail.conservation.changeCount));
                hRow.append($('<th></th>').text(this.locale.planDetail.conservation.changeFloorSpace));

                buildingConservationsTable.append(hRow);

                for (var i = 0; i < data.BuildingConservations.main.length; i++) {

                    var dRow = i == 0 ? $('<tr class="highlight"></tr>') : $('<tr></tr>');
                    var buildingConservationsRow = data.BuildingConservations.main[i];

                    dRow.append($('<td></td>').text(this._formatTextForSummary(buildingConservationsRow, "conservationTypeName")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "buildingCount")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "floorSpace")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "changeCount")));
                    dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "changeFloorSpace")));

                    buildingConservationsTable.append(dRow);
                }

                container.append(buildingConservationsTable);
            }

            //if this is summary, show tables with child elements only if summary is based on plans from the same municipality
            var sameMunicipality = true;
            if (summary && summaryElements.length > 0) {
                var municipalityId = summaryElements[0].municipalityId;
                for (var i = 0; i < summaryElements.length; i++) {
                    if (municipalityId != summaryElements[i].municipalityId) {
                        sameMunicipality = false;
                        break;
                    }
                }
            }

            container.append('<br /><br />');

            if (!summary || (summary && sameMunicipality)) {

                container.append('<br /><div class="urbanPlanDetailHeader">' + this.locale.planDetail.detailInfoHeader + '</div>');

                //Child entries
                if (data.AreaReservations != null) {
                    var childEntriesTable = jQuery("<table class='bordered'></table>").addClass('childEntries');

                    var hRow = $('<tr></tr>');

                    hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.description));
                    hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.areaSize));
                    hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.areaPercent));
                    hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.floorSpace));
                    hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.efficiency));
                    hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.areaChange));
                    hRow.append($('<th></th>').text(this.locale.planDetail.areaReservation.floorSpaceChange));

                    childEntriesTable.append(hRow);

                    for (var i = 0; i < data.AreaReservations.length; i++) {

                        var dRow = i == 0 ? $('<tr class="highlight"></tr>') : $('<tr></tr>');
                        var areaReservationsRow = data.AreaReservations[i];

                        dRow.append($('<td></td>').text(this._formatTextForSummary(areaReservationsRow, "description")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "areaSize", 4)));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "areaPercent", 1)));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "floorSpace")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "efficiency", 2)));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "areaChange", 4)));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsRow, "floorSpaceChange")));

                        childEntriesTable.append(dRow);

                        if (areaReservationsRow.data != null) {
                            for (var j = 0; j < areaReservationsRow.data.length; j++) {
                                var dRow = $('<tr></tr>');
                                var areaReservationsChildRow = areaReservationsRow.data[j];

                                dRow.append($('<td></td>').text(this._formatTextForSummary(areaReservationsChildRow, "description")));
                                dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsChildRow, "areaSize", 4)));
                                dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsChildRow, "areaPercent", 1)));
                                dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsChildRow, "floorSpace")));
                                dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsChildRow, "efficiency", 2)));
                                dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsChildRow, "areaChange", 4)));
                                dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(areaReservationsChildRow, "floorSpaceChange")));

                                childEntriesTable.append(dRow);
                            }
                        }
                    }

                    container.append(childEntriesTable);
                }

                //Underground space table
                if (data.UndergroundAreas.sub != null && data.UndergroundAreas.sub.length > data.UndergroundAreas.main.length) {
                    var undergroundAreasTable = jQuery("<table class='bordered'></table>").addClass('undergroundAreas');;

                    var hRow = $('<tr></tr>');

                    hRow.append($('<th></th>').text(this.locale.planDetail.underground.description));
                    hRow.append($('<th></th>').text(this.locale.planDetail.underground.areaSize));
                    hRow.append($('<th></th>').text(this.locale.planDetail.underground.areaPercent));
                    hRow.append($('<th></th>').text(this.locale.planDetail.underground.floorSpace));
                    hRow.append($('<th></th>').text(this.locale.planDetail.underground.areaChange));
                    hRow.append($('<th></th>').text(this.locale.planDetail.underground.floorSpaceChange));

                    undergroundAreasTable.append(hRow);

                    for (var i = 0; i < data.UndergroundAreas.sub.length; i++) {

                        var dRow = i == 0 ? $('<tr class="highlight"></tr>') : $('<tr></tr>');
                        var undergroundAreasRow = data.UndergroundAreas.sub[i];

                        dRow.append($('<td></td>').text(this._formatTextForSummary(undergroundAreasRow, "description")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "areaSize", 4)));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "areaPercent", 1)));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "floorSpace")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "areaChange", 4)));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(undergroundAreasRow, "floorSpaceChange")));

                        undergroundAreasTable.append(dRow);
                    }

                    container.append(undergroundAreasTable);
                }

                //Building conservation table
                if (data.BuildingConservations.sub != null &&
                        data.BuildingConservations.sub.length > data.BuildingConservations.main.length) {
                    var buildingConservationsTable = jQuery("<table class='bordered'></table>").addClass('buildingConservations');

                    var hRow = $('<tr></tr>');

                    hRow.append($('<th></th>').text(this.locale.planDetail.conservation.name));
                    hRow.append($('<th></th>').text(this.locale.planDetail.conservation.buildingCount));
                    hRow.append($('<th></th>').text(this.locale.planDetail.conservation.floorArea));
                    hRow.append($('<th></th>').text(this.locale.planDetail.conservation.changeCount));
                    hRow.append($('<th></th>').text(this.locale.planDetail.conservation.changeFloorSpace));

                    buildingConservationsTable.append(hRow);

                    for (var i = 0; i < data.BuildingConservations.sub.length; i++) {

                        var dRow = i == 0 ? $('<tr class="highlight"></tr>') : $('<tr></tr>');
                        var buildingConservationsRow = data.BuildingConservations.sub[i];

                        if(buildingConservationsRow.conservationTypeId === 3) {
                            continue;
                        }

                        dRow.append($('<td></td>').text(this._formatTextForSummary(buildingConservationsRow, "conservationTypeName")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "buildingCount")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "floorSpace")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "changeCount")));
                        dRow.append($('<td class="number"></td>').text(this._formatTextForSummary(buildingConservationsRow, "changeFloorSpace")));

                        buildingConservationsTable.append(dRow);
                    }

                    container.append(buildingConservationsTable);
                }

            }

            if (summary) {
                //Footer
                var footer = jQuery(this.template.footer);

                footer.append('<br /><div class="urbanPlanDetailHeader">' + this.locale.planDetail.summaryHeader + '</div>');

                var tableElement = jQuery(this.template.summaryElementsTable);

                var sortedSummary = summaryElements.sort(this._getPropertyComparer(['approvalDate', 'proposalDate', 'initialDate', 'fillDate'], true));

                for (i = 0; i < sortedSummary.length; i++) {

                    var dRow = $('<tr></tr>');
                    var summaryRow = sortedSummary[i];

                    dRow.append($('<td></td>').text(this._formatTextForSummary(summaryRow, "municipality")));
                    dRow.append($('<td></td>').text(this._formatTextForSummary(summaryRow, "name")));
                    dRow.append($('<td></td>').text(this._formatTextForSummary(summaryRow, "municipalityPlanId")));
                    dRow.append($('<td></td>').text(this._formatTextForSummary(summaryRow, "generatedPlanId")));
                    dRow.append($('<td></td>').html(this._formatDate(summaryRow, "approvalDate")));

                    tableElement.append(dRow);
                }

                footer.append(tableElement);
                container.append(footer);
            }
            var disclaimer = jQuery(this.template.disclaimer);
            container.append(disclaimer);

            return container;
        },
        _getPropertyComparer: function (props, isDesc) {
            var actualFactor = isDesc ? -1 : 1;

            var propDescComparer = function (propName, factor) {
                return function (a, b) {
                    if(a[propName] === b[propName]) 
                        return 0;
                    
                    if(a[propName] === null) 
                        return -1 * factor;

                    if(b[propName] === null) 
                        return 1 * factor;

                    return ((a[propName] > b[propName]) ? 1 * factor : -1 * factor);
                }
            };

            var comparer = function (a, b) {
                for (var ix = 0; ix < props.length; ix++) {
                    var value = propDescComparer(props[ix], actualFactor)(a, b);
                    if (value != 0)
                        return value;
                }
                return 0;
            };

            return comparer;
        },
        _getOnScreenForm: function () {
            return jQuery('div.myplacescategoryform');
        },

        _formatDataForSummary: function (data, label, key, decimalsNumber) {
            var value = "&nbsp;";
            if (data[key] != null && data[key] !== "") {
                value = typeof data[key] == 'number' ?
                    this._formatNumberForSummary(data[key], decimalsNumber) :
                    data[key] + "";
            }
            return "<span><dt>" + label + "</dt><dd>" + value + "</dd></span>";
        },

        _formatTextForSummary: function(data, key, decimalsNumber) {
            var value = "";
            if (data[key] != null) {
                value = typeof data[key] == 'number' ?
                    this._formatNumberForSummary(data[key], decimalsNumber) :
                    data[key] + "";
            }
            return value;
        },
        _formatDateForSummary: function (data, label, key) {
            var value = this._formatDate(data, key);        
            return "<span><dt>" + label + "</dt><dd>" + value + "</dd></span>";
        },
        _formatNumberForSummary: function(inputValue, decimalsNumber) {
            var outputValue = "",
            decimalSeparator = ",";

            if (decimalsNumber) {
                outputValue = inputValue.toFixed(decimalsNumber);
            } else {
                outputValue = inputValue + "";
            }

            return outputValue.replace(".", decimalSeparator);
        },
        _formatDate: function (data, key) {
            var value = "&nbsp;";
            if (data[key] != null && data[key] !== "") {
                var date = new Date(data[key]);
                if (date != 'Invalid Date') {
                    value = $.datepicker.formatDate("d.m.yy", date);
                }
            }
            return value;
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
