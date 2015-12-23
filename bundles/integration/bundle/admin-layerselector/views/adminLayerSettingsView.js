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
                "click .admin-add-layer-ok": "addLayer",
                "click .admin-add-sublayer-ok": "addLayer",
                "click .admin-add-layer-cancel": "hideLayerSettings",
                "click .admin-remove-layer": "removeLayer",
                "click .admin-remove-sublayer": "removeLayer",
                "click .show-edit-layer": "clickLayerSettings",
                "click #add-layer-wms-button": "fetchCapabilities",
                "click .icon-close": "clearInput",
                "change #add-layer-type": "createLayerSelect",
                "click .admin-add-group-ok": "saveCollectionLayer",
                "click .admin-add-group-cancel": "hideLayerSettings",
                "click .admin-remove-group": "removeLayerCollection",
                "click .add-layer-record.capabilities li" :"handleCapabilitiesSelection"
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

                this._rolesUpdateHandler();
                if(this.model) {
                    // listenTo will remove dead listeners, use it instead of on()
                    this.listenTo(this.model, 'change', this.render);
                    //this.model.on('change', this.render, this);
                }

                this.render();
            },

            /**
             * Renders layer settings
             *
             * @method render
             */
            render: function () {
                var me = this;
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
                    } else if(me.model.isLayerOfType('WMS')) {
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
                        localization: me.options.instance.getLocalization('admin')
                    }));
                }
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
                    var groupTitle = (e.currentTarget.value === 'base' ? 'baseName' : 'groupName');

                    this.createGroupForm(groupTitle, e);
                }
            },
            createGeneralLayerForm: function (e, modelName, template) {
                var me = this,
                    supportedLanguages = Oskari.getSupportedLanguages(),
                    opacity = 100,
                    readOnly = false,
                    styles = [];

                if (!me.model) {
                    me.model = this._createNewModel(modelName);
                    this.listenTo(this.model, 'change', this.render);
                } else if (modelName == 'wfslayer') {
                    readOnly = true;
                }

                // This propably isn't the best way to get reference to inspire themes
                //var inspireGroups = this.instance.models.inspire.getGroupTitles();
                var inspireGroups = [];
                me.$el.append(me[template]({
                    readOnly: readOnly,
                    model: me.model,
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
                            var input = jQuery(ui.handle).parents('.left-tools').find("input.opacity-slider.opacity");
                            input.val(ui.value);
                        }
                    });
                    me.$el.find("input.opacity-slider.opacity").on('change paste keyup', function () {
                        var sldr = me.$el.find('.layout-slider');
                        sldr.slider('value', jQuery(this).val());
                    });
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
                    addLayerDiv = element.parents('.admin-add-layer');

                var confirmMsg = me.instance.getLocalization('admin').confirmDeleteLayer;
                if(!confirm(confirmMsg)) {
                    // existing layer/cancel!!
                    return;
                }

                var sandbox = me.options.instance.getSandbox();
                jQuery.ajax({
                    type: "GET",
                    dataType: 'json',
                    data : {
                        layer_id : me.model.getId()
                    },
                    url: sandbox.getAjaxUrl() + "action_route=DeleteLayer",
                    success: function (resp) {
                        if (!resp) {
                            //close this
                            if (addLayerDiv.hasClass('show-edit-layer')) {
                                addLayerDiv.removeClass('show-edit-layer');
                                // bubble this action to the View
                                // = outside of backbone implementation
                                element.trigger({
                                    type: "adminAction",
                                    command: 'removeLayer',
                                    modelId: me.model.getId(),
                                    baseLayerId: me.options.baseLayerId
                                });
                                addLayerDiv.remove();

                            }

                        }/* else {
                            //problem
                            console.log('Removing layer did not work.')
                        }*/
                    },
                    error: function (jqXHR, textStatus) {
                        if (jqXHR.status !== 0) {
                            alert(' Removing layer did not work. ');
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

                var me = this,
                    element = jQuery(e.currentTarget),
                    accordion = element.parents('.accordion'),
                    lcId = accordion.attr('lcid'),
                    form = element.parents('.admin-add-layer'),
                    data = {},
                    wmsVersion = form.find('#add-layer-interface-version').val(),
                    createLayer;

                // If this is a sublayer -> setup parent layers id
                if (me.options.baseLayerId) {
                    data.parentId = me.options.baseLayerId;
                }

                // add layer type and version
                data.version = (wmsVersion !== "") ? wmsVersion : form.find('#add-layer-interface-version > option').first().val();

                // base and group are always of type wmslayer
                data.layerType = form.find('#add-layer-type').val() || 'wmslayer';
                //FIXME: incorrect type
                if (data.layerType == 'wfs')
                    data.layerType = 'wfslayer';
                if (me.model.getId() !== null && me.model.getId() !== undefined) {
                    data.layer_id = me.model.getId();
                }

                form.find('[id$=-name]').filter('[id^=add-layer-]').each(function (index) {
                    var lang = this.id.substring(10, this.id.indexOf("-name"));
                    data['name_' + lang] = this.value;
                });
                form.find('[id$=-title]').filter('[id^=add-layer-]').each(function (index) {
                    var lang = this.id.substring(10, this.id.indexOf("-title"));
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
                data.xslt = form.find('#add-layer-xslt').val();
                data.gfiType = form.find('#add-layer-responsetype').val();

                data.realtime = form.find('#add-layer-realtime').is(':checked');
                data.refreshRate = form.find('#add-layer-refreshrate').val();

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

                var sandbox = me.instance.getSandbox();
                jQuery.ajax({
                    type: "POST",
                    data : data,
                    dataType: 'json',
                    url: sandbox.getAjaxUrl() + "action_route=SaveLayer",
                    success: function (resp) {
                        // response should be a complete JSON for the new layer
                        if(!resp) {
                            alert(me.instance.getLocalization('admin').update_or_insert_failed);
                        }
                        else if(resp.error) {
                            alert(me.instance.getLocalization('admin')[resp.error] || resp.error);
                        }
                        // happy case - we got id
                        if (resp.id) {

                            //FIXME: workaround as user theme id is not in OskariLayer object
                            if (!resp.admin)
                                resp.admin = {};
                            resp.admin['userThemesId'] = parseInt(lcId, 10);

                            // close this
                            form.removeClass('show-add-layer');
                            createLayer = form.parents('.create-layer');
                            if (createLayer) {
                                createLayer.find('.admin-add-layer-btn').html(me.instance.getLocalization('admin').addLayer);
                                createLayer.find('.admin-add-layer-btn').attr('title', me.instance.getLocalization('admin').addLayerDesc);
                            }
                            form.remove();
                            if (!me.model.getId()) {
                                //trigger event to View.js so that it can act accordingly
                                accordion.trigger({
                                    type: "adminAction",
                                    command: 'addLayer',
                                    layerData: resp,
                                    baseLayerId: me.options.baseLayerId
                                });
                            } else {
                                //trigger event to View.js so that it can act accordingly
                                accordion.trigger({
                                    type: "adminAction",
                                    command: 'editLayer',
                                    layerData: resp,
                                    baseLayerId: me.options.baseLayerId
                                });
                            }
                        }
                        if(resp.warn) {
                            alert(me.instance.getLocalization('admin')[resp.warn] || resp.warn);
                        }
                    },
                    error: function (jqXHR, textStatus) {
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
                                    if(errVar) {
                                        if(loc[errVar]) {
                                            err += loc[errVar];
                                        }
                                        else {
                                            err += errVar;
                                        }
                                    }
                                }
                            }
                            alert(err);
                        }
                    }
                });
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
                    var lang = this.id.substring(10, this.id.indexOf("-name"));
                    data['name_' + lang] = this.value;
                });

                // permissions
                if(!me.model.getId()) {
                    var checkedPermissions = [];
                    groupElement.find(".layer-view-role").filter(":checked").each(function (index) {
                        checkedPermissions.push(jQuery(this).data("role-id"));
                    });

                    data.viewPermissions = checkedPermissions.join();
                }
                
                // make AJAX call
                jQuery.ajax({
                    type: "POST",
                    dataType: 'json',
                    data : data,
                    beforeSend: function (x) {
                        jQuery("body").css({
                            cursor: "wait"
                        });
                    },
                    url: sandbox.getAjaxUrl() + "action_route=SaveLayer",
                    success: function (resp) {
                        jQuery("body").css("cursor", "");
                        if (!me.model.getId()) {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: "adminAction",
                                command: 'addLayer',
                                layerData: resp
                            });
                        } else {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: "adminAction",
                                command: 'editLayer',
                                layerData: resp
                            });
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        jQuery("body").css("cursor", "");
                        alert('Failed to save grouplayer');
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
                    type: "GET",
                    dataType: 'json',
                    data : {
                        layer_id : me.model.getId()
                    },
                    url: sandbox.getAjaxUrl() + "action_route=DeleteLayer",
                    success: function (resp) {
                        accordion.trigger({
                            type: "adminAction",
                            command: 'removeLayer',
                            modelId: me.model.getId()
                        });
                    },
                    error: function (jqXHR, textStatus) {
                        alert('Removing group failed');
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
                
                var serviceURL = form.find('#add-layer-interface').val();
                
                me.model.set({
                    "_wmsUrls" : [serviceURL]
                }, { silent: true });

                var successCb = function (resp) {
                    me.model.setCapabilitiesResponse(resp);
                }
                var errorCb = function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        alert(me.instance.getLocalization('admin').metadataReadFailure);
                    }
                }
                me.service.getCapabilities(me.model.getLayerType(), serviceURL, successCb, errorCb);
            },
            handleCapabilitiesSelection : function(e) {
                var me = this,
                    current = jQuery(e.currentTarget);
                // stop propagation so handler on outer tags won't be triggered as well
                e.stopPropagation();
                var wmsName = current.attr('data-wmsname');
                if(wmsName) {
                    // actual layer node -> populate model
                    me.model.setupCapabilities(wmsName);
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