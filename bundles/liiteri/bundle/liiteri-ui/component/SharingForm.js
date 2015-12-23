Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.component.SharingForm',

    function (loc, options) {
        this.defaultLoc = {
            "delete": "Delete",
            "email": "Share by email",
            "user": "Share to user",
            "role": "Share to role",
            "columns" : {
                    'credentialId': "Id",
                    'permissionId': "Permission",
                    'name': "Name",
                    'type': "Type",
                    'email': "Email",
                    'status': "Status",
                    'operations' : "Operations"
                }
            },
        this.loc = $.extend(this.defaultLoc, loc);
        this.templates = {
            "forms": '<div class="form-inline">' +
                        '<div class="form-group email-group oskarifield"><label>' + this.loc.email + '</label><p class="input-group">' +
                        '<input type="email" id="email" class="form-control input-sm" placeholder="' + this.loc.email + '">' +
                        '<span class="input-group-btn">' +
                            '<button class="btn btn-default btn-sm"><i class="glyphicon glyphicon-plus"></i></button>' +
                        '</span>' +
                      '</p></div>' +
                      '<br/>' +
                      '<div class="form-group role-group oskarifield"><label>' + this.loc.role + '</label><p class="input-group">' +
                        '<select class="form-control input-sm" name="roles" id="roles"></select>' +
                        '<span class="input-group-btn">' +
                            '<button class="btn btn-default btn-sm"><i class="glyphicon glyphicon-plus"></i></button>' +
                        '</span>' +
                      '</p></div>' +
                      '</div>'
        }
        this.defaultOptions = {
            "addEmail": true,
            "addUser": true,
            "addRole": true,
            "visibleFields": ['permissionId', 'credentialId', 'name', 'email', 'type', 'status', 'operations']
        };
        this.options = $.extend(this.defaultOptions, options);
        var container = null;        
        this.title = null;
        this.content = null;
        this.html = "";
        this.categoriesDict = {};
        this.categories = [];
        this.dialogMode = false;
        this.dialog = null;

        this._createUI();
    }, {
        _createUI: function () {
            var me = this;            
            this.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
            this.gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            this.container = jQuery('<div class="sharingContainer"></div>');
            this.gridContainer = jQuery('<div class="gridSharingContainer"></div>');

            var formsContainer = jQuery(this.templates.forms);
            if (!this.options.addEmail) {
                formsContainer.find(".email-group").empty();
            } else {
                formsContainer.find(".email-group").find("button").click(function (e) {
                    var input = formsContainer.find(".email-group").find("input#email");
                    var value = input.val();
                    input.val('');
                    me._addRow({
                        'credentialId': 0,
                        'type': "user",
                        'email': value,
                        'status': "new",
                    });
                    me._redraw();
                });
            }
            
            if (!this.options.addRole) {
                formsContainer.find(".role-group").empty();
            } else {
                formsContainer.find(".role-group").find("button").click(function (e) {
                    var input = formsContainer.find(".role-group").find("select");
                    var value = input.val();
                    var name = input.find(":selected").text();
                    input.val('');
                    me._addRow({
                        'credentialId': value,
                        'type': "role",
                        'name': name,
                        'status': "new",
                    });
                    me._redraw();
                });
            }

            this.container.append(formsContainer);            

            this.gridModel.setIdField('row');
            this.grid.setDataModel(this.gridModel);
            this.grid.setVisibleFields(this.options.visibleFields);
            this.grid.setColumnValueRenderer('operations', function (id, data) {
                var container = jQuery('<div class="text-center"></div>');
                var deleteLink = jQuery('<a class="removeLink glyphicon glyphicon-remove-sign"></a>');
                deleteLink.click(function (e) {
                    me.gridModel.removeData(data);
                    me._redraw();
                });
                container.append(deleteLink);
                return container;
            });

            this.grid.setColumnUIName('credentialId', this.loc.columns.credentialId);
            this.grid.setColumnUIName('permissionId', this.loc.columns.permissionId);
            this.grid.setColumnUIName('name', this.loc.columns.name);
            this.grid.setColumnUIName('type', this.loc.columns.type);
            this.grid.setColumnUIName('email', this.loc.columns.email);
            this.grid.setColumnUIName('status', this.loc.columns.status);
            this.grid.setColumnUIName('operations', this.loc.columns.operations);

            this._redraw();

            this.container.append(this.gridContainer);
        },
        _addRow: function (data) {
            var length = this.gridModel.getData().length;
            var row = length == 0 ? 0 : this.gridModel.getData()[length - 1].row + 1;
            this.gridModel.addData({
                'row' : row,
                'credentialId': data.credentialId,
                'permissionId' : data.permissionId,
                'name': data.name,
                'type': data.type,
                'email': data.email,
                'status': data.status
            });
        },
        _redraw: function() {
            this.grid.renderTo(this.gridContainer);
        },
        setData: function(data) {
            for (var i = 0; i < data.length; i++) {
                this._addRow(data[i]);
            }
            this._redraw();
        },
        getData: function() {
            return this.gridModel.getData().slice();
        },
        setRoles: function (roles) {
            if (!this.options.addRole)
                return;

            var select = this.container.find(".role-group").find("select");
            for (var i=0;i<roles.length; i++) {
                var option = jQuery('<option></option>');
                option.attr('value', roles[i].id);
                option.append(roles[i].name);
                select.append(option);
            }
        },
        destroy: function () {
            this.container.remove();
        },
        insertTo: function (container) {
            container.append(this.container);
        }
    });