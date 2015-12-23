Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanPeopleDetailsForm",
    function (instance, baseView) {
        this.view = baseView;
        this.instance = instance;
        this.locale = instance.getLocalization('view');
        this.container = null;
        this.dataTable = null;
        this.templates = {
            'peopleTable': '<table id="urbanPlansPeopleFilterTable" class="display" cellspacing="0" width="100%"><thead><tr>' +
                '<th>' + this.locale.peopletable.municipalityId + '</th>' +
                '<th>' + this.locale.peopletable.municipalityName + '</th>' +
                '<th>' + this.locale.peopletable.vat + '</th>' +
                '<th>' + this.locale.peopletable.companyName + '</th>' +
                '<th>' + this.locale.peopletable.office + '</th>' +
                '<th>' + this.locale.peopletable.personName + '</th>' +
                '<th>' + this.locale.peopletable.address + '</th>' +
                //'<th>' + this.locale.peopletable.city + '</th>' +
                //'<th>' + this.locale.peopletable.postAddress + '</th>' +
                '<th>' + this.locale.peopletable.email + '</th>' +
                '<th>' + this.locale.peopletable.phone + '</th>' +
                '<th>' + this.locale.peopletable.fax + '</th>' +
                '<th>' + this.locale.peopletable.consultAuthorized + '</th>' +
                '</tr></thead><tbody></tbody></table>',
            'tableDisclaimer' : '<div class="disclaimer">Kunnat, aluearkkitehdit ja kaavoituskonsultit tallentavat asemakaavan seurantalomakkeen tiedot TYVI-operaattorilla. Asemakaavan seurantalomakkeen käyttäjätiedot kopioituvat TYVI-operaattorilta. Henkilötietoja saa käyttää vain maankäyttö- ja rakennuslain mukaisten lakisääteisten tehtävien hoitamisessa. Lisätietoja henkilötietolain <a target="_blank" href="http://www.ym.fi/fi-FI/Ministerio/Yhteystiedot_ja_asiointi/Rekisteriselosteet%2831531%29">rekisteriselosteesta.</a></div>'
        };
    }, {
        getForm: function() {
            if (this.container == null) {
                this.container = this._createUI();
            }
            return this.container;
        },

        _createUI: function () {
            var me = this;
            var peopleList = jQuery(
                "<div id='urbanPlansPeopleList' class='listContainer'></div>");
            var listHeader = jQuery("<div class='urbanPlansHeader'>" +
                this.locale.peopletable.title.default + "</div>");
            var buttons = jQuery("<div></div>");

            peopleList.append(listHeader);
            peopleList.append(buttons);

            this._preparePeopleRightTableElement(peopleList);
            return peopleList;
        },
        _preparePeopleRightTableElement: function (container) {
            var me = this;
            var tableElement = jQuery(this.templates.peopleTable);
            var height;
            var dataTable;

            container.append(tableElement);
            var tableDisclaimerElement = jQuery(me.templates.tableDisclaimer);
            container.append(tableDisclaimerElement);

            height = $("#contentMap").height() - $("#menutoolbar").height() - 250;
            console.log('height is ' + height);
            dataTable = tableElement.DataTable({
                "ajax": {
                    "url": this.instance.service.urls.peopleInitial, //prevent loading data on start
                    "dataSrc": ""
                },
                "deferRender": true,
                "columns": [
                    { "data": "municipalityId" },
                    { "data": "municipalityName" },
                    { "data": "vatNumber" },
                    { "data": "organizationName" },
                    { "data": "office" },
                    { "data": "personName" },
                    { "data": "address" },
                    { "data": "email" },
                    { "data": "phone" },
                    { "data": "fax" },
                    { "data": "consultAuthorized" }
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            if (data === true) {
                                return me.locale.peopletable['true'];
                            } else if (data === false) {
                                return me.locale.peopletable['false'];
                            } else {
                                return "";
                            }
                        },
                        "targets": [10] //"consultAuthorized"
                    },
                    {
                        "render": function (data, type, row) {
                          return ("000" + data).slice(-3);
                        },
                        "targets": [0] // "municipalityId"
                    }
                ],
                "language" : {
                    "url":
                        this.view.datatableLocaleLocation +
                        this.locale.datatablelanguagefile,
                    "sThousands": ""
                },
                
                "scrollY": height + "px",
                "scrollX": true,
                "scrollCollapse": true,
                "paging": true,
                "processing": true,
                "initComplete": function (settings, json) {
                    $('#urbanPlansPeopleFilterTable_filter input').attr("placeholder", me.locale.table.searchPlaceHolder);
                    $('#urbanPlansPeopleFilterTable_filter input').unbind();
                    $('#urbanPlansPeopleFilterTable_filter input').bind('keyup', function (e) {
                        if (e.keyCode == 13 || (this.value != null && (this.value.length > 2 || this.value.length == 0))) {
                            dataTable.search(this.value).draw();
                        }
                    });
                },
                "order": [[1, "asc"], [3, "asc"], [4, "asc"], [5, "asc"]],
                "autoWidth": true,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Kaikki"]]
            });

            this.view.peopleDataTable = dataTable;
            this.dataTable = dataTable;
        },
        onFilterChanged : function(filter) {
            var me = this;
            var url = me.instance.service.urls.people(filter.personType, filter.ely, filter.municipality, filter.search, filter.authorizedOnly);
            me.dataTable.ajax.url(url).load(function () {
                me.dataTable.search('');                
                var show = filter.personType == 'MunicipalityContact' ? true : false;
                me.dataTable.column(0).visible(show);
                me.dataTable.column(1).visible(show);
                me.dataTable.column(2).visible(!show);
                me.dataTable.column(3).visible(!show);
                me.dataTable.column(10).visible(show);

                me.dataTable.columns.adjust().draw();
            });
        },
    });
