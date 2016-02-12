define([
    'text!_bundle/templates/adminTypeSelectTemplate.html',
    'text!_bundle/templates/adminLayerSettingsTemplate.html',
    'text!_bundle/templates/adminArcgisLayerSettingsTemplate.html',
    'text!_bundle/templates/adminWFSLayerSettingsTemplate.html',
	'text!_bundle/templates/adminGisLayerSettingsTemplate.html',
    'text!_bundle/templates/adminGroupSettingsTemplate.html',
    'text!_bundle/templates/group/subLayerTemplate.html',
    'text!_bundle/templates/capabilitiesTemplate.html',
    '_bundle/collections/userRoleCollection',
    '_bundle/models/layerModel'
],
    function (
        TypeSelectTemplate,
        LayerSettingsTemplate,
        ArcGisLayerSettingsTemplate,
        WFSLayerSettingsTemplate,
		GISLayerSettingsTemplate,
        GroupSettingsTemplate,
        SubLayerTemplate,
        CapabilitiesTemplate,
        userRoleCollection,
        layerModel
    ) {
        return Backbone.View.extend({
            //<div class="admin-add-layer" data-id="<% if(model != null && model.getId()) { %><%= model.getId() %><% } %>">

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
                // for wfs params editing - phase 3 'click .fetch-wfs-button': 'fetchWfsLayerConfiguration',
                'click .icon-close': 'clearInput',
                'change .admin-layer-type': 'createLayerSelect',
                'click .admin-add-group-ok': 'saveCollectionLayer',
                'click .admin-add-group-cancel': 'hideLayerSettings',
                'click .admin-remove-group': 'removeLayerCollection',
                'click .add-layer-record.capabilities li': 'handleCapabilitiesSelection'
            },

            /**
             * At initialization we add model for this tabPanelView, add templates
             * and do other initialization steps.
             *
             * @method initialize
             */
            initialize: function () {                
                this.instance = this.options.instance;
                this.service = Oskari.clazz.create('Oskari.integration.bundle.admin-layerselector.View.service.AdminLayerSelectorService', this.instance.getSandbox());
                // for new layers/sublayers, model is always null at this point
                // if we get baseLayerId -> this is a sublayer
                if(this.options.baseLayerId && this.options.model) {
                    // wrap existing sublayers with model
                    this.model = new layerModel(this.options.model);
                }
                else {
                    this.model = this.options.model;
                }
                // model to use when creating a new layer
                this.modelObj = layerModel;
                this.typeSelectTemplate = _.template(TypeSelectTemplate);
                this.layerTemplate = _.template(LayerSettingsTemplate);
                this.arcgisLayerTemplate = _.template(ArcGisLayerSettingsTemplate);
                this.wfsLayerTemplate = _.template(WFSLayerSettingsTemplate);
				this.gisLayerTemplate = _.template(GISLayerSettingsTemplate);
                this.groupTemplate = _.template(GroupSettingsTemplate);
                this.subLayerTemplate = _.template(SubLayerTemplate);
                this.capabilitiesTemplate = _.template(CapabilitiesTemplate);
                _.bindAll(this);

                // Progress spinner
                this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');

                this._rolesUpdateHandler();
                if(this.model) {
                    // listenTo will remove dead listeners, use it instead of on()
                    var me = this;
                    this.listenTo(this.model, 'change', function() {
//                        console.log('model change', arguments);
                        me.render();
                    });
                    //this.model.on('change', this.render, this);
                }
                var me = this;

                this.supportedTypes = this.options.supportedTypes;
                this.render();
            },

            /**
             * Renders layer settings
             *
             * @method render
             */
            render: function () {
                var me = this;
                var spinnerContainer;

                // set id for this layer
                if (me.model && me.model.getId()) {
                    me.$el.attr('data-id', me.model.getId());
                }

                // When creating a new sublayer, its type is 'wmslayer'
                // so no need to show the type select form.
                if (me.options.baseLayerId) {
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
                        this.createGeneralLayerForm(null, 'wmslayer', 'layerTemplate');
                    } else if (me.model.isLayerOfType('WFS')) {
                        me.$el.empty();
                        this.createGeneralLayerForm(null, 'wfslayer', 'wfsLayerTemplate');
                    } else if(me.model.isLayerOfType('arcgislayer')) {
                        me.$el.empty();
                        this.createGeneralLayerForm(null, 'arcgislayer', 'arcgisLayerTemplate');
                    } else if(me.model.isLayerOfType('myplaces') || me.model.isLayerOfType('analysis') || me.model.isLayerOfType('userlayer')) {
                        me.$el.empty();
                        this.createGeneralLayerForm(null, 'wmslayer', 'gisLayerTemplate');
					}
                } else {
                    // otherwise create a new layer
                    // add html template
                    me.$el.html(me.typeSelectTemplate({
                        model: me.model,
                        supportedTypes : me.supportedTypes,
                        localization: me.options.instance.getLocalization('admin')
                    }));
                }

                // Append a progress spinner
                spinnerContainer = me.instance.view.container.parent().parent();
                // FF bug ?
              /*  if (!spinnerContainer.has(me.progressSpinner).length > 0) {
                    me.progressSpinner.insertTo(spinnerContainer);
                } */
            },
            /**
             * @method _rolesUpdateHandler
             * @private
             * Updates user roles.
             */
            _rolesUpdateHandler: function () {
                var sandbox = Oskari.getSandbox(),
                    roles = sandbox.getUser().getRoles();

                this.roles = new userRoleCollection(roles).getRoles();
            },

            /**
             * Creates the selection to create either base, group or normal layer.
             *
             * @method createLayerSelect
             */
            createLayerSelect: function (e) {
                jQuery('.add-layer-wrapper').remove();
                jQuery('.admin-add-group').remove();
                jQuery('.layer-type-wrapper').remove();


                // Create a normal layer
                if (e.currentTarget.value === 'wmslayer') {
                    this.createGeneralLayerForm(e, 'wmslayer', 'layerTemplate');
                } else if (e.currentTarget.value == "arcgislayer") {
                    this.createGeneralLayerForm(e, 'arcgislayer', 'arcgisLayerTemplate');
                } else if (e.currentTarget.value === 'wfslayer') {
                    this.createGeneralLayerForm(e, 'wfslayer', 'wfsLayerTemplate');
                } else if (e.currentTarget.value === 'base' || e.currentTarget.value === 'groupMap') {
                    // Create a base or a group layer
                    var groupTitle = (layerType === 'base' ? 'baseName' : 'groupName');
                    this.createGroupForm(groupTitle, e);
                }
                else {
                    // Create a normal layer
                    this.createLayerForm(layerType);
                }
            },
            __isSupportedLayerType : function(layerType) {
                var types = _.map(this.supportedTypes, function(type){ 
                    return type.id;
                });
                return _.contains(types, layerType);
            },
            __getLayerTypeData : function(layerType) {
                return _.find(this.supportedTypes, function(type) {
                    return type.id === layerType;
                }) ;
            },

            createLayerForm: function (layerType) {
                var me = this,
                    supportedLanguages = Oskari.getSupportedLanguages(),
                    opacity = 100,
                    readOnly = false,
                    styles = [],
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
                } else if (modelName == 'wfslayer') {
                    readOnly = true;
                }
                // make sure we have correct layer type (from model)
                layerType = me.model.getLayerType() + 'layer';
                if(!this.__isSupportedLayerType(layerType)) {
                    me.$el.append(me.instance.getLocalization('errors').layerTypeNotSupported + me.model.getLayerType());
                    return;
                }

                // This propably isn't the best way to get reference to inspire themes
                var inspireGroups = [],
                   layerTypeData = me.__getLayerTypeData(layerType);

                me.$el.append(me.layerTemplate({
                    readOnly: readOnly,
                    model: me.model,
                    header : layerTypeData.headerTemplate,
                    footer : layerTypeData.footerTemplate,
                    instance: me.options.instance,
                    inspireThemes: inspireGroups,
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
                    // FIXME non-unique ID
                    me.$el.find('.layout-slider').slider({
                        min: 0,
                        max: 100,
                        value: me.model.getOpacity(),
                        slide: function (event, ui) {
                            var input = jQuery(ui.handle).parents('.left-tools').find('input.opacity-slider.opacity');
                            input.val(ui.value);
                        }
                    });
                    me.$el.find('input.opacity-slider.opacity').on('change paste keyup', function () {
                        var sldr = me.$el.find('.layout-slider');
                        sldr.slider('value', jQuery(this).val());
                    });
                }
                // Layer interface autocomplete
                lcId = me.$el.parents('.accordion').attr('lcid');
                if (typeof lcId !== 'undefined') {
                    urlInput = me.$el.find('input[type=text]#add-layer-interface');
                    if (urlInput.length > 0 ) {
                        layerGroups = me.options.instance.models.organization.layerGroups;
                        for (i=0; i<layerGroups.length; i++) {
                            if (layerGroups[i].id.toString() === lcId) {
                                for (j=0; j<layerGroups[i].models.length; j++) {
                                    url = layerGroups[i].models[j].getAdmin().url;
                                    if ((typeof url !== 'undefined')&&(jQuery.inArray(url,urlSource) === -1)) {
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
                }
            },
            _createNewModel: function (type) {
                var sandbox = this.instance.sandbox,
                    mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                    layer = null;
                if(type === 'base' || type === 'groupMap' ) {
                    layer = mapLayerService.createMapLayer({ 'type' : type });
                }
                else if (type == 'wfslayer') {
                    layer = Oskari.clazz.create('Oskari.integration.bundle.admin-layerselector.models.ExtendedWFSLayer');
                } else {
                    if(!type) {
                        // if type is not defined, default to wms
                        type = 'wmslayer';
                    }
                    layer = mapLayerService.createLayerTypeInstance(type);
                }
                return new this.modelObj(layer);
            },
            createGroupForm: function (groupTitle, e) {
                var me = this;
                if (!me.model) {
                    if(groupTitle === 'baseName') {
                        me.model = this._createNewModel('base');
                    }
                    else {
                        me.model = this._createNewModel('groupMap');
                    }
                }

                // This propably isn't the best way to get reference to inspire themes
                var inspireGroups = this.instance.models.inspire.getGroupTitles();
                me.$el.append(me.groupTemplate({
                    model: me.model,
                    instance: me.options.instance,
                    groupTitle: groupTitle,
                    inspireThemes: inspireGroups,
                    subLayers: me.model.getSubLayers(),
                    subLayerTemplate: me.subLayerTemplate,
                    roles: me.roles
                }));
            },

            /**
             * Hide layer settings
             *
             * @method hideLayerSettings
             */
            hideLayerSettings: function (e) {
                e.stopPropagation();
                var element = jQuery(e.currentTarget);
                if (element.parents('.admin-add-layer').hasClass('show-edit-layer') ||
                        element.parents('.admin-add-layer').hasClass('show-add-layer')) {

                    element.parents('.create-layer').children('.admin-add-layer-btn').html(this.options.instance.getLocalization('admin').addLayer);
                    element.parents('.create-layer').children('.admin-add-layer-btn').attr('title', this.options.instance.getLocalization('admin').addLayerDesc);
                    element.parents('.admin-add-layer').removeClass('show-edit-layer');
                    element.parents('.admin-add-layer').remove();
                }
            },

            /**
             * Remove layer
             *
             * @method removeLayer
             */
            removeLayer: function (e) {
                e.stopPropagation();

                var me = this,
                    element = jQuery(e.currentTarget),
                    addLayerDiv = element.parents('.admin-add-layer'),
                    confirmMsg = me.instance.getLocalization('admin').confirmDeleteLayer,
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    btn = dialog.createCloseButton(me.instance.getLocalization().ok),
                    cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    sandbox = me.options.instance.getSandbox();

                btn.addClass('primary');
                cancelBtn.setTitle(me.instance.getLocalization().cancel);
                btn.setHandler(function() {
                    dialog.close();

                    jQuery.ajax({
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            layer_id: me.model.getId()
                        },
                        url: sandbox.getAjaxUrl() + 'action_route=DeleteLayer',
                        success: function (resp) {
                            if (!resp) {
                                // TODO this isn't fired on sublayer delete...
                                //close this
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
                            /* else {
                                //problem
                                console.log('Removing layer did not work.')
                            }*/
                        },
                        error: function (jqXHR, textStatus) {
                            if (jqXHR.status !== 0) {
                                me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')['errorRemoveLayer']);
                            }
                        }
                    });

                });
                cancelBtn.setHandler(function() {
                    dialog.close();
                });

                dialog.show(me.instance.getLocalization('admin')['warningTitle'], confirmMsg, [btn, cancelBtn]);
                dialog.makeModal();
                
            },
            /**
            * @method _showDialog
            * @private
            * @param title the dialog title
            * @param message the dialog message
            */
            _showDialog: function(title, message){
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
            _addLayerAjax: function(data, element){
                var me = this,
                    form = element.parents('.admin-add-layer'),
                    createLayer,
                    sandbox = me.instance.getSandbox();
                // Progress spinner
                me.progressSpinner.start();
                
                jQuery.ajax({
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    url: sandbox.getAjaxUrl() + 'action_route=SaveLayer',
                    success: function (resp) {
                        var success = true;
                        me.progressSpinner.stop();
                        // response should be a complete JSON for the new layer
                        if (!resp) {
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin').update_or_insert_failed);
                            success = false;
                        } else if (resp.error) {
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')[resp.error] || resp.error);
                            success = false;
                        }
                        // happy case - we got id
                        if (resp.id) {
                            // close this
                            form.removeClass('show-add-layer');
                            createLayer = form.parents('.create-layer');
                            if (createLayer) {
                                createLayer.find('.admin-add-layer-btn').html(me.instance.getLocalization('admin').addLayer);
                                createLayer.find('.admin-add-layer-btn').attr('title', me.instance.getLocalization('admin').addLayerDesc);

                            }
                            form.remove();
                            if (callback) {
                                callback();
                            }

                            // FIXME this doesn't seem to do anything? remove's trigger re-renders the layer view, this doesn't
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: 'adminAction',
                                command: me.model.getId() !== null && me.model.getId() !== undefined ? 'editLayer' : 'addLayer',
                                layerData: resp,
                                baseLayerId: me.options.baseLayerId
                            });
                        }
                        if (resp.warn) {
                            me._showDialog(me.instance.getLocalization('admin')['warningTitle'], me.instance.getLocalization('admin')[resp.warn] || resp.warn);
                            success = false;
                        }
                        if (success) {
                            me._showDialog(me.instance.getLocalization('admin')['successTitle'], me.instance.getLocalization('admin')['success']);
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        me.progressSpinner.stop();
                        if (jqXHR.status !== 0) {
                            var loc = me.instance.getLocalization('admin'),
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
                                    if (errVar) {
                                        if (loc[errVar]) {
                                            err += loc[errVar];
                                        } else {
                                            err += errVar;
                                        }
                                    }
                                }
                            }
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], err);
                        }
                    }
                });
            },
            /**
             * Add layer
             *
             * @method addLayer
             */
            addLayer: function (e) {
                e.stopPropagation();

                // FIXME don't get this from the event...
                var me = this,
                    element = jQuery(e.currentTarget),
                    accordion = element.parents('.accordion'),
                    lcId = accordion.attr('lcid'),
                    form = element.parents('.admin-add-layer'),
                    data = {},
                    wmsVersion = form.find('#add-layer-interface-version').val(),
                    createLayer,
                    admin;

                // If this is a sublayer -> setup parent layers id
                if (me.options.baseLayerId) {
                    data.parentId = me.options.baseLayerId;
                }

                // add layer type and version
                data.version = (wmsVersion !== '') ? wmsVersion : form.find('#add-layer-interface-version > option').first().val();

                // base and group are always of type wmslayer
                data.layerType = me.model.getLayerType() + 'layer';
                if (me.model.getId() !== null && me.model.getId() !== undefined) {
                    data.layer_id = me.model.getId();
                }

                form.find('[id$=-name]').filter('[id^=add-layer-]').each(function (index) {
                    var lang = this.id.substring(10, this.id.indexOf('-name'));
                    data['name_' + lang] = this.value;
                });
                form.find('[id$=-title]').filter('[id^=add-layer-]').each(function (index) {
                    var lang = this.id.substring(10, this.id.indexOf('-title'));
                    data['title_' + lang] = this.value;
                });

                // type can be either wmslayer, base or groupMap
                data.type = form.find('#add-layer-type').val() || 'wmslayer';
                data.wmsName = form.find('#add-layer-wms-id').val();
                data.wmsUrl = form.find('#add-layer-wms-url').val();

                if (data.type == 'arcgislayer') {
                    if (data.wmsUrl != me.model.getLayerUrls().join() || data.wmsName != me.model.getWmsName()) {
                        var confirmMsg = me.instance.getLocalization('admin').confirmResourceKeyChange;
                        if (me.model.getId() && !confirm(confirmMsg)) {
                            // existing layer/cancel!!
                            return;
                        }
                    }
                } else if (data.type == 'wmslayer' || data.type == 'wms') {
                   if(data.wmsUrl != me.model.getWmsUrls().join() ||
                   data.wmsName != me.model.getWmsName()) {
                       var confirmMsg = me.instance.getLocalization('admin').confirmResourceKeyChange;
                       if(me.model.getId() && !confirm(confirmMsg)) {
                           // existing layer/cancel!!
                           return;
                       }
                   }
                } else if (data.type == 'wfs') {
                    data.type = 'wfslayer';                    
                    data.username = form.find('#add-layer-wfsusername').val();
                    data.password = form.find('#add-layer-wfspassword').val();
                    data.GMLVersion = form.find('#add-layer-wfsgmlversion').val();
                    data.GMLGeometryProperty = form.find('#add-layer-wfsgmlgeometryproperty').val();
                    data.featureNamespaceURI = form.find('#add-layer-wfsfeaturenamespaceURI').val();
                    data.featureNamespace = form.find('#add-layer-wfsfeaturenamespace').val();
                    data.featureElement = form.find('#add-layer-wfsfeatureelement').val();
                    data.WFSVersion = (wmsVersion !== "") ? wmsVersion : form.find('#add-layer-interface-version > option').first().val();
                    data.geometryNamespaceURI = form.find('#add-layer-wfsgeometrynamespaceURI').val();
                }

                data.opacity = form.find('#opacity-slider').val();

                data.style = form.find('#add-layer-style').val();
                data.minScale = form.find('#add-layer-minscale').val();// || 16000000;
                data.maxScale = form.find('#add-layer-maxscale').val();// || 1;

                //data.descriptionLink = form.find('#add-layer-').val();
                data.legendImage = form.find('#add-layer-legendImage').val();
                //data.inspireTheme = form.find('#add-layer-inspire-theme').val();
                data.metadataId = form.find('#add-layer-datauuid').val();

                // layer type specific
                // TODO: maybe something more elegant?
                if(data.layerType === 'wmslayer') {
                    data.xslt = form.find('#add-layer-xslt').val();
                    data.gfiType = form.find('#add-layer-responsetype').val();
                }
                else if(data.layerType === 'wmtslayer') {
                    data.matrixSetId = form.find('#add-layer-matrixSetId').val();
                    data.matrixSet = form.find('#add-layer-matrixSet').val();
                }
                else if(data.layerType === 'wfslayer') {
                    admin = me.model.getAdmin();
                    // in insert all wfs properties are behind passthrough
                    if ((admin)&&(admin.passthrough)) {
                        _.forEach(admin.passthrough, function (value, key) {
                            data[key] = form.find("#add-layer-passthrough-"+key).val();
                        })
                    }
                }

                data.realtime = form.find('#add-layer-realtime').is(':checked');
                data.refreshRate = form.find('#add-layer-refreshrate').val();

                data.srs_name = form.find('#add-layer-srs_name').val();

                data.username = form.find('#add-layer-username').val();
                data.password = form.find('#add-layer-password').val();

                if (!data.gfiType) {
                    // if there isn't a selection, don't send anything so backend will keep the existing value
                    delete data.gfiType;
                }

                data.viewPermissions = '';
                for (var i = 0; i < me.roles.length; i += 1) {
                    if (form.find('#layer-view-roles-' + me.roles[i].id).is(':checked')) {
                        data.viewPermissions += me.roles[i].id + ',';
                    }
                }
                
                data.userThemeId = lcId;
                data.inspireTheme = lcId;				
				
				//Downloading service for GIS data layers
                data.downloadServiceUrl = form.find('#add-layer-download-service-url').val();
                data.copyrightInfo = form.find('#add-layer-copyright-info').val();

                // Layer class id aka. orgName id aka groupId
                data.groupId = lcId;

                if (data.layerUrl !== me.model.getInterfaceUrl() ||
                    data.layerName !== me.model.getLayerName()) {
                    var confirmMsg = me.instance.getLocalization('admin').confirmResourceKeyChange,
                        dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        btn = dialog.createCloseButton(me.instance.getLocalization().ok),
                        cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    
                    btn.addClass('primary');
                    cancelBtn.setTitle(me.instance.getLocalization().cancel);

                    btn.setHandler(function() {
                        dialog.close();
                        me._addLayerAjax(data, element);
                    });

                    cancelBtn.setHandler(function() {
                        dialog.close();
                    });

                    dialog.show(me.instance.getLocalization('admin')['warningTitle'], confirmMsg, [btn, cancelBtn]);
                    dialog.makeModal();
                } else {
                    me._addLayerAjax(data, element);
                }
            },
            /**
             * Save group or base layers
             *
             * @method saveCollectionLayer
             */
            saveCollectionLayer: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    groupElement = element.parents('.admin-add-group'),
                    accordion = element.parents('.accordion');
/*
                model.isBaseLayer() <- group vai base + layerType == 'collection'
                groupId <- organization
                */
                var sandbox = me.options.instance.getSandbox();
                var data = {
                    groupId : accordion.attr('lcid'),
                    layerType : 'collection',
                    isBase : me.model.isBaseLayer(),
                    inspireTheme : groupElement.find('#add-layer-inspire-theme').val()
                };

                if (me.model.getId() !== null && me.model.getId() !== undefined) {
                    data.layer_id = me.model.getId();
                }

                groupElement.find('[id$=-name]').filter('[id^=add-group-]').each(function (index) {
                    var lang = this.id.substring(10, this.id.indexOf('-name'));
                    data['name_' + lang] = this.value;
                });

                // permissions
                if(!me.model.getId()) {
                    var checkedPermissions = [];
                    groupElement.find('.layer-view-role').filter(':checked').each(function (index) {
                        checkedPermissions.push(jQuery(this).data('role-id'));
                    });

                    data.viewPermissions = checkedPermissions.join();
                }
                
                // make AJAX call
                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data : data,
                    beforeSend: function (x) {
                        jQuery('body').css({
                            cursor: 'wait'
                        });
                    },
                    url: sandbox.getAjaxUrl() + 'action_route=SaveLayer',
                    success: function (resp) {
                        jQuery('body').css('cursor', '');
                        if (!me.model.getId()) {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: 'adminAction',
                                command: 'addLayer',
                                layerData: resp
                            });
                        } else {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: 'adminAction',
                                command: 'editLayer',
                                layerData: resp
                            });
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        jQuery('body').css('cursor', '');
                        me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')['errorSaveGroupLayer']);
                    }
                });
            },
            removeLayerCollection: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget),
//                    editForm = element.parents('.admin-add-layer').attr('data-id'),
                    accordion = element.parents('.accordion');
                var sandbox = me.options.instance.getSandbox();
                // make AJAX call
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    data : {
                        layer_id : me.model.getId()
                    },
                    url: sandbox.getAjaxUrl() + 'action_route=DeleteLayer',
                    success: function (resp) {
                        accordion.trigger({
                            type: 'adminAction',
                            command: 'removeLayer',
                            modelId: me.model.getId()
                        });
                    },
                    error: function (jqXHR, textStatus) {
                        me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')['errorRemoveGroupLayer']);
                    }
                });
            },
            /**
             * Fetch capabilities. AJAX call to get capabilities for given capability url
             *
             * @method fetchCapabilities
             */
            fetchCapabilities: function (e) {
                e.stopPropagation();
                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.add-layer-wrapper'),
                    baseUrl = me.options.instance.getSandbox().getAjaxUrl();
                
                // Progress spinner
                me.progressSpinner.start();
                
                var serviceURL = form.find('#add-layer-interface').val(),
                    layerType = form.find('#add-layer-layertype').val(),
                    user = form.find('#add-layer-username').val(),
                    pw =  form.find('#add-layer-password').val();

                me.model.set({
                    '_layerUrls': [serviceURL]
                }, {
                    silent: true
                });
                me.model.set({_admin:{
                    username: user,
                    password: pw
                }}, {
                    silent: true
                });

                jQuery.ajax({
                    type: 'POST',
                    data: {
                        url: serviceURL,
                        type : layerType,
                        user: user,
                        pw: pw
                    },
                    url: baseUrl + 'action_route=GetWSCapabilities',
                    success: function (resp) {
                        me.progressSpinner.stop();
                        me.__capabilitiesResponseHandler(layerType, resp);
                    },
                    error: function (jqXHR, textStatus) {
                        me.progressSpinner.stop();
                        if (jqXHR.status !== 0) {
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin').metadataReadFailure);
                        }
                    }
                });
            },
            /**
             * Fetch WFS layer configuration. AJAX call to get configuration for given wfs layer id
             * Only for wfslayer-type
             * TODO: add this to button click for wfs spesific editing popup
             *
             * @method fetchWfsLayerConfiguration
             */
            fetchWfsLayerConfiguration: function (e) {
                var me = this,
                    //element = jQuery(e.currentTarget),
                    //form = element.parents('.add-wfs-layer-wrapper'),
                    baseUrl = me.options.instance.getSandbox().getAjaxUrl();

               // e.stopPropagation();

              /*  var serviceURL = form.find('#add-layer-interface').val(),
                    layerType = form.find('#add-layer-layertype').val(),
                    user = form.find('#add-layer-username').val(),
                    pw =  form.find('#add-layer-password').val();  */


                jQuery.ajax({
                    type: 'POST',
                    data: {
                        id: me.model.getId(),
                        redis : 'no'
                    },
                    url: baseUrl + 'action_route=GetWFSLayerConfiguration',
                    success: function (resp) {
                        me.model.setWfsConfigurationResponse(resp);
                    },
                    error: function (jqXHR, textStatus) {
                        if (jqXHR.status !== 0) {
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin').metadataReadFailure);
                        }
                    }
                }
                me.service.getCapabilities(me.model.getLayerType(), serviceURL, successCb, errorCb);
            },
            /**
             * Acts on capabilities response based on layer type
             * @param  {String} layerType 'wmslayer'/'wmtslayer'/'wfslayer'
             * @param  {String} response  GetWSCapabilities response
             */
            __capabilitiesResponseHandler : function(layerType, response) {
                var me = this;
                if(layerType === 'wmslayer') {
                    me.model.setCapabilitiesResponse(response);
                }
                else if(layerType === 'wmtslayer') {
                    var format = new OpenLayers.Format.WMTSCapabilities(),
                        caps = format.read(response.xml);
                    me.model.setOriginalMatrixSetData(caps);
                    me.model.setCapabilitiesResponse(response);
                    //me.model.change();
                } else if(layerType === 'wfslayer') {
                    me.model.setCapabilitiesResponse(response);
                }
            },
            handleCapabilitiesSelection: function (e) {
                var me = this,
                    current = jQuery(e.currentTarget);
                // stop propagation so handler on outer tags won't be triggered as well
                e.stopPropagation();
                var layerName = current.attr('data-layername'),
                    additionalId = current.attr('data-additionalId');
                if (layerName) {
                    // actual layer node -> populate model
                    me.model.setupCapabilities(layerName, null, additionalId);
                }
                else {
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
            getValue: function (object, key) {
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
            clearInput: function (e) {
                var element = jQuery(e.currentTarget),
                    input = element.parent().children(':input');
                if (input.length === 1) {
                    input.val('');
                }
            },

            /**
             * Stops propagation if admin clicks layer settings section.
             *
             * @method addLayer
             */
            clickLayerSettings: function (e) {
                e.stopPropagation();
            }
        });
    });