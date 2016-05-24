/**
 * @class Oskari.liiteri.bundle.liiteri-usergisdata.view.OwnDataLayer
 *
 *
 */
Oskari.clazz.define("Oskari.liiteri.bundle.liiteri-usergisdata.view.OwnDataLayer",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (layer, sandbox, localization, editOperation, dataId, dataType, id, expirationDate, users) {
        //"use strict";
        this.sandbox = sandbox;
        this.localization = localization;
        this.layer = layer;
		this.dataId = dataId;
		this.dataType = dataType;
		this.id = id;
		this.expirationDate = expirationDate;
		this.users = users;
		/*
		    ==================================================
			data type name  | dataType value    | dataId value
			--------------------------------------------------
		    My places       | "MY_PLACES"       | categoryId
			--------------------------------------------------
			Analysis        | "ANALYSIS"        | layerId
			--------------------------------------------------
			Imported places | "IMPORTED_PLACES" | layerId
			==================================================
		*/
        this.backendStatus = 'OK'; // see also 'backendstatus-ok'
		this.linkTemplate = jQuery('<a href="JavaScript:void(0);"></a>');
        this.iconTemplate = jQuery('<div class="icon"></div>');
		this.editOperation = editOperation;
		this.datatableLocaleLocation = "/Oskari/libraries/jquery/plugins/DataTables-1.10.7/locale/";
		this.templates = {
			'layerRow': '<div class="layer"><input type="checkbox" /> ' + 
				'<div class="layer-title"></div>' + 
				'<div class="layer-tools">' +
					'<span class="layer-expiration"></span>' +
					'<span>' +
					'<a class="layer-edit glyphicon glyphicon-pencil" title="' + this.localization.layerList.edit + '"></a>' +
					'<a class="layer-postpone glyphicon glyphicon-calendar" title="' + this.localization.layerList.postpone + '"></a>' +
					'<a class="layer-share glyphicon glyphicon-share-alt" title="' + this.localization.layerList.share + '"></a>' +
					'<a class="layer-delete glyphicon glyphicon-remove-circle" title="' + this.localization.layerList.remove + '"></a>' +
					'</span>' +
				'</div>' + 
				'<div style="clear: both"></div>' +
				'</div>',
			'usersTable': '<table id="gis-data-users-table"><thead><tr>' +
				'<th>' + this.localization.layerList.usersTable.name + '</th>' +
				'<th>' + this.localization.layerList.usersTable.operations + '</th>' +
				'</tr></thead><tbody></tbody></table>'
		}
		
		this.ui = this._createLayerContainer(layer);
    }, {
        /**
         * @method getId
         * @return {String} layer id
         */
		 
        getId: function () {
            //"use strict";
            return this.layer.getId();
        },
		
        setVisible: function (bln) {
            //"use strict";
            // TODO assúme boolean and clean up everyhting that passes somehting else
            // checking since we dont assume param is boolean
            if (bln == true) {
                this.ui.show();
            } else {
                this.ui.hide();
            }
        },
		
        setSelected: function (isSelected, sendEvent) {
            //"use strict";
            // TODO assúme boolean and clean up everyhting that passes somehting else
            // checking since we dont assume param is boolean
            var checkbox = this.ui.find('input');
            checkbox.attr('checked', (isSelected == true));
            if (isSelected) {
                checkbox.parent().addClass('selected');
            } else {
                checkbox.parent().removeClass('selected');
            }

            if (sendEvent) {
                checkbox.change();
            }
        },

        /**
         * @method updateLayerContent
         */
        updateLayerContent: function (layer) {
            //"use strict";
            /* set title */
            var newName = layer.getName(),
                /* set/clear alert if required */
                prevBackendStatus = this.backendStatus,
                currBackendStatus = layer.getBackendStatus(),
                loc = this.localization.backendStatus,
                locForPrevBackendStatus = prevBackendStatus ? loc.prevBackendStatus : null,
                locForCurrBackendStatus = currBackendStatus ? loc.currBackendStatus : null,
                clsForPrevBackendStatus = locForPrevBackendStatus ? locForPrevBackendStatus.iconClass : null,
                clsForCurrBackendStatus = locForCurrBackendStatus ? locForCurrBackendStatus.iconClass : null,
                tipForPrevBackendStatus = locForPrevBackendStatus ? locForPrevBackendStatus.tooltip : null,
                tipForCurrBackendStatus = locForCurrBackendStatus ? locForCurrBackendStatus.tooltip : null,
                elBackendStatus = this.ui.find('.layer-backendstatus-icon');

            this.ui.find('.layer-title').html(newName);

            /* set sticky */
            if (layer.isSticky()) {
                this.ui.find('input').attr('disabled', 'disabled');
            }


            if (clsForPrevBackendStatus) {
                /* update or clear */
                if (clsForPrevBackendStatus !== clsForCurrBackendStatus) {
                    elBackendStatus.removeClass(clsForPrevBackendStatus);
                }
            }
            if (clsForCurrBackendStatus) {
                /* update or set */
                if (clsForPrevBackendStatus !== clsForCurrBackendStatus) {
                    elBackendStatus.addClass(clsForCurrBackendStatus);
                }
            }
            if (tipForCurrBackendStatus) {
                if (tipForPrevBackendStatus !== tipForCurrBackendStatus) {
                    elBackendStatus.attr('title', tipForCurrBackendStatus);
                }
            } else if (tipForPrevBackendStatus) {
                elBackendStatus.attr('title', '');
            }
            this.backendStatus = currBackendStatus;

        },
		
        getContainer: function () {
            //"use strict";
            return this.ui;
        },
		
        /**
         * @method _createLayerContainer
         * @private
         * Creates the layer containers
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
         */
        _createLayerContainer: function (layer) {
            //"use strict";
            var me = this,
                sandbox = me.sandbox,
                // create from layer template 
                // (was clone-from-template but template was only used once so there was some overhead)  
                layerDiv = jQuery(this.templates.layerRow),
                tooltips = this.localization.tooltip,
                tools = jQuery(layerDiv).find('div.layer-tools'),
                icon = tools.find('div.layer-icon'),
                rn,
                uuid,
                additionalUuids,
                additionalUuidsCheck,
                subLayers,
                s,
                subUuid,
                checkbox,
                elBackendStatus,
                mapLayerId;

            icon.addClass(layer.getIconClassname());

            if (layer.isBaseLayer()) {
                icon.attr('title', tooltips['type-base']);
            } else if (layer.isLayerOfType('WMS')) {
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WMTS')) {
                // FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
                // but since it would require some refactoring to make this general
                // I'll just leave this like it was on old implementation
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WFS')) {
                icon.attr('title', tooltips['type-wfs']);
            } else if (layer.isLayerOfType('VECTOR')) {
                icon.attr('title', tooltips['type-wms']);
            }


            if (!layer.getMetadataIdentifier()) {
                subLayers = layer.getSubLayers();
                subLmeta = false;
                if (subLayers && subLayers.length > 0) {
                    subLmeta = true;
                    for (s = 0; s < subLayers.length; s += 1) {

                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (!subUuid || subUuid == "" ) {
                          subLmeta = false;      
                          break;
                        }
                    }
                }
            }
            if (layer.getMetadataIdentifier() || subLmeta) {

                tools.find('div.layer-info').addClass('icon-info');
                tools.find('div.layer-info').click(function () {
                    rn = 'catalogue.ShowMetadataRequest';
                    uuid = layer.getMetadataIdentifier();
                    additionalUuids = [];
                    additionalUuidsCheck = {};
                    additionalUuidsCheck[uuid] = true;
                    subLayers = layer.getSubLayers();
                    if (subLayers && subLayers.length > 0) {
                        for (s = 0; s < subLayers.length; s += 1) {
                            subUuid = subLayers[s].getMetadataIdentifier();
                            if (subUuid && subUuid !== "" && !additionalUuidsCheck[subUuid]) {
                                additionalUuidsCheck[subUuid] = true;
                                additionalUuids.push({
                                    uuid: subUuid
                                });

                            }
                        }

                    }

                    sandbox.postRequestByName(rn, [{
                            uuid: uuid
                        },
                        additionalUuids
                    ]);
                });
            }

            // setup id
            jQuery(layerDiv).attr('layer_id', layer.getId());
            jQuery(layerDiv).find('.layer-title').append(layer.getName());
            jQuery(layerDiv).find('input').change(function () {
                checkbox = jQuery(this);
                if (checkbox.is(':checked')) {
                    sandbox.postRequestByName('AddMapLayerRequest', [layer.getId(), false, layer.isBaseLayer()]);
                } else {
                    sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
                }
            });

            /* set sticky */
            if (layer.isSticky()) {
                jQuery(layerDiv).find('input').attr('disabled', 'disabled');
            }

            /*
             * backend status
             */
            elBackendStatus = tools.find('.layer-backendstatus-icon');
            elBackendStatus.click(function () {
                mapLayerId = layer.getId();
                sandbox.postRequestByName('ShowMapLayerInfoRequest', [
                    mapLayerId
                ]);
            });
			
			/*
			 * edit my places
			 */
			var editMyPlaces = tools.find('.layer-edit');
			if (me.editOperation && me.dataType == 'MY_PLACES') {
				editMyPlaces.click(function () {
					var mapLayerId = layer.getId() + "";
					var loc = me.localization.myPlacesLayer;
					
					var pos = mapLayerId.indexOf('_');
					
					if (pos != -1) {
						var categoryId = mapLayerId.substr(pos + 1);
					} else {
						var categoryId = mapLayerId;
					}
					
					var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
						saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
					
					// update places
					var content = jQuery('<div></div>');
					
					var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
					var visibleFields = ['name', 'desc', 'createDate', 'updateDate', 'measurement', 'edit', 'delete'];
					grid.setVisibleFields(visibleFields);
					
					var service = sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');
					var places = service.getAllMyPlaces();
					
					// update places
					var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
					gridModel.setIdField('id');
					grid.setDataModel(gridModel);
					var i;
					for (i = 0; i < places.length; ++i) {
						// check if this category
						if (places[i].getCategoryID() === categoryId) {
							var drawMode = me._getDrawModeFromGeometry(places[i].geometry),
								measurement = sandbox.findRegisteredModuleInstance('MainMapModule').formatMeasurementResult(places[i].geometry, drawMode);
							gridModel.addData({
								'id': places[i].getId(),
								'name': places[i].getName(),
								'desc': places[i].getDescription(),
								'attention_text': places[i].getAttention_text(),
								'geometry': places[i].getGeometry(),
								'categoryId': places[i].getCategoryID(),
								'edit': loc['edit'],
								'delete': loc['delete'],
								'createDate': me._formatDate(service, places[i].getCreateDate()),
								'updateDate': me._formatDate(service, places[i].getUpdateDate()),
								'measurement': measurement
							});
						}
					}
					
					var nameRenderer = function (name, data) {
						var link = me.linkTemplate.clone();
						var linkIcon = me.iconTemplate.clone();
						var shape = me._getDrawModeFromGeometry(data.geometry);
						linkIcon.addClass('myplaces-' + shape);
						link.append(linkIcon);

						link.append(name);
						link.bind('click', function () {
							me._showPlace(data.geometry, data.categoryId);
							return false;
						});
						return link;
					};
					grid.setColumnValueRenderer('name', nameRenderer);
					// set up the link from edit field
					var editRenderer = function (name, data) {
						var link = me.linkTemplate.clone();
						link.append(name);
						link.bind('click', function () {
							me._editPlace(data);
							dialog.close();
							return false;
						});
						return link;
					};
					grid.setColumnValueRenderer('edit', editRenderer);
					// set up the link from edit field
					var deleteRenderer = function (name, data) {
						var link = me.linkTemplate.clone();
						link.append(name);
						link.bind('click', function () {
							me._deletePlace(data);
							dialog.close();
							return false;
						});
						return link;
					};
					grid.setColumnValueRenderer('delete', deleteRenderer);
					// setup localization
					var i,
						key;
					for (i = 0; i < visibleFields.length; ++i) {
						key = visibleFields[i];
						grid.setColumnUIName(key, me.localization.grid[key]);
					}
					
					grid.renderTo(content);
					
					var editLink = me.linkTemplate.clone();
					editLink.addClass('categoryOp');
					editLink.append(loc.editCategory);
					editLink.bind('click', {catId: categoryId}, function(event){
						sandbox.postRequestByName('MyPlaces.EditCategoryRequest', [event.data.catId]);
						return false;
					});
					content.append(editLink);

					var deleteLink = me.linkTemplate.clone();
					deleteLink.addClass('categoryOp');
					deleteLink.append(loc.deleteCategory);
					deleteLink.bind('click', {catId: categoryId}, function(event){
						sandbox.postRequestByName('MyPlaces.DeleteCategoryRequest', [event.data.catId]);
						dialog.close();
						return false;
					});
					content.append(deleteLink);
					
					saveBtn.addClass('primary');

					saveBtn.setTitle(loc.ok);
					saveBtn.setHandler(function() {
						dialog.close();
						
					});

					dialog.show(loc.myPlaces, content, [saveBtn]);
					dialog.makeDraggable();
				});
			} else {
				editMyPlaces.css( "display", "none" );
			}
			
			var shareLayer = tools.find('.layer-share');
			if (me.editOperation) {
				shareLayer.bind('click', {}, function(event) {
					var users = [];
					if (me.users != undefined && me.users != null) {
						users = me.users;
					}
					me._showSharingPopUp(users);
				});
			} else {
				shareLayer.css( "display", "none" );
			}
			
			var postponeLayer = tools.find('.layer-postpone');
			if (me.editOperation) {
				postponeLayer.bind('click', function() {
					me._saveGisData();
				});
			} else {
				postponeLayer.css( "display", "none" );
			}
			
			var expirationDateFormatted = '-';
			if (me.expirationDate) {
				var expDate = new Date(me.expirationDate);
				if (expDate) {
					var expDay = expDate.getDate() + '';
					if (expDay.length == 1) {
						expDay = '0' + expDay;
					}

					var expMonth = (expDate.getMonth() + 1) + ''; //month is 0-11
					if (expMonth.length == 1) {
						expMonth = '0' + expMonth;
					}

					var expirationDateFormatted = expDay + '.' + expMonth + '.' + expDate.getFullYear();
				}
			}
			var expirationDateInfo = tools.find('.layer-expiration');
			expirationDateInfo.append(me.localization.layerList.expiration + ': ' + expirationDateFormatted);
			
			var deleteLayer = tools.find('.layer-delete');
			if (me.dataType != 'MY_PLACES') {
				deleteLayer.bind('click', function() {
					var data = {
						id: layer.getId(),
						layer: layer,
						name: layer.getName()
					};
					if (me.dataType == 'ANALYSIS') {
						me._confirmDeleteAnalysis(data);
					} else if (me.dataType == 'IMPORTED_PLACES') {
						me._confirmDeleteUserLayer(data);
					}
				});
			} else {
				deleteLayer.css( "display", "none" );
			}
			
			if(layer.dataType === 'USERWMS') {
			    tools.hide();
			}

            return layerDiv;
        },
		
		_formatDate: function (service, date) {
            var time = service.parseDate(date),
                value = '';
            if (time.length > 0) {
                value = time[0];
            }
            // skip time
            /*if(time.length > 1) {
            value = value  + ' ' + time[1];
        }*/
            return value;
        },
		
		_getDrawModeFromGeometry: function (geometry) {
            if (geometry === null) {
                return null;
            }
            var olClass = geometry.CLASS_NAME,
                ret = null;
            if (('OpenLayers.Geometry.MultiPoint' === olClass) || ('OpenLayers.Geometry.Point' === olClass)) {
                ret = 'point';
            } else if (('OpenLayers.Geometry.MultiLineString' === olClass) || ('OpenLayers.Geometry.LineString' === olClass)) {
                ret = 'line';
            } else if (('OpenLayers.Geometry.MultiPolygon' === olClass) || ('OpenLayers.Geometry.Polygon' === olClass)) {
                ret = 'area';
            }
            return ret;
        },
		
		_showPlace: function (geometry, categoryId) {
            // center map on selected place
            var center = geometry.getCentroid();
            //mapmoveRequest = this.sandbox.getRequestBuilder('MapMoveRequest')(center.x, center.y, geometry.getBounds(), false);
            //this.sandbox.request(this.instance, mapmoveRequest);
			this.sandbox.postRequestByName('MapMoveRequest', [center.x, center.y, geometry.getBounds(), false]);
            // add the myplaces layer to map
            var layerId = 'myplaces_' + categoryId,
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                //var request = this.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
                //this.sandbox.request(this.instance, request);
				this.sandbox.postRequestByName('AddMapLayerRequest', [layerId, true]);
            }
        },
		
		/**
         * @method _editPlace
         * Requests for given place to be opened for editing
         * @param {Object} data grid data object for place
         * @private
         */
        _editPlace: function (data) {
            // focus on map
            this._showPlace(data.geometry, data.categoryId);
            // request form
            //var request = this.instance.sandbox.getRequestBuilder('MyPlaces.EditPlaceRequest')(data.id);
            //this.instance.sandbox.request(this.instance, request);
			this.sandbox.postRequestByName('MyPlaces.EditPlaceRequest', [data.id])
        },
		
        /**
         * @method _deletePlace
         * Confirms delete for given place and deletes it if confirmed. Also shows
         * notification about cancel, deleted or error on delete.
         * @param {Object} data grid data object for place
         * @private
         */
        _deletePlace: function (data) {
            var me = this,
                sandbox = this.sandbox,
                loc = this.localization.notification['delete'],
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(loc.btnDelete);
            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                dialog.close();
                var service = sandbox.getService('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService');
                var callback = function (isSuccess) {
                    var request;

                    if (isSuccess) {
                        dialog.show(loc.title, loc.success);
                        //request = me.instance.sandbox
                        //    .getRequestBuilder('MyPlaces.DeletePlaceRequest')(data.categoryId);
                        //me.instance.sandbox.request(me.instance, request);
						sandbox.postRequestByName('MyPlaces.DeletePlaceRequest', [data.categoryId]);
                    } else {
                        dialog.show(loc.title, loc.error);
                    }
                    dialog.fadeout();
                };
                service.deleteMyPlace(data.id, callback);
            });
            var cancelBtn = dialog.createCloseButton(loc.btnCancel),
                confirmMsg = loc.confirm + '"' + data.name + '"' + '?';
            dialog.show(loc.title, confirmMsg, [okBtn, cancelBtn]);
            dialog.makeModal();
        },
		
		_showSharingPopUp: function(data) {
			var me = this,
				loc = me.localization.layerList.sharing;
				sandbox = this.sandbox,
				dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
				cancelBtn = dialog.createCloseButton(loc.cancel),
				saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
			
			var content = jQuery('<div></div>');
			var emailField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'emailField');
			emailField.getField().find('input').before('<br />');
			emailField.setLabel(loc.shareByEmail);
			content.append(emailField.getField());
			
			//List of users which are shared to
			var tableElement = jQuery(me.templates.usersTable);
			content.append(tableElement);

			var dataTable = tableElement.DataTable({
				"data": data,
				"columns": [
					{ "data": "email" },
					{ "data": "id" }
				],
				"columnDefs": [
					/*{
						"targets": 0,
						"render": function (data, type, row) {
							if (data != null) {
								return data;
							} else {
								return row.email;
							}
						}
					},*/
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
					"url": this.datatableLocaleLocation + this.localization.datatablelanguagefile
				},
				"scrollCollapse": true,
				"paging": false,
				"processing": true,
				"searching": false,
				"info": false
			});
			
			tableElement.find('tbody').on('click', 'a.removeLink', function () {
				//Removing but only from table. Real removing is after clicking "Save" button
				dataTable.row($(this).parents('tr')).remove().draw(false);
			});
				
			saveBtn.addClass('primary');

			saveBtn.setTitle(loc.ok);
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
					
					me._saveGisData(users);
				}
			});

			dialog.show(loc.sharing, content, [saveBtn, cancelBtn]);
		},
		
		_saveGisData: function (usersParam) {
			var me = this,
				loc = me.localization.notification.save;
				users = me.users;
			//creating new dataset
			if (me.id == undefined || me.id == null) {
				me.id = 0;
			}
			
			if (usersParam != undefined && usersParam != null) {
				users = usersParam;
			}
			
			var url = me.sandbox.getAjaxUrl() + 'action_route=SaveGisData';
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
					"id": me.id,
					"dataId": me.dataId,
					"dataType": me.dataType,
					"users": JSON.stringify(users)
				},
				success: function () {
					if (usersParam) {
			            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
			            dialog.show(loc.shareSuccess, loc.shareSuccess);
			            dialog.fadeout(3000);
					} else {
	                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	                    dialog.show(loc.postponeSuccess, loc.postponeSuccess);
                        dialog.fadeout(3000);
					}
					//refreshing list of layers
					var eventBuilder = me.sandbox.getEventBuilder('MapLayerEvent')(me.layer.getId(), 'update');
					me.sandbox.notifyAll(eventBuilder);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.responseText && JSON.parse(jqXHR.responseText)) {
						var errorMessage = JSON.parse(jqXHR.responseText)['error'];
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                            okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        okBtn.setTitle("Sulje");
                        okBtn.addClass('primary');

                        okBtn.setHandler(function () {
                            dialog.close();
                        });
                        dialog.show(loc.error, loc.errorMessage, [okBtn]);
                        dialog.makeModal();
					} else {
	                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                            okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        okBtn.setTitle("Sulje");
                        okBtn.addClass('primary');

                        okBtn.setHandler(function () {
                            dialog.close();
                        });
	                    dialog.show(loc.error, loc.error, [okBtn]);
	                    dialog.makeModal();
					}
				}
			});
		},

		_confirmDeleteAnalysis: function (data) {
            var me = this;
            //var loc = this.loc.notification['delete'];
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.localization.analysisLayer.buttons['delete']);
            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                me._deleteAnalysis(data.layer);
                dialog.close();
            });
            var cancelBtn = dialog.createCloseButton(this.localization.analysisLayer.buttons.cancel);
            var confirmMsg = this.localization.analysisLayer.confirmDeleteMsg + '"' + data.name + '"' + '?';
            dialog.show(this.localization.analysisLayer.title, confirmMsg, [okBtn, cancelBtn]);
            dialog.makeModal();
        },
		
		_deleteAnalysis: function (layer) {

            var me = this;

            // parse actual id from layer id
            var tokenIndex = layer.getId().lastIndexOf("_") + 1;
            var idParam = layer.getId().substring(tokenIndex);

            jQuery.ajax({
                url: me.sandbox.getAjaxUrl(),
                data: {
                    action_route: 'DeleteAnalysisData',
                    id: idParam
                },
                type: 'POST',
                success: function (response) {
                    if (response && response.result === 'success') {
                        me._deleteAnalysisSuccess(layer);
                    } else {
                        me._deleteAnalysisFailure();
                    }
                },
                error: function () {
                    me._deleteFailure();
                }
            });

        },
		
		_deleteAnalysisSuccess: function (layer) {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
            // also we need to do it before service.remove() to avoid problems on other components
			this.sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
            service.removeLayer(layer.getId());
			
            // show msg to user about successful removal
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(this.localization.analysisLayer.notification.deletedTitle, this.localization.analysisLayer.notification.deletedMsg);
            dialog.fadeout(3000);
        },
		
		_deleteAnalysisFailure: function () {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = dialog.createCloseButton(this.localization.analysisLayer.buttons.ok);
            dialog.show(this.localization.error.title, this.localization.analysisLayer.error.generic, [okBtn]);
        },
		
		_confirmDeleteUserLayer: function (data) {
            var me = this;
            //var loc = this.loc.notification['delete'];
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            okBtn.setTitle(me.localization.uploadedObjectLayer.buttons['delete']);
            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                me._deleteUserLayer(data.id);
                dialog.close();
            });
            var cancelBtn = dialog.createCloseButton(me.localization.uploadedObjectLayer.buttons.cancel),
                confirmMsg = me.localization.uploadedObjectLayer.confirmDeleteMsg + ' "' + data.name + '"?';
            dialog.show(me.localization.uploadedObjectLayer.title, confirmMsg, [okBtn, cancelBtn]);
            dialog.makeModal();
        },

        _deleteUserLayer: function (layerId) {
            var me = this;

            // parse actual id from layer id
            var tokenIndex = layerId.lastIndexOf("_") + 1,
                idParam = layerId.substring(tokenIndex);

            jQuery.ajax({
                url: me.sandbox.getAjaxUrl(),
                data: {
                    action_route: 'DeleteUserLayer',
                    id: idParam
                },
                type: 'POST',
                success: function (response) {
                    if (response && response.result === 'success') {
                        me._deleteUserLayerSuccess(layerId);
                    } else {
                        me._deleteUserLayerFailure();
                    }
                },
                error: function () {
                    me._deleteFailure();
                }
            });
        },

        _deleteUserLayerSuccess: function (layerId) {
            var me = this,
                service = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
				
            // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
            // also we need to do it before service.remove() to avoid problems on other components
			me.sandbox.postRequestByName('RemoveMapLayerRequest', [layerId]);
            service.removeLayer(layerId);

            // show msg to user about successful removal
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(me.localization.uploadedObjectLayer.notification.deletedTitle, me.localization.uploadedObjectLayer.notification.deletedMsg);
            dialog.fadeout(3000);
        },

        _deleteUserLayerFailure: function () {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = dialog.createCloseButton(this.localization.uploadedObjectLayer.buttons.ok);
            dialog.show(this.localization.uploadedObjectLayer.error.title, this.localization.uploadedObjectLayer.error.generic, [okBtn]);
        }
		
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });