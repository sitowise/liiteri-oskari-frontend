

/**
 * @class Oskari.framework.bundle.admin-layerrights.Flyout
 *
 * Renders the layer rights management flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layerrights.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance}
     *        instance reference to component that created the tile
     */
    function (instance, locale) {
        "use strict";
        var me = this;
        me.instance = instance;
        me.locale = locale;
        me.container = null;
        me.state = null;
        me.template = null;
        me.columns = null;
        me.cleanData = null;
        me.activeRole = null;
        me.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me.dataTable = null;
        me.datatableLocaleLocation = Oskari.getSandbox().getService('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService').getDataTablesLocaleLocation() + locale.datatablelanguagefile;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName : function () {
            "use strict";
            return 'Oskari.framework.bundle.admin-layerrights.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl : function (el, width, height) {
            "use strict";
            this.container = el[0];
            if (!jQuery(this.container).hasClass('admin-layerrights')) {
                jQuery(this.container).addClass('admin-layerrights');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin : function () {
            "use strict";

            this.template = jQuery(
                '<div class="admin-layerrights">\n' +
                    '   <form method="post" id="admin-layerrights-form">' +
                    '       <div class="header-container">' +
                    '          <label><span></span>' +
                    '               <select class="admin-layerrights-role"></select>\n' +
                    '          </label>' +
                    '          <div class="controls"></div>' +
                    '       </div>' +
                    /*
                    '       <label for="admin-layerrights-theme">Theme</label>' +
                    '       <select id="admin-layerrights-theme"></select>\n' +
                    '       <label for="admin-layerrights-dataprovidere">Data provider</label>' +
                    '       <select id="admin-layerrights-dataprovider"></select>\n' +*/
                    '       <div class="admin-layerrights-layers">' +
                    '       </div>' +                    
                    '   </form>' +
                    '</div>\n'
            );
            var rightsLoc = this.instance._localization.rights,
                elParent;
            this.columns = [
                {id: "name", "name": rightsLoc.name},
                {id: "isSelected", "name": rightsLoc.rightToPublish},
                {id: "isViewSelected", "name": rightsLoc.rightToView},
                {id: "isDownloadSelected", "name": rightsLoc.rightToDownload},
                {id: "isViewPublishedSelected", "name": rightsLoc.rightToPublishView}
            ];

            elParent = this.container.parentElement.parentElement;
            jQuery(elParent).addClass('admin-layerrights-flyout');
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin : function () {
            "use strict";
        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle : function () {
            "use strict";
            return this.instance.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription : function () {
            "use strict";
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions : function () {
            "use strict";
        },

        /**
         * @method setState
         * @param {Object} state
         */
        setState : function (state) {
            "use strict";
            this.state = state;
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState : function () {
            "use strict";
            if (!this.state) {
                return {};
            }
            return this.state;
        },
        /**
        * @method doSave
        * Save layer rights
        */
        doSave : function () {
            "use strict";
            var me = this,
                selections = me.extractSelections(),
                saveData = {"resource" : JSON.stringify(selections)},
                rightsLoc = this.instance._localization.rights,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            me.progressSpinner.start();
            jQuery.ajax({
                type: 'POST',
                url: ajaxUrl + 'action_route=SaveLayerPermission',
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),               
                data: saveData,
                success: function (response) {
                    if (response && response.error) {
                        me.instance.showMessage(me.instance.getLocalization('error').title, me.instance.getLocalization('error')[response.error] || response.error);
                    } else {
                        me.instance.showMessage(me.instance.getLocalization('info').title, me.instance.getLocalization('info').success);
                    }
                    me.updatePermissionsTable(me.activeRole, "ROLE");
                    me.progressSpinner.stop();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var errorLoc = me.instance.getLocalization('error');
                    me.instance.showMessage(errorLoc.title, errorLoc[errorThrown] || errorLoc.defaultErrorMessage);
                    me.progressSpinner.stop();
                }
            });
        },

        /**
         * @method setContent
         * Creates the UI for a fresh start
         * @param {String} content
         */
        setContent : function (content) {
            "use strict";
            // TODO add filters (provider/theme etc.)
            var me = this,
                flyout = jQuery(this.container),
                container = this.template.clone(),
                button = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                controls = container.find('div.controls'),
                roleSelectLabel = container.find('label > span'),
                roleSelect = container.find('select.admin-layerrights-role');

            flyout.empty();
            button.setTitle(me.instance.getLocalization('save'));

            button.setHandler(
                function () {
                    me.doSave();
                }
            );
            // Not sure if we want save on enter
            //field.bindEnterKey(doSave);

            controls.append(button.getElement());

            roleSelectLabel.html(this.instance.getLocalization('selectRole'));
            container.append(content);

            roleSelect.change(function (event) {
                me.activeRole = jQuery(event.currentTarget).val();
                me.updatePermissionsTable(me.activeRole, "ROLE");
            });

            flyout.append(container);
            // We're only supporting ROLE ATM, USER support might be added later
            me.getExternalIdsAjaxRequest("ROLE", 0);

            /* progress */
            this.progressSpinner.insertTo(container);
        },
        createLayerRightGrid2: function (columnHeaders) {
            var table = '<table class="layer-rights-table stripe hover row-border" width="100%">';
            table += "<thead><tr>";
            for (i = 0; i < columnHeaders.length; i += 1) {
                if (i == 0) {
                    table += '<th class="layer-name">' + columnHeaders[i].name + '</th>';
                } else {
                    table += '<th>';
                    table += columnHeaders[i].name;
                    table += '<br /><input name="layer-rights-table-select-all-' + this.columns[i].id + '" value="1" id="layer-rights-table-select-all-' + this.columns[i].id + '" type="checkbox">';
                    table += '</th>';
                }

        handleRoleChange: function (role, operation) {
            var me = this,
                select = jQuery(this.container).find('select.admin-layerrights-role'),
                option = select.find('option[value=' + role.id +']');

            if (operation == 'remove') { 
                option.remove(); 
            } 
            if (operation == 'update') { 
                option.html(role.name); 
            }
            if (operation == 'add') {
                select.append("<option value=" + role.id +">" + role.name + "</option>");
            } 
        },

        /**
         * @method createLayerRightGrid
         * Creates the permissions table as a String
         * @param {Array} columnHeaders
         * @param {Object} layerRightsJSON
         * @return {String} Permissions table
         */
        createLayerRightGrid: function (columnHeaders, layerRightsJSON) {
            "use strict";
            var table = '<table class="layer-rights-table">',
                i = 0,
                tr = 0,
                layerRight = null,
                header = null,
                value = null;

            table += "<thead><tr>";
            for (i  = 0; i < columnHeaders.length; i += 1) {
                table += '<th>' + columnHeaders[i].name + '</th>';
            }
            table += '</tr></thead>';

            table += "<tbody>";
            table += "</tbody>";
            table += "</table>";

                table += "<tr>";

                // lets loop through header
                for (i = 0; i < columnHeaders.length; i += 1) {
                    header = columnHeaders[i];
                    //select input value based on arrangement of header columns
                    value = layerRight[header.id];
                    var tooltip = header.name;

                    if (header.id === 'name') {
                        if(layer) {
                            tooltip = layer.getLayerType() + '/' + layer.getInspireName() + '/' + layer.getOrganizationName();
                            //value = '<div class="layer-icon ' + layer.getIconClassname() + '"></div> ' + value;
                        }
                        table += '<td><span class="layer-name" data-resource="' + layerRight.resourceName + 
                            '" data-namespace="' + layerRight.namespace + 
                            '" title="' + tooltip + 
                            '">' + value + '</span></td>';
                    } else if (value) {
                        table += '<td><input type="checkbox" checked="checked" data-right="' + header.id + '" title="' + tooltip + '" /></td>';
                    } else {
                        table += '<td><input type="checkbox" data-right="' + header.id + '" title="' + tooltip + '" /></td>';
                    }
                }

                table += "</tr>";
            }
            table += "</tbody></table>";
            return table;
        },
        /**
         * @method extractSelections
         * Returns dirty table rows as JSON
         * @return {Object} Dirty table rows
         */
        extractSelections : function () {
            "use strict";
            var me = this,
                data = [],
                container = jQuery(me.container),
                trs = me.dataTable.$("tr"),
                i = 0,
                j = 0,
                dataObj = null,
                cleanDataObj = null,
                tr = null,
                tdName = null,
                tds = null,
                td = null,
                right = null,
                value = null,
                dirty = false;
            for (i = 0; i < trs.length; i += 1) {
                // TODO check if data has changed on this row before adding to output
                dirty = false;                
                dataObj = {};
                tr = jQuery(trs[i]);
                tdName = tr.find('td span');
                tds = tr.find('td input');
                dataObj.name            = tdName.text();
                dataObj.resourceName    = tdName.attr('data-resource');
                dataObj.namespace = tdName.attr('data-namespace');
                dataObj.id = tdName.attr('data-layer-id');
                dataObj.roleId = me.activeRole;
                cleanDataObj = me.cleanData[dataObj.id];

                for (j = 0; j < tds.length; j += 1) {
                    td = jQuery(tds[j]);
                    right = td.attr('data-right');
                    value = td.prop('checked');

                    if (cleanDataObj[right] !== value) {
                        //console.log("Dirty value on " + right + ": " + cleanDataObj[right] + " : " + value);
                        dirty = true;
                    }
                    dataObj[right] = value;
                }

                if (cleanDataObj.resourceName !== dataObj.resourceName) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                    //console.err("Resource name mismatch: " + cleanDataObj.resourceName + ", " + dataObj.resourceName);
                }

                if (cleanDataObj.namespace !== dataObj.namespace) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                    //console.err("Namespace mismatch: " + cleanDataObj.namespace + ", " + dataObj.namespace);
                }

                if (dirty) {
                    //console.log(dataObj);
                    data.push(dataObj);
                }
            }
            return data;
        },

        /**
         * @method updatePermissionsTable
         * Refreshes the permissions table with the given role and type
         * @param {String} activeRole
         * @param {String} externalType
         */
        updatePermissionsTable : function (activeRole, externalType) {
            "use strict";
            var me = this;
            me.progressSpinner.start();

            jQuery.getJSON(ajaxUrl, {
                action_route: "GetPermissionsLayerHandlers",
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                externalId: activeRole,
                dataType: 'json',
               //resourceType: "WMS_LAYER",
                externalType: externalType
            }, function (result) {
                me.progressSpinner.stop();
                // store unaltered data so we can do a dirty check on save
                me.cleanData = {};
                for (var j = 0; j < result.resource.length; j++) {
                    me.cleanData[result.resource[j].id] = result.resource[j];
                }

                var table = me.createLayerRightGrid2(me.columns);
                jQuery(me.container).find('.admin-layerrights-layers').empty().append(table);

                var dataTableColumns = [];
                for (var i = 0; i < me.columns.length; i++) {
                    var item = { "data": me.columns[i].id };
                    dataTableColumns.push(item);
                }
                me.dataTable = table.dataTable({
                    "data": result.resource,
                    "columns": dataTableColumns,
                    "dom": '<<"info-wrapper"if<"clearfix">><t>>',
                    "paging": false,
                    "scrollY": "auto",
                    "language": {
                        "url": me.datatableLocaleLocation,
                        "sThousands": ""
                    },
                    "columnDefs": [
                        {
                            "render": function (data, type, row, meta) {
                                var columnId = meta.col;
                                var id = me.columns[columnId].id;
                                var tooltip = "empty";
                                var inputx = data === true ?
                                    jQuery('<input type="checkbox" checked="checked" data-right="' + id + '" title="' + tooltip + '" />') :
                                    jQuery('<input type="checkbox" data-right="' + id + '" title="' + tooltip + '" />');
                                return inputx[0].outerHTML;
                            },
                            "className" : "dt-center",
                            "sortable" : false,
                            "targets": [1, 2, 3, 4],
                            "searchable" : false
                        },
                        {
                            "render": function (data, type, row, meta) {
                                var tooltip = "empty";
                                var inputx = jQuery('<span class="layer-name" data-resource="' + row.resourceName +
                                    '" data-layer-id="' + row.id +
                                    '" data-namespace="' + row.namespace +
                                    '" title="' + tooltip +
                                    '">' + data + '</span>');
                                return inputx[0].outerHTML;
                            },
                            "className": "dt-left",
                            "sortable": true,
                            "targets": [0],
                            "searchable": true
                        }                        
                    ]
                });

                //apply filter also to 'select all' checkboxes
                table.on('search.dt', function () {
                    for (var i = 1; i < me.columns.length; i++) {
                        var columnId = me.columns[i].id;
                        me._setSelectAllCheckbox(columnId, table);
                    }
                });

                for (var i = 1; i < me.columns.length; i++) {

                    var columnId = me.columns[i].id;

                    //handle click on 'select all' checkbox
                    $('#layer-rights-table-select-all-' + columnId).on('click', { columnId: columnId, table: table }, me._handleSelectAllCheckbox);

                    //handle change of a checkboxes in the column
                    table.on('change', 'input[type="checkbox"][data-right="' + columnId + '"]', { columnId: columnId, table: table, me: me }, me._handleDataRightCheckbox);

                    //set proper status in "select all" checkbox
                    me._setSelectAllCheckbox(columnId, table);
                }
            });
        },

        _handleSelectAllCheckbox: function(event) {
            var columnId = event.data.columnId,
                table = event.data.table,
                rows = table.DataTable().rows({ 'search': 'applied' }).nodes();
                        
            $('input[type="checkbox"][data-right="' + columnId + '"]', rows).prop('checked', this.checked);
        },

        _handleDataRightCheckbox: function(event) {
            var columnId = event.data.columnId,
                table = event.data.table,
                me = event.data.me;

            me._setSelectAllCheckbox(columnId, table);
        },

        /**
         * @method _setSelectAllCheckbox
         * 
         * Check if all checkboxes in the column are selected (take into account only visible elements after applied filter) 
         * and set proper status for the 'select all' checkbox
         */
        _setSelectAllCheckbox: function(columnId, table) {
            var selectAllCheckbox = $('#layer-rights-table-select-all-' + columnId).get(0),
                rows = table.DataTable().rows({ 'search': 'applied' }).nodes(),
                checkedElements = $('input:checked[type="checkbox"][data-right="' + columnId + '"]', rows);

            if (checkedElements.length == 0) {
                //no element is checked
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedElements.length < rows.length) {
                //some elements are checked
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            } else if (checkedElements.length == rows.length) {
                //all elements are checked
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            }
        },

        /**
         * @method getExternalIdsAjaxRequest
         * Retrieves permissions data for the given type and role
         * @param {String} externalType
         * @param {String} selectedId
         */
        getExternalIdsAjaxRequest : function (externalType, selectedId) {
            "use strict";
            var me = this;

            //ajaxRequestGoing = true;
            // TODO add error handling
            jQuery.getJSON(ajaxUrl, {
                action_route: "GetAllRoles",
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                getExternalIds: externalType
            }, function (result) {
                me.makeExternalIdsSelect(result, externalType, selectedId);
            });
        },

        /**
         * @param (Object) result
         * @param {String} externalType
         * @param {String} selectedId
         */
        makeExternalIdsSelect : function (result, externalType, selectedId) {
            "use strict";
            var externalIdSelect = jQuery(this.container).find("select.admin-layerrights-role"),
                a,
                d;
            externalIdSelect.html("");
            if (externalType !== "0") {
                if (selectedId !== "0") {
                    a = '<option value="0" >-- Valitse tunniste --</option>';
                } else {
                    a = '<option value="0" selected="selected">-- Valitse tunniste --</option>';
                }
                for (d = 0; d < result.external.length; d += 1) {
                    if (result.external[d].id === selectedId) {
                        a += '<option selected="selected" value="' + result.external[d].id + '">' + result.external[d].name + "</option>";
                    } else {
                        a += '<option value="' + result.external[d].id + '">' + result.external[d].name + "</option>";
                    }
                }
                externalIdSelect.html(a);
            } else {
                externalIdSelect.html("");
            }
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol' : ['Oskari.userinterface.Flyout']
    });