define([
        "text!_bundle/templates/layerSelectorTemplate.html",
        "text!_bundle/templates/tabTitleTemplate.html",
        '_bundle/collections/allLayersCollection',
        '_bundle/models/layersTabModel',
        '_bundle/views/tabPanelView'
    ],
    function (ViewTemplate, TabTitleTemplate, LayerCollection, LayersTabModel, TabPanelView) {
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
                this.selectedType = 'organization';
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

                // create tabModel for organization
                this.organizationTabModel = new LayersTabModel({
                    layers: collection,
                    type: 'organization',
                    baseUrl : this.instance.getSandbox().getAjaxUrl() + '&action_route=',
                    actions : {
                        load : "GetMapLayerGroups",
                        save : "SaveOrganization",
                        remove : "DeleteOrganization"
                    },
                    title: this.instance.getLocalization('filter').organization
                });
                // render organizations
                this._renderLayerGroups(this.organizationTabModel, 'organization');

                this.instance.models.inspire = this.inspireTabModel;
                this.instance.models.organization = this.organizationTabModel;

                // activate organization tab
                jQuery('.admin-layerselectorapp .tabsHeader').find('.organization').parent().addClass('active');
                jQuery('.tab-content.inspire').hide();
                jQuery('.tab-content.organization').show();

                // Check that data for classes is fetched
                this.inspireTabModel.getClasses('getInspireName');
                this.organizationTabModel.getClasses('getOrganizationName');
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
                if (type === 'inspire') {
                    jQuery('.tab-content.organization').hide();
                    jQuery('.tab-content.inspire').show();
                    jQuery('.tab-content.inspire').find('.admin-filter-input').focus();
                    this.selectedType = type;
                } else if (type === 'organization') {
                    jQuery('.tab-content.inspire').hide();
                    jQuery('.tab-content.organization').show();
                    jQuery('.tab-content.organization').find('.admin-filter-input').focus();
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