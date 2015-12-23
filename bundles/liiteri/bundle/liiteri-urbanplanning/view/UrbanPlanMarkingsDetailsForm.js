Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanMarkingsDetailsForm",
    function (instance, parent) {
        this.instance = instance;
        this.locale = instance.getLocalization('view');
        this.container = null;
        this.templates = {
            'markingsTable': '<table id="markings-table" class="display" cellspacing="0" width="100%"><thead><tr>' +
                '<th>' + this.locale.markingstable.municipalityid + '</th>' +
                '<th>' + this.locale.markingstable.municipalityname + '</th>' +
                '<th>mainmarkid</th>' +
                '<th>' + this.locale.markingstable.mainmarkname + '</th>' +
                '<th>' + this.locale.markingstable.name + '</th>' +
                '<th>' + this.locale.markingstable.description + '</th>' +
                '<th>order</th>' +
                '</tr></thead><tbody></tbody></table>',
                };
        this.parent = parent;
    }, {
        getForm: function() {
            if (this.container == null) {
                this.container = this._createUI();
            }
            return this.container;
        },
        _createUI: function() {
            var markingsList = jQuery(
                "<div id='urbanPlansMarkingsList' class='listContainer'></div>");

            var listHeader = jQuery(
                "<div class='urbanPlansHeader'>" +
                this.locale.markingstable.markings +
                "</div>");

            var markingsDescription = jQuery("<div/>", {
                    id: "markingsDescription",
                });
            listHeader.append(markingsDescription);

            markingsList.append(listHeader);

            var buttons = jQuery("<div></div>");

            markingsList.append(buttons);

            this._prepareMarkingsRightTableElement(markingsList);

            return markingsList;
        },
        _prepareMarkingsRightTableElement: function (container) {
            var me = this;
            var tableElement = jQuery(me.templates.markingsTable);
            container.append(tableElement);
            var height = $("#contentMap").height() - $("#menutoolbar").height() - 200;
            var dataTable = tableElement.DataTable({
                "ajax": {
                    "url": this.instance.service.urls.markingsInitial,
                    "dataSrc": "",
                },
                "deferRender": true,
                "columns": [
                    { "data": "municipalityId", "defaultContent": "" },
                    { "data": "municipalityName", "defaultContent": "" },
                    //FIXME: the way to put rows without value at the end
                    { "data": "mainMarkId", "defaultContent": Number.MAX_VALUE, "visible": false },
                    { "data": "mainMarkName", "defaultContent": "ma" },
                    { "data": "name" },
                    { "data": "description" },
                    { "data": "order", "defaultContent": "", "visible": false }
                ],
                "language" : {
                    "url":
                        this.parent.datatableLocaleLocation +
                        this.locale.datatablelanguagefile,
                    "sThousands": ""
                },
                "scrollY": height + "px",
                "scrollX": true,
                "scrollCollapse": true,
                "paging": true,
                "processing": true,
                "initComplete": function (settings, json) {
                    $('#markings-table_filter input').attr("placeholder", me.locale.table.searchPlaceHolder);
                    $('#markings-table_filter input').unbind();
                    $('#markings-table_filter input').bind('keyup', function (e) {
                        if (e.keyCode == 13 || (this.value != null && (this.value.length > 2 || this.value.length == 0))) {
                            dataTable.search(this.value).draw();
                        }
                    });
                },
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Kaikki"]],                
                "autoWidth": true,
                "columnDefs" : [ {
                    "render" : function(data, type, row) {
                        return ("000" + data).slice(-3);
                    },
                    "targets" : [ 0 ] // "municipalityId"
                } ]
            });

            this.parent.markingsDataTable = dataTable;
        }
    });