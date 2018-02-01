define([
        'text!_bundle/templates/adminTypeSelectTemplate.html',
        'text!_bundle/templates/adminLayerSettingsTemplate.html',
        'text!_bundle/templates/adminGroupSettingsTemplate.html',
        'text!_bundle/templates/group/subLayerTemplate.html',
        'text!_bundle/templates/capabilitiesTemplate.html',
        'text!_bundle/templates/layersWithErrorsPopupTemplate.html',
        '_bundle/collections/userRoleCollection',
        '_bundle/models/layerModel'
    ],
    function(
        TypeSelectTemplate,
        LayerSettingsTemplate,
        GroupSettingsTemplate,
        SubLayerTemplate,
        CapabilitiesTemplate,
        LayersWithErrorsPopupTemplate,
        userRoleCollection,
        layerModel
    ) {
        return Backbone.View.extend({
            tagName: 'div',
            className: 'admin-add-layer',

            /**
             * This object contains backbone event-handling.
             * It binds methods to certain events fired by different elements.
             *
             * @property events
             * @type {Object}
             */
            events: {
                'click .admin-add-layer-ok': 'addLayer',
                'click .admin-add-sublayer-ok': 'addLayer',
                'click .admin-add-layer-cancel': 'hideLayerSettings',
                'click .admin-remove-layer': 'removeLayer',
                'click .admin-remove-sublayer': 'removeLayer',
                'click .show-edit-layer': 'clickLayerSettings',
                'click .fetch-ws-button': 'fetchCapabilities',
                'click .add-dataprovider-button': 'addDataprovider',
                'click .import-wfs-style-button': 'importSldStyle',
                'click .save-wfs-style-button': 'saveSldStyle',
                'click .cancel-wfs-style-button': 'cancelSldStyle',
                'click .icon-close': 'clearInput',
                'change .admin-layer-type': 'createLayerSelect',
                'click .admin-add-group-ok': 'saveCollectionLayer',
                'click .admin-add-group-cancel': 'hideLayerSettings',
                'click .admin-remove-group': 'removeLayerCollection',
                'click .add-layer-record.capabilities li': 'handleCapabilitiesSelection',
                'change .admin-interface-version': 'handleInterfaceVersionChange',
                'change .admin-sld-styles': 'handleSldStylesChange',
                'change .admin-layer-legendUrl': 'handleLayerLegendUrlChange',
                'click .layer-capabilities.icon-info': 'showCapabilitiesPopup'
            },

            /**
             * Add dataprovider
             * @method addDataprovider
             */
            addDataprovider: function() {
                var me = this;
                var buttons = [];

                var popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                errorDialog.setId('admin-hierarchical-layerlist-group-error-popup');
                var btnCancel = Oskari.clazz.create('Oskari.userinterface.component.Button');
                btnCancel.setTitle(me.instance.locale('buttons.cancel'));
                btnCancel.addClass('cancel');
                btnCancel.setHandler(function() {
                    popup.close();
                    tool.removeClass('active');
                });
                buttons.push(btnCancel);
                var btnOk = Oskari.clazz.create('Oskari.userinterface.component.Button');
                buttons.push(btnOk);
                popup.addClass('admin-hierarchical-layerlist-group');

                var loc = (Oskari.getMsg('DivManazer', 'LanguageSelect').languages) ? Oskari.getMsg('DivManazer', 'LanguageSelect').languages : {};
                btnOk.addClass('add');
                btnOk.setTitle(me.instance.locale('buttons.add'));
                btnOk.setHandler(function() {
                    var data = {};
                    var hasValidLocales = true;
                    var localesCount = 0;
                    popup.getJqueryContent().find('.oskari-textinput.group-name').each(function() {
                        var el = jQuery(this);
                        localesCount++;
                        var value = el.find('input').val().trim();
                        data['name_' + el.attr('data-locale')] = value;
                        if (value.length < 4) {
                            hasValidLocales = false;
                            el.find('input').addClass('error');
                        } else {
                            el.find('input').removeClass('error');
                        }
                    });

                    if (localesCount === Oskari.getSupportedLanguages().length && hasValidLocales) {
                        me._saveDataprovider(data, popup);
                    } else {
                        errorDialog.show(me.instance.locale('errors.dataprovider.title'), me.instance.locale('errors.dataprovider.message'));
                        errorDialog.fadeout();
                    }

                });

                var message = jQuery('<div class="group-names"></div>');
                // locale inputs
                var supportedLocales = Oskari.getSupportedLanguages();
                supportedLocales.forEach(function(locale) {
                    var input = Oskari.clazz.create('Oskari.userinterface.component.TextInput');
                    input.setTitle(me.instance.locale('groupTitles.localePrefix') + ' ' + (loc[locale] || locale));
                    input.addClass('group-name');
                    var el = jQuery(input.getElement());
                    el.find('input').bind('keyup', function() {
                        var inputEl = jQuery(this);
                        var value = inputEl.val().trim();
                        if (value.length < 4) {
                            inputEl.addClass('error');
                        } else {
                            inputEl.removeClass('error');
                        }
                    });
                    el.attr('data-locale', locale);
                    message.append(el);
                });

                popup.show(me.instance.locale('groupTitles.addDataprovider'), message, buttons);
                popup.makeModal();
            },
            /**
             * Save dataprovider
             * @method  _saveDataprovider
             * @param   {Object}   data  data fo saving
             * @param   {Oskari.userinterface.component.Popup}   popup group adding/editing popup
             * @private
             */
            _saveDataprovider: function(data, popup) {
                var me = this;

                jQuery.ajax({
                    type: 'PUT',
                    url: me.instance.sandbox.getAjaxUrl('SaveOrganization'),
                    data: data,
                    error: function() {
                        var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        errorDialog.show(me.instance.locale('errors.dataproviderSave.title'), me.instance.locale('errors.dataproviderSave.message'));
                        errorDialog.fadeout();
                    },
                    success: function(response) {
                        popup.close();
                        var successDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        successDialog.show(me.instance.locale('succeeses.dataproviderSave.title'), me.instance.locale('succeeses.dataproviderSave.message'));
                        successDialog.fadeout();

                        jQuery('#select-dataprovider').append('<option value="' + response.id + '">' + Oskari.getLocalized(response.name) + '</option>');
                        jQuery('#select-dataprovider').val(response.id);
                    }
                });
            },

            showCapabilitiesPopup: function() {
                var caps = this.model.getCapabilities();
                if (!caps) {
                    return;
                }
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.addClass('admin-layerselector-capabilities-popup');
                // Show stringified JSON in textarea
                var content = jQuery('<textarea></textarea>').append(JSON.stringify(caps, null, 2));
                var title = this.options.instance.locale('admin.capabilitiesLabel');
                dialog.show(title, content, [dialog.createCloseButton()]);
                dialog.makeDraggable();
            },
            /**
             * At initialization we add model for this tabPanelView, add templates
             * and do other initialization steps.
             *
             * @method initialize
             */
            initialize: function() {
                var me = this;

                this.instance = this.options.instance;
                // for new layers/sublayers, model is always null at this point
                // if we get baseLayerId -> this is a sublayer
                if (this.options.baseLayerId && this.options.model) {
                    // wrap existing sublayers with model
                    this.model = new layerModel(this.options.model);
                } else {
                    this.model = this.options.model;
                }
                // model to use when creating a new layer
                this.modelObj = layerModel;
                this.typeSelectTemplate = _.template(TypeSelectTemplate);
                this.layerTemplate = _.template(LayerSettingsTemplate);

                this.groupTemplate = _.template(GroupSettingsTemplate);
                this.subLayerTemplate = _.template(SubLayerTemplate);
                this.capabilitiesTemplate = _.template(CapabilitiesTemplate);
                _.bindAll(this);

                // Progress spinner
                this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');

                this._rolesUpdateHandler();
                this.supportedTypes = this.options.supportedTypes;

                if (this.model) {
                    // listenTo will remove dead listeners, use it instead of on()
                    this.listenTo(this.model, 'change', function() {
                        me.render();
                    });
                }

                this.render();
            },

            /**
             * Renders layer settings
             *
             * @method render
             */
            render: function() {
                var me = this;
                var spinnerContainer;

                // set id for this layer
                if (me.model && me.model.getId()) {
                    me.$el.attr('data-id', me.model.getId());
                }

                // When creating a new sublayer, its type is 'wmslayer'
                // so no need to show the type select form.
                if (me.options.baseLayerId) {
                    me.$el.empty();
                    me.createLayerForm();
                    return;
                }
                // if editing an existing layer
                if (me.model) {
                    if (me.model.isBaseLayer()) {
                        me.createGroupForm('baseName');
                    } else if (me.model.isGroupLayer()) {
                        me.createGroupForm('groupName');
                    } else {
                        me.$el.empty();
                        me.createLayerForm();
                    }
                } else {
                    // otherwise create a new layer
                    // add html template
                    me.$el.html(me.typeSelectTemplate({
                        model: me.model,
                        supportedTypes: me.supportedTypes,
                        localization: me.options.instance.locale
                    }));
                }

                // Append a progress spinner
                spinnerContainer = me.options.spinnerContainer;

                me.groupId = me.options.groupId;
            },
            /**
             * @method _rolesUpdateHandler
             * @private
             * Updates user roles.
             */
            _rolesUpdateHandler: function() {
                var roles = Oskari.user().getRoles();

                this.roles = new userRoleCollection(roles).getRoles();
            },

            /**
             * Creates the selection to create either base, group or normal layer.
             *
             * @method createLayerSelect
             */
            createLayerSelect: function(e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    addLayerWrappers = element.parents('.add-layer-wrapper'),
                    addGroups = element.parents('.admin-add-group'),
                    layerTypeWrappers = element.parents('.layer-type-wrapper');
                addLayerWrappers.remove();
                addGroups.remove();
                layerTypeWrappers.remove();

                var layerType = e.currentTarget.value;
                if (layerType === 'base' || layerType === 'groupMap') {
                    // Create a base or a group layer
                    var groupTitle = (layerType === 'base' ? 'baseName' : 'groupName');
                    this.createGroupForm(groupTitle, e);
                } else {
                    // Create a normal layer
                    this.createLayerForm(layerType);
                }
            },
            __isSupportedLayerType: function(layerType) {
                var types = _.map(this.supportedTypes, function(type) {
                    return type.id;
                });
                return _.contains(types, layerType);
            },
            __getLayerTypeData: function(layerType) {
                return _.find(this.supportedTypes, function(type) {
                    return type.id === layerType;
                });
            },
            createLayerForm: function(layerType) {
                var me = this,
                    sandbox = me.instance.sandbox,
                    lcId,
                    layerGroups,
                    urlInput,
                    url,
                    urlSource = [],
                    i,
                    j;
                if (!me.model) {
                    me.model = this._createNewModel(layerType);
                    this.listenTo(this.model, 'change', this.render);
                }
                if ((me.model.getSrs_name() === null || me.model.getSrs_name() === undefined) && sandbox.getMap()) {
                    me.model.setSrs_name(sandbox.getMap().getSrsName());
                }

                // make sure we have correct layer type (from model)
                layerType = me.model.getLayerType() + 'layer';
                if (!this.__isSupportedLayerType(layerType)) {
                    me.$el.append(me.instance.locale('errors.layerTypeNotSupported') + me.model.getLayerType());
                    return;
                }

                var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
                var groups = mapLayerService.getAllLayerGroups();
                var groupTitles = [];
                groups.forEach(function(group) {
                    groupTitles.push({
                        name: Oskari.getLocalized(group.name),
                        id: group.id
                    });
                });
                var layerTypeData = me.__getLayerTypeData(layerType);

                me.$el.append(me.layerTemplate({
                    model: me.model,
                    header: layerTypeData.headerTemplate,
                    footer: layerTypeData.footerTemplate,
                    instance: me.options.instance,
                    //inspireThemes: groupTitles,
                    dataProviders: me.getDataProviders(),
                    isSubLayer: me.options.baseLayerId,
                    // capabilities template related
                    capabilities: me.model.get('capabilities'),
                    capabilitiesTemplate: me.capabilitiesTemplate,
                    // ^ /capabilities related
                    roles: me.roles
                }));
                // if settings are hidden, we need to populate template and
                // add it to the DOM
                if (!me.$el.hasClass('show-edit-layer')) {
                    me.$el.find('.layout-slider').slider({
                        min: 0,
                        max: 100,
                        value: me.model.getOpacity(),
                        slide: function(event, ui) {
                            var input = jQuery(ui.handle).parents('.left-tools').find('input.opacity-slider.opacity');
                            input.val(ui.value);
                        }
                    });
                    me.$el.find('input.opacity-slider.opacity').on('change paste keyup', function() {
                        var sldr = me.$el.find('.layout-slider');
                        sldr.slider('value', jQuery(this).val());
                    });
                    if (layerType === 'wfslayer') {
                        // Unique name field to readonly
                        me.$el.find('#add-layer-layerName').prop('disabled', true);
                    }
                }
                // Layer interface autocomplete
                lcId = me.groupId;
                /*
                if (typeof lcId !== 'undefined') {
                    urlInput = me.$el.find('input[type=text]#add-layer-interface');
                    if (urlInput.length > 0) {
                        layerGroups = me.options.instance.models.organization.layerGroups;
                        for (i = 0; i < layerGroups.length; i++) {
                            if (layerGroups[i].id.toString() === lcId) {
                                for (j = 0; j < layerGroups[i].models.length; j++) {
                                    url = layerGroups[i].models[j].getAdmin().url;
                                    if ((typeof url !== 'undefined') && (jQuery.inArray(url, urlSource) === -1)) {
                                        urlSource.push(url);
                                    }
                                }
                                break;
                            }
                        }
                        if (urlSource.length > 0) {
                            urlSource.sort();
                            urlInput.autocomplete({
                                delay: 300,
                                minLength: 0,
                                source: urlSource
                            });
                        }
                    }
                }*/
                if (layerType === 'wfslayer') {
                    // sld styles for all wfs layers
                    me._setupSldStyles();
                }
            },
            _createNewModel: function(type) {
                var sandbox = this.instance.sandbox,
                    mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                    layer = null;
                if (type === 'base' || type === 'groupMap') {
                    layer = mapLayerService.createMapLayer({
                        'type': type
                    });
                } else {
                    if (!type) {
                        // if type is not defined, default to wms
                        type = 'wmslayer';
                    }
                    layer = mapLayerService.createLayerTypeInstance(type);
                }
                return new this.modelObj(layer);
            },

            getLayerGroups: function() {
                var allLayerGroups = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService').getAllLayerGroups();
                var layerGroups = [];
                allLayerGroups.forEach(function(group) {
                    layerGroups.push({
                        id: group.id,
                        name: Oskari.getLocalized(group.name)
                    });
                });
                return layerGroups;
            },

            createGroupForm: function(groupTitle) {
                var me = this;
                if (!me.model) {
                    if (groupTitle === 'baseName') {
                        me.model = this._createNewModel('base');
                    } else {
                        me.model = this._createNewModel('groupMap');
                    }
                }

                me.$el.append(me.groupTemplate({
                    model: me.model,
                    instance: me.options.instance,
                    groupTitle: groupTitle,
                    subLayers: me.model.getSubLayers(),
                    subLayerTemplate: me.subLayerTemplate,
                    roles: me.roles,
                    dataProviders: me.getDataProviders()
                }));
            },

            /**
             * Hide layer settings
             *
             * @method hideLayerSettings
             */
            hideLayerSettings: function(e) {
                e.stopPropagation();
                var me = this;
                me.options.flyout.hide();
            },
            /**
             * Handle interface version change
             *
             * @method handleInterfaceVersionChange
             */
            handleInterfaceVersionChange: function(e) {
                e.stopPropagation();
                var element = jQuery(e.currentTarget),
                    form = element.parents('.admin-add-layer'),
                    interfaceVersion = form.find('#add-layer-interface-version').val();

                if (interfaceVersion === '2.0.0') {
                    form.find("input[type='radio'][name='jobtype'][id='layer-jobtype-fe']").prop('checked', true);
                } else {
                    form.find("input[type='radio'][name='jobtype'][id='layer-jobtype-default']").prop('checked', true);
                }

            },
            /**
             * New sld style management for importing it to server
             *
             * @method importSldStyle
             */
            importSldStyle: function(e) {
                e.stopPropagation();
                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.add-style-send'),
                    sldImport = form.find('.add-layer-style-import-block');

                // set this element invisible
                element.hide();

                // Show  new sld input block
                sldImport.show();

            },
            /**
             * Cancel sld style management for importing it to server
             *
             * @method cancelSldStyle
             */
            cancelSldStyle: function(e) {
                e.stopPropagation();
                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.add-style-send'),
                    sldImport = form.find('.add-layer-style-import-block'),
                    sldImportBtn = form.find('.import-wfs-style-button');

                // set this element invisible
                sldImportBtn.show();

                // Show  new sld input block
                sldImport.hide();

            },
            /**
             * Save new sld style to data base
             *
             * @method saveSldStyle
             */
            saveSldStyle: function(e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.add-style-send'),
                    sldImport = form.find('.add-layer-style-import-block'),
                    sldImportBtn = form.find('.import-wfs-style-button'),
                    sldName = form.find('.add-layer-sld-style-sldname').val(),
                    sldXml = form.find('.add-sld-file').val(),
                    newId = 0;

                //Check if sld is valid
                if (me._checkXml(sldXml)) {
                    // Save new style
                    me._saveSldStyle(sldName, sldXml);
                } else {
                    return;
                }


                // set this element invisible
                sldImportBtn.show();

                // Show  new sld input block
                sldImport.hide();

            },
            /**
             * Check, that xml has valid  syntax
             *
             * @method checkXml
             */
            _checkXml: function(xml) {
                var me = this,
                    isValid = true;

                if (xml) {
                    try {
                        oDOM = jQuery.parseXML(xml);
                    } catch (e) {
                        isValid = false;
                    }
                }

                if (!isValid) {
                    me._showDialog("title", "Not valid sld xml");
                }
                return isValid;

            },
            /**
             * Handle sld styles selection
             *
             * @method handleSldStylesChange
             */
            handleSldStylesChange: function(e) {
                e.stopPropagation();
                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.admin-add-layer');

                styles = me.selectedSldStyles(form);
                me._DefaultStylesUI(element, styles);

            },
            /**
             * selected sld styles selection
             *
             * @method selectedSldStyles
             */
            selectedSldStyles: function(form) {

                var me = this,
                    selectedStyles = {},
                    styles = [];

                form.find("#add-layer-sld-style option:selected").each(function() {
                    var sel = jQuery(this);
                    if (sel.length) {
                        var style = {};
                        style.id = sel.val();
                        style.name = sel.text();
                        styles.push(style);
                    }
                });
                selectedStyles.selectedStyles = styles;
                return selectedStyles;
            },
            _DefaultStylesUI: function(element, selection) {
                var me = this,
                    form = element.parents('.admin-add-layer'),
                    defaelem = form.find('#add-layer-style');

                defaelem.find('option').remove();
                for (var i = 0; selection != null && i < selection.selectedStyles.length; i++) {
                    defaelem.append('<option value=' + selection.selectedStyles[i].id + ' >' + selection.selectedStyles[i].name + '</option>');
                }

            },
            /**
             * Handle layer style legend Url change
             *
             * @method handleLayerLegendUrlChange
             */
            handleLayerLegendUrlChange: function(e) {
                e.stopPropagation();
                var element = jQuery(e.currentTarget),
                    form = element.parents('.admin-add-layer'),
                    cur_legendUrl = form.find('#add-layer-legendUrl').val();
                form.find('#add-layer-legendImage').val(cur_legendUrl);
            },
            /**
             * Remove layer
             *
             * @method removeLayer
             */
            removeLayer: function(e, callback) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }

                var me = this,
                    element = jQuery(e.currentTarget),
                    addLayerDiv = element.parents('.admin-add-layer'),
                    confirmMsg = me.instance.locale('admin.confirmDeleteLayer'),
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    btn = dialog.createCloseButton(me.instance.locale('ok')),
                    cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

                if (callback) {
                    addLayerDiv = jQuery('.admin-layerselector .admin-add-layer.show-edit-layer[data-id=' + me.options.baseLayerId + ']');
                }

                btn.addClass('primary');
                cancelBtn.setTitle(me.instance.locale('cancel'));
                btn.setHandler(function() {
                    dialog.close();

                    jQuery.ajax({
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            layer_id: me.model.getId()
                        },
                        url: me.instance.sandbox.getAjaxUrl('DeleteLayer'),
                        success: function(resp) {
                            if (!resp) {
                                if (addLayerDiv.hasClass('show-edit-layer')) {
                                    addLayerDiv.removeClass('show-edit-layer');
                                    // FIXME this re-renders the layer view but doesn't update the model...
                                    // bubble this action to the View
                                    // = outside of backbone implementation
                                    element.trigger({
                                        type: 'adminAction',
                                        command: 'removeLayer',
                                        modelId: me.model.getId(),
                                        baseLayerId: me.options.baseLayerId
                                    });
                                    addLayerDiv.remove();
                                }
                                if (callback) {
                                    callback();
                                }
                            }
                        },
                        error: function(jqXHR) {
                            if (jqXHR.status !== 0) {
                                me._showDialog(me.instance.locale('admin.errorTitle'), me.instance.locale('admin.errorRemoveLayer'));
                            }
                        }
                    });

                });
                cancelBtn.setHandler(function() {
                    dialog.close();
                });

                dialog.show(me.instance.locale('admin.warningTitle'), confirmMsg, [btn, cancelBtn]);
                dialog.makeModal();

            },

            getDataProviders: function() {
                return this.options.dataProviders;
            },
            /**
             * @method _showDialog
             * @private
             * @param title the dialog title
             * @param message the dialog message
             */
            _showDialog: function(title, message) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.show(title, message);
                dialog.fadeout(5000);
            },
            /**
             * @method _addLayerAjax
             * @private
             * @param {Object} data saved data
             * @param {jQuery} element jQuery element
             */
            _addLayerAjax: function(data, element, callback) {
                var me = this,
                    form = element.parents('.admin-add-layer'),
                    //accordion = element.parents('.accordion'),
                    createLayer;
                // Progress spinner
                me.progressSpinner.start();

                jQuery.ajax({
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    url: me.instance.sandbox.getAjaxUrl('SaveLayer'),
                    success: function(resp) {
                        var success = true;
                        me.progressSpinner.stop();
                        // response should be a complete JSON for the new layer
                        if (!resp) {
                            me._showDialog(me.instance.locale('admin.errorTitle'), me.instance.locale('admin.update_or_insert_failed'));
                            success = false;
                        } else if (resp.error) {
                            me._showDialog(me.instance.locale('admin.errorTitle'), me.instance.locale('admin.resp.error'));
                            success = false;
                        }
                        // happy case - we got id
                        if (resp.id) {
                            // close this
                            form.removeClass('show-add-layer');
                            createLayer = form.parents('.create-layer');
                            if (createLayer) {
                                createLayer.find('.admin-add-layer-btn').html(me.instance.locale('admin.addLayer'));
                                createLayer.find('.admin-add-layer-btn').attr('title', me.instance.locale('admin.addLayerDesc'));
                            }
                            form.remove();

                            if (typeof callback === 'function') {
                                callback();
                            }

                            me.options.flyout.hide();
                            if (me.model.getId() !== null && me.model.getId() !== undefined) {
                                me.options.instance.service.trigger('admin-layer', {
                                    mode: 'edit',
                                    layerData: resp
                                });
                            } else {
                                me.options.instance.service.trigger('admin-layer', {
                                    mode: 'add',
                                    layerData: resp
                                });
                            }
                        }
                        if (resp.warn) {
                            me._showDialog(me.instance.locale('admin.warningTitle'), me.instance.locale('admin.resp.warn'));
                            success = false;
                        }
                        if (success) {
                            me._showDialog(me.instance.locale('admin.successTitle'), me.instance.locale('admin.success'));
                        }
                    },
                    error: function(jqXHR) {
                        me.progressSpinner.stop();
                        if (jqXHR.status !== 0) {
                            var loc = me.instance.locale('admin'),
                                err = loc.update_or_insert_failed;
                            if (jqXHR.responseText) {
                                var jsonResponse = jQuery.parseJSON(jqXHR.responseText);
                                if (jsonResponse && jsonResponse.error) {
                                    err = jsonResponse.error;
                                    // see if we recognize the error
                                    var errVar = null;
                                    if (err.indexOf('mandatory_field_missing:') === 0) {
                                        errVar = err.substring('mandatory_field_missing:'.length);
                                        err = 'mandatory_field_missing';
                                    } else if (err.indexOf('invalid_field_value:') === 0) {
                                        errVar = err.substring('invalid_field_value:'.length);
                                        err = 'invalid_field_value';
                                    } else if (err.indexOf('operation_not_permitted_for_layer_id:') === 0) {
                                        errVar = err.substring('operation_not_permitted_for_layer_id:'.length);
                                        err = 'operation_not_permitted_for_layer_id';
                                    } else if (err.indexOf('no_layer_with_id') === 0) {
                                        errVar = err.substring('no_layer_with_id:'.length);
                                        err = 'no_layer_with_id';
                                    }

                                    err = loc[err] || err;
                                    if (errVar && loc[errVar]) {
                                        err += loc[errVar];
                                    } else if (errVar) {
                                        err += errVar;
                                    }
                                }
                            }
                            me._showDialog(me.instance.locale('admin.errorTitle'), err);
                        }
                    }
                });
            },
            /**
             * Add layer
             *
             * @method addLayer
             */
            addLayer: function(e, callback) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }

                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.admin-add-layer'),
                    data = {},
                    interfaceVersion = form.find('#add-layer-interface-version').val(),
                    sandbox = me.instance.sandbox,
                    admin;


                // If this is a sublayer -> setup parent layers id
                if (me.options.baseLayerId) {
                    data.parentId = me.options.baseLayerId;
                }

                // add layer type and version
                data.version = (interfaceVersion !== '') ? interfaceVersion : form.find('#add-layer-interface-version > option').first().val();

                // base and group are always of type wmslayer
                data.layerType = me.model.getLayerType() + 'layer';
                if (me.model.getId() !== null && me.model.getId() !== undefined) {
                    data.layer_id = me.model.getId();
                }

                form.find('[id$=-name]').filter('[id^=add-layer-]').each(function() {
                    var lang = this.id.substring(10, this.id.indexOf('-name'));
                    data['name_' + lang] = this.value;
                });

                form.find('[id$=-title]').filter('[id^=add-layer-]').each(function() {
                    var lang = this.id.substring(10, this.id.indexOf('-title'));
                    data['title_' + lang] = this.value;
                });

                data.layerUrl = form.find('#add-layer-url').val();
                if (typeof data.layerUrl === "undefined") {
                    data.layerUrl = form.find('#add-layer-interface').val();
                }

                data.opacity = form.find('#opacity-slider').val();

                data.style = form.find('#add-layer-style').val();
                data.minScale = form.find('#add-layer-minscale').val() || -1;
                data.maxScale = form.find('#add-layer-maxscale').val() || -1;
                data.legendImage = form.find('#add-layer-legendImage').val();
                data.metadataId = form.find('#add-layer-datauuid').val();
                data.attributes = form.find('#add-layer-attributes').val();

                // layer type specific
                // TODO: maybe something more elegant?
                if (data.layerType === 'wmslayer') {
                    data.xslt = form.find('#add-layer-xslt').val();
                    data.gfiType = form.find('#add-layer-responsetype').val();
                    data.params = form.find('#add-layer-selectedtime').val();
                } else if (data.layerType === 'wfslayer') {
                    admin = me.model.getAdmin();
                    // in insert all wfs properties are behind passthrough
                    if ((admin) && (admin.passthrough)) {
                        _.forEach(admin.passthrough, function(value, key) {
                            data[key] = typeof value === 'object' ? JSON.stringify(value) : value;
                        });
                    }
                    data.styleSelection = JSON.stringify(me.selectedSldStyles(form));
                    data.style = form.find('#add-layer-style option:selected').text();
                }
                data.layerName = form.find('#add-layer-layerName').val();
                data.gfiContent = form.find('#add-layer-gfi-content').val();

                data.realtime = form.find('#add-layer-realtime').is(':checked');
                data.refreshRate = form.find('#add-layer-refreshrate').val();

                data.srs_name = form.find('#add-layer-srs_name').val();
                if ((data.srs_name === null || data.srs_name === undefined) && sandbox.getMap()) {
                    data.srs_name = sandbox.getMap().getSrsName();
                }
                data.jobType = form.find("input[type='radio'][name='jobtype']:checked").val();

                data.manualRefresh = form.find("input[type='checkbox'][name='manualRefresh']:checked").val();
                data.resolveDepth = form.find("input[type='checkbox'][name='resolveDepth']:checked").val();

                data.username = form.find('#add-layer-username').val();
                data.password = form.find('#add-layer-password').val();

                if (!data.gfiType) {
                    // if there isn't a selection, don't send anything so backend will keep the existing value
                    delete data.gfiType;
                }

                data.viewPermissions = '';
                data.downloadPermissions = '';
                data.enbeddedPermissions = '';
                data.publishPermissions = '';
                for (var i = 0; i < me.roles.length; i += 1) {
                    if (form.find('#layer-view-roles-' + me.roles[i].id).is(':checked')) {
                        data.viewPermissions += me.roles[i].id + ',';
                    }
                    if (form.find('#layer-download-roles-' + me.roles[i].id).is(':checked')) {
                        data.downloadPermissions += me.roles[i].id + ',';
                    }
                    if (form.find('#layer-enbedded-roles-' + me.roles[i].id).is(':checked')) {
                        data.enbeddedPermissions += me.roles[i].id + ',';
                    }
                    if (form.find('#layer-publish-roles-' + me.roles[i].id).is(':checked')) {
                        data.publishPermissions += me.roles[i].id + ',';
                    }
                }

                // Layer class id aka. orgName id aka groupId
                data.inspireTheme = me.options.groupId;
                data.groupId = form.find('#select-dataprovider').val();

                if ((data.layerUrl !== me.model.getInterfaceUrl() && me.model.getInterfaceUrl()) ||
                    (data.layerName !== me.model.getLayerName() && me.model.getLayerName())) {
                    var confirmMsg = me.instance.locale('admin.confirmResourceKeyChange'),
                        dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        btn = dialog.createCloseButton(me.instance.locale('ok')),
                        cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

                    btn.addClass('primary');
                    cancelBtn.setTitle(me.instance.locale('cancel'));

                    btn.setHandler(function() {
                        dialog.close();
                        me._addLayerAjax(data, element, callback);
                    });

                    cancelBtn.setHandler(function() {
                        dialog.close();
                    });

                    dialog.show(me.instance.locale('admin.warningTitle'), confirmMsg, [btn, cancelBtn]);
                    dialog.makeModal();
                } else {
                    me._addLayerAjax(data, element, callback);
                }
            },
            /**
             * Save group or base layers
             *
             * @method saveCollectionLayer
             */
            saveCollectionLayer: function(e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    groupElement = element.parents('.admin-add-group');

                var data = {
                    groupId: groupElement.find('#select-dataprovider').val(),
                    layerType: 'collection',
                    isBase: me.model.isBaseLayer(),
                    inspireTheme: me.options.groupId
                };


                if (me.model.getId() !== null && me.model.getId() !== undefined) {
                    data.layer_id = me.model.getId();
                }

                groupElement.find('[id$=-name]').filter('[id^=add-group-]').each(function() {
                    var lang = this.id.substring(10, this.id.indexOf('-name'));
                    data['name_' + lang] = this.value;
                });

                // permissions
                if (!me.model.getId()) {
                    var checkedPermissions = [];
                    groupElement.find('.layer-view-role').filter(':checked').each(function() {
                        checkedPermissions.push(jQuery(this).data('role-id'));
                    });

                    data.viewPermissions = checkedPermissions.join();
                }

                // make AJAX call
                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    beforeSend: function() {
                        jQuery('body').css({
                            cursor: 'wait'
                        });
                    },
                    url: me.instance.sandbox.getAjaxUrl('SaveLayer'),
                    success: function(resp) {
                        jQuery('body').css('cursor', '');
                        me.options.flyout.hide();
                        if (!me.model.getId()) {
                            me.options.instance.service.trigger('admin-layer', {
                                mode: 'add',
                                layerData: resp
                            });
                        } else {
                            me.options.instance.service.trigger('admin-layer', {
                                mode: 'edit',
                                layerData: resp
                            });
                        }
                    },
                    error: function() {
                        jQuery('body').css('cursor', '');
                        me._showDialog(me.instance.locale('admin.errorTitle'), me.instance.locale('admin.errorSaveGroupLayer'));
                    }
                });
            },
            removeLayerCollection: function(e) {
                var me = this,
                    element = jQuery(e.currentTarget);
                // make AJAX call
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        layer_id: me.model.getId()
                    },
                    url: me.instance.sandbox.getAjaxUrl('DeleteLayer'),
                    success: function(resp) {
                        // FIXME do handling
                    },
                    error: function() {
                        me._showDialog(me.instance.locale('admin.errorTitle'), me.instance.locale('admin.errorRemoveGroupLayer'));
                    }
                });
            },
            /**
             * Fetch capabilities. AJAX call to get capabilities for given capability url
             *
             * @method fetchCapabilities
             */
            fetchCapabilities: function(e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.add-layer-wrapper');

                e.stopPropagation();

                // Progress spinner
                me.progressSpinner.start();

                var serviceURL = form.find('#add-layer-interface').val(),
                    layerType = form.find('#add-layer-layertype').val(),
                    user = form.find('#add-layer-username').val(),
                    pw = form.find('#add-layer-password').val(),
                    version = form.find('#add-layer-interface-version').val(),
                    crs = me.instance.sandbox.getMap().getSrsName();

                me.model.set({
                    '_layerUrls': [serviceURL]
                }, {
                    silent: true
                });
                me.model.setVersion(version);
                me.model.set({
                    _admin: {
                        username: user,
                        password: pw,
                        version: version
                    }
                }, {
                    silent: true
                });

                jQuery.ajax({
                    type: 'POST',
                    data: {
                        url: serviceURL,
                        type: layerType,
                        user: user,
                        pw: pw,
                        version: version,
                        crs: crs
                    },
                    url: me.instance.sandbox.getAjaxUrl('GetWSCapabilities'),
                    success: function(resp) {
                        me.progressSpinner.stop();
                        me.__capabilitiesResponseHandler(layerType, resp);
                    },
                    error: function(jqXHR) {
                        me.progressSpinner.stop();
                        if (jqXHR.status !== 0) {
                            me._showDialog(me.instance.locale('admin.errorTitle'), me.instance.locale('admin.metadataReadFailure'));
                        }
                    }
                });
            },
            /**
             * Acts on capabilities response based on layer type
             * @param  {String} layerType 'wmslayer'/'wmtslayer'/'wfslayer'
             * @param  {String} response  GetWSCapabilities response
             */
            __capabilitiesResponseHandler: function(layerType, response) {
                var me = this,
                    warningDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    warningDialogOkBtn = warningDialog.createCloseButton(me.instance.locale('ok')),
                    warningMessage;
                me.model.setCapabilitiesResponse(response);
                if (layerType === 'wfslayer') {
                    //check layers with error and act accordingly.
                    var capabilities = me.model.get("capabilities");
                    if (capabilities && capabilities.layersWithErrors && capabilities.layersWithErrors.length > 0) {
                        warningMessage = _.template(LayersWithErrorsPopupTemplate, {
                            "capabilities": capabilities,
                            title: me.instance.locale('admin.warning_some_of_the_layers_could_not_be_parsed')
                        });
                        warningDialog.show(me.instance.locale('admin.warningTitle'), warningMessage, [warningDialogOkBtn]);
                        warningDialog.makeModal();
                    }
                }
            },
            handleCapabilitiesSelection: function(e) {
                var me = this,
                    current = jQuery(e.currentTarget);
                // stop propagation so handler on outer tags won't be triggered as well
                e.stopPropagation();
                var layerName = current.attr('data-layername'),
                    additionalId = current.attr('data-additionalId'),
                    title = current.text();
                if (layerName) {
                    // actual layer node -> populate model
                    me.model.setupCapabilities(layerName, null, additionalId, title);
                } else {
                    // toggle class to hide submenu
                    current.toggleClass('closed');
                    // toggle open/closed icon
                    current.children('div.inline-icon').toggleClass('icon-arrow-right icon-arrow-down');
                }
            },

            /**
             * Helper function. This returns inner value
             * first one or the one which matches with given key
             *
             * @method getValue
             */
            getValue: function(object, key) {
                var k,
                    ret;
                if (key && object[key]) {
                    ret = object[key];
                }
                if (!ret) {
                    for (k in object) {
                        if (object.hasOwnProperty(k)) {
                            ret = object[k];
                            break;
                        }
                    }
                }
                return ret;
            },
            clearInput: function(e) {
                var element = jQuery(e.currentTarget),
                    input = element.parent().children(':input');
                if (input.length === 1) {
                    input.val('');
                }
            },
            /**
             * Fetch wfs specific common data / sld styles
             *
             * @method __setupSldStyles
             */
            _setupSldStyles: function() {
                var me = this,
                    elem = me.$el;

                if (me.sldStyles) {
                    me._SldStylesUI(elem);
                }

                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    url: me.instance.sandbox.getAjaxUrl('SldStyles'),
                    success: function(resp) {
                        me.sldStyles = resp.sldStyles;
                        me._SldStylesUI(elem);
                    },
                    error: function(jqXHR) {
                        if (jqXHR.status !== 0) {
                            me._showDialog(me.instance.locale('admin.errorTitle'), me.instance.locale('admin.sldStylesFetchError'));
                        }
                    }
                });
            },
            /**
             * Save new sld style
             *
             * @method _saveSldStyle
             */
            _saveSldStyle: function(sldName, sldXml) {
                var me = this;


                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name: sldName,
                        xml: encodeURIComponent(sldXml)
                    },
                    url: me.instance.sandbox.getAjaxUrl('SldStyles'),
                    success: function(resp) {
                        me._showDialog("title", "New sld saved success / " + sldName);
                        //Update UI
                        me._SldStylesAppendUI(resp.id, sldName);

                    },
                    error: function(jqXHR) {
                        if (jqXHR.status !== 0) {
                            me._showDialog("title", "Save of new sld xml failed");
                        }
                    }
                });
            },
            _SldStylesUI: function(elem) {
                var me = this,
                    sldSele = elem.find('#add-layer-sld-style');

                for (var i = 0; me.sldStyles != null && i < me.sldStyles.length; i++) {
                    sldSele.append('<option value=' + me.sldStyles[i].id + ' >' + me.sldStyles[i].name + '</option>');
                }

            },
            _SldStylesAppendUI: function(id, name) {
                var me = this,
                    elem = me.$el,
                    sldSele = elem.find('#add-layer-sld-style');

                sldSele.append('<option value=' + id + ' >' + name + '</option>');


            },

            /**
             * Stops propagation if admin clicks layer settings section.
             *
             * @method addLayer
             */
            clickLayerSettings: function(e) {
                e.stopPropagation();
            }
        });
    });