/**
 * @class Oskari.mapframework.mapmodule.ControlsPlugin
 *
 * Adds mouse and keyboard controls to the map and adds tools controls
 * for zoombox and measurement (line/area). Also adds request handling for
 * ToolSelectionRequest, EnableMapKeyboardMovementRequest, DisableMapKeyboardMovementRequest,
 * EnableMapMouseMovementRequest and DisableMapMouseMovementRequest.
 * Overrides OpenLayers keyboard/mouse controls with PorttiKeyboard and PorttiMouse.
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.ControlsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.mapmodule.ControlsPlugin';
        me._name = 'ControlsPlugin';
    }, {
        /**
         * @public @method hasUI
         * This plugin doesn't have a UI, BUT it is controllable in publisher so it is added to map
         * when publisher starts -> always return true to NOT get second navControl on map when publisher starts
         * FIXME this is clearly a hack
         *
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol
         *
         *
         */
        _startPluginImpl: function () {
            var me = this;

            me._createMapInteractions();
        },

        _createEventHandlers: function () {
            return {
                /**
                * @method Toolbar.ToolSelectedEvent
                * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
                */
                'DrawingEvent': function (event) {
                    var   me = this,
                        measureValue,
                        data = event.getData(),
                        finished = event.getIsFinished(),
                        geoJson = event.getGeoJson(),
                        geomMimeType = 'application/json';

                    // FIXME! Does StopDrawingRequest need to send drawingEvent?
                    if (finished) {
                        return;
                    }

                    if (data.shape === 'LineString') {
                        measureValue = data.lenght;
                    } else if (data.shape === 'Polygon') {
                         measureValue = data.area;
                    }

                    me.getSandbox().request(
                        me,
                        me.getSandbox().getRequestBuilder(
                            'ShowMapMeasurementRequest'
                        )(measureValue, finished, geoJson, geomMimeType)
                    );
                },
                /**
                 * @method Toolbar.ToolSelectedEvent
                 * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
                 */

                'Toolbar.ToolSelectedEvent': function (event) {
                    return;
                }
            };
        },

        _createRequestHandlers: function () {
            var me = this;
            var mapMovementHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler', me.getMapModule());
            return {
                'ToolSelectionRequest': Oskari.clazz.create(
                    'Oskari.mapframework.mapmodule.ToolSelectionHandler',
                    me.getSandbox(),
                    me
                ),
                'EnableMapKeyboardMovementRequest' : mapMovementHandler,
                'DisableMapKeyboardMovementRequest' : mapMovementHandler,
                'EnableMapMouseMovementRequest' : mapMovementHandler,
                'DisableMapMouseMovementRequest' : mapMovementHandler
            };
        },

        /**
         * @private @method _createMapControls
         * Constructs/initializes necessary controls for the map. After this they can be added to the map
         * with _addMapControls().
         *
         */
        _createMapInteractions: function () {
             var me = this,
            conf = me.getConfig();

            //TODO: add Esc button handler

            // Map movement/keyboard control
            if (conf.keyboardControls === false) {
                me.getMap().removeInteraction(ol.interaction.KeyboardPan);
                me.getMap().removeInteraction(ol.interaction.KeyboardZoom);
            }

            // mouse control
            if (conf.mouseControls === false) {
                me.getMap().removeInteraction(ol.interaction.DragPan);
                me.getMap().removeInteraction(ol.interaction.MouseWheelZoom);
                me.getMap().removeInteraction(ol.interaction.DoubleClickZoom);
                me.getMap().removeInteraction(ol.interaction.DragZoom);
            }
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
