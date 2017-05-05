Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-workspaces.WorkspacesView',
/**
 * @static constructor function
 */
function() {
	this.locale = this.instance.getLocalization()["view"];
	this.datatableLocaleLocation = Oskari.getSandbox().getService('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService').getDataTablesLocaleLocation();
	this.templates = {
        'table': '<table id="workspaces-table"><thead><tr>' +
            '<th>' + this.locale.table.name + '</th>' +
            '<th>' + this.locale.table.expirationDate + '</th>' +
            '<th>' + this.locale.table.operations + '</th>' +
            '</tr></thead><tbody></tbody></table>',
		'sharedWorkspacesTable': '<table id="shared-workspaces-table"><thead><tr>' +
            '<th>' + this.locale.table.name + '</th>' +
            '<th>' + this.locale.table.expirationDate + '</th>' +
            '<th>' + this.locale.table.operations + '</th>' +
			'</tr></thead><tbody></tbody></table>',
		'usersTable': '<table id="workspaces-users-table"><thead><tr>' +
            '<th>' + this.locale.userstable.name + '</th>' +
            '<th>' + this.locale.userstable.operations + '</th>' +
            '</tr></thead><tbody></tbody></table>'	
	};
	this.table = null;
	this.sharedWorkspacesTable = null;
	this.SharingType = { LINK : 0, FACEBOOK : 1, TWITTER : 2 };
	this.mediaSharingWindow = { 'width' : 600, 'height' : 400 };
	this.flyoutBaseWidth = null;
	this.flyouts = {
		statistics: {
			selector: null,
			zIndexOffset: 0
		},
		mapLegends: {
			selector: '#oskari-flyout-maplegend',
			zIndexOffset: 1
		},
		layerSelector: {
			selector: '#oskari-flyout-layerselector',
			zIndexOffset: 2
		}
	};
}, {
    /**
     * called by host to start view operations
     *
     * @method startPlugin
     */
    startPlugin: function() {

    },
    /**
     * called by host to stop view operations
     *
     * @method stopPlugin
     */
    stopPlugin: function() {
        //this.toolbar.destroy();
        //this.instance.getSandbox().removeRequestHandler('liiteri-groupings.MyRequest', this.requestHandler);
    },
    /**
     * called by host to change mode
     *
     * @method showMode
     */
    showMode: function(isShown, madeUpdateExtensionRequest) {
        var sandbox = this.instance.getSandbox(),
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
            map = mapModule.getMap(),
            elCenter = this.getCenterColumn(),
            elLeft = this.getLeftColumn();
		
        //this.toolbar.show(isShown);

        if (isShown) {
            /** ENTER The Mode */

            /** show our mode view */
            elCenter.
                removeClass('span12').
                addClass('span8');

            elLeft.
                removeClass('oskari-closed').
                addClass('span4');
				
			var element = this.prepareView();
            elLeft.empty();
            elLeft.append(element);
			
        } else {
            /** EXIT The Mode */

            /** remove our mode view */
            elCenter.
                removeClass('span8').
                addClass('span12');

            elLeft.
                addClass('oskari-closed').
                removeClass('span4');

            if (!madeUpdateExtensionRequest) {
                // reset tile state if not triggered by tile click
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
            }
        }

        /** notify openlayers of map size change */
        map.updateSize();
    },
    /**
     * Get left column container
     */
    getLeftColumn : function() {
        return jQuery('.oskariui-left');
    },
    /**
     * Get center column container
     */
    getCenterColumn : function() {
        return jQuery('.oskariui-center');
    },
    /**
     * Get right column container
     */
    getRightColumn : function() {
        return jQuery('.oskariui-right');
    },
	
	createUI: function () {
		// nothing to do here
	},
	
	/**
	 * CUSTOM FUNCTIONS
	 */
	
	prepareView: function() {
		var me = this;
		var container = jQuery("<div id='workspacesContainer'></div>");
		container.empty();

	    if (!me.instance.getSandbox().getUser().isLoggedIn())
	        return container;
		
		var tableElement = jQuery(me.templates.table);
	    container.append(tableElement);
		
		var dataTable = tableElement.DataTable({
            "ajax": {
                "url": me.instance.getSandbox().getAjaxUrl() + 'action_route=GetWorkspaces&type=own&showHidden=false',
                "dataSrc": "workspaces"
            },
            "columns": [
	            { "data": "name" },
	            { "data": "expirationDate" },
	            { "data": "id" }
            ],
            "columnDefs": [
				{
					"targets": 0,
					"render": function (data, type, row) {
						var loadLink = jQuery('<a class="loadLink" title="' + me.locale.table.open + '">' + data + '</a>');
						return loadLink.outerHTML();
					}
				},
				{
					"targets": 2,
                    "render": function (data, type, row) {
						var operationsLinks = jQuery('<div class="operationsLinks"></div>');
						var editLink = jQuery('<a class="editLink glyphicon glyphicon-floppy-disk" title="' + me.locale.table.edit + '"></a>');
						var postponeLink = jQuery('<a class="postponeLink glyphicon glyphicon-calendar" title="' + me.locale.table.postpone + '"></a>');
						var shareLink = jQuery('<a class="shareLink glyphicon glyphicon-share-alt" title="' + me.locale.table.share + '"></a>');
						var removeLink = jQuery('<a class="removeLink glyphicon glyphicon-remove-sign" title="' + me.locale.table.remove + '"></a>');
						var transformLink = jQuery('<a class="transformLink glyphicon glyphicon-transfer" title="' + me.locale.table.transform + '"></a>');
						
						operationsLinks.append(editLink);
						operationsLinks.append(postponeLink);
						operationsLinks.append(shareLink);
						operationsLinks.append(removeLink);

						if (me.hasRightToSeeTransformButton()) {
						    operationsLinks.append(transformLink);
						}
						
                        //return operationsLinks;
						return operationsLinks.outerHTML();
                    }
				}
            ],
            "language": {
                "url": this.datatableLocaleLocation + this.locale.datatablelanguagefile
            },
            //"scrollY": height + "px",
            "scrollCollapse": true,
            "paging": false,
            "processing": true,
			"searching": false,
			"info": false
        });
		
		tableElement.find('tbody').on('click', 'a.loadLink', function () {
            var data = dataTable.row($(this).parents('tr')).data();
			if (data.workspace) {
                var id = data.id;
                if (id != null) {
                    window.location.replace(location.protocol+'//'+location.host+'/?action=restoreWorkspace&type=own&workspaceId='+id);
                }
			}
        });
		
		tableElement.find('tbody').on('click', 'a.editLink', function () {
            var data = dataTable.row($(this).parents('tr')).data();
			
			if (data) {
				me._showEditPopUp(data);
			}
			
        });
		
		tableElement.find('tbody').on('click', 'a.postponeLink', function () {
            var data = dataTable.row($(this).parents('tr')).data();
			
			if (data) {
				me._postponeWorkspace(data);
			}
			
        });
		
		tableElement.find('tbody').on('click', 'a.shareLink', function () {
            var data = dataTable.row($(this).parents('tr')).data();
            
			if (data) {
				me._showSharingPopUp(data);
			}
        });
		
		tableElement.find('tbody').on('click', 'a.removeLink', function () {
            var data = dataTable.row($(this).parents('tr')).data();
			
			if (data.id) {
			    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                okBtn.setTitle(me.locale.remove);
                okBtn.addClass('primary');
    
                okBtn.setHandler(function () {
                    me._deleteWorkspace(data.id, false);
                    dialog.close();
                });
                
                cancelBtn.setTitle(me.locale.cancel);
                cancelBtn.setHandler(function () {
                    dialog.close();
                });
                dialog.show(me.locale.removeQuestion, '', [okBtn, cancelBtn]);
                dialog.makeModal();
			}
		});

		tableElement.find('tbody').on('click', 'a.transformLink', function () {
		    var data = dataTable.row($(this).parents('tr')).data();

		    if (data.id) {
		        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    transformBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    updateBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
				var buttons = [];

		        transformBtn.setTitle(me.locale.transform.buttonTransform);
		        transformBtn.addClass('primary');
		        transformBtn.setHandler(function () {
		            me._transformWorkspace(data.id);
		            dialog.close();
		        });
		        buttons.push(transformBtn);

				var workspace = JSON.parse(data.workspace);
				var servicePackageId = workspace.servicePackage;
				if (servicePackageId != null) {
					updateBtn.setTitle(me.locale.transform.buttonUpdate);
					updateBtn.addClass('primary');
					updateBtn.setHandler(function () {
						me._updateServicePackage(data.id, servicePackageId);
						dialog.close();
					});
					buttons.push(updateBtn);
				}

		        cancelBtn.setTitle(me.locale.cancel);
		        cancelBtn.setHandler(function () {
		            dialog.close();
		        });
		        buttons.push(cancelBtn);

		        dialog.show(me.locale.table.transform, me.locale.transform.tranformQuestion, buttons);
		        dialog.makeModal();
		    }
		});
		
		this.table = dataTable;

		var buttonsContainer = jQuery('<div id="workspacesButtonsContainer"></div>');
		
		var removeAllButton = jQuery('<a class="removeButton"><span class=" glyphicon glyphicon-trash"></span>' + me.locale.removeAllWorkspaces + '</a>');
		removeAllButton.click(function(){
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(me.locale.remove);
            okBtn.addClass('primary');
    
            okBtn.setHandler(function () {
                me._deleteAllWorkspaces();
                dialog.close();
            });
            
            cancelBtn.setTitle(me.locale.cancel);
            cancelBtn.setHandler(function () {
                dialog.close();
            });
            dialog.show(me.locale.removeAllQuestion, '', [okBtn, cancelBtn]);
            dialog.makeModal();
			
		});
		var addNewButton = jQuery('<a class="addButton">+ ' + me.locale.saveNew + '</a>');
		addNewButton.click(function(){
			me._showEditPopUp();
		});
		
		buttonsContainer.append(removeAllButton);
		buttonsContainer.append(addNewButton);
		container.append(buttonsContainer);
		
		//list without editing, sharing, but can be removed (only permission, not actual workspace)
		var sharedWorkspacesHeader = jQuery('<div id="sharedWorkspacesHeader">' + me.locale.table.sharedWorkspaces + '</div>');
		container.append(sharedWorkspacesHeader);
		
		var sharedWorkspacesTableElement = jQuery(me.templates.sharedWorkspacesTable);
	    container.append(sharedWorkspacesTableElement);
		
		var sharedWorkspacesTable = sharedWorkspacesTableElement.DataTable({
            "ajax": {
                "url": me.instance.getSandbox().getAjaxUrl() + 'action_route=GetWorkspaces&type=shared',
                "dataSrc": "workspaces"
            },
            "columns": [
	            { "data": "name" },
	            { "data": "expirationDate" },
	            { "data": "id" }
            ],
            "columnDefs": [
				{
					"targets": 0,
					"render": function (data, type, row) {
						var loadLink = jQuery('<a class="loadLink">' + data + '</a>');
						return loadLink.outerHTML();
					}
				},
				{
					"targets": 2,
                    "render": function (data, type, row) {
						var operationsLinks = jQuery('<div class="operationsLinks"></div>');
						var removeLink = jQuery('<a class="removeLink glyphicon glyphicon-remove-sign"></a>');

						operationsLinks.append(removeLink);

						return operationsLinks.outerHTML();
                    }
				}
            ],
            "language": {
                "url": this.datatableLocaleLocation + this.locale.datatablelanguagefile
            },
            //"scrollY": height + "px",
            "scrollCollapse": true,
            "paging": false,
            "processing": true,
			"searching": false,
			"info": false
        });
		
		sharedWorkspacesTableElement.find('tbody').on('click', 'a.loadLink', function () {
            var data = sharedWorkspacesTable.row($(this).parents('tr')).data();
            
			if (data.workspace) {
                var id = data.id;
                if (id != null) {
                    window.location.replace(location.protocol+'//'+location.host+'/?action=restoreWorkspace&type=own&workspaceId='+id);
                }
			}
        });
		
		sharedWorkspacesTableElement.find('tbody').on('click', 'a.removeLink', function () {
            var data = sharedWorkspacesTable.row($(this).parents('tr')).data();
			
			if (data.id) {
				var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                okBtn.setTitle(me.locale.remove);
                okBtn.addClass('primary');
    
                okBtn.setHandler(function () {
                    me._deleteWorkspace(data.id, false, true);
                    dialog.close();
                });
                
                cancelBtn.setTitle(me.locale.cancel);
                cancelBtn.setHandler(function () {
                    dialog.close();
                });
                dialog.show(me.locale.removeQuestion,'', [okBtn,cancelBtn]);
                dialog.makeModal();
			}
        });
		
		this.sharedWorkspacesTable = sharedWorkspacesTable;
		
		return container;
	},
	
	_deleteAllWorkspaces: function() {
		var me = this;
		me.table.rows().indexes().each( function (idx) {
			var data = me.table.row( idx ).data();
			
			if (data.id) {
				me._deleteWorkspace(data.id, true);
			}
		});	
	},
	
	_deleteWorkspace: function (id, deletingAllWorkspaces, deletetOnlyPermission) {
		var me = this;
		var url = me.instance.getSandbox().getAjaxUrl() + 'action_route=DeleteWorkspace';
		
		jQuery.ajax({
			type: 'POST',
			dataType: 'text',
			url: url,
			beforeSend: function (x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			data: {
				"id": id,
				"deletetOnlyPermission": deletetOnlyPermission
			},
			success: function () {
				me.refreshList();
				
				if (!deletingAllWorkspaces) {
	                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

	                dialog.show(me.locale.removeSuccess, me.locale.removeSuccess);
                    dialog.fadeout(3000);
				} else if (deletingAllWorkspaces && me.table.rows().indexes().length == 0) {
	                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

	                dialog.show(me.locale.removeAllSuccess, me.locale.removeAllSuccess);
	                dialog.fadeout(3000);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (jqXHR.responseText && JSON.parse(jqXHR.responseText)) {
				   var errorMessage = JSON.parse(jqXHR.responseText)['error'];
	               var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                       okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
	               okBtn.setTitle(me.locale.buttonOk);
                   okBtn.addClass('primary');
   
                   okBtn.setHandler(function () {
                       dialog.close();
                   });
                   dialog.show(errorMessage, errorMessage, [okBtn]);
                   dialog.makeModal();
				} else {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okBtn.setTitle(me.locale.buttonOk);
                    okBtn.addClass('primary');
    
                    okBtn.setHandler(function () {
                        dialog.close();
                    });
                    dialog.show(me.locale.removeError, me.locale.removeError, [okBtn]);
                    dialog.makeModal();
				}
			}
		});
	},

	_transformWorkspace: function (id) {
	    var me = this;
	    var url = me.instance.getSandbox().getAjaxUrl() + 'action_route=TransformWorkspace';

	    jQuery.ajax({
	        type: 'POST',
	        dataType: 'text',
	        url: url,
	        beforeSend: function (x) {
	            if (x && x.overrideMimeType) {
	                x.overrideMimeType("application/j-son;charset=UTF-8");
	            }
	        },
	        data: {
	            "id": id
	        },
	        success: function () {
	            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	            dialog.show(me.locale.transform.transformSuccessTitle, me.locale.transform.transformSuccessContent);
	            dialog.fadeout(3000);
	            
	            //refresh service packages list
	            var eventBuilder = me.instance.getSandbox().getEventBuilder('liiteri-groupings.GroupingUpdatedEvent');
	            var event = eventBuilder("package");
	            me.instance.getSandbox().notifyAll(event);
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	            dialog.show(me.locale.transform.transformFailureTitle, me.locale.transform.transformFailureContent);
	            dialog.fadeout(3000);
	        }
	    });
	},

	_updateServicePackage: function (id, servicePackageId) {
	    var me = this;
	    var url = me.instance.getSandbox().getAjaxUrl() + 'action_route=TransformWorkspace';

	    jQuery.ajax({
	        type: 'POST',
	        dataType: 'text',
	        url: url,
	        beforeSend: function (x) {
	            if (x && x.overrideMimeType) {
	                x.overrideMimeType("application/j-son;charset=UTF-8");
	            }
	        },
	        data: {
	            "id": id,
	            "updateServicePackage": true
	        },
	        success: function () {
	            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	            dialog.show(me.locale.transform.updateSuccessTitle, me.locale.transform.updateSuccessContent);
	            dialog.fadeout(3000);

	            //refresh service packages list
	            var eventBuilder = me.instance.getSandbox().getEventBuilder('liiteri-groupings.GroupingUpdatedEvent');
	            var event = eventBuilder("package");
	            me.instance.getSandbox().notifyAll(event);
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	            dialog.show(me.locale.transform.updateFailureTitle, me.locale.transform.updateFailureContent);
	            dialog.fadeout(3000);
	        }
	    });
	},

	refreshList: function() {
		this.table.ajax.reload();
		this.sharedWorkspacesTable.ajax.reload();
	},
	
	_saveWorkspace: function(id, name, users, windows, hiddenWorkspace, sharingType) {
		var me = this;
		var sandbox = me.instance.getSandbox();
		
		//Creating new workspace content
		var workspace = new Object();
		
		//Selected Service Package
		workspace.servicePackage = me.instance.getSelectedServicePackage();
		
		//Selected layers
		var selectedLayers = sandbox.findAllSelectedMapLayers();
		
		if (selectedLayers != null && selectedLayers.length > 0) {
			workspace.selectedLayers = new Array();
			
			for (var i = 0; i < selectedLayers.length; i++) {
				//The status of selected layers (baseLayer, opacity, visibility) and layer's style
				workspace.selectedLayers.push({
					'id': selectedLayers[i].getId(), 
					'baseLayer': selectedLayers[i].isBaseLayer(),
					'opacity': selectedLayers[i].getOpacity(),
					'style': selectedLayers[i].getCurrentStyle(),
					'customStyle': selectedLayers[i].getCustomStyle && selectedLayers[i].getCurrentStyle().getName() === "oskari_custom" ? selectedLayers[i].getCustomStyle() : null,
					'visible': selectedLayers[i].isVisible(),
					'type': selectedLayers[i].getLayerType()
				});
			}
		}

		//What statistics user had chosen and what thematic maps had he made from those
		if (me.instance.getSelectedStats()) {
			workspace.statistics = new Object();
			workspace.statistics.state = me.instance.getSelectedStats().state;
			//workspace.statistics.layer = me.instance.getSelectedStats().layer;
		}
		
		//Current position on the screen (zoom and coordinates)
		workspace.map = new Object();
		workspace.map.x = sandbox.getMap().getX();
		workspace.map.y = sandbox.getMap().getY();
		workspace.map.zoomLevel = sandbox.getMap().getZoom();
		
		workspace.windows = (windows != null) ? windows : [];

		me._sendWorkspace(id, workspace, name, users, hiddenWorkspace, sharingType);
	},
	
	_sendWorkspace: function (id, selections, name, users, hiddenWorkspace, sharingType) {
		var me = this;
		if (hiddenWorkspace == null)
		{
			hiddenWorkspace = false;
		}
		var url = me.instance.getSandbox().getAjaxUrl() + 'action_route=SaveWorkspace';
		jQuery.ajax({
			type: 'POST',
			dataType: 'text',
			url: url,
			beforeSend: function (x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			data: {
				"id": id,
				"workspace": JSON.stringify(selections),
				"name": name,
				"users": JSON.stringify(users),
				"hidden": hiddenWorkspace
			},
			success: function () {
				if (hiddenWorkspace)
				{
					switch (sharingType)
					{
						case me.SharingType.FACEBOOK:
						case me.SharingType.TWITTER:
							me._GetLastUserWorkspaceIdAndExecuteCallback(me._showSocialMediaSharingWindow, sharingType);
							break;
						case me.SharingType.LINK:
						default:
							me._GetLastUserWorkspaceIdAndExecuteCallback(me._showWorkspaceLink, sharingType	);
							break;
					}
				}
				else
				{
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

                    dialog.show(me.locale.saveSuccessTitle, me.locale.saveSuccess);
                    dialog.fadeout(3000);
					me.refreshList();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (jqXHR.responseText && JSON.parse(jqXHR.responseText)) {
					var errorMessage = JSON.parse(jqXHR.responseText)['error'];
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okBtn.setTitle(me.locale.buttonOk);
                    okBtn.addClass('primary');
    
                    okBtn.setHandler(function () {
                        dialog.close();
                    });
                    dialog.show(errorMessage, errorMessage, [okBtn]);
                    dialog.makeModal();
				} else {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okBtn.setTitle(me.locale.buttonOk);
                    okBtn.addClass('primary');
    
                    okBtn.setHandler(function () {
                        dialog.close();
                    });
                    dialog.show(me.locale.saveFailure, me.locale.saveFailure, [okBtn]);
                    dialog.makeModal();
				}
			}
		});
	},
	_sendRequest(name, params) {
        var reqBuilder = this.instance.getSandbox().getRequestBuilder(name);
        if (reqBuilder) {
            var request = reqBuilder.apply(this.instance.getSandbox(), params);
            this.instance.getSandbox().request(this.instance, request);
        }
    },
	_restoreWorkspace: function (workspaceJson) {
    	var me = this;
		var sandbox = this.instance.getSandbox();
		var workspace = JSON.parse(workspaceJson);
		var i;

		//Selected service package
		if (workspace.servicePackage) {
			jQuery.ajax({
                url: sandbox.getAjaxUrl() + 'action_route=GetPermittedGroupings',
                type: 'GET',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                },
                success: function (response) {
					var packages = response.groupings;
					if ((packages != null) && (packages.length > 0)) {
						for (var i = 0; i < packages.length; i++) {
							if ((packages[i].mainType === 'package')&&(packages[i].id === workspace.servicePackage)) {
					            var servicePackageEventBuilder = sandbox.getEventBuilder('liiteri-servicepackages.ServicePackageSelectedEvent');
            					var servicePackageEvent = servicePackageEventBuilder
								(packages[i].themes, workspace.servicePackage);
								sandbox.notifyAll(servicePackageEvent);
								

								if (workspace.selectedLayers) {
									var previousSelectedLayers = sandbox.findAllSelectedMapLayers();
									for (i = 0; i < previousSelectedLayers.length; i++) {
									    var itemLayer = previousSelectedLayers[i];
									    me._sendRequest('RemoveMapLayerRequest', [itemLayer.getId()]);
									}
									for (i = 0; i<workspace.selectedLayers.length; i++) {
										//add map layer
										me._sendRequest('AddMapLayerRequest', [workspace.selectedLayers[i].id, false, workspace.selectedLayers[i].baseLayer]);
										//set opacity
										me._sendRequest('ChangeMapLayerOpacityRequest', [workspace.selectedLayers[i].id, workspace.selectedLayers[i].opacity]);
										//add custom style
										if (workspace.selectedLayers[i].customStyle && workspace.selectedLayers[i].style._name === "oskari_custom") {
											me._sendRequest('ChangeMapLayerOwnStyleRequest', [workspace.selectedLayers[i].id, workspace.selectedLayers[i].customStyle]);
										}
										//change style
										if (workspace.selectedLayers[i].style) {
											me._sendRequest('ChangeMapLayerStyleRequest', [workspace.selectedLayers[i].id, workspace.selectedLayers[i].style._name]);
										}
										//set visibility
										me._sendRequest('MapModulePlugin.MapLayerVisibilityRequest', [workspace.selectedLayers[i].id, workspace.selectedLayers[i].visible]);
									}
								}

								//What statistics user had chosen and what thematic maps had he made from those
								if (workspace.statistics) {
									me._sendRequest('StatsGrid.SetStateRequest', []);
									me._sendRequest('StatsGrid.StatsGridRequest', [false, null]);
									if ((workspace.windows == null) || (workspace.windows.indexOf('statistics') >= 0)) {
									    var layer = sandbox.findMapLayerFromAllAvailable(workspace.statistics.state.layerId);
									    if (layer != null) {
											me._sendRequest('StatsGrid.SetStateRequest', [workspace.statistics.state]);
										    me._sendRequest('StatsGrid.StatsGridRequest', [true, layer]);
									    } else if (workspace.statistics.state != null) {
											me.instance.pendingStatState = workspace.statistics.state;
									    }
									}
								}

								//Current position on the screen (zoom and coordinates)
								if (workspace.map) {
									me._sendRequest('MapMoveRequest', [workspace.map.x, workspace.map.y, workspace.map.zoomLevel]);
								}

								var personalDataFlyout = null;
								var flyoutBaseZIndex = jQuery('.oskari-flyout').get().reduce(function (maxZIndex, element) {
									var flyout = jQuery(element);
									if (jQuery(flyout).attr('id') === 'oskari-flyout-personaldata') {
										personalDataFlyout = flyout;
										return maxZIndex;
									}
									var flyoutZIndex = Number(flyout.css('z-index'));
									flyout.removeClass('oskari-attached');
									flyout.removeClass('oskari-detached');
									flyout.addClass('oskari-closed');
									return (jQuery.isNumeric(flyoutZIndex)) ? Math.max(maxZIndex, flyoutZIndex) : maxZIndex;
								}, 0) + 1;
								if (personalDataFlyout != null) {
									personalDataFlyout.css('z-index', flyoutBaseZIndex + 10);
								}
								if (workspace.windows != null) {
									workspace.windows.sort(function (a, b) {
										if ((me.flyouts[a] == null) || (me.flyouts[b] == null)) {
											return 0;
										}
										return me.flyouts[a].zIndexOffset - me.flyouts[b].zIndexOffset;
									});
									var flyoutCount = 0;
									workspace.windows.forEach(function (flyoutType, index) {
										var selector = me.flyouts[flyoutType].selector;
										if (selector == null) {
											return;
										}
										var flyout = jQuery('div.oskari-flyout' + selector);
										if (flyout.length === 0) {
											return;
										}
										var zIndexOffset = me.flyouts[flyoutType].zIndexOffset;
										flyout.removeClass('oskari-attached');
										flyout.removeClass('oskari-closed');
										flyout.addClass('oskari-detached');
										if (me.flyoutBaseWidth == null) {
											me.flyoutBaseWidth = flyout.width();
										}
										if ((flyoutCount === 0) && (index === 0) && (workspace.windows.length > 1)) {
											flyout.width(me.flyoutBaseWidth + 50);
										}
										flyout.css('z-index', flyoutBaseZIndex + zIndexOffset);
										flyoutCount++;
									});
						        }

								//show information that the workspace is restored
								var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
								dialog.show(me.locale.workspaceRestoredTitle, me.locale.workspaceRestored);
								dialog.fadeout(3000);
								
								break;
							}
						}
					}
                },
                error: function (jqXHR, textStatus) {
                }
            });
		}

	},
	
	_showEditPopUp: function(data) {
		var me = this,
			sandbox = this.instance.getSandbox(),
			dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
			cancelBtn = dialog.createCloseButton(me.locale.cancel),
			saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		
		//ask statsgrid bundle about selected statistics
		me.instance.setSelectedStats();
		sandbox.postRequestByName('StatsGrid.CurrentStateRequest');

		var content = jQuery('<div></div>');
		if(data) {
			content.append(jQuery('<div class="info">' + me.locale.saveDialog.saveWorkspaceInfo + '</div>'));
		}
		content.addClass('edit-workspace');

		var workspaceNameField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'workspaceNameField');
		workspaceNameField.getField().find('input').before('<br />');
		workspaceNameField.setLabel(me.locale.saveDialog.nameField);
		content.append(workspaceNameField.getField());

		var workspaceData = {};
		if (data != null) {
			workspaceNameField.setValue(data.name);
			workspaceData = JSON.parse(data.workspace);
		}

		var openFlyouts= Oskari.clazz.create('Oskari.userinterface.component.Fieldset');
		openFlyouts.setTitle(me.locale.saveDialog.openFlyouts);
		openFlyouts.addClass('oskari-checkboxgroup');
		openFlyouts.addClass('oskari-formcomponent');
		openFlyouts.addClass('workspace-open-views');

		var openFlyoutInputData = [
			'layerSelector', 'mapLegends', 'statistics'
		];
		openFlyoutInputData.forEach(function(input) {
			var checkbox = Oskari.clazz.create(
				'Oskari.userinterface.component.CheckboxInput'
			);
			checkbox.setName(input+'Input');
			checkbox.setTitle(me.locale.saveDialog[input]);
			checkbox.setValue(input);
			checkbox.setEnabled(true);
			checkbox.setChecked((workspaceData.windows != null) ? workspaceData.windows.indexOf(input) >= 0 : false);
			checkbox.setHandler(function() {
				var numChecked = openFlyouts.getComponents().reduce(function(numChecked, component) {
					return numChecked + Number(component.isChecked());
				}, 0);
				if (numChecked > 2) {
					checkbox.setChecked(false);
				}
			});
			openFlyouts.addComponent(checkbox);
		});
		openFlyouts.insertTo(content);

		saveBtn.addClass('primary');

		saveBtn.setTitle(me.locale.saveDialog.save);
		saveBtn.setHandler(function() {
			dialog.close();
			var id = 0;
			var users = [];
			if (data) {
				id = data.id;
				users = data.users;
			}
			var windows = [];
			openFlyouts.getComponents().forEach(function(input) {
				if (input.isChecked()) {
					windows.push(input.getValue());
				}
			});
			var name = workspaceNameField.getValue();
			me._saveWorkspace(id, name, users, windows);
		});

		dialog.show(me.locale.saveDialog.saveWorkspace, content, [saveBtn, cancelBtn]);
		//dialog.makeModal();
	},
	
	_postponeWorkspace: function(data) {
		var me = this,
			sandbox = this.instance.getSandbox(),
			dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
			closeBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

		var content = jQuery('<div></div>');
		var title = "";
		
		closeBtn.addClass('primary');

		closeBtn.setTitle(me.locale.postponeDialog.close);
		closeBtn.setHandler(function() {
			dialog.close();
		});
		
		var url = me.instance.getSandbox().getAjaxUrl() + 'action_route=PostponeWorkspace';
		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
			url: url,
			beforeSend: function (x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			data: {
				"id": data.id
			},
			success: function (data) {
				var message = me.locale.postponeDialog.success;
				message = message.replace('{0}', data.expirationDate);
				content.append(jQuery('<div class="info">' + message + '</div>'));
				title = me.locale.postponeDialog.successTitle;
				dialog.show(title, content, [closeBtn]);
				me.refreshList();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				content.append(jQuery('<div class="info">' + me.locale.postponeDialog.error + '</div>'));
				title = me.locale.postponeDialog.errorTitle;
				dialog.show(title, content, [closeBtn]);
			}
		});
	},
	
	_showSharingPopUp: function(data) {
		var me = this,
			sandbox = this.instance.getSandbox(),
			dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
			cancelBtn = dialog.createCloseButton(me.locale.cancel),
			saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		
		var content = jQuery('<div></div>');
		var emailField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'emailField');
		emailField.getField().find('input').before('<br />');
		emailField.setLabel(me.locale.shareDialog.shareByEmail);
		content.append(emailField.getField());
		
		//List of users which are shared to
		var tableElement = jQuery(me.templates.usersTable);
	    content.append(tableElement);

		var dataTable = tableElement.DataTable({
			"data": data.users,
            "columns": [
	            { "data": "name" },
	            { "data": "id" }
            ],
            "columnDefs": [
				{
					"targets": 0,
                    "render": function (data, type, row) {
						if (data != null) {
							return data;
						} else {
							return row.email;
						}
                    }
				},
				{
					"targets": 1,
                    "render": function (data, type, row) {
						var operationsLinks = jQuery('<div class="operationsLinks"></div>');
						var removeLink = jQuery('<a class="removeLink glyphicon glyphicon-remove-sign"></a>');
						operationsLinks.append(removeLink);
						return operationsLinks.outerHTML();
                    }
				}
            ],
            "language": {
                "url": this.datatableLocaleLocation + this.locale.datatablelanguagefile
            },
            "scrollCollapse": true,
            "paging": false,
            "processing": true,
			"searching": false,
			"info": false
        });
		
		tableElement.find('tbody').on('click', 'a.removeLink', function () {
            //Removing but only from table. Real removing is after save the workspace
			dataTable.row($(this).parents('tr')).remove().draw(false);
        });
			
		saveBtn.addClass('primary');

		saveBtn.setTitle(me.locale.shareDialog.share);
		saveBtn.setHandler(function() {
			dialog.close();
			
			if (data) {
				var rawUsers = dataTable.data();
				var users = [];
				for (var i = 0; i < rawUsers.length; i++) {
				  users.push(rawUsers[i]);
				}

				if (emailField.getValue() && emailField.getValue().trim() != '') {
					users.push({"externalType": "USER", "email": emailField.getValue().trim()});
				}
				
				//Sending workspace to backend without changing it - only list of users is updated
				me._sendWorkspace(data.id, JSON.parse(data.workspace), data.name, users);
			}
		});

		dialog.show(me.locale.shareDialog.sharingWorkspace, content, [saveBtn, cancelBtn]);
		//dialog.makeModal();
	},
	_SaveHiddenWorkspace: function(sharingType)
	{
		var me = this;
		me._saveWorkspace(0, "hidden", [], [], true, sharingType);
	},	
	_GetLastUserWorkspaceIdAndExecuteCallback: function(callbackFunction, sharingType)
	{
		var me = this;
		$.ajax({
			url: me.instance.getSandbox().getAjaxUrl() + 'action_route=GetWorkspaces&type=own&showHidden=true&iefix=' + (new Date()).getTime(),
			success: function(data)
			{
				var maxId = 0;
				$.each(data.workspaces, function(key, value){
					if (value.id > maxId)
					{
						maxId = value.id;
					}
				});
				
				if (sharingType == me.SharingType.LINK)
				{
					callbackFunction(maxId, me);	
				}
				else
				{
					callbackFunction(maxId, me, sharingType);
				}
				
			}
		});
	},
	_showSocialMediaSharingWindow: function(workspaceId, parentObject, sharingType)
	{
		var obj = null;
		if (parentObject != null)
		{
			obj = parentObject;
		}
		else
		{
			obj = this;
		}
		var left = (screen.width/2)-(obj.mediaSharingWindow.width/2);
		var top = (screen.height/2)-(obj.mediaSharingWindow.height/2);
		
		if (!window.location.origin) {
            window.location.origin =
                window.location.protocol + "//" +
                window.location.hostname +
                (window.location.port ? ':' + window.location.port: '');
        }
		
		var workspaceURL = redirectURL = window.location.origin + "/?action=restoreWorkspace&workspaceId=" + workspaceId;
		//var workspaceURL = redirectURL = "http://liiteri.ymparisto.fi" + "/?action=restoreWorkspace&workspaceId=" + workspaceId; // ONLY FOR TESTING
		//var workspaceURL = redirectURL = "http://liiteri-test.sito.fi/public/share.html"; // ONLY FOR TESTING
		
		var logo = window.location.origin + "/Oskari/1.1-SNAPSHOT/img/liiteri_logo_large.png";
		
		var targetURL = null;
		if (sharingType == obj.SharingType.FACEBOOK)
		{
			//the facebook app is configured only for the domain: http://liiteri.ymparisto.fi/
			targetURL = "https://www.facebook.com/dialog/feed?app_id=819671628091095&display=popup&name=Liiteri&link=" + encodeURIComponent(workspaceURL) + "&redirect_uri=" + encodeURIComponent(redirectURL) + "&picture=" + logo;
		}
		else if (sharingType == obj.SharingType.TWITTER)
		{
			targetURL = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(workspaceURL);
		}
		window.open(targetURL, "_blank", "width=" + obj.mediaSharingWindow.width + ", height=" +  obj.mediaSharingWindow.height + ", top=" + top + ", left=" + left);
	},
	_showWorkspaceLink: function(workspaceId, parentObject)
	{
		var obj = null;
		if (parentObject != null)
		{
			obj = parentObject;
		}
		else
		{
			obj = this;
		}
		
		var sandbox = obj.instance.getSandbox(),
			pcn = 'Oskari.userinterface.component.Popup',
        	okcn = 'Oskari.userinterface.component.Button',
        	copycn = 'Oskari.userinterface.component.Button',
        	dialog = Oskari.clazz.create(pcn),
        	buttons = [];
		
        dialog.addClass("no_resize");
        
        var okBtn = Oskari.clazz.create(okcn);
        okBtn.setTitle(obj.locale.buttonOk);
        okBtn.addClass('primary');
        okBtn.setHandler(function () {
        	 rn = 'EnableMapKeyboardMovementRequest';
             dialog.close();
             sandbox.postRequestByName(rn);
        });
        
        rn = 'DisableMapKeyboardMovementRequest';
        sandbox.postRequestByName(rn);

        if (!window.location.origin) {
            window.location.origin =
                window.location.protocol + "//" +
                window.location.hostname +
                (window.location.port ? ':' + window.location.port: '');
        }
        
        var workspaceLink = window.location.origin + "/?action=restoreWorkspace&workspaceId=" + workspaceId;
		
        if (window.clipboardData && typeof window.clipboardData.setData == 'function') {
	        var copyBtn = Oskari.clazz.create(copycn);
	        copyBtn.setTitle(obj.locale.buttonCopy);
	        copyBtn.setHandler(function () {
	        	window.clipboardData.setData("Text", workspaceLink);
	        });
	        buttons.push(copyBtn);
        }
        
        buttons.push(okBtn);

        dialog.show(obj.locale.linkShareTitle, "<textarea cols=60>" + workspaceLink + "</textarea>", buttons);
	},

	hasRightToSeeTransformButton: function () {
	    var user = this.instance.getSandbox().getUser();

	    if (user == null || user.getRoles() == null)
	        return false;

	    var adminRoles = ["liiteri_groupings_admin", "liiteri_admin"];
	    var roles = user.getRoles();

	    for (var i = 0; i < roles.length; i++) {
	        var role = roles[i];
	        if ($.inArray(role.name, adminRoles) != -1)
	            return true;
	    }

	    return false;
	},
	
}, {
    // the protocol / interface of this object is view
    "protocol": ["Oskari.userinterface.View"],
    // extends DefaulView
    "extend": ["Oskari.userinterface.extension.DefaultView"]
});