Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.ContentPanel',
    function (view) {
        this.view         = undefined;
        this.instance     = undefined;
        this.sandbox      = undefined;
        this.loc          = undefined;
        this.mapModule    = undefined;
        this.features     = undefined;
        this.panel        = undefined;
        this.drawPluginId = undefined;
        this.drawPlugin   = undefined;
        this.featureLayer = undefined;
        this.layerType    = undefined;
        this.linkAction   = undefined;
        this.isStarted    = undefined;
        this.selectControl= undefined;

        me.view = undefined;
        me.instance = undefined;
        me.sandbox = undefined;
        me.loc = undefined;
        me.mapModule = undefined;
        me.features = undefined;
        me.dataPanel = undefined;
        me.drawToolsPanel = undefined;
        me.drawPluginId = undefined;
        me.drawPlugin = undefined;
        me.drawFilterPluginId = undefined;
        me.drawFilterPlugin = undefined;
        me.featureLayer = undefined;
        me.layerType = undefined;
        me.linkAction = undefined;
        me.isStarted = undefined;
        me.selectedGeometry = undefined;
        me.drawFilterMode = undefined;
        me.helpDialog = undefined;
        me.WFSLayerService = undefined;
        me.init(view);
        me.start();
    }, {
        /**
         * @static
         * @property _templates
         */
        _templates: {
            'help': '<div class="help icon-info"></div>',
            'buttons': '<div class="buttons"></div>',
            'layersContainer': '<div class="layers"></div>',
            'toolContainer': '<div class="toolContainer">' +
                    '<div class="title"></div>' +
                '</div>',
            'tool': '<div class="tool"></div>',
            'drawControls': '<div class="buttons"></div>',
            'search': '<div class="analyse-search"></div>'
        },
        /**
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function() {
            return this.panel;
        },
        /**
         * Returns the container where all the stuff is.
         * 
         * @method getPanelContainer
         * @return {jQuery}
         */
        getPanelContainer: function() {
            return this.getPanel().getContainer();
        },
        /**
         * @method getName
         * @return {String}
         */
        getName: function() {
            return this.instance.getName() + 'ContentPanel';
        },
        /**
         * Returns a list of all temporary features added.
         * 
         * @method getFeatures
         * @return {Object[]}
         */
        getFeatures: function() {
            return this.features;
        },
        /**
         * Returns the element which the layer list is rendered into.
         * 
         * @method getLayersContainer
         * @return {jQuery}
         */
        getLayersContainer: function() {
            return this.getPanelContainer().find('div.layers');
        },
        /**
         * Returns the type of the layer we fake here for the temporary features.
         * 
         * @method getLayerType
         * @return {String}
         */
        getLayerType: function() {
            return this.layerType;
        },
        /**
         * Empties the layer list.
         * 
         * @method emptyLayers
         */
        emptyLayers: function() {
            this.getLayersContainer().empty();
        },
        /**
         * @method onEvent
         * @param  {Oskari.Event} event
         */
        onEvent: function(event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) return handler.apply(this, [event]);
        },
        /**
         * @static
         * @property eventHandlers
         */
        eventHandlers: {
            'DrawPlugin.FinishedDrawingEvent': function(event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                this.addGeometry(event.getDrawing());
            }
        },

            'WFSFeatureGeometriesEvent': function (event) {
                var me = this,
                    layerId = event.getMapLayer().getId();

                if (!me.instance.analyse.isEnabled) {
                    return;
                }
                if (me.drawFilterMode) {
                    return;
                }
                // if selection is made from different layer than previous selection, empty selections from previous layer
                _.forEach(me.sandbox.findAllSelectedMapLayers(), function (layer) {
                    if (layer.hasFeatureData() && layerId !== layer.getId()) {
                        me.WFSLayerService.emptyWFSFeatureSelections(layer);
                    }
                });
                // if there are selected features, unselect them
                me.selectControl.unselectAll();

                //set selected geometry for filter json
                var geometries = [];
                _.forEach(event.getGeometries(), function (geometry) {
                    geometries.push(geometry[1]);
                });
                me.view.setFilterGeometry(geometries);

                // set selected geometries for drawFilter function
                var selectedGeometries = event.getGeometries();
                if (selectedGeometries.length > 0) {
                    var selectedGeometry = selectedGeometries[0];
                    me.selectedGeometry = me.parseFeatureFromClickedFeature(selectedGeometry);
                    me._operateDrawFilters();
                }
                me.drawControls.toggleEmptySelectionBtn(true);
            },

            'WFSFeaturesSelectedEvent': function (event) {
                var me = this,
                    layerId = event.getMapLayer().getId();

                if (me.drawFilterMode) {
                    return;
                }
                if (event.getWfsFeatureIds().length === 0 && layerId === me.WFSLayerService.getAnalysisWFSLayerId()) {
                    me.selectedGeometry = null;
                    me._disableAllDrawFilterButtons();
                    me.drawControls.toggleEmptySelectionBtn(false);
                }
            },

            'AfterMapMoveEvent': function (event) {
                if (this.drawFilterMode || !this.instance.analyse.isEnabled) {
                    return;
                }
                var olMap = this.mapModule.getMap(),
                layer = olMap.getLayersByName('AnalyseFeatureLayer')[0];
                this.mapModule.bringToTop(layer, 20);
            },
            'AfterMapLayerAddEvent': function(event) {
                this.toggleSelectionTools();
                this.drawControls.toggleEmptySelectionBtn((this.WFSLayerService.getWFSSelections() && this.WFSLayerService.getWFSSelections().length > 0));
            },
            'AfterMapLayerRemoveEvent': function(event) {
                this.toggleSelectionTools();
                this.drawControls.toggleEmptySelectionBtn((this.WFSLayerService.getWFSSelections() && this.WFSLayerService.getWFSSelections().length > 0));
            }
        },

        /**
         * Initializes the class.
         * Creates draw plugin and feature layer and sets the class/instance variables.
         * 
         * @method init
         * @param  {Oskari.analysis.bundle.analyse.view.StartAnalyse} view
         */
        init: function(view) {
            this.view         = view;
            this.instance     = this.view.instance;
            this.sandbox      = this.instance.getSandbox();
            this.loc          = this.view.loc;
            this.mapModule    = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            this.features     = [];
            this.featCounts   = {
                point: 0,
                line: 0,
                area: 0
            };

            me.drawControls = Oskari.clazz.create('Oskari.analysis.bundle.analyse.view.DrawControls',
                                me.instance,
                                me.loc,
                                function (isCancel) {me._stopDrawing(isCancel);},
                                function (drawMode) {me._startNewDrawing(drawMode);});

            me.dataPanel = me.drawControls.createDataPanel(me.loc);
            me.drawToolsPanel = me.drawControls.createDrawToolsPanel(me.loc);

            me.drawPluginId = me.instance.getName();
            me.drawPlugin = me._createDrawPlugin();
            me.drawFilterPluginId = me.instance.getName();
            me.drawFilterPlugin = me._createDrawFilterPlugin();
            me.featureLayer = me._createFeatureLayer(me.mapModule);
            me.layerType = 'ANALYSE_TEMP';
            me.linkAction = me.loc.content.search.resultLink;
            me.isStarted = false;
            this.selectControl= new OpenLayers.Control.SelectFeature(this.featureLayer);

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
            }
        },
        /**
         * Adds the feature layer to the map, stops all other draw plugins
         * and starts the draw plugin needed here.
         * 
         * @method start
         */
        start: function() {
            var sandbox = this.sandbox,
                rn = 'Search.AddSearchResultActionRequest',
                reqBuilder,
                request;

            // Already started so nothing to do here
            if (this.isStarted) return;    

            this._toggleDrawPlugins(false);
            this.mapModule.getMap().addLayer(this.featureLayer);

            this.mapModule.registerPlugin(this.drawPlugin);
            this.mapModule.startPlugin(this.drawPlugin);

            reqBuilder = sandbox.getRequestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(
                    this.linkAction, this._getSearchResultAction(), this);
                sandbox.request(this.instance, request);
            }

            this.isStarted = true;
        },
        /**
         * Destroys the created components and unsets the class/instance variables.
         * 
         * @method destroy
         */
        destroy: function() {
            for (var p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.unregisterFromEventByName(this, p);
                }
            }

            this.stop();
            this._destroyFeatureLayer();

            this.view         = undefined;
            this.instance     = undefined;
            this.sandbox      = undefined;
            this.loc          = undefined;
            this.mapModule    = undefined;
            this.features     = undefined;
            this.featCounts   = undefined;
            this.panel        = undefined;
            this.drawPluginId = undefined;
            this.drawPlugin   = undefined;
            this.layerType    = undefined;
            this.linkAction   = undefined;
            this.isStarted    = undefined;
        },
        /**
         * Removes the feature layer, stops the draw plugin and
         * restarts all other draw plugins.
         * 
         * @method stop
         */
        stop: function() {
            var sandbox = this.sandbox,
                rn = 'Search.RemoveSearchResultActionRequest',
                reqBuilder,
                request;

            // Already stopped so nothing to do here
            if (!this.isStarted) return;

            this.mapModule.stopPlugin(this.drawPlugin);
            this.mapModule.unregisterPlugin(this.drawPlugin);

            me.drawControls.closeHelpDialog();

            me.mapModule.stopPlugin(me.drawFilterPlugin);
            me.mapModule.unregisterPlugin(me.drawFilterPlugin);

            me.mapModule.getMap().removeLayer(me.featureLayer);

            me._deactivateSelectControls();
            me.drawControls.deactivateSelectTools();

            me._toggleDrawPlugins(true);
            me._toggleDrawFilterPlugins(true);

            reqBuilder = sandbox.getRequestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(this.linkAction);
                sandbox.request(this.instance, request);
            }

            this.isStarted = false;
        },
        /**
         * Returns the feature object by its id.
         * 
         * @method findFeatureById
         * @param  {String} id
         * @return {Object}
         */
        findFeatureById: function(id) {
            return _.find(this.getFeatures(), function(feature) {
                return feature.getId() === id;
            });
        },
        /**
         * Adds the given geometry to the feature layer
         * and to the internal list of features.
         * 
         * @method addGeometry
         * @private
         * @param {OpenLayers.Geometry} geometry
         * @param {String} name optional name for the temp feature
         */
        addGeometry: function(geometry, name) {
            var mode = this._getDrawModeFromGeometry(geometry),
                feature;

            if (mode) {
                feature = new OpenLayers.Feature.Vector(geometry);
                this.getFeatures().push(
                    this._createFakeLayer(feature.id, mode, name)
                );

                if (this.featureLayer) {
                    this.featureLayer.addFeatures([feature]);
                }
                this.featureLayer.events.on({
                    'featureselected': function (event) {
                        var wkt = new OpenLayers.Format.WKT(),
                            featureWKT = wkt.write(event.feature),
                            map = me.mapModule.getMap(),
                            sandbox = me.mapModule.getSandbox(),
                            layers = sandbox.findAllSelectedMapLayers();

                this.view.refreshAnalyseData(feature.id);
            }
        },
        /**
         * Removes the feature by given id from the feature layer
         * and from the internal feature list.
         * 
         * @method removeGeometry
         * @param  {String} id
         */
        removeGeometry: function(id) {
            var arr = this.features || [],
                i,
                arrLen,
                feature;

            for (i = 0, arrLen = arr.length; i < arrLen; ++i) {
                if (arr[i].getId() === id) {
                    arr.splice(i, 1);
                    break;
                }
            }

            if (this.featureLayer) {
                feature = this.featureLayer.getFeatureById(id);
                this.featureLayer.destroyFeatures([feature]);
            }

            this.view.refreshAnalyseData();
        },
        /**
         * Hilight the feature by given id from the feature layer
         * 
         * @method selectGeometry
         * @param  {String} id
         */
        selectGeometry: function(id) {
            var feature;

            if (this.featureLayer) {
                this.selectControl.unselectAll();
                if(id) {
                    feature = this.featureLayer.getFeatureById(id);
                    if(feature) {
                        this.selectControl.select(feature);
                    }
                }
            }
        },

        /*
         *******************
         * PRIVATE METHODS *
         *******************
         */

        /**
         * @method toggleSelectionTools
         * Sets the selection tools' status after a map layer has been added or removed. Disables controls if no wfs layers selected, enables tools otherwise
         * 
         * @method _createPanel
         * @private
         * @param {Object} loc
         * @return {Oskari.userinterface.component.AccordionPanel}
         *         Returns the created panel
         */
        _createPanel: function (loc) {
            var panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'),
                panelContainer = panel.getContainer(),
                layersCont = jQuery(this._templates.layersContainer).clone();
                //var tooltipCont = jQuery(this._templates.help).clone();
            panel.setTitle(loc.content.label);
            //tooltipCont.attr('title', loc.content.tooltip);

            //panelContainer.append(tooltipCont);
            panelContainer.append(layersCont);
            //panelContainer.append(this._createDataButtons(loc));
            panelContainer.append(this._createDrawButtons(loc));

            return panel;
        },
        toggleSelectionTools: function() {
            var me = this,
                selectionToolsToolContainer = jQuery('div.toolContainerToolDiv'),
                analysisWFSLayerSelected = (me.WFSLayerService.getAnalysisWFSLayerId() !== undefined && me.WFSLayerService.getAnalysisWFSLayerId() !== null);
            if (analysisWFSLayerSelected) {
                selectionToolsToolContainer.find('div[class*=selection-]').removeClass('disabled');
                if (!_.isEmpty(me.WFSLayerService.getSelectedFeatureIds(me.WFSLayerService.getAnalysisWFSLayerId()))) {
                    me.drawControls.toggleEmptySelectionBtn(true);
                } else {
                    me.drawControls.toggleEmptySelectionBtn(false);
                }
            } else {
                me.drawControls.deactivateSelectTools();
                selectionToolsToolContainer.find('div[class*=selection-]').addClass('disabled');
            }
            me.WFSLayerService.setSelectionToolsActive(analysisWFSLayerSelected);
        },

        /**
         * Creates and returns the draw plugin needed here.
         * 
         * @method _createDrawPlugin
         * @private
         * @return {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin}
         */
        _createDrawPlugin: function() {
            var drawPlugin = Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', {
                        id: this.drawPluginId,
                        multipart: true
                    });
            
            return drawPlugin;
        },
        /**
         * Creates and returns the filter control buttons.
         *
         * @method _createDrawFilterControls
         * @private
         * @return {Oskari.userinterface.component.Button[]}
         */
        _createDrawFilterControls: function () {
            var me = this,
                loc = me.loc.content.drawFilter.buttons,
                finishBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'
                );

            return container;
        },
        /**
         * Sends a request to open a Flyout impersonating
         * as the bundle provided in the name param.
         * 
         * @method _openFlyoutAs
         * @private
         * @param  {String} name
         */
        _openFlyoutAs: function(name) {
            var extension = {
                    getName: function () {
                        return name;
                    }
                },
                rn = 'userinterface.UpdateExtensionRequest';

            if(name === 'LayerSelector') {
                var requestName = 'ShowFilteredLayerListRequest';
                me.sandbox.postRequestByName(
                    requestName,
                    [null, 'featuredata']
                );
                clearTimeout(this._flyoutTimeOut);
                this._flyoutTimeOut = setTimeout(function(){
                    me.sandbox.postRequestByName(rn, [extension, 'attach', rn, '0', '424']);
                },100);
            } else {
                me.sandbox.postRequestByName(rn, [extension, 'attach', rn, '0', '424']);
            }
        },
        /**
         * Resets currently selected place and sends a draw request to plugin
         * with given config.
         * 
         * @method _startNewDrawing
         * @private
         * @param {Object} config params for StartDrawRequest
         */
        _startNewDrawing: function (config) {
            if (this.drawControls.helpDialog) {
                this.stopDrawing(true);
                this.drawControls.closeHelpDialog();
                this.drawControls.activateWFSLayer(true);
                return;
            }

            // Disable WFS highlight and GFI dialog
            this.drawControls.activateWFSLayer(false);

            // notify plugin to start drawing new geometry
            this._sendDrawRequest(config);
        },

        _startNewDrawFiltering: function (config) {
            if (this.helpDialog) {
                me._cancelDrawFilter();
                return;
            }


            var me = this,
                diaLoc = this.loc.content.drawFilter.dialog,
                controlButtons = [],
                dialogTitle,
                dialogText;

            // Enable and disable correct buttons
            if (config.mode === 'remove') {
                this._cancelDrawFilter();
            } else {
                // Enable only the remove button
                this._disableAllDrawFilterButtons();
                this.drawControls.activateWFSLayer(false);
                jQuery('div.drawFilter.analysis-selection-remove').removeClass('disabled');
                jQuery('div.drawFilter.analysis-selection-' + config.mode).addClass('selected');

                // Create help dialog
                this.helpDialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                );
                dialogTitle = diaLoc.modes[config.mode].title;
                dialogText = diaLoc.modes[config.mode].message;
                controlButtons = this._createDrawFilterControls();
                this.helpDialog.addClass('drawfilterdialog');
                this.helpDialog.show(dialogTitle, dialogText, controlButtons);
                this.helpDialog.
                moveTo('div.drawFilter.analysis-selection-' + config.mode, 'bottom');
            }

            // Disable WFS highlight and GFI dialog
            this.drawControls.activateWFSLayer(false);

            // notify plugin to start draw filtering new geometries
            this._sendDrawFilterRequest(config);
        },

        _cancelDrawFilter: function () {
            this.drawFilterMode = false;
            this._sendStopDrawFilterRequest(true);
            this._disableAllDrawFilterButtons();
            this.drawControls.activateWFSLayer(true);
            this.selectedGeometry = null;
            // Disable the remove button
            jQuery('div.drawFilter.analysis-selection-remove').addClass('disabled');
            // Remove the finish button
            this.getDrawToolsPanelContainer()
                .find('div.drawFilterContainer')
                .find('div.buttons').remove();
            delete this.helpDialog;
        },

        /**
         * Sends a StartDrawRequest with given params.
         * 
         * @method _sendDrawRequest
         * @private
         * @param {Object} config params for StartDrawRequest
         */
        _sendDrawRequest: function (config) {
            if(this.drawPlugin) {
                this.drawPlugin.startDrawing(config);
            }
        },

        /**
         * Sends a StopDrawingRequest.
         *
         * @method _sendStopDrawRequest
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        _stopDrawing: function (isCancel) {
            this.getDrawToolsPanelContainer()
                .find('div.toolContainer div.buttons')
                .remove();

            if(this.drawPlugin) {
                if (isCancel) {
                    // we wish to clear the drawing without sending further events
                    this.drawPlugin.stopDrawing();
                } else {
                    // pressed finished drawing, act like dblclick
                    this.drawPlugin.forceFinishDraw();
                }
            }
        },

        /**
         * Sends a StartDrawFilteringRequest with given params.
         *
         * @method _sendDrawFilterRequest
         * @private
         * @param {Object} config params for StartDrawFilteringRequest
         */
        _sendDrawFilterRequest: function (config) {
            var sandbox = this.sandbox,
                reqBuilder = sandbox.getRequestBuilder(
                    'DrawPlugin.StartDrawingRequest'),
                request;

            if (reqBuilder) {
                request = reqBuilder(config);
                sandbox.request(this.instance, request);
            }
        },
        /**
         * Sends a StopDrawingRequest.
         * 
         * @method _sendStopDrawRequest
         * @private
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        _sendStopDrawRequest: function (isCancel) {
            var sandbox = this.sandbox,
                reqBuilder = sandbox.getRequestBuilder('DrawPlugin.StopDrawingRequest'),
                request;

            this.getPanelContainer()
                .find('div.toolContainer div.buttons')
                .remove();

            if (reqBuilder) {
                request = reqBuilder(isCancel);
                sandbox.request(this.instance, request);
            }
        },
        /**
         * Creates a fake layer for analyse view which behaves
         * like an Oskari layer in some sense
         * (has all the methods needed in the view).
         * 
         * @method _createFakeLayer
         * @private
         * @param  {String} id the OpenLayers.Feature.Vector id
         * @param  {String} mode either 'area', 'line' or 'point'
         * @param {String} name fake layer's name (optional, generates it if not given)
         * @return {Object}
         */
        _createFakeLayer: function(id, mode, name) {
            var loc = this.loc.content.features.modes,
                name = name || (loc[mode] + ' ' + (++this.featCounts[mode])),
                layerType = this.getLayerType(),
                featureLayer = this.featureLayer,
                formatter = new OpenLayers.Format.GeoJSON;

            return {
                getId: function() {
                    return id;
                },
                getName: function() {
                    return name;
                },
                isLayerOfType: function(type) {
                    return type === layerType;
                },
                getLayerType: function() {
                    return 'temp';
                },
                getMode: function() {
                    return mode;
                },
                hasFeatureData: function() {
                    return false;
                },
                getOpacity: function() {
                    return (featureLayer.opacity * 100);
                },
                getFeature: function() {
                    return formatter.write(featureLayer.getFeatureById(id));
                }
            };
        },
        /**
         * Maps OpenLayers geometries into strings (draw modes).
         * 
         * @method _getDrawModeFromGeometry
         * @private
         * @param  {OpenLayers.Geometry} geometry
         * @return {String} 'area'|'line'|'point'
         */
        _getDrawModeFromGeometry : function(geometry) {
            var modes = {
                'OpenLayers.Geometry.MultiPoint'      : 'point',
                'OpenLayers.Geometry.Point'           : 'point',
                'OpenLayers.Geometry.MultiLineString' : 'line',
                'OpenLayers.Geometry.LineString'      : 'line',
                'OpenLayers.Geometry.MultiPolygon'    : 'area',
                'OpenLayers.Geometry.Polygon'         : 'area'
            };

            return (geometry ? modes[geometry.CLASS_NAME] : undefined);
        },
        /**
         * Creates the feature layer where the drawn features are added to
         * and adds it to the map.
         * 
         * @method _createFeatureLayer
         * @private
         * @return {OpenLayers.Layer.Vector}
         */
        _createFeatureLayer: function(mapModule) {
            var layer = new OpenLayers.Layer.Vector('AnalyseFeatureLayer');

            mapModule.getMap().addLayer(layer);

            return layer;
        },
        /**
         * Destroys the feature layer and removes it from the map.
         * 
         * @method _destroyFeatureLayer
         * @private
         */
        _destroyFeatureLayer: function() {
            var map = this.mapModule.getMap();

            if (this.featureLayer) {
                map.removeLayer(this.featureLayer);
                this.featureLayer.destroyFeatures();
                this.featureLayer.destroy();
                this.featureLayer = undefined;
            }
        },
        /**
         * @method  @private _isPluginNamed
         * @param  {Object}  plugin Oskari plugin
         * @param  {String}  regex  regex
         * @return {Boolean}        is plugin not named
         */
        _isPluginNamed: function(plugin, regex) {
            // Check at puligin has name
            if(!plugin || !plugin.getName()) {
                return false;
            }

            return plugin.getName().match(regex) && plugin.getName() !== me.drawPlugin.getName();
        },

        /**
         * Either starts or stops draw plugins which are added to the map module
         * (except the one created in this class).
         * 
         * @method _toggleDrawPlugins
         * @private
         * @param  {Boolean} enabled
         */
        _toggleDrawPlugins: function(enabled) {
            var me = this,
                sandbox = me.sandbox,
                mapModule = me.mapModule;

            var drawPlugins = _.filter(
                mapModule.getPluginInstances(),
                function (plugin) {
                    return me._isPluginNamed(plugin, /DrawPlugin$/);
                });

            _.each(drawPlugins, function(plugin) {
                if (enabled) mapModule.startPlugin(plugin);
                else mapModule.stopPlugin(plugin);
            });
        },
        /**
         * Either starts or stops draw filter plugins which are added to the map module
         *
         * @method _toggleDrawFilterPlugins
         * @private
         * @param  {Boolean} enabled
         */
        _toggleDrawFilterPlugins: function (enabled) {
            var me = this,
                sandbox = this.sandbox,
                mapModule = this.mapModule;

            var drawFilterPlugins = _.filter(
                mapModule.getPluginInstances(),
                function (plugin) {
                    return  me._isPluginNamed(plugin, /DrawFilterPlugin$/);
                }
            );

            _.each(drawFilterPlugins, function (plugin) {
                if (enabled) {
                    mapModule.startPlugin(plugin);
                } else {
                    mapModule.stopPlugin(plugin);
                }
            });
        },

        /**
         * Returns a function that gets called in search bundle with
         * the search result as an argument which in turn returns
         * a function that gets called when the user clicks on the link
         * in the search result popup.
         * 
         * @method _getSearchResultAction
         * @private
         * @return {Function}
         */
        _getSearchResultAction: function() {
            var me = this;

            return function(result) {
                return function() {
                    var geometry = new OpenLayers.Geometry.Point(
                            result.lon, result.lat),
                        name = (result.name + ' (' + result.village + ')');

                    me.addGeometry(geometry, name);
                };
            };
        }
            var type = this.selectedGeometry.geometry.CLASS_NAME;
            // Enable or disable buttons depending on the selected feature type
            switch (type) {
                case 'OpenLayers.Geometry.LineString':
                    pointButton.removeClass('disabled');
                    lineButton.addClass('disabled');
                    editButton.addClass('disabled');
                    removeButton.addClass('disabled');
                    break;
                case 'OpenLayers.Geometry.MultiPolygon':
                    pointButton.addClass('disabled');
                    lineButton.removeClass('disabled');
                    editButton.removeClass('disabled');
                    removeButton.addClass('disabled');
                    break;
                default:
                    pointButton.addClass('disabled');
                    lineButton.addClass('disabled');
                    editButton.addClass('disabled');
                    removeButton.addClass('disabled');
                    break;
            }
        },

        _disableAllDrawFilterButtons: function () {
            jQuery('div.drawFilter').addClass('disabled');
            jQuery('div.drawFilter').removeClass('selected');
            // Close the help dialog
            this.drawControls.closeHelpDialog();
        },
    }
);
