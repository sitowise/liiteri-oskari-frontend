/**
 * @class Oskari.liikennevirasto.bundle.lakapa.layerselector2.view.LayersTab
 *
 *
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.layerselector2.view.LayersTab",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance, title) {
    this.instance = instance;
    this.title = title;
    this.layerGroups = [];
    this.layerContainers = {};
    this._createUI();
}, {
    getTitle : function() {
        return this.title;
    },
    getTabPanel : function() {
        return this.tabPanel;
    },
    getState : function() {
        var state = {
            tab : this.getTitle(),
            filter : this.filterField.getValue(),
            groups : []
        };
        return state;
    },
    setState : function(state) {
        if(!state) {
            return;
        }

        if(!state.filter) {
            this.filterField.setValue(state.filter);
            this.filterLayers(state.filter);
        }
        if(state.groups && state.groups.length > 0) {
        }
    },
    _createUI : function() {

        this.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        this.tabPanel.setTitle(this.title);

        this.tabPanel.getContainer().append(this.getFilterField().getField());

        this.accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion.insertTo(this.tabPanel.getContainer());
    },
    getFilterField : function() {
        if(this.filterField) {
            return this.filterField;
        }
        var me = this;
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.addClearButton();
        field.bindChange(function(event) {
            me.filterLayers(field.getValue());
        }, true);
        this.filterField = field;
        return field;
    },
    showLayerGroups : function(groups) {
        var me = this;
        this.accordion.removeAllPanels();
        this.layerContainers = undefined;
        this.layerContainers = {};
        this.layerGroups = groups;
        for(var i = 0; i < groups.length; ++i) {
            var group = groups[i];
            var layers = group.getLayers();

            var groupPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
            group.layerListPanel = groupPanel;

            var groupContainer = groupPanel.getContainer();
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerWrapper =
                    Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.layerselector2.view.Layer',
                    layer, this.instance.sandbox, this.instance.getLocalization());
                var layerContainer = layerWrapper.getContainer();
                groupContainer.append(layerContainer);

                this.layerContainers[layer.getId()] = layerWrapper;
            }

            var serviceMetaDataUrl = null;
            try{
            	serviceMetaDataUrl = me.instance.conf.serviceMetadatas[group.getTitle()];
            } catch(err){}



            if(serviceMetaDataUrl){
	            groupPanel.html.find('.headerText').after('<a href="#" class="layer-info icon-info livi-layerselector-service-info"></a>');
	            groupPanel.html.find('.livi-layerselector-service-info').attr('data-uuid', serviceMetaDataUrl);
	            groupPanel.html.find('.livi-layerselector-service-info').attr('title', me.instance._localization.tooltip['type-service-info']);
	            groupPanel.html.find('.livi-layerselector-service-info').bind('click',function(evt){
	            	var uuid = jQuery(this).attr('data-uuid');
	            	if(uuid!=null || uuid!=''){
	            		me.instance.sandbox.postRequestByName('catalogue.ShowMetadataRequest', [{
	            			uuid : uuid
	            		}]);
	            	}
	            	evt.stopPropagation();
	            });
            }

            this.accordion.addPanel(groupPanel);
        }

        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < selectedLayers.length; ++i) {
            this.setLayerSelected(selectedLayers[i].getId(), true);
        }

        this.filterLayers(this.filterField.getValue());
    },
    /**
     * @method _filterLayers
     * @private
     * @param {String} keyword
     *      keyword to filter layers by
     * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
     * Also checks if all layers in a group is hidden and hides the group as well.
     */
    filterLayers : function(keyword) {

        // show all groups
        this.accordion.showPanels();
        if(!keyword || keyword.length == 0) {
            this._showAllLayers();
            return;
        }
        // filter
        var visibleGroupCount = 0;
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();
            var visibleLayerCount = 0;
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerId = layer.getId();
                var layerCont = this.layerContainers[layerId];
                var bln = group.matchesKeyword(layerId, keyword);
                layerCont.setVisible(bln);
                if(bln) {
                    visibleLayerCount++;
                    if(visibleLayerCount%2 == 1) {
                        layerCont.getContainer().addClass('odd');
                    }
                    else {
                        layerCont.getContainer().removeClass('odd');
                    }
                    // open the panel if matching layers
                    group.layerListPanel.open();
                }
            }
            group.layerListPanel.setVisible(visibleLayerCount > 0);
            if(group.layerListPanel.isVisible()) {
                visibleGroupCount++;
            }
            group.layerListPanel.setTitle(group.getTitle() + ' (' + visibleLayerCount +  '/' + layers.length + ')');
        }

        // check if there are no groups visible -> show 'no matches' notification
        // else clear any previous message
        if(visibleGroupCount == 0) {
            // empty result
            var loc = this.instance.getLocalization('errors');
            this.accordion.showMessage(loc.noResults);
        }
        else {
            this.accordion.removeMessage();
        }
    },

    _showAllLayers : function() {
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();

            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerId = layer.getId();
                var layerCont = this.layerContainers[layerId];
                layerCont.setVisible(true);
                if(n%2 == 1) {
                    layerCont.getContainer().addClass('odd');
                }
                else {
                    layerCont.getContainer().removeClass('odd');
                }
            }
            group.layerListPanel.setVisible(true);
            group.layerListPanel.close();
            group.layerListPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
        }
    },
    setLayerSelected : function(layerId, isSelected) {
        var layerCont = this.layerContainers[layerId];
        if(layerCont) {
            layerCont.setSelected(isSelected);
        }
    },
    updateLayerContent : function(layerId, layer) {
        var layerCont = this.layerContainers[layerId];
        if(layerCont) {
            layerCont.updateLayerContent(layer);
        }
    }
});
