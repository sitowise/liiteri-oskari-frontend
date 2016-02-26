/**
 * @class Oskari.mapframework.core.Core.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari core as they
 * were in the class itself.
 */
Oskari.clazz.category(
    'Oskari.mapframework.core.Core',
    'map-layer-methods', {
        /**
         * @public @method isLayerAlreadySelected
         * Checks if the layer matching the id is added to map
         *
         * @param {String} id ID of the layer to check
         *
         * @return {Boolean} true if the layer is added to map
         */
        isLayerAlreadySelected: function (id) {
            var mapLayerService = this.getService(
                    'Oskari.mapframework.service.MapLayerService'
                ),
                layer = mapLayerService.findMapLayer(id, this._selectedLayers);

            //var layer = this.findMapLayer(id, this._selectedLayers);
            return (layer !== null && layer !== undefined);
        },

    /**
     * @method findMapLayerFromSelectedMapLayers
     * Returns the layer domain object matching the id if it is added to map
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromSelectedMapLayers: function (id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService'),
            layer = mapLayerService.findMapLayer(id, this._selectedLayers);
        return layer;
    },
    /**
     * @method isMapLayerAlreadyHighlighted
     * Checks if the layer matching the id is "highlighted". Highlighted wfslayer responds to map
     * clicks by highlighting a clicked feature.
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is highlighted
     */
    isMapLayerAlreadyHighlighted: function (id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService'),
            layer = mapLayerService.findMapLayer(id, this._mapLayersHighlighted);
        if (layer === null || layer === undefined) {
            this.printDebug("[core-map-layer-methods] " + id + " is not yet highlighted.");
        }
        return (layer !== null && layer !== undefined);
    },
    /**
     * @method findMapLayerFromAllAvailable
     * Finds map layer from all available. Uses Oskari.mapframework.service.MapLayerService.
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromAllAvailable: function (id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService'),
            layer = mapLayerService.findMapLayer(id);
        if (layer === null || layer === undefined) {
            this.printDebug("Cannot find map layer with id '" + id + "' from all available. " +
                "Check that current user has VIEW permissions to that layer.");
        }
        return layer;
    },
    /**
     * @method getAllSelectedLayers
     * Returns all currently selected map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    getAllSelectedLayers: function () {
        return this._selectedLayers;
    },
    /**
     * @method getAllHighlightedMapLayers
     * Returns all currently highlighted map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    getAllHighlightedMapLayers: function () {
        return this._mapLayersHighlighted;
    },
    /**
     * @method allowMultipleHighlightLayers
     * Allow multiple layers to be highlighted at once
     *
     * @param {Boolean} allow - true to allow, false to restrict to one highlight at a time
     */
    allowMultipleHighlightLayers: function (allow) {
        this._allowMultipleHighlightLayers = allow;
    },
    /**
     * @method handleAddMapLayerRequest
     * Handles AddMapLayerRequests, adds the map layer to selected layers and sends out
     * an AfterMapLayerAddEvent to signal that a map layer has been selected.
     *
     * @param {Oskari.mapframework.request.common.AddMapLayerRequest} request
     * @private
     */
    _handleAddMapLayerRequest: function (request) {
        var me = this,
            id = request.getMapLayerId(),
            keepLayersOrder = request.getKeepLayersOrder(), // TODO we need to pass this as false from layerselector...
            isBaseMap = request.isBasemap()
            groupName = request.getGroupName();

            return layer;
        },

        /**
         * @public @method isMapLayerAlreadyHighlighted
         * Checks if the layer matching the id is "highlighted". Highlighted
         * wfslayer responds to map clicks by highlighting a clicked feature.
         *
         * @param {String} id ID of the layer to check
         *
         * @return {Boolean} True if the layer is highlighted
         */
        isMapLayerAlreadyHighlighted: function (id) {
            var mapLayerService = this.getService(
                    'Oskari.mapframework.service.MapLayerService'
                ),
                layer = mapLayerService.findMapLayer(
                    id,
                    this._mapLayersHighlighted
                );

            if (layer === null || layer === undefined) {
                this.printDebug(
                    '[core-map-layer-methods] ' + id + ' is not yet highlighted.'
                );
            }
            return (layer !== null && layer !== undefined);
        },

        /**
         * @public @method findMapLayerFromAllAvailable
         * Finds map layer from all available. Uses
         * Oskari.mapframework.service.MapLayerService.
         *
         * @param {String} id ID of the layer to get
         *
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * Layer domain object if found matching id or null if not found
         */
        findMapLayerFromAllAvailable: function (id) {
            var mapLayerService = this.getService(
                    'Oskari.mapframework.service.MapLayerService'
                ),
                layer = mapLayerService.findMapLayer(id);

            if (layer === null || layer === undefined) {
                this.printDebug('Cannot find map layer with id "' + id +
                    '" from all available. ' +
                    'Check that current user has VIEW permissions to that layer.');
            }
            return layer;
        },

        /**
         * @public @method getAllSelectedLayers
         * Returns all currently selected map layers
         *
         *
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        getAllSelectedLayers: function () {
            return this._selectedLayers;
        },

        /**
         * @public @method getAllHighlightedMapLayers
         * Returns all currently highlighted map layers
         *
         *
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        getAllHighlightedMapLayers: function () {
            return this._mapLayersHighlighted;
        },

        /**
         * @public @method allowMultipleHighlightLayers
         * Allow multiple layers to be highlighted at once
         *
         * @param {Boolean} allow
         * True to allow, false to restrict to onehighlight at a time
         *
         */
        allowMultipleHighlightLayers: function (allow) {
            this._allowMultipleHighlightLayers = allow;
        },

        /**
         * @private @method handleAddMapLayerRequest
         * Handles AddMapLayerRequests, adds the map layer to selected layers and sends out
         * an AfterMapLayerAddEvent to signal that a map layer has been selected.
         *
         * @param {Oskari.mapframework.request.common.AddMapLayerRequest} request
         *
         */
        _handleAddMapLayerRequest: function (request) {
            var me = this,
                id = request.getMapLayerId(),
                keepLayersOrder = request.getKeepLayersOrder(), // TODO we need to pass this as false from layerselector...
                isBaseMap = request.isBasemap(),
                groupName = request.getGroupName();

            me.printDebug(
                'Trying to add map layer with id "' + id + '" AS ' +
                (isBaseMap ? ' BASE ' : ' NORMAL ')
            );
            if (me.isLayerAlreadySelected(id)) {
                me.printDebug(
                    'Attempt to select already selected layer "' + id + '"'
                );
                return;
            }

            var mapLayer = me.findMapLayerFromAllAvailable(id);
            if (!mapLayer) {
                // not found, ignore
                me.printDebug(
                    'Attempt to select layer that is not available "' + id + '"'
                );
                return;
            }
            // FIXME make sure isBaseMap is a boolean and use if (isBaseMap) {...
            if (isBaseMap == true) {
                mapLayer.setType('BASE_LAYER');
            }

            var newLayerIndex = -1;

            // if we need keep layers order, i.e. when map is accessed by link
            if (keepLayersOrder !== null && keepLayersOrder !== undefined && keepLayersOrder) {
                this._selectedLayers.push(mapLayer);
            } else {
                if (mapLayer.isBaseLayer() || isBaseMap == true) {
                    var newSelectedLayers = [],
                        i;

                    newSelectedLayers.push(mapLayer);
                    for (i = 0; i < this._selectedLayers.length; i += 1) {
                        newSelectedLayers.push(this._selectedLayers[i]);
                    }
                    delete this._selectedLayers;
                    this._selectedLayers = newSelectedLayers;
                } else {
                    this._selectedLayers.push(mapLayer);
                }
            }
	        var evt;
	        if (mapLayer.isBaseLayer() || isBaseMap) {
	            evt = me.getEventBuilder('AfterMapLayerAddEvent')(mapLayer, keepLayersOrder, isBaseMap, groupName);
	        } else {
	            evt = me.getEventBuilder('AfterMapLayerAddEvent')(mapLayer, true, isBaseMap, groupName);
	        }
	        me.copyObjectCreatorToFrom(evt, request);
	        me.dispatch(evt);
    },
    /**
     * @method _handleRemoveMapLayerRequest
     * Handles RemoveMapLayerRequests, removes the map layer from selected layers and sends out
     * an AfterMapLayerRemoveEvent to signal that a map layer has been removed from selected.
     *
     * @param {Oskari.mapframework.request.common.RemoveMapLayerRequest} request
     * @private
     */
    _handleRemoveMapLayerRequest: function (request) {
        var me = this;
        var id = request.getMapLayerId();
        me.printDebug("Trying to remove map layer with id '" + id + "'");
        if (!me.isLayerAlreadySelected(id)) {
            me.printDebug("Attempt to remove layer '" + id + "' that is not selected.");
            return;
        }
    },

        /**
         * @private @method _handleRemoveMapLayerRequest
         * Handles RemoveMapLayerRequests, removes the map layer from selected layers and sends out
         * an AfterMapLayerRemoveEvent to signal that a map layer has been removed from selected.
         *
         * @param {Oskari.mapframework.request.common.RemoveMapLayerRequest} request
         *
         */
        _handleRemoveMapLayerRequest: function (request) {
            var me = this,
                id = request.getMapLayerId();

            me.printDebug('Trying to remove map layer with id "' + id + '"');
            if (!me.isLayerAlreadySelected(id)) {
                me.printDebug('Attempt to remove layer "' + id + '" that is not selected.');
                return;
            }

            var index = -1,
                n,
                mapLayer = me.findMapLayerFromAllAvailable(id);

            for (n = 0; n < me._selectedLayers.length; n += 1) {
                if (me._selectedLayers[n] === mapLayer) {
                    index = n;
                    break;
                }
            }
            me._selectedLayers.splice(index, 1);

            if (me.isMapLayerAlreadyHighlighted(id)) {
                // remove it from highlighted list
                me.printDebug('Maplayer is also highlighted, removing it from highlight list.');
                me._handleDimMapLayerRequest(id);
            }

            /* AH-2186
             * Layer visibility is set back to true... somewhere.
             * So set it to visible for the layer object as well.
             */
            if (mapLayer) {
                mapLayer.setVisible(true);
            }

            // finally notify sandbox
            var event = me.getEventBuilder('AfterMapLayerRemoveEvent')(mapLayer);
            me.copyObjectCreatorToFrom(event, request);
            me.dispatch(event);
        },


        /**
         * @private @method _handleShowMapLayerInfoRequest
         * Handles ShowMapLayerInfoRequest, sends out an AfterShowMapLayerInfoEvent
         *
         * @param {Oskari.mapframework.request.common.ShowMapLayerInfoRequest} request
         *
         */
        _handleShowMapLayerInfoRequest: function (request) {
            var mapLayer = this.findMapLayerFromAllAvailable(request.getMapLayerId()),
                event = this.getEventBuilder('AfterShowMapLayerInfoEvent')(mapLayer);

            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        },

        /**
         * @private @method _handleShowMapLayerInfoRequest
         * Handles ShowMapLayerInfoRequest, sorts selected layers array so
         * that layer with given id is positioned into given index
         * and all the rest are pushed one step further. Sends out an AfterRearrangeSelectedMapLayerEvent
         *
         * @param {Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest} request
         *
         */
        _handleRearrangeSelectedMapLayerRequest: function (request) {
            var requestToPosition = request.getToPosition(),
                requestMapLayerId = request.getMapLayerId(),
                modifiedLayer = null,
                oldPosition = 0;

            if (requestMapLayerId !== null && requestMapLayerId !== undefined && requestToPosition !== null && requestToPosition !== undefined) {
                modifiedLayer = this.findMapLayerFromSelectedMapLayers(requestMapLayerId);

                var newSelectedLayers = [],
                    itemsAdded = 0,
                    lastHandledIndex = 0,
                    i,
                    layer;

                // loop through layers so that we have enough elements before new position
                for (i = 0; itemsAdded < requestToPosition; i += 1) {
                    lastHandledIndex += 1;

                    layer = this._selectedLayers[i];

                    if (layer.getId() + '' === requestMapLayerId + '') {
                        oldPosition = i;
                        continue;
                    }

                    newSelectedLayers.push(layer);
                    itemsAdded += 1;
                }

                // now we got start of the array ready. Next add modified one.
                newSelectedLayers.push(modifiedLayer);

                // Finally add rest to array
                for (i = lastHandledIndex; i < this._selectedLayers.length; i += 1) {
                    layer = this._selectedLayers[i];

                    if (layer.getId() + '' === requestMapLayerId + '') {
                        oldPosition = i;
                        continue;
                    }
                    newSelectedLayers.push(layer);
                }

                // clear carbage
                delete this._selectedLayers;
                this._selectedLayers = newSelectedLayers;
            }

            // notify listeners
            var event = this.getEventBuilder('AfterRearrangeSelectedMapLayerEvent')(modifiedLayer, oldPosition, requestToPosition);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        },

        /**
         * @private @method _handleChangeMapLayerOpacityRequest
         * Handles ChangeMapLayerOpacityRequest, sends out an AfterChangeMapLayerOpacityEvent
         *
         * @param {Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest} request
         *
         */
        _handleChangeMapLayerOpacityRequest: function (request) {
            var layer = this.findMapLayerFromSelectedMapLayers(request.getMapLayerId());
            if (!layer) {
                return;
            }
            layer.setOpacity(request.getOpacity());

            var event = this.getEventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        },

        /**
         * @private @method _handleChangeMapLayerStyleRequest
         * Handles ChangeMapLayerStyleRequest, sends out an AfterChangeMapLayerStyleEvent
         *
         * @param {Oskari.mapframework.request.common.ChangeMapLayerStyleRequest} request
         *
         */
        _handleChangeMapLayerStyleRequest: function (request) {
            var layer = this.findMapLayerFromSelectedMapLayers(request.getMapLayerId());
            if (!layer) {
                return;
            }
            // Check for magic string
            if (request.getStyle() !== '!default!') {
                layer.selectStyle(request.getStyle());
                var event = this.getEventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                this.copyObjectCreatorToFrom(event, request);
                this.dispatch(event);
            }
        },

        /**
         * @private @method _removeHighLightedMapLayer
         * Removes layer with given id from highlighted layers.
         * If id is not given -> removes all layers from highlighted layers
         *
         * @param {String} id of the layer to remove or leave undefined to remove all
         *
         */
        _removeHighLightedMapLayer: function (id) {
            var highlightedMapLayers = this.getAllHighlightedMapLayers(),
                i,
                mapLayer,
                evt;

            for (i = 0; i < highlightedMapLayers.length; i += 1) {
                mapLayer = highlightedMapLayers[i];
                if (!id || mapLayer.getId() + '' === id + '') {
                    highlightedMapLayers.splice(i);
                    // Notify that dim has occured
                    evt = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
                    this.dispatch(evt);
                    return;
                }
            }
        },

        /**
         * @private @method _handleHighlightMapLayerRequest
         * Handles HighlightMapLayerRequest, sends out an AfterHighlightMapLayerEvent.
         * Highlighted wfslayer responds to map clicks by highlighting a clicked feature.
         *
         * @param {Oskari.mapframework.request.common.HighlightMapLayerRequest} request
         *
         */
        _handleHighlightMapLayerRequest: function (request) {
            var creator = this.getObjectCreator(request),
                id = request.getMapLayerId();

            this.printDebug(
                '[core-map-layer-methods] Trying to highlight map ' +
                'layer with id "' + id + '"'
            );
            if (this.isMapLayerAlreadyHighlighted(id)) {
                this.printWarn(
                    '[core-map-layer-methods] Attempt to highlight ' +
                    'already highlighted wms feature info ' + 'map layer "' + id +
                    '"'
                );
                return;
            }

            if (this._allowMultipleHighlightLayers == true) {
                this._removeHighLightedMapLayer(id);
            } else {
                this._removeHighLightedMapLayer();
            }

            var mapLayer = this.findMapLayerFromSelectedMapLayers(id);
            if (!mapLayer) {
                return;
            }
            this._mapLayersHighlighted.push(mapLayer);
            this.printDebug(
                '[core-map-layer-methods] Adding ' + mapLayer + ' (' +
                mapLayer.getId() + ') to highlighted list.'
            );

            // finally notify sandbox
            var evt = this.getEventBuilder('AfterHighlightMapLayerEvent')(mapLayer);
            this.copyObjectCreatorToFrom(evt, request);
            this.dispatch(evt);
        },

        /**
         * @private @method _handleDimMapLayerRequest
         * Handles DimMapLayerRequest, sends out an AfterDimMapLayerEvent.
         * Highlighted wfslayer responds to map clicks by highlighting a clicked feature.
         * This removes the layer from highlighted list
         *
         * @param {Oskari.mapframework.request.common.DimMapLayerRequest} request
         *
         */
        _handleDimMapLayerRequest: function (layerId) {
            if (this._allowMultipleHighlightLayers == true) {
                this._removeHighLightedMapLayer(layerId);
            } else {
                this._removeHighLightedMapLayer();
            }

            var mapLayer = this.findMapLayerFromAllAvailable(layerId);
            if (!mapLayer) {
                return;
            }

            var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
            this.dispatch(event);
        }
    }
);
