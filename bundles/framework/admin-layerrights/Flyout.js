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
        me.cleanData = null;
        me.activeRole = null;
        me.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me.dataTable = null;
        me.datatableLocaleLocation = Oskari.getSandbox().getService('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService').getDataTablesLocaleLocation() + locale.datatablelanguagefile;
        me._templates = {
            table: jQuery('<table class="layer-rights-table"><thead></thead><tbody></tbody></table>'),
            cellTh: jQuery('<th></th>'),
            cellTd: jQuery('<td></td>'),
            row: jQuery('<tr></tr>'),
            checkboxCtrl: jQuery('<input id="checkboxCtrl" type="checkbox" />'),
            checkBox: jQuery('<input type="checkbox" />'),
            name: jQuery('<span class="layer-name"></span>')
        };
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
                '       <label><span></span>' +
                '          <select class="admin-layerrights-role"></select>\n' +
                '       </label>' +
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
            var elParent = this.container.parentElement.parentElement;
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
                changedPermissions = me.extractSelections();

            me.progressSpinner.start();
            var chunks = this._createChunks(changedPermissions, 100);
            this._savePermissions(chunks, function(errors) {
                me.progressSpinner.stop();
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var rightsLoc = me.instance._localization.rights;

                var changedLayers = me._collectResponseMessages( changedPermissions );

                if (errors.length) {
                    var errorLayers = me._collectResponseMessages( errors );
                    // TODO: append layers that couldn't be updated to dialog message
                    dialog.show(rightsLoc.error.title, rightsLoc.error.message + " " + errorLayers);
                }

                dialog.show(rightsLoc.success.title, rightsLoc.success.message + '</br>' + changedLayers);
                dialog.fadeout(3000);
                me.updatePermissionsTable(me.activeRole, "ROLE");
            }, []);
        },
        _collectResponseMessages: function( responseItems ) {
          var responseArray = [];
          jQuery.each( responseItems, function( index ) {
              if ( !_.contains( responseArray, responseItems[index].name ) ) {
                  responseArray.push( responseItems[index].name );
                }
            });
          return responseArray;
        },
        /**
         * Split list into chunks of given size
         * @param  {Array} list
         * @param  {Number} size
         * @return {Array} array containing list as chunks
         */
        _createChunks: function(list, size) {
            var result = [];
            var chunksCount = Math.ceil(list.length / size);
            for (var i = 0; i < chunksCount; ++i) {
                var end = i + size;
                if (end >= list.length) {
                    end = list.length;
                }
                var chunk = list.slice(i, end);
                result.push(chunk);
            }
            return result;
        },
        _savePermissions: function(chunks, done, errors) {
            if (!chunks.length) {
                done(errors);
                return;
            }
            var me = this;
            var currentChunk = chunks.shift();
            var saveData = {
                "resource": JSON.stringify(currentChunk)
            };
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
                    me._savePermissions(chunks, done, errors);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var errorLoc = me.instance.getLocalization('error');
                    me.instance.showMessage(errorLoc.title, errorLoc[errorThrown] || errorLoc.defaultErrorMessage);
                    errors.push(currentChunk);
                    me._savePermissions(chunks, done, errors);
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
            if (operation == 'update') {
                option.text(role.name);
            }
            table += "</tr></thead>";
            table += "<tbody>";
            table += "</tbody>";
            table += "</table>";

            return jQuery(table);
        },

        /**
         * @method createLayerRightGrid
         * Creates the permissions table as a String
         * @param {Object} layerRightsJSON
         * @return {String} Permissions table
         */
        createLayerRightGrid: function(layerRightsJSON) {
            "use strict";
            var me = this,
                table = me._templates.table.clone(),
                thead = table.find('thead'),
                tbody = table.find('tbody'),
                service = this.instance.getSandbox().getService('Oskari.mapframework.service.MapLayerService'),
                headerRow = me._templates.row.clone(),
                controlRow = me._templates.row.clone(),
                controlCell,
                checkboxes,
                columnsLoc = this.instance.getLocalization('rights');

                controlRow.addClass("control");


            // Create headers
                var thCell = me._templates.cellTh.clone();
            thCell.html(columnsLoc.name);
                headerRow.append(thCell);

            jQuery.each(layerRightsJSON[0].permissions, function(index, header) {
                var thCell = me._templates.cellTh.clone();
                var tdCell = me._templates.cellTd.clone();
                var checkboxCtrl = me._templates.checkboxCtrl.clone();
                var headerName = header.name;
                if (typeof columnsLoc[header.name] !== 'undefined') {
                    headerName = columnsLoc[header.name];
                }
                checkboxCtrl.addClass(header.name);
                tdCell.append(checkboxCtrl);
                thCell.html(headerName);
                controlRow.append(tdCell);
                headerRow.append(thCell);
            });
            thead.append(headerRow);
            thead.append(controlRow);


            // Create rows
            jQuery.each(layerRightsJSON, function(index, layerRight) {
                var layer = service.findMapLayer(layerRight.id),
                    dataRow = me._templates.row.clone(),
                    cell = null,
                    tooltip = null,
                    dataCell = me._templates.cellTd.clone();

                        if(layer) {
                            tooltip = layer.getLayerType() + '/' + layer.getInspireName() + '/' + layer.getOrganizationName();
                        }

                        cell = me._templates.name.clone();
                        cell.attr('data-resource', layerRight.resourceName);
                        cell.attr('data-namespace', layerRight.namespace);
                cell.text(Oskari.util.sanitize(layerRight.name));
                dataCell.append(cell);
                dataRow.append(dataCell);

                // lets loop through permissions
                jQuery.each(layerRight.permissions, function(index, permission) {
                    var allow = permission.allow,
                        tooltip = permission.name,
                        dataCell = me._templates.cellTd.clone();

                        cell = me._templates.checkBox.clone();
                    cell.attr('data-right', permission.id);
                    cell.addClass(permission.name);
                    if (allow === true) {
                            cell.attr('checked', 'checked');
                        }

                    cell.attr('title', tooltip);

                    dataCell.append(cell);
                    dataRow.append(dataCell);

                });
                tbody.append(dataRow);

            });
            me.togglePermissionsColumn(thead, tbody);

            return table;
        },
        togglePermissionsColumn: function(thead, tbody) {
         var controlCell = thead.find('#checkboxCtrl');
         controlCell.change(function() {
           var checkboxes = tbody.find('input.'+ this.className);
             checkboxes.prop('checked', !checkboxes.prop('checked'));
         });
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
                tds = tr.find('td input').not('input.checkboxCtrl');
                dataObj.name            = tdName.text();
                dataObj.resourceName    = tdName.attr('data-resource');
                dataObj.namespace = tdName.attr('data-namespace');
                dataObj.id = tdName.attr('data-layer-id');
                dataObj.roleId = me.activeRole;
                dataObj.permissions = [];
                cleanDataObj = me.cleanData[dataObj.id];

                for (j = 0; j < tds.length; j += 1) {
                    td = jQuery(tds[j]);
                    right = td.attr('data-right');
                    value = td.prop('checked');

                    if (cleanDataObj[right] !== value) {
                        dirty = true;
                    }
                    dataObj.permissions.push({
                        key: right,
                        value: value
                    });
                }

                if (cleanDataObj.resourceName !== dataObj.resourceName) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                }

                if (cleanDataObj.namespace !== dataObj.namespace) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                }

                if (dirty) {
                    data.push(dataObj);
                }
            }
            var changedData = this.getChangedValues(me.cleanData, data);

            return changedData;
        },
        getChangedValues: function(arrayClean, arrayDirty) {
            var changedvalues = [];
            for (var i = 0; i < arrayClean.length; i++) {
                for (var j = 0; j < arrayClean[0].permissions.length; j++) {
                    if (arrayClean[i].permissions[j].allow !== arrayDirty[i].permissions[j].value) {
                        if (!_.contains(changedvalues, arrayDirty[i])) {
                            changedvalues.push(arrayDirty[i]);
                        }
                    }
                }
            }
            return changedvalues;
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
                var mappedResult = me.mapResult(result);
                // store unaltered data so we can do a dirty check on save
                me.cleanData = mappedResult;
                var table = me.createLayerRightGrid(mappedResult);
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
        /**
         * Maps names for permissions
         * @param  {Object} result response from GetPermissionsLayerHandlers
         * @return {Object[]}    resource array of response with populated permission names
         */
        mapResult: function(result) {
            //result.names = [id : VIEW_LAYER, name : 'ui name'];
            //result.resource = [{permissions : [{id : VIEW_LAYER, name : "populate"}]}]
            var nameMapper = {};
            result.names.forEach(function(item) {
                // for whatever reason...
                if (item.id === 'VIEW_LAYER') {
                    item.name = 'rightToView';
                } else if (item.id === 'VIEW_PUBLISHED') {
                    item.name = 'rightToPublishView';
                } else if (item.id === 'PUBLISH') {
                    item.name = 'rightToPublish';
                } else if (item.id === 'DOWNLOAD') {
                    item.name = 'rightToDownload';
                }
                nameMapper[item.id] = item.name;
            });

            var mapped = [];
            result.resource.forEach(function(resource) {
                resource.permissions.forEach(function(permission) {
                    if (permission.name) {
                        return;
                    }
                    permission["name"] = nameMapper[permission.id] || permission.id;
                });
                mapped.push(resource);
            });
            return mapped;
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
                optionEl,
                d,
                rightsLoc = this.instance._localization.rights;

            externalIdSelect.html("");
            if (externalType !== "0") {
                optionEl = document.createElement('option');
                optionEl.value = "0";
                optionEl.textContent = '-- ' + rightsLoc.selectValue + ' --';
                if (selectedId == "0") {
                    optionEl.setAttribute('selected', 'selected');
                }
                externalIdSelect.append(optionEl);
                for (d = 0; d < result.external.length; d += 1) {
                  optionEl = document.createElement('option');
                  optionEl.value = result.external[d].id;
                  optionEl.textContent = result.external[d].name;
                    if (result.external[d].id === selectedId) {
                        optionEl.setAttribute('selected', 'selected');
                    }
                  externalIdSelect.append(optionEl);
                }
            }
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol' : ['Oskari.userinterface.Flyout']
    });
