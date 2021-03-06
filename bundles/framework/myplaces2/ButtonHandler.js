/**
 * @class Oskari.mapframework.bundle.myplaces2.ButtonHandler
 *
 * Handles the buttons for myplaces functionality
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.ButtonHandler",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance) {
        this.instance = instance;
        this.buttonGroup = 'myplaces';
        this.measureButtonGroup = 'measuretools';
        this.ignoreEvents = false;
        this.dialog = null;
        this.drawMode = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces2');
        var me = this;
        this.buttons = {
            'point': {
                iconCls: 'myplaces-draw-point',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.startNewDrawing({
                        drawMode: 'point'
                    });
                }
            },
            'line': {
                iconCls: 'myplaces-draw-line',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.startNewDrawing({
                        drawMode: 'line'
                    });
                }
            },
            'area': {
                iconCls: 'myplaces-draw-area',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.startNewDrawing({
                        drawMode: 'area'
                    });
                }
            },
            'box': {
                iconCls: 'myplaces-draw-box',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.startNewDrawing({
                        drawMode: 'box'
                    });
                }
            },
            'circle': {
                iconCls: 'myplaces-draw-circle',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.startNewDrawing({
                        drawMode: 'circle'
                    });
                }
            }
            /*,
        'cut' : {
            iconCls : 'tool-draw-cut',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'cut'
                });
            }
        }*/
        };
        this.templateGuide = jQuery('<div><div class="guide"></div>' +
            '<div class="buttons">' +
            '<div class="cancel button"></div>' +
            '<div class="finish button"></div>' +
            '</div>' +
            '</div>');

        this.templateHelper = jQuery(
            '<div class="drawHelper">' +
            '<div class="infoText"></div>' +
            '<div class="measurementResult"></div>' +
            '</div>'
        );
    }, {
        __name: 'MyPlacesButtonHandler',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {
            var user = Oskari.user();
            // different tooltip for guests - "Please log in to use"
            var guestPostfix = ' - ' + this.loc('guest.loginShort'),
                tool,
                tooltip;
            for (tool in this.buttons) {
                if (this.buttons.hasOwnProperty(tool)) {
                    tooltip = this.loc('tools.' + tool + '.tooltip');
                    if (!user.isLoggedIn()) {
                        tooltip = tooltip + guestPostfix;
                    }
                    this.buttons[tool].tooltip = tooltip;
                }
            }
        },
        /**
         * @method start
         * implements Module protocol start methdod
         */
        start: function () {
            var me = this,
                sandbox = me.instance.sandbox,
                p,
                tool,
                measureTool;
            sandbox.register(me);

            // request toolbar to add buttons
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            var addAdditionalMeasureTools = me.instance.conf.measureTools === true;

            var addMeasureTool = function(tool){
                        if (tool === 'line') {
                    measureTool = jQuery.extend(true, {}, me.buttons[tool]);
                            measureTool.callback = function () {
                                me.startNewDrawing({
                                    drawMode: 'measureline'
                                });
                            };
                            measureTool.iconCls = 'tool-measure-line';
                    measureTool.tooltip = me.loc('tools.measureline.tooltip');
                    sandbox.request(me, reqBuilder(tool, me.measureButtonGroup, measureTool));
                            //remove default measure tool
                            sandbox.request(this, removeReqBuilder('measureline', this.measureButtonGroup, null));
                        }
                        if (tool === 'area') {
                    measureTool = jQuery.extend(true, {}, me.buttons[tool]);
                            measureTool.callback = function () {
                                me.startNewDrawing({
                                    drawMode: 'measurearea'
                                });
                            };
                            measureTool.iconCls = 'tool-measure-area';
                    measureTool.tooltip = me.loc('tools.measurearea.tooltip');
                    sandbox.request(me, reqBuilder(tool, me.measureButtonGroup, measureTool));
                            //remove default measure tool
                            sandbox.request(this, removeReqBuilder('measurearea', this.measureButtonGroup, null));
                        }
            };

            for (tool in this.buttons) {
                if (!this.buttons.hasOwnProperty(tool)) {
                    continue;
                    }
                sandbox.request(this, reqBuilder(tool, this.buttonGroup, this.buttons[tool]));

                // for logged-in-user: add line & area measurement tools if configured
                // basic measurement tools should be configured off so these can be used
                // as replacements - this way measurement can be saved as myplaces
                // TODO: this is not the way to do this: instead allow request to be used for
                // saving a place and make the basic measurement tools use it when available
                if (Oskari.user().isLoggedIn() && addAdditionalMeasureTools) {
                    if (tool === 'line') {
                        addMeasureTool(tool);
                }
                    if (tool === 'area') {
                        addMeasureTool(tool);
            }
                }
            }

            var user = Oskari.user();
            if (!user.isLoggedIn()) {
                // disable toolbar buttons for guests
                this.disableButtons();
            } else {
                // logged in user -> listen to events as normal
                for (p in me.eventHandlers) {
                    if (me.eventHandlers.hasOwnProperty(p)) {
                        sandbox.registerForEventByName(me, p);
                    }
                }
            }
        },
        /**
         * @method disableButtons
         * Disables draw buttons
         */
        disableButtons: function () {
            var sandbox = this.instance.sandbox,
                stateReqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
            sandbox.request(this, stateReqBuilder(undefined, this.buttonGroup, false));
        },
        /**
         * @method startNewDrawing
         * Resets currently selected place and sends a draw request to plugin with given config
         * @param config params for StartDrawRequest
         */
        startNewDrawing: function (config) {
            // notify components to reset any saved "selected place" data
            var evt = this.instance.sandbox.getEventBuilder('DrawPlugin.SelectedDrawingEvent')();
            this.instance.sandbox.notifyAll(evt);

            // notify plugin to start drawing new geometry
            this.sendDrawRequest(config);
            this.instance.enableGfi(false);
        },
        /**
         * @method startNewDrawing
         * Sends a StartDrawRequest with given params. Changes the panel controls to match the application state (new/edit)
         * @param config params for StartDrawRequest
         */
        sendDrawRequest: function (config) {
            var conf = jQuery.extend(true, {}, config);
            if (conf.drawMode === 'measureline') {
                conf.drawMode = 'line';
            } else if (conf.drawMode === 'measurearea') {
                conf.drawMode = 'area';
            }
            this.drawMode = conf.drawMode;
            var startRequest = this.instance.sandbox.getRequestBuilder('DrawPlugin.StartDrawingRequest')(conf);
            this.instance.sandbox.request(this, startRequest);

            if (!config.geometry) {
                // show only when drawing new place
                this._showDrawHelper(config.drawMode);

            }
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        _showDrawHelper: function (drawMode) {
            if (this.dialog) {
                this.dialog.close(true);
                this.dialog = null;
            }
            var me = this,
                title = me.loc('tools.' + drawMode + '.title'),
                message = me.loc('tools.' + drawMode + '.add'),
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this.dialog = dialog;
            var buttons = [],
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

            cancelBtn.setHandler(function () {
                // ask toolbar to select default tool
                var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                me.instance.sandbox.request(me, toolbarRequest);
                me.sendStopDrawRequest(true);
                dialog.close(true);
                me.dialog = null;
            });

            var finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            finishBtn.setTitle(me.loc('buttons.finish'));
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me.sendStopDrawRequest();
            });
            buttons.push(finishBtn);
            buttons.push(cancelBtn);

            if (me.instance.sandbox.getUser().isLoggedIn()) {
                cancelBtn.setTitle(me.loc('buttons.close'));
                finishBtn.setTitle(me.loc('buttons.saveAsMyPlace'));
            }


            var content = this.templateHelper.clone();
            content.find('div.infoText').html(message);

            var measureResult = content.find('div.measurementResult');
            if (drawMode === 'point') {
                // No need to show the measurement result for a point
                measureResult.remove();
            } else {
                measureResult.html(me.loc('tools.' + drawMode + '.noResult'));
            }

            dialog.show(title, content, buttons);
            dialog.addClass('myplaces2');
            dialog.moveTo('#toolbar div.toolrow[tbgroup=default-myplaces]', 'bottom');
        },
        /**
         * @method sendStopDrawRequest
         * Sends a StopDrawingRequest.
         * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        sendStopDrawRequest: function (isCancel) {
            var request = this.instance.sandbox.getRequestBuilder('DrawPlugin.StopDrawingRequest')(isCancel);
            this.instance.sandbox.request(this, request);
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        stop: function () {
            // Toolbar.RemoveToolButtonRequest
            // remove on bindings
            jQuery('div.myplaces2 div.button').off();
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method Toolbar.ToolSelectedEvent
             */
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getToolId() !== this.drawMode && !this.ignoreEvents) {
                    // changed tool -> cancel any drawing
                    // do not trigger when we return drawing tool to
                    this.sendStopDrawRequest(true);
                    this.instance.enableGfi(true);
                    this.drawMode = null;
                    if (this.dialog){
                        this.dialog.close();
                }
                }
            },
            /**
             * @method DrawPlugin.MyPlaceSelectedEvent
             * Place was selected
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.SelectedDrawingEvent} event
             */
            'DrawPlugin.SelectedDrawingEvent': function (event) {
                if (this.instance.view.drawPluginId !== event.getCreatorId())
                {
                    return;
                }

                if (!event.getPlace()) {
                    // cleanup
                    // ask toolbar to select default tool
                    var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                    this.instance.sandbox.request(this, toolbarRequest);
                }
            },
            /**
             * @method DrawPlugin.FinishedDrawingEvent
             * Requests toolbar to select default tool
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent} event
             */
            'DrawPlugin.FinishedDrawingEvent': function (event) {
                if (this.instance.view.drawPluginId !== event.getCreatorId()) {
                    return;
                }
                // set ignore so we don't cancel our drawing unintentionally
                this.ignoreEvents = true;
                // ask toolbar to select default tool
                var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                this.instance.sandbox.request(this, toolbarRequest);
                // disable ignore to act normally after ^request
                this.ignoreEvents = false;
                // select tool selection will enable gfi -> disable it again
                this.instance.enableGfi(false);
                if (this.dialog) {
                    this.dialog.close();
                }
            },

            /**
             * @method DrawPlugin.AddedFeatureEvent
             * Update the help dialog after a new feature was added
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.AddedFeatureEvent} event
             */
            'DrawPlugin.AddedFeatureEvent': function (event) {
                if (this.instance.view.drawPluginId !== event.getCreatorId()) {
                    return;
                }

                var drawingMode = event.getDrawingMode();
                if (drawingMode !== undefined && drawingMode !== null) {
                    var areaDialogContent = this.loc('tools.' + drawingMode + '.next'),
                            content = this.dialog.getJqueryContent();
                        if (content.find('div.infoText') !== areaDialogContent) {
                            content.find('div.infoText').html(areaDialogContent);
                            this.dialog.moveTo('#toolbar div.toolrow[tbgroup=default-myplaces]', 'bottom');
                        }

                        var geom = event.getDrawing();
                        if(drawingMode === 'box' || drawingMode === 'circle') {
                            drawingMode = 'area';
                        }
                        var resultText = this.instance.getDrawPlugin().getMapModule().formatMeasurementResult(geom, drawingMode);                        
                        content.find('div.measurementResult').html(resultText);
                        
                    }
                }
            },

            'DrawPlugin.ActiveDrawingEvent': function (event) {
                if (this.instance.view.drawPluginId !== event.getCreatorId()) {
                    return;
                }

                var geom = event.getDrawing(),
                    mode = event.getDrawMode(),
                    resultText = this.instance.getDrawPlugin().getMapModule().formatMeasurementResult(geom, mode);

                if (this.dialog) {
                    var content = this.dialog.getJqueryContent();
                    content.find('div.measurementResult').html(resultText);
                }
            },

            'InfoBox.InfoBoxEvent': function (event) {
                var popupId = this.instance.getMainView().getPopupId(),
                    sandbox = this.instance.getSandbox(),
                    form = this.instance.getMainView().getForm(),
                    keyBoardRequest;

                if (event.getId() == popupId) {
                    this.instance.enableGfi(true);
                    this.sendStopDrawRequest(true);
                    if (sandbox.hasHandler('EnableMapKeyboardMovementRequest')) {
                        keyBoardRequest = Oskari.requestBuilder('EnableMapKeyboardMovementRequest')();
                        sandbox.request(this, keyBoardRequest);
                    }
                    if (form) {
                        form.destroy();
                        form = undefined;
                    }
                }
            }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
