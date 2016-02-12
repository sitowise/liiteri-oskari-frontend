define([
        "text!_bundle/templates/layerSelectorTemplate.html",
        "text!_bundle/templates/tabTitleTemplate.html",
        '_bundle/collections/allLayersCollection',
        '_bundle/models/layersTabModel',
        '_bundle/models/userThemesTabModel',
        '_bundle/views/tabPanelView',
		'_bundle/models/userGisDataTabModel'
    ],
    function (ViewTemplate, TabTitleTemplate, LayerCollection, LayersTabModel, UserThemesTabModel, TabPanelView, UserGisDataTabModel) {
        return Backbone.View.extend({


            /**
             * This object contains backbone event-handling.
             * It binds methods to certain events fired by different elements.
             *
             * @property events
             * @type {Object}
             */
            events: {
                "click .admin-layer-tab": "toggleTab",
                "keydown .admin-layerselectorapp": "catchInputs",
                "keyup .admin-layerselectorapp": "catchInputs"
            },

            /**
             * At initialization we bind passed container element as a root element
             * for this view, add templates and other initialization steps.
             *
             * @method initialize
             */
            initialize: function () {
                this.instance = this.options.instance;
                this.el = this.options.el;
                this.appTemplate = _.template(ViewTemplate);
                this.tabTitleTemplate = _.template(TabTitleTemplate);
                this.selectedType = 'userThemes';
                _.bindAll(this);
                //render this view immediately after initialization.
                this.render();
            },

            /**
             * Add HTML templates to this view (appTemplate & tabs)
             *
             * @method render
             */
            render: function () {
                this.el.html(this.appTemplate);
                // TODO this is empty rendering for inspire tab - instead, we should render
                // somekind of notification that we are wating for data.
                // this._renderLayerGroups(null, 'inspire');
            },

            /**
             * Add HTML templates to this view (appTemplate & tabs)
             *
             * @method render
             * @param {Object} LayerGroupingTab contains layersTabModel
             * @param {String} tabType - what kind of tab this is (inspire vs. organization)
             */
            _renderLayerGroups: function (layerGroupingTab, tabType) {
                if (!layerGroupingTab) {
                    return;
                }
                //create tab container
                var tabContent = new TabPanelView({
                    layerGroupingModel: layerGroupingTab,
                    instance: this.instance,
                    tabId: tabType
                });
                //create headers for tabs
                jQuery('.admin-layerselectorapp').find('.tabsContent').append(tabContent.$el);
                jQuery('.admin-layerselectorapp').find('.tabsHeader ul').append(
                    this.tabTitleTemplate({
                        title: tabContent.layerGroupingModel.getTitle(),
                        tabId: tabType
                    }));
            },
            removeLayer : function(layerId) {
                // removing layer from the main collection
                // layer groups monitor the main collection and update 
                // their state based on changes to the main collection
                var models = this.instance.models.layers;
                var layer = models.get(layerId);
                models.removeLayer(layerId);
                // trigger change for sublayers parent so changes reflect on UI
                if(layer.getParentId() !== -1) {
                    var parent = models.get(layer.getParentId());
                    if(parent) {
                        parent.trigger('change', parent);
                    }
                }
            },
            addToCollection: function (layerList) {
                if(!this.instance.models || !this.instance.models.layers) {
                    return false;
                }
                var models = this.instance.models.layers;
                // merge updates existing
                models.add(layerList, {merge: true});
                _.each(layerList, function(layer) {
                    if(layer.getParentId() === -1) {
                        return;
                    }
                    // trigger change for sublayers parent so changes reflect on UI
                    var parent = models.get(layer.getParentId());
                    if(parent) {
                        parent.trigger('change', parent);
                    }
                });
                return true;
            },
            /**
             * Adds layer models and uses those to create layersTabModels
             *
             * @method addToCollection
             * @param {Array} models which are created from layers.
             */
            createUI: function (models) {
                var collection = new LayerCollection(models);
                this.instance.models = {
                    "layers" : collection
                };
                // clear everything
                this.el.html(this.appTemplate);

                // create tabModel for inspire classes
                this.inspireTabModel = new LayersTabModel({
                    layers: collection,
                    type: 'inspire',
                    baseUrl : this.instance.getSandbox().getAjaxUrl() + '&action_route=',
                    actions : {
                        load : "InspireThemes",
                        save : "InspireThemes",
                        remove : "InspireThemes"
                    },
                    title: this.instance.getLocalization('filter').inspire
                });
                // render inspire classes
                this._renderLayerGroups(this.inspireTabModel, 'inspire');

                // create tabModel for user themes
                this.userThemesTabModel = new UserThemesTabModel({
                    layers: collection,
                    type: 'userThemes',
                    baseUrl: this.instance.getSandbox().getAjaxUrl() + '&action_route=',
                    actions: {
                        load: "GetUserThemes",
                        save: "Not implemented",
                        remove: "Not implemented"
                    },
                    title: this.instance.getLocalization('filter').userThemes
                });
                // render organizations
                this._renderLayerGroups(this.userThemesTabModel, 'userThemes');
				
				// create tabModel for user GIS data
                // this.userGisDataTabModel = new UserGisDataTabModel({
                    // layers: collection,
                    // type: 'userGisData',
                    // baseUrl: this.instance.getSandbox().getAjaxUrl() + '&action_route=',
                    // actions: {
                        // load: "Not implemented",
                        // save: "Not implemented",
                        // remove: "Not implemented"
                    // },
                    // title: "Own GIS data" //TODO: localization
                // });
                // render organizations
                this._renderLayerGroups(this.userGisDataTabModel, 'userGisData');

                // FIXME: not really comfortable with this but need 
                // the references on layer forms and instance is available
                // maybe create a service to store these?
//                this.instance.models.inspire = this.inspireTabModel;
//                this.instance.models.organization = this.organizationTabModel;
                this.instance.models.userThemes = this.userThemesTabModel;
				//this.instance.models.userGisData = this.userGisDataTabModel;

                // activate organization tab
                jQuery('.admin-layerselectorapp .tabsHeader').find('.userThemes').parent().addClass('active');
//                jQuery('.tab-content.inspire').hide();
//                jQuery('.tab-content.organization').hide();
                jQuery('.tab-content.userThemes').show();
				jQuery('.tab-content.userGisData').hide();

                // Check that data for classes is fetched
                // FIXME we shouldn't need to do this everytime, just once?
                //console.log("Getting inspire themes and map layer classes");
//                this.inspireTabModel.getClasses('getInspireName');
//                this.organizationTabModel.getClasses('getOrganizationName');
                this.userThemesTabModel.getClasses();
				//this.userGisDataTabModel.getClasses();
                return true;
            },

            /**
             * Changes tab when user clicks one of them
             *
             * @method toggleTab
             * @param {Object} e - click event
             */
            toggleTab: function (e) {
                // this event does not need to bubble up.
                e.stopPropagation();
                var target = jQuery(e.currentTarget),
                    type = target.attr('data-tab');

                // change class 'active' to correct tab
                jQuery('.tabsHeader').find('.active').removeClass('active');
                target.parent().addClass('active');

                // change focus and visibility
                // TODO: part of this should be done through CSS classes
                /*if (type == 'inspire') {
                    jQuery('.tab-content.organization').hide();
                    jQuery('.tab-content.userThemes').hide();
                    jQuery('.tab-content.inspire').show();
                    jQuery('.tab-content.inspire').find('.admin-filter-input').focus();
                    this.selectedType = type;
                } else if (type == 'organization') {
                    jQuery('.tab-content.inspire').hide();
                    jQuery('.tab-content.userThemes').hide();
                    jQuery('.tab-content.organization').show();
                    jQuery('.tab-content.organization').find('.admin-filter-input').focus();
                    this.selectedType = type;
                }*/
				if (type == 'userThemes') {
                    jQuery('.tab-content.userGisData').hide();
                    jQuery('.tab-content.userThemes').show();
                    jQuery('.tab-content.userThemes').find('.admin-filter-input').focus();
                    this.selectedType = type;
                } else if (type == 'userGisData') {
                    jQuery('.tab-content.userThemes').hide();
                    jQuery('.tab-content.userGisData').show();
                    jQuery('.tab-content.userGisData').find('.admin-filter-input').focus();
                    this.selectedType = type;
                }


            },

            /**
             * Catches all the events that try to bubble outside of this admin tool.
             *
             * @method catchInputs
             * @param {Object} e - click event
             */
            catchInputs: function (e) {
                e.stopPropagation();
            }

        });
    });