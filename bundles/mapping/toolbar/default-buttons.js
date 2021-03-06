Oskari.clazz.category(
    'Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance',
    'default-buttons', {
        /**
         * @method _isButtonConfigured
         * @private
         *
         * @param {String}
         *            pId identifier so we can manage the button with subsequent requests
         * @param {String}
         *            pGroup identifier for organizing buttons
         *
         * Checks the configuration if the button should be excluded.
         * All buttons are included by default
         */
        _isButtonConfigured: function (pId, pGroup) {
            if (this.conf && (this.conf[pGroup] === false || (this.conf[pGroup] && this.conf[pGroup][pId] === false))) {
                // When conf is defined and pGroup or pId false, then exclude the button
                return false;
            }
            // Without a conf, all buttons are included
            return true;
        },
        /**
         * @method _getLinkUuid
         * @private
         * 
         * @return {String} current view uuid, if public view. Otherwise returns uuid of system default view with same srs as current view.
         */
        _getLinkUuid: function () {
            if(Oskari.app.isPublic()) {
                return Oskari.app.getUuid();
            }
            // not public -> get the a system appsetup with matching srs
            var srs = Oskari.getSandbox().getMap().getSrsName();
            var matchingSystemAppsetup = Oskari.app.getSystemDefaultViews().find(function(appsetup) {
                return appsetup.srsName === srs;
            });
            if(!matchingSystemAppsetup) {
                return null;
            }
            return matchingSystemAppsetup.uuid;
        },
        /**
         * @method _addDefaultButtons
         * @private
         *
         * Adds default map window controls to toolbar.
         * TODO: check if we really want to do this here instead of
         * mapfull start()
         */
        _addDefaultButtons: function () {
            this.dialog = null;
            var me = this,
                loc = this.getLocalization('buttons'),
                sandbox = this.getSandbox(),
                reqBuilder = Oskari.requestBuilder('ToolSelectionRequest'),
                gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest',
                gfiReqBuilder = Oskari.requestBuilder(gfiRn),
                group;

            var buttonGroups = [{
                'name' : 'basictools',
                'buttons': {
                    'zoombox' : {
                        iconCls: 'tool-zoombox',
                        tooltip: loc.zoom,
                        sticky: true,
                        callback: function () {
                            rn = 'map_control_zoom_tool';
                            me.getSandbox().request(me, gfiReqBuilder(false));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    },
                    'select' : {
                        iconCls: 'tool-pan',
                        tooltip: loc.pan,
                        selected: true,
                        sticky: true,
                        callback: function () {
                            rn = 'map_control_navigate_tool';
                            me.getSandbox().request(me, gfiReqBuilder(false));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    },
                    'featureinfo' : {
                        iconCls: 'tool-feature-info',
                        tooltip: loc.featureinfo,
                        sticky: true,
                        callback: function () {
                            me.getSandbox().request(me, gfiReqBuilder(true));
                        }
                    },
                    'clear': {
                        iconCls: 'tool-clear',
                        tooltip: loc.clear,
                        sticky: false,
                        callback: function () {
                            me.getSandbox().getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService').emptyAllWFSFeatureSelections();
                        }
                    }
                }
            },
            {
                'name' : 'measuretools',
                'buttons': {
                    'measureline' : {
                        iconCls: 'tool-measure-line',
                        tooltip: loc.measure.line,
                        sticky: true,
                        callback: function () {
                            rn = 'map_control_measure_tool';
                            me.getSandbox().request(me, gfiReqBuilder(false));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    },
                    'measurearea' : {
                        iconCls: 'tool-measure-area',
                        tooltip: loc.measure.area,
                        sticky: true,
                        callback: function () {
                            rn = 'map_control_measure_area_tool';
                            me.getSandbox().request(me, gfiReqBuilder(false));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    }
                }
            },
            {
                    'name': 'viewtools',
                    'buttons': {
                        'link': {
                            iconCls: 'tool-link',
                            tooltip: loc.link.tooltip,
                            sticky: false,
                            callback: function () {
                              if( me.dialog ){
                                me.dialog.close(true);
                                me.dialog = null;
                                return;
                              }
                                me.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                                me.dialog.onClose(function(){
                                  me.dialog = null;
                                });
                                var mapUrlPrefix = me.__getMapUrl();
                                var linkParams = me.getSandbox().generateMapLinkParameters({});

                                var viewUuid = me._getLinkUuid();
                                if(!viewUuid) {
                                    var closeBtn = me.dialog.createCloseButton();
                                    me.dialog.show(loc.link.title, loc.link.cannot, [closeBtn]);
                                    return;
                                }

                                linkParams += '&uuid=' + viewUuid;

                                // This is kinda ugly...
                                // Only show marker if there's no markers.
                                if (linkParams.indexOf('&markers=') === -1) {
                                    linkParams += '&showMarker=true';
                                }
                                me.dialog.addClass('no_resize');
                                var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                okBtn.setTitle(loc.link.ok);
                                okBtn.addClass('primary');
                                okBtn.setHandler(function () {
                                    me.dialog.close();
                                    me.getSandbox().postRequestByName('EnableMapKeyboardMovementRequest');
                                });

                                var linkContent = '<div class="linkcontent">' +
                                    mapUrlPrefix + linkParams + '</div>';
                                me.getSandbox().postRequestByName('DisableMapKeyboardMovementRequest');
                                me.dialog.show(loc.link.title, linkContent, [okBtn]);
                            }
                        },
                        'print' : {
                            iconCls: 'tool-print',
                            tooltip: loc.print.tooltip,
                            sticky: false,
                            callback: function () {
                                wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
                                link = window.location.pathname + '?' + me.getSandbox().generateMapLinkParameters() +
                                    '&p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive' +
                                    '&showMarker=false&forceCache=true&mapmode=print&viewId=2';
                                window.open(link, "Print", wopParm);
                            }
                        }
                    }
                }];

            for (group in buttonGroups) {
                if (buttonGroups.hasOwnProperty(group)) {
                    var buttonGroup = buttonGroups[group],
                        tool;
                    for (tool in buttonGroup.buttons) {
                        if (this._isButtonConfigured(tool, buttonGroup.name)) {
                            this.addToolButton(tool, buttonGroup.name, buttonGroup.buttons[tool]);
                        }
                    }
                }
            }
        },
        /**
         * Returns the map url for link tool
         * @private
         * @return {String} base URL for state parameters
         */
        __getMapUrl : function() {
            var sandbox = this.getSandbox();
            var url = null;
            if(this.conf) {
                url = sandbox.getLocalizedProperty(this.conf.mapUrlPrefix);
            }

            // setup current url as base if none configured
            return sandbox.createURL(url || window.location.pathname, true);
        }

    }
);
