Oskari.clazz.category('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 'default-buttons', {
    
	/**
	 * @method _addDefaultButtons
	 * @private
	 * 
	 * Adds default map window controls to toolbar.
	 * TODO: check if we really want to do this here instead of mapfull start()
	 */
	_addDefaultButtons : function() {
	    var me = this;
        var reqBuilder = this.getSandbox().getRequestBuilder('ToolSelectionRequest');
        var locales = me.getLocalization('buttons');
        
        /* basic tools */
        this.addToolButton('reset', 'history', {
            iconCls : 'tool-reset',
            tooltip: 'Paluu aloitusnäkymään',
            sticky: false,
            callback : function() {                
                // statehandler reset state
                var rb = me.getSandbox().getRequestBuilder('StateHandler.SetStateRequest');
                if(rb) {
                    me.getSandbox().request(me, rb());
                }
                // clear history
                var req = me.getSandbox().getRequestBuilder('ClearHistoryRequest')();
                me.getSandbox().request(me, req);
            }
        });
        this.addToolButton('history_back', 'history', {
            iconCls : 'tool-history-back',
            tooltip: 'Taaksepäin historiassa',
            sticky: false,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_tool_prev'));
            }
        });
        this.addToolButton('history_forward', 'history', {
            iconCls : 'tool-history-forward',
            tooltip: 'Eteenpäin historiassa',
            sticky: false,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_tool_next'));
            }
        });
        
        /* basic tools */
        this.addToolButton('zoombox', 'basictools', {
            iconCls : 'tool-zoombox',
            tooltip: 'Zoom',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_zoom_tool'));
            }
        });
        this.addToolButton('select', 'basictools', {
            iconCls : 'tool-pan',
            tooltip: 'Pan',
            selected : true,
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_navigate_tool'));
            }
        });
        
        /* Measurements area */
        this.addToolButton('measureline', 'measuretools', {
            iconCls : 'tool-measure-line',
            tooltip: 'Measure line',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_measure_tool'));
            }
        });
        
        this.addToolButton('measurearea', 'measuretools', {
            iconCls : 'tool-measure-area',
            tooltip: 'Measure area',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_measure_area_tool'));
            }
        });
        
        
        this.addToolButton('link', 'viewtools', {
            iconCls : 'tool-link',
            tooltip: locales.link.tooltip,
            sticky: false,
            callback : function() {
                var mapFullComponent = me.getSandbox().getStatefulComponents()['mapfull'].getState();
				var link = 
					'zoomLevel='+ mapFullComponent['zoom'] +
					'&coord=' + mapFullComponent['east'] +'_'+ mapFullComponent['north'] +
					'&mapLayers=';
				
				var layers ='';
				
				for ( var i = 0; i < mapFullComponent['selectedLayers'].length; i++) {
					if (!mapFullComponent['selectedLayers'][i].hidden) {
						if (layers != '') {
							layers +=',';
						}
						layers +=mapFullComponent['selectedLayers'][i].id+'+'+mapFullComponent['selectedLayers'][i].opacity
						if (mapFullComponent['selectedLayers'][i].style) {
							layers +='+'+mapFullComponent['selectedLayers'][i].style;
						} else {
							layers +='+';
						}
					} 
				}
				link += layers;
				link += '&showMarker=false&forceCache=true';
				
				
				var linkContent = 
					'<textarea rows="3" cols="100">' +
					locales.link.prefixUrl + 
					link +
					'</textarea>';
				
				var ok = {
				  name : "ok",
				  text : locales.link.ok,
				  close : true,
				  onclick : function() { }
				};
				
				
				var onShow = function(dialog) {
				  if ($.dontshowmodaldialogs) {
				    dialog.close();
				  }
				}

				var buttons = [ ok ];
				var reqName = 'userinterface.ModalDialogRequest';
				var reqBuilder2 = me.getSandbox().getRequestBuilder(reqName);	
				me.getSandbox().request(me, reqBuilder2(locales.link.title, linkContent, buttons, onShow));
            }
        });
        
        this.addToolButton('print', 'viewtools', {
            iconCls : 'tool-print',
            tooltip: locales.print.tooltip,
            sticky: false,
            callback : function() {
                var mapFullComponent = me.getSandbox().getStatefulComponents()['mapfull'].getState();
				var link = 
					'zoomLevel='+ mapFullComponent['zoom'] +
					'&coord=' + mapFullComponent['east'] +'_'+ mapFullComponent['north'] +
					'&mapLayers=';
				
				var layers ='';
				
				for ( var i = 0; i < mapFullComponent['selectedLayers'].length; i++) {
					if (!mapFullComponent['selectedLayers'][i].hidden) {
						if (layers != '') {
							layers +=',';
						}
						layers +=mapFullComponent['selectedLayers'][i].id+'+'+mapFullComponent['selectedLayers'][i].opacity
						if (mapFullComponent['selectedLayers'][i].style) {
							layers +='+'+mapFullComponent['selectedLayers'][i].style;
						} else {
							layers +='+';
						}
					} 
				}
				link += layers;
				link += '&p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&showMarker=false&forceCache=true&mapmode=print&viewId=2&noSavedState=true';
				link = window.location.pathname + '?' + link;
				//window.open (link,"Print", "location=1,status=1,scrollbars=1,width=850,height=800");
				window.open (link,"Print", "location=1,status=1,scrollbars=yes,width=850,height=800");
				
				
			}
        });
        
        
        
	}
    
});

	