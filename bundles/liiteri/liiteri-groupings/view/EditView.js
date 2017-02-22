
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-groupings.EditView',
function (instance) {
    var me = this;
    me.service = instance.service;
	me.data = null;
	me.isTheme = null;
	me.template = jQuery('<div class="groupingsContainer">' +
			'<div class="header">' +
				'<div class="icon-close"></div>' +
			'</div>' +
			'<div class="content"></div>' +
		'</div>');

	me.templateButtonsDiv = jQuery('<div class="buttons"></div>');

	me.themesValues = new Array();
	me.permissionsValues = new Array();
	
	//Grouping panels
	me.metadataPanel = null;
	me.labelPanel = null;
	me.usersPanel = null;
	me.themesPanel = null;
	
	me.themeList = jQuery('<ul class="selectedLayersList sortable levelzero" ' + 'data-sortable=\'{' + 'itemCss: "li.layer.selected", ' + 'handleCss: "div.layer-title" ' + '}\'></ul>');			
	me.themeItem = jQuery('<li class="layer selected">' + '<div class="layer-info">' + '<div class="layer-tool-remove icon-close"></div>' + '<div class="layer-title"><h4></h4></div>' + '</div>' + '<div class="layer-tools volatile">' + '</div>' + '</li>');
	
	me.activeTheme = null;
	me.addThemeButton = null;
	me.datatableLocaleLocation = "/Oskari/libraries/jquery/plugins/DataTables-1.10.7/locale/";
	me.templates = { //TODO localization
		'table': '<table id="groupings-table"><thead><tr>' +
			'<th>' + 'Tunnus' + '</th>' +
			'<th>' + 'Nimi' + '</th>' +
			'<th>' + 'Toiminnot' + '</th>' +
			'</tr></thead><tbody></tbody></table>'
	};
	me.indicatorsData = null;
	me.groupingsData = null;
	
	me.addLayerBtn = null;
	me.addStatBtn = null;
	me.addSubthemeBtn = null;
	me.statsContainer = null;
    me.errorCb = function(jqxhr, textStatus) { me.showMessage("Virhe", jqxhr.statusText); };
}, {
    /**
     * called by host to start view operations
     *
     * @method startPlugin
     */
    startPlugin: function() {
        var sandbox = this.instance.getSandbox();

        // The extension bundle instance routes request 
        // to enter / exit mode by listening to and responding to userinterface.ExtensionUpdatedEvent 
        //this.requestHandler = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-groupings.request.MyRequestHandler', this);
        //sandbox.addRequestHandler('liiteri-groupings.MyRequest', this.requestHandler);

    },
    /**
     * called by host to stop view operations
     *
     * @method stopPlugin
     */
    stopPlugin: function() {
        //this.instance.getSandbox().removeRequestHandler('liiteri-groupings.MyRequest', this.requestHandler);
    },
    /**
     * called by host to change mode
     *
     * @method showMode
     */
    showMode: function(isShown, madeUpdateExtensionRequest, localization, data, isTheme) {
        var sandbox = this.instance.getSandbox(),
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
            map = mapModule.getMap(),
            elCenter = this.getCenterColumn(),
            elLeft = this.getLeftColumn();
		
		this.loc = localization;
		this.data = data;
		this.isTheme = isTheme;

        if (isShown) {
            /** ENTER The Mode */

            /** show our mode view */
            //elCenter.
            //    removeClass('span12');//.
                //addClass('span5');

            elLeft.
                removeClass('oskari-closed');//.
                //addClass('span7');
				
			var element = this.prepareView();
            elLeft.empty();
            elLeft.append(element);
			
        } else {
            /** EXIT The Mode */

            /** remove our mode view */
            elCenter.
                removeClass('span5').
                addClass('span12');

            elLeft.
                addClass('oskari-closed');//.
                //removeClass('span7');

            if (!madeUpdateExtensionRequest) {
                // reset tile state if not triggered by tile click
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
            }
        }

        /** notify openlayers of map size change */
        map.updateSize();
		
		this.initTree();		

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
	
	//-------------
	// Creating GUI
	//-------------
	
	initTree: function() {
		//Prepare data for tree
		var me = this,
			children = [];
		if (this.data) {
			var subChildren = this._getSubChildren(this.data);
			
			if (!this.isTheme) {
				children.push({title: "Palvelupaketti", isFolder: true, nodeType: 'root', children: subChildren, activate: true, focus: true/*, icon: false*/}); //TODO localization
			} else {
				children.push({title: this.data.name, isFolder: true, nodeType: 'roottheme', children: subChildren, themeName: this.data.name, themeType: this.data.type, activate: true, focus: true/*, icon: false*/}); //TODO localization
			}
			
			
		} else {
			if (!this.isTheme) {
				children = [{title: "Palvelupaketti", isFolder: true, nodeType: 'root', children: [], activate: true, focus: true/*, icon: false*/}]; //TODO localization
			} else {
				children = [{title: 'uusi teema', isFolder: true, nodeType: 'roottheme', children: [], themeName: 'uusi teema', themeType: 'map_layers', activate: true, focus: true/*, icon: false*/}]; //TODO localization
			}
		}
		
		if (me.isTheme) {
			$('#themeMetadataContainer').show();
		} else {
			$('#themeMetadataContainer').hide();
		}

		var treeParams = {
		    onActivate: function(node) {
		        me._onActivateTreeNode(node);
		    },
		    children: children,
		    minExpandLevel: 1,
		    clickFolderMode: 1,
		    imagePath: "/skin-vista/"
		}
        if (!me.isTheme) {
            treeParams['checkbox'] = true;
            treeParams['selectMode'] = 3;
        }
		
		$("#tree").dynatree(treeParams);
		
		var activeNode = $("#tree").dynatree("getActiveNode");
		if (activeNode) {
			$('#themes').find('input[name=themeNameField]').val(activeNode.data.themeName);
			$('#themes').find('select[name=themetype]').val(activeNode.data.themeType);

			if (activeNode.getChildren() && activeNode.getChildren().length > 0) {
				$('#themes').find('select[name=themetype]').prop('disabled', 'disabled');
			}
			
			if (activeNode.data.themeType == 'map_layers') {
				me.addLayerBtn.setEnabled(true);
				me.addStatBtn.setEnabled(false);
				me.addSubthemeBtn.setEnabled(false);
				
				me.statsContainer.hide();
			} else {
				me.addLayerBtn.setEnabled(false);
				me.addStatBtn.setEnabled(true);
				me.addSubthemeBtn.setEnabled(true);
			}
			
			me._onActivateTreeNode(activeNode);
		}
	},
	
	_onActivateTreeNode: function(node) {
		var me = this;
		if (node.data.nodeType == 'theme' || node.data.nodeType == 'roottheme') {
			$('#themeMetadataContainer').show();
			$('#themes').find('input[name=themeNameField]').val(node.data.themeName);
			$('#themes').find('select[name=themetype]').val(node.data.themeType);

			
			if ((me.isTheme && node.data.nodeType == 'roottheme' && (!node.getChildren() || node.getChildren().length == 0)) ||
				(!me.isTheme && node.parent.data.nodeType == 'root' && (!node.getChildren() || node.getChildren().length == 0))) {
				$('#themes').find('select[name=themetype]').prop('disabled', false);
			} else {
				$('#themes').find('select[name=themetype]').prop('disabled', 'disabled');
			}
			
			if (me.addThemeButton) {
				if (node.data.themeType == 'map_layers') {
					me.addThemeButton.setEnabled(false);
				} else {
					me.addThemeButton.setEnabled(true);
				}
			}
			//Showing on the map only these layers which belong to selected theme
			if (node.data.themeType == 'map_layers') {
				var sandbox = me.instance.getSandbox();
				var previousSelectedLayers = sandbox.findAllSelectedMapLayers();
			    var previouslySelectedLayerIds = $.map(previousSelectedLayers, function(layer, idx) {
			        return layer.getId();
			    });
				
				//get current layers from the tree
			    var themeLayers = node.getChildren();
			    var themeLayersIds = [];
                if (themeLayers) {
                    themeLayersIds = $.map(themeLayers, function (layer, idx) {
                        return layer.data.itemId;
                    });
                }
			    var layersToRemove = previouslySelectedLayerIds.filter(function(a) {
			        return themeLayersIds.indexOf(a) == -1;
			    });
			    var layersToAdd = themeLayersIds.filter(function (a) {
			        return previouslySelectedLayerIds.indexOf(a) == -1;
			    });
				
				//cleaning old layers
			    for (var i = 0; i < layersToRemove.length; i++) {
			        sandbox.postRequestByName('RemoveMapLayerRequest', [layersToRemove[i]]);
				}				
				//set theme layers
				for (var i = 0; i < layersToAdd.length; i++) {
				     sandbox.postRequestByName('AddMapLayerRequest', [layersToAdd[i]]);
				}
				
			} else {
				//TODO? Optional: revert previous selected layers (before come to administration of groupings)
			}
			
		} else {
			$('#themeMetadataContainer').hide();
			if (me.addThemeButton) {
				me.addThemeButton.setEnabled(true);
			}
		}
		
		if (node.data.themeType == 'map_layers') {
			me.addLayerBtn.setEnabled(true);
			me.addStatBtn.setEnabled(false);
			me.addSubthemeBtn.setEnabled(false);
			
			me.statsContainer.hide();
		} else {
			me.addLayerBtn.setEnabled(false);
			me.addStatBtn.setEnabled(true);
			
			/*Prevent to add subtheme if maximum level of statistic subthemes is reached (can be 1 theme + 4 subthemes):
				- Service package: 0 - root, 1 - service package, 2-6 - themes, 7 - statistics
				- Standalone Theme: 0 - root, 1-5 - themes, 6 - statistics*/
			if ((!me.isTheme && node.getLevel() < 6) || (me.isTheme && node.getLevel() < 5)) {
				me.addSubthemeBtn.setEnabled(true);
			} else {
				me.addSubthemeBtn.setEnabled(false);
			}
		}
	},
	
	_getSubChildren: function(data) {
		var children = [];
		if (data.elements && data.elements.length > 0) {
			for (var i=0; i<data.elements.length; i++) {
			    var child = {title: data.elements[i].id, isFolder: false, nodeType: 'item', itemId: data.elements[i].id, itemName: data.elements[i].id, itemType: data.elements[i].type, children: []/*, icon: false*/};
			    if(data.elements[i].type == "map_layer") {
			        if(typeof data.elements[i].name !== 'undefined' && data.elements[i].name &&
			                typeof data.elements[i].name[Oskari.getLang()] !== 'undefined' && data.elements[i].name[Oskari.getLang()] &&
			                typeof data.elements[i].name[Oskari.getLang()].name !== 'undefined' && data.elements[i].name[Oskari.getLang()].name) {
    			        child.itemName = data.elements[i].name[Oskari.getLang()].name;
    			        child.title = data.elements[i].name[Oskari.getLang()].name;
			        }
			    } else {
	                 if(typeof data.elements[i].name !== 'undefined' && data.elements[i].name &&
	                            typeof data.elements[i].name[Oskari.getLang()] !== 'undefined' && data.elements[i].name[Oskari.getLang()]) {
	                        child.itemName = data.elements[i].name[Oskari.getLang()];
	                        child.title = data.elements[i].name[Oskari.getLang()];
	                    }
			    }
			    if (data.elements[i].status == 'drawn')
			        child.select = true;

				children.push(child);
			}
		} else if (data.themes && data.themes.length > 0) {
			for (var i=0; i<data.themes.length; i++) {
				var subChildren = this._getSubChildren(data.themes[i]);
				children.push({title: data.themes[i].name, isFolder: true, nodeType: 'theme', themeName: data.themes[i].name, themeType: data.themes[i].type, children: subChildren/*, icon: false*/});
			}
		}
		
		return children;
	},	
	prepareView: function () {
		var me = this,
			content = me.template.clone();
		
		me.themeList.empty();
		me.themesValues = new Array();
		me.permissionsValues = new Array();
			
		me.mainPanel = content;

		var contentDiv = content.find('div.content'),
			accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
		me.accordion = accordion;
		
		
		//Metadata				
		var metadataContainer = jQuery('<div class=""></div>');
		
		if (!me.isTheme) {
			//Field: name
			var metadataNameField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'metadataNameField');
			metadataNameField.getField().find('input');
			metadataNameField.setLabel('Palvelupaketin nimi'); //TODO localization
			if (me.data) {
				// set initial values
				metadataNameField.setValue(me.data.name);
			}
			metadataContainer.append(metadataNameField.getField());

			//Field: short description
			var metadataShortDescriptionField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'metadataShortDescriptionField');
			metadataShortDescriptionField.getField().find('input');
			metadataShortDescriptionField.setLabel('Lyhyt kuvaus'); //TODO localization
			if (me.data) {
				// set initial values
				metadataShortDescriptionField.setValue(me.data.description);
			}
			metadataContainer.append(metadataShortDescriptionField.getField());

			//Field: creation date
			var metadataCreateDateField = jQuery('<div class="oskarifield"><label class="metadataFieldTitle">' + 'Luotu' + '</label><span id="metadataCreateDateField" class="metadataFieldValue"></span></div>'); //TODO localization
			
			if (me.data) {
				metadataCreateDateField.find('#metadataCreateDateField').append(me.data.created);
			} else {
				//fill it automatically
				metadataCreateDateField.find('#metadataCreateDateField').append(new Date());
			}
			metadataContainer.append(metadataCreateDateField);
			
			//Field: modification date
			var metadataModifyDateField = jQuery('<div class="oskarifield"><label class="metadataFieldTitle">' + 'Muokattu' + '</label><span id="metadataModifyDateField" class="metadataFieldValue"></span></div>'); //TODO localization
			
			if (me.data) {					
				metadataModifyDateField.find('#metadataModifyDateField').append(me.data.updated);
			} else {
				//fill it automatically
				metadataModifyDateField.find('#metadataModifyDateField').append(new Date());
			}
			metadataContainer.append(metadataModifyDateField);
		}
		
		//Field: state
		var lifecycleStateField = jQuery('<div class="oskarifield"><label class="metadataFieldTitle">' + 'Tila' + '</label><span id="lifecycleStateField" class="metadataFieldValue"></span></div>'); //TODO localization
		
		if (me.data) {					
			lifecycleStateField.find('#lifecycleStateField').append(me.data.state);
		} else {
			lifecycleStateField.find('#lifecycleStateField').append('alustava');
		}
		metadataContainer.append(lifecycleStateField);
		
		
		me.metadataPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		me.metadataPanel.setTitle('Perustiedot'); //TODO localization
		var contentMetadataPanel = me.metadataPanel.getContainer();
		contentMetadataPanel.append(metadataContainer);
		
		me.metadataPanel.setVisible(true);
		me.metadataPanel.open();
		accordion.addPanel(me.metadataPanel);

		// Ryhmittely
		if (!this.isTheme) {
            var labelContainer = jQuery('<div class="servicePackageLabel"></div>');

			var existingLabelField = jQuery('<div class="oskarifield"><label for="existingLabel" class="existingLabelField"></label><select name="existingLabel"></select></div>');
			var existingLabelTitle = existingLabelField.find('label.existingLabelField');
			existingLabelTitle.html(me.loc.chooseLabel);
			var existingLabelSelection = existingLabelField.find('select[name=existingLabel]');
			labelContainer.append(existingLabelField);

			var newLabelField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'newLabel');
			newLabelField.getField().find('input');
			newLabelField.setLabel(me.loc.createNewLabel);
			newLabelField.bindChange(function() {
				if (newLabelField.getValue().length > 0) {
					existingLabelSelection.prop('disabled', true);
					existingLabelTitle.addClass('disabled');
				} else {
					existingLabelSelection.prop('disabled', false);
					existingLabelTitle.removeClass('disabled');
				}
			}, true);
			labelContainer.append(newLabelField.getField());

            me.labelPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            me.labelPanel.setTitle(me.loc.grouping);
            me.labelPanel.setContent(labelContainer);
            me.labelPanel.setVisible(true);
            accordion.addPanel(me.labelPanel);

			me._sendRequest(me.instance.sandbox.getAjaxUrl() + 'action_route=GetGroupings',
				// Success callback
				function (data) {
					var labels = [];
					// Add and sort
					data.groupings.forEach(function(grouping) {
						if (grouping.mainType !== "package") {
							return;
						}
						var label = grouping.label;
						if ((label == null)||(label.length === 0)) {
							return;
						}
						var numLabels = labels.length;
						var index = 0;
						while (index < numLabels) {
							var comparison = label.toLocaleLowerCase().localeCompare(labels[index].toLocaleLowerCase());
							if (comparison === 0) {
								return;
							} else if (comparison < 0) {
								break;
							}
							index++;
						}
						labels.splice(index, 0, label);
					});
					labels.forEach(function(label) {
						var labelOption = jQuery('<option></option>');
						labelOption.attr('value', label);
						labelOption.append(label);
						existingLabelSelection.append(labelOption);
					});
					if ((me.data != null)&&(me.data.label != null)&&(me.data.label.length > 0)) {
						existingLabelSelection.val(me.data.label);
					}
				},
				// Error callback
				function (jqXHR, textStatus) {
				}
			);
        }

		//Users
		var usersContainer = jQuery('<div class="usersContainer"></div>');
		var sharingFormOptions = {
		    "addEmail": true,
		    "addRole": false,
		    "addUser": false,
		    "visibleFields": ['credentialId', 'name', 'email', 'type', 'operations']
		}

		if (!this.isTheme) {
		    sharingFormOptions.addRole = true;
			//SHARING TO ROLES (for service packages)					
			var rolesOptions;
			me._sendRequest(me.instance.sandbox.getAjaxUrl() + 'action_route=GetRoles',
				// success callback
				function (dataArray) {
					rolesOptions = dataArray;
					me.sharingForm.setRoles(rolesOptions.Roles);
				},
				// error callback
				function (jqXHR, textStatus) {
					//me.showMessage("Error");
					//return null;
				});
		} else {
			//SHARING PUBLICLY (for theme)
			var publicThemeRow = jQuery('<div class="oskarifield"></div>');
			var publicThemeLabel = jQuery('<label>' + me.loc.edit.themeVisibility + '</label>');
			var publicThemeRadio = jQuery('<span class="metadataFieldValue"></span>');
			var publicThemeRadioOption1 = jQuery('<div><input type="radio" name="public" value=true >' + me.loc.edit.showToAllUsers + '</div>');
			publicThemeRadio.append(publicThemeRadioOption1);
			var publicThemeRadioOption2 = jQuery('<div><input type="radio" name="public" value=false >' + me.loc.edit.showToIndividualUsers + '</div>');
			publicThemeRadio.append(publicThemeRadioOption2);

			if (me.data == null || me.data.isPublic === false) {
				publicThemeRadioOption2.find('input').prop('checked', true);
			} else {
				publicThemeRadioOption1.find('input').prop('checked', true);
			}
			
			publicThemeRow.append(publicThemeLabel);
			publicThemeRow.append(publicThemeRadio);
			usersContainer.append(publicThemeRow);
		}
		
		this.sharingForm = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-ui.component.SharingForm', me.loc.sharing, sharingFormOptions);
		this.sharingForm.insertTo(usersContainer);
		if (me.data && me.data.permissions) {
		    var data = [];
		    for (var i = 0; i < me.data.permissions.length; i++) {
		        console.log(me.data.permissions[i]);
	            var item = {
	                'permissionId': me.data.permissions[i].permissionId,
	                'credentialId': me.data.permissions[i].id,
	                'type': me.data.permissions[i].type,
	                'name': me.data.permissions[i].name,
	                'email' : me.data.permissions[i].email,
	                'status': me.data.permissions[i].status,
	            };
	            data.push(item);
	        }
		    this.sharingForm.setData(data);
		}

	    me.usersPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		me.usersPanel.setTitle(me.loc.edit.accessRights);
		me.usersPanel.setContent(usersContainer);
		me.usersPanel.setVisible(true);
		accordion.addPanel(me.usersPanel);


		//Themes			
		var themesTemplate = jQuery("<div class='themes' id='themes'></div>");

		if (!me.isTheme) {
			//Adding new theme
			var addBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
			addBtn.setTitle(me.loc.AddNewTheme);
			addBtn.addClass('block');
			addBtn.addClass('addNewThemeButton');
			addBtn.insertTo(themesTemplate);
						
			addBtn.setHandler(me._addNewTheme);
			
			me.addThemeButton = addBtn;
		}
		
		//Remove selected tree node
		var removeBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		removeBtn.setTitle('Poista valittu kohde'); //TODO localization
		removeBtn.addClass('block');
		removeBtn.addClass('addNewThemeButton');
		removeBtn.insertTo(themesTemplate);
					
		removeBtn.setHandler(function () {
			var node = $("#tree").dynatree("getActiveNode");
			
			if (!node || node.data.nodeType == 'root' || node.data.nodeType == 'roottheme') {
				return;
			}

			node.remove();
			//node.parent.data.children.splice(node.data);
			
			/*for (var i=0; i < node.parent.data.children.length; i++) {
				if (node.parent.data.children[i].key === node.data.key) {
					node.parent.data.children.splice(i, 1);
				}
			}*/
			//$("#tree").dynatree("getTree").reload();
			
			//clear data fields
			$('#themes').find('input[name=themeNameField]').val();
			$('#themes').find('select[name=themetype]').val();
			
			var activeNode = $("#tree").dynatree("getActiveNode");
			if (activeNode) {
				me._onActivateTreeNode(activeNode);
			}
			
		});
		
		//Ready themes
		var readyThemesRow = jQuery('<div class="oskarifield"><span id="metadataCreateDateField" class="metadataFieldValue"></span></div>'); //TODO localization
		var readyThemesBox = jQuery("<div class='readyThemes' id='themes'></div>");
		
		var tree = jQuery('<div id="tree"></div>');
		
		readyThemesBox.append(tree);
		readyThemesRow.append(readyThemesBox);
		themesTemplate.append(readyThemesRow);
		
		//Container for theme's metadata
		var themeMetadataContainer = jQuery('<div id="themeMetadataContainer"></div>');
		
		//Theme name
		var themeNameField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'themeNameField');
		themeNameField.getField().find('input');
		themeNameField.setLabel('Teeman nimi'); //TODO localization
		themeNameField.bindChange(function() {
			//change name of the editing theme
			
			var node = $("#tree").dynatree("getActiveNode");
			
			if (!node || node.data.nodeType == 'item' || node.data.nodeType == 'root') {
				return;
			}
				
			/*node.fromDict({
				title: themeNameField.getValue(),
				isFolder: node.data.isFolder,
				nodeType: node.data.nodeType,
				themeName: themeNameField.getValue(),
				themeType: node.data.themeType,
				children: node.data.children
			});*/
			
			node.data.title = themeNameField.getValue();
			node.data.themeName = themeNameField.getValue();
			node.render();

			var pnode = node.parent;
			var key = node.data.key;

			if (pnode && pnode.data.children) {
				for (var i=0; i < pnode.data.children.length; i++) {
					node = pnode.data.children[i];

					if (node.key == key) {
						node.title = themeNameField.getValue();
						node.themeName = themeNameField.getValue();
					}
				}
			}

		}, true);

		themeMetadataContainer.append(themeNameField.getField());
		
		//Theme type			
		var themeTypeField = jQuery('<div class="oskarifield"><label for="themetype" class="metadataFieldTitle">' + 'Teeman tyyppi' + '</label><select name="themetype"></select></div>'); //TODO localization
		var themeTypeSelection = themeTypeField.find('select[name=themetype]');

		var themeTypeOptions = [
			{
				name: 'Karttataso',
				value: 'map_layers'
			},
			{ 
				name: 'Tilasto',
				value: 'statistics'
			}
		];

		for (var i = 0; i < themeTypeOptions.length; i++) {
			var option = jQuery('<option></option>');
			option.attr('value', themeTypeOptions[i].value);
			option.append(themeTypeOptions[i].name);
			themeTypeSelection.append(option);
		}
		themeMetadataContainer.append(themeTypeField);
		
		//Buttons for adding new: (map layer) OR (statistic AND subtheme)
		var addItemButtons = jQuery('<div class="addItemButtons"></div>');

		//Adding new map layer
		var addLayerBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		addLayerBtn.setTitle('Uusi karttataso'); //TODO localization
		addLayerBtn.addClass('block');
		addLayerBtn.setHandler(function () {
			me._openExtension('LayerSelector');
		});
		addLayerBtn.insertTo(addItemButtons);
		me.addLayerBtn = addLayerBtn;

		//Adding new statistic
		var addStatBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		addStatBtn.setTitle('Uusi tilasto'); //TODO localization
		addStatBtn.addClass('block');
		addStatBtn.setHandler(function () {                				
			statsContainer.show();
		});
		addStatBtn.insertTo(addItemButtons);
		me.addStatBtn = addStatBtn;
		
		//Adding new subtheme
		var addSubthemeBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		addSubthemeBtn.setTitle(me.loc.AddNewTheme);
		addSubthemeBtn.addClass('block');
		addSubthemeBtn.setHandler(me._addNewTheme);
		addSubthemeBtn.insertTo(addItemButtons);
		me.addSubthemeBtn = addSubthemeBtn;
		
		themeMetadataContainer.append(addItemButtons);
		
		themesTemplate.append(themeMetadataContainer);
		
		///////////////////////
		//////STATISTICS///////
		///////////////////////		
		var statsContainer = jQuery('<div class="statsContainer"></div>');
		var statsField = jQuery('<div><label for="stats">' + me.loc.AddStatistic + '</label><select name="stats"></select></div>');
		statsDropDown = statsField.find('select[name=stats]');
		
		var statsOptions = [];
		var indicatorInThemeIds = [];
		
		var mergeIndicatorsData = function () {
		    if(me.groupingsData == null) {
		        return;
		    }
		    
		    if(me.indicatorsData == null) {
		        return;
		    }
		    
            var addIndicators = function (themes, treeNode) {
                if(typeof treeNode.elements !== 'undefined') {
                    //add themes to indicators
                    for(var i = 0; i < treeNode.elements.length; ++i) {
                        var indicator = {};
                        indicator.themes = themes;
                        indicator.id = treeNode.elements[i].id;
                        if(typeof treeNode.elements[i].name !== 'undefined') {
                            indicator.name = treeNode.elements[i].name[Oskari.getLang()];
                        } else {
                            indicator.name = "Tuntematon tilasto";
                        }
                        indicator.title = {"fi": themes.join(", ") + ", " + indicator.name + " (id " + indicator.id + ")"};
                        statsOptions.push(indicator);
                        indicatorInThemeIds.push(indicator.id);
                    }
                }
              
                if(typeof treeNode.themes !== 'undefined') {
                    for(var i = 0; i < treeNode.themes.length;++i) {
                        addIndicators(themes.concat(treeNode.themes[i].name), treeNode.themes[i]);
                    }
                }
            };
        
            for(var i = 0; i < me.groupingsData.groupings.length; ++i) {
                if(me.groupingsData.groupings[i].type === "statistics" && typeof me.groupingsData.groupings[i].themes !== 'undefined') {
                    for(var j = 0; j < me.groupingsData.groupings[i].themes.length; ++j) {
                        addIndicators([me.groupingsData.groupings[i].name], me.groupingsData.groupings[i].themes[j]);
                    }
                }
            }           
            
            for (var i = 0; i < me.indicatorsData.length; ++i) {
                if(jQuery.inArray(me.indicatorsData[i].id, indicatorInThemeIds) == -1) {
                    var indicator = {};
                    indicator.themes = ["Ei teemaa"];
                    indicator.id = me.indicatorsData[i].id;
                    if(typeof me.indicatorsData[i].name !== 'undefined') {
                        indicator.name = me.indicatorsData[i].name[Oskari.getLang()];
                    } else {
                        indicator.name = "Tuntematon tilasto";
                    }
                    indicator.title = {"fi": indicator.themes.join(", ") + ", " + indicator.name + " (id " + indicator.id + ")"};
                    statsOptions.unshift(indicator);
                }
            }

            for (var opt in statsOptions) {
                var option = jQuery('<option></option>');
                option.attr('value', opt);
                option.append(statsOptions[opt].title.fi);
                statsDropDown.append(option);
            }
            
            statsDropDown.chosen({
                no_results_text: "Ei hakutuloksia",
                placeholder_text: "Valitse",
                search_contains: true
            });
		    
		}
		me._sendRequest(me.instance.sandbox.getAjaxUrl() + 'action_route=GetGroupings',
			// success callback
			function (dataArray) {
		        me.groupingsData = dataArray;
		        mergeIndicatorsData();
			},
			// error callback
			function (jqXHR, textStatus) {
				//me.showMessage("Error");
				//return null;
			});
		
        me._sendRequest(me.instance.sandbox.getAjaxUrl() + 'action_route=GetSzopaData&action=indicators&version=1.1',
            // success callback
              function (dataArray) {
                  me.indicatorsData = dataArray;
                  mergeIndicatorsData();
              },
              // error callback
              function (jqXHR, textStatus) {
                  //me.showMessage("Error");
                  //return null;
              });

		var statsBtnCnt = jQuery('<div class="buttons"></div>');
		var addStatBtn2 = Oskari.clazz.create('Oskari.userinterface.component.Button');
		addStatBtn2.setTitle(me.loc.AddSelectedStatistic);
		addStatBtn2.setHandler(function () {                
			var selectedItem = statsOptions[statsDropDown.val()];				
			
			var node = $("#tree").dynatree("getActiveNode");
			
			//Don't add child if it is item (map_layer or statistic)
			if (!node || node.data.nodeType == 'item') {
				return;
			}

			//var children = node.data.children;
			
			var newChild = {
					title: selectedItem.title["fi"],
					isFolder: false,
					nodeType: 'item',
					itemId: selectedItem.id,
					itemType: 'statistic'
					//children: []
					/*icon: false*/
				};
			node.addChild(newChild);
			node.expand(true);
		});
		
		addStatBtn2.insertTo(statsBtnCnt);
		statsContainer.append(statsField);
		statsContainer.append(statsBtnCnt);
		me.statsContainer = statsContainer;
		
		themesTemplate.append(statsContainer);
		
		//////////////////////////////
		//////END OF STATISTICS///////
		//////////////////////////////

		////////////////////////////
		//Changing the type of theme
		////////////////////////////
		var themeTypeSelection = themeTypeField.find('select[name=themetype]');
		if (themeTypeSelection != null) {
			if (themeTypeSelection.val() == 'map_layers') {
				addLayerBtn.setEnabled(true);
				addStatBtn.setEnabled(false);
				addSubthemeBtn.setEnabled(false);
				
				statsContainer.hide();
			} else {
				addLayerBtn.setEnabled(false);
				addStatBtn.setEnabled(true);
				addSubthemeBtn.setEnabled(true);
			}
			
			themeTypeSelection.change(function() {
				if (this.value == 'map_layers') {
					addLayerBtn.setEnabled(true);
					addStatBtn.setEnabled(false);
					addSubthemeBtn.setEnabled(false);
					
					statsContainer.hide();
				} else {
					addLayerBtn.setEnabled(false);
					addStatBtn.setEnabled(true);
					addSubthemeBtn.setEnabled(true);
				}
				
				//change type of the editing theme
				var node = $("#tree").dynatree("getActiveNode");
				
				if (!node || node.data.nodeType == 'item' || node.data.nodeType == 'root') {
					return;
				}
				
				if (me.addThemeButton) {
					if (this.value == 'map_layers') {
						me.addThemeButton.setEnabled(false);
					} else {
						me.addThemeButton.setEnabled(true);
					}
				}
					
				/*node.fromDict({
					title: node.data.title,
					isFolder: node.data.isFolder,
					nodeType: node.data.nodeType,
					themeName: node.data.title,
					themeType: this.value,
					children: node.data.children
				});*/
				
				node.data.themeType = this.value;
				node.render();

				var pnode = node.parent;
				var key = node.data.key;

				if(typeof pnode.data.children !== 'undefined' && pnode.data.children) {
    				for (var i=0; i < pnode.data.children.length; i++) {
    					node = pnode.data.children[i];

    					if (node.key == key) {
    						node.themeType = this.value;
    					}
    				}
				}
				
			});
		}


		me.themesPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		me.themesPanel.setTitle('Teemojen hallinta'); //TODO localization
		me.themesPanel.setContent(themesTemplate);
		me.themesPanel.setVisible(true);
		accordion.addPanel(me.themesPanel);
		
		if (me.isTheme) {
			me.metadataPanel.close();
			me.themesPanel.open();
		}

		
		accordion.insertTo(contentDiv);

		// buttons
		// close
		content.find('div.header div.icon-close').bind('click', function () {
			me._closeExtension('LayerSelector');
			me.instance.showCustomView(false);
		});
		contentDiv.append(me._getButtons());
		
		//TODO disable map during navigation in the form
		/*var inputs = me.mainPanel.find('input[type=text]');
		inputs.focus(function () {
			me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
		});
		inputs.blur(function () {
			me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
		});*/
		
		return content;
	},
	
	_addNewTheme: function () {
		var node = $("#tree").dynatree("getActiveNode");
		
		//Don't add child if it is an item (map_layer or statistic).
		if (!node || node.data.nodeType == 'item') {
			return;
		}
		
		var themeType = $('#themes').find('select[name=themetype]').val();
		
		var newChild = {
			title: 'uusi teema', //TODO localization
			isFolder: true,
			nodeType: 'theme',
			themeName: 'uusi teema', //TODO localization
			themeType: themeType,
			children: []
			/*icon: false*/
		};
		
		var addedNode = node.addChild(newChild);
		
		if (addedNode) {
			addedNode.activate();
		}
		
		node.expand(true);
		
	},
	
	_getButtons: function () {
		var me = this,
			buttonCont = me.templateButtonsDiv.clone(),
			cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		cancelBtn.setTitle('> ' + me.loc.buttons.cancel); //TODO localization
		cancelBtn.setHandler(function () {
			me._closeExtension('LayerSelector');
			me.instance.showCustomView(false);
		});
		cancelBtn.addClass('cancelBtn');

		var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		saveBtn.setTitle(me.loc.buttons.ok);
		saveBtn.addClass('primary');
		saveBtn.addClass('saveBtn');
		saveBtn.setHandler(function () {
		    var selections = me._gatherSelections();
		    if (selections) {
		        me.service.saveGrouping(selections, function (data) {
		            if (data.status == 'created') {
		                me._afterGroupingSaved(selections, data.grouping);
		            } else if (data.status == 'updated') {
		                me._afterGroupingUpdated(selections, data.grouping);
		            }
		        }, me.errorCb);
		    }
		});
		saveBtn.insertTo(buttonCont);
        cancelBtn.insertTo(buttonCont);
		return buttonCont;
	},
	_afterGroupingSaved: function (original, grouping) {
	    var me = this;
        if (grouping.status == 3) {
            me.showMessage(me.loc.info, me.loc.publishedWarning);
        } else {
            me.showMessage(me.loc.info, me.loc.notPublishedWarning);
        }
        me._closeExtension('LayerSelector');
        me.instance.showCustomView(false);

        var data = $.extend(true, {}, original, grouping);
        var isTheme = true;
        if (data.mainType == 'package') {
            isTheme = false;
        }
        var layers = me.instance.getLayersWithoutPublishRights();
        me.instance.showCustomView(true, layers, data, isTheme);
	},
	_afterGroupingUpdated: function (original, grouping) {
	    var me = this;
        if (grouping.mainTpe == 'package') 
            me.showMessage(me.loc.info, me.loc.packageUpdated);
        else
	        me.showMessage(me.loc.info, me.loc.themeUpdated);
	    me._closeExtension('LayerSelector');
	    me.instance.showCustomView(false);
	},
	_gatherSelections: function () {
		var me = this,
			selections = {
				name: '',
				label: '',
				state: '',
				themes: []
			};

		if (me.data && me.data.id) {
			selections.id = me.data.id;
		}
		
		//get root element from the tree
		var children = $("#tree").dynatree("getTree").toDict();
		var root = children[0];

		if (!me.isTheme) {
			var name = me.metadataPanel.html.find('input[name=metadataNameField]');
			var state = $("#lifecycleStateField").text();
			var shortDescription = me.metadataPanel.html.find('input[name=metadataShortDescriptionField]');
			
			selections.name = name.val();
			var label = me.labelPanel.html.find('input[name=newLabel]').val();
			if ((label == null)||(label.length === 0)) {
				label = me.labelPanel.html.find('select[name=existingLabel]').val();
			}
			if ((label != null)&&(label.length > 0)) {
				selections.label = label;
            }

			if (state == 'alustava') {
				state = 'kesken';
			}
			selections.state = state;//state.val();
			selections.mainType = 'package';
			selections.description = shortDescription.val();
			//TODO: Remove 'userGroup' from backend
			selections.userGroup = '';
			
			//Parsing Tree
			if (root.children) {
				for (var i = 0; i < root.children.length; i++) {
					
					var currentTheme = root.children[i];
				
					var fName = currentTheme.themeName;
					var fType = currentTheme.themeType;
					
					//Layers
					var vLayers = [];

					if (currentTheme.themeType == "map_layers" && currentTheme.children) {
						for (var j = 0; j < currentTheme.children.length; j++) {
						    if (currentTheme.children[j].nodeType == 'item') {
						        var status = 'initial';
						        if (currentTheme.children[j].select)
						            status = 'drawn';
						        vLayers.push({
						            "id": currentTheme.children[j].itemId,
						            "type": "map_layer",
                                    "status" : status,
						        });
							}
						}
					}
					
					//Stats
					var vStats = [];
					var vThemes = [];
					
					if (currentTheme.themeType == "statistics" && currentTheme.children) {
						for (var j = 0; j < currentTheme.children.length; j++) {
						    if (currentTheme.children[j].nodeType == 'item') {
						        var status = 'initial';
						        if (currentTheme.children[j].select)
						            status = 'drawn';
						        vStats.push({
						            "id": currentTheme.children[j].itemId,
						            "type": "statistic",
						            "status": status,
						        });
							} else {
								vThemes.push(me._getEmbeddedValues(currentTheme.children[j]));
							}
						}
					}

					var elements = [];

					if (fType == 'map_layers') {
						elements = vLayers;
					} else {
						elements = vStats;
					}
					
					selections.themes[i] = {
						name : fName,
						type : fType,
						themes : vThemes,
						elements : elements
					};
				}
			}
		} else {
			selections.mainType = 'theme';
			selections.isPublic = me.usersPanel.html.find('input[name=public][value=true]').prop('checked');
			
			var currentTheme = root;
			
			var fName = currentTheme.themeName;
			var fType = currentTheme.themeType;
			
			//Layers
			var vLayers = [];

			if (currentTheme.themeType == "map_layers" && currentTheme.children) {
				for (var j = 0; j < currentTheme.children.length; j++) {
				    if (currentTheme.children[j].nodeType == 'item') {
				        var item = { "id": currentTheme.children[j].itemId, "type": "map_layer" };
				        item.name = {};
				        item.name[Oskari.getLang()] = {
				            'name': currentTheme.children[j].title,
				        };
					    vLayers.push(item);
					}
				}
			}
			
			//Stats
			var vStats = [];
			var vThemes = [];
			
			if (currentTheme.themeType == "statistics" && currentTheme.children) {
				for (var j = 0; j < currentTheme.children.length; j++) {
					if (currentTheme.children[j].nodeType == 'item') {
						vStats.push({"id": currentTheme.children[j].itemId, "type": "statistic"});
					} else {
						vThemes.push(me._getEmbeddedValues(currentTheme.children[j]));
					}
				}
			}

			var elements = [];

			if (fType == 'map_layers') {
				elements = vLayers;
			} else {
				elements = vStats;
			}
			
			selections.name = fName;
			selections.type = fType;
			selections.themes = vThemes;
			selections.elements = elements;
			
		}

		var sharingData = me.sharingForm.getData();
		var permissions = [];

        for (var i = 0; i < sharingData.length; i++) {
            var item = {                
                'id': sharingData[i].credentialId,
                'permissionId': sharingData[i].permissionId,
                'type': sharingData[i].type,
                'email': sharingData[i].email,
            };
            permissions.push(item);
        }
	    selections.permissions = permissions;		
		return selections;
	},
	
	_getEmbeddedValues: function (currentTheme) {
			
		var fName = currentTheme.themeName;
		var fType = currentTheme.themeType;
		
		//Layers
		var vLayers = [];

		if (currentTheme.themeType == "map_layers" && currentTheme.children) {
			for (var j = 0; j < currentTheme.children.length; j++) {
				if (currentTheme.children[j].nodeType == 'item') {
					vLayers.push({"id": currentTheme.children[j].itemId, "type": "map_layer"});
				}
			}
		}
		
		//Stats
		var vStats = [];
		var vThemes = []
		
		if (currentTheme.themeType == "statistics" && currentTheme.children) {
			for (var j = 0; j < currentTheme.children.length; j++) {
				if (currentTheme.children[j].nodeType == 'item') {
					vStats.push({"id": currentTheme.children[j].itemId, "type": "statistic"});
				} else {
					vThemes.push(this._getEmbeddedValues(currentTheme.children[j]));
				}
			}
		}

		var elements = [];

		if (fType == 'map_layers') {
			elements = vLayers;
		} else {
			elements = vStats;
		}
		
		//selections.themes[i] = {
		return {
			name : fName,
			type : fType,
			themes : vThemes,
			elements : elements
		};
	},

	//------------------------
	//MAP LAYERS FUNCTIONALITY
	//------------------------
	
	_getLayersList: function () {
		var layers = [],
			selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
		return selectedLayers;
	},	
	handleLayerAdded: function (layer) {
	    var me = this;
	    if (me.themesPanel) {
	        me._addLayerToTree([layer]);
	    }
	},
	handleLayerRemoved: function (layer) {
	    var me = this;
	    if (me.themesPanel) {	       	        
	        me._removeLayerFromTree([layer]);
	    }
    },	
	_addLayerToTree: function(layers){
		var node = $("#tree").dynatree("getActiveNode");
			
		//Don't add child if it is item (map_layer or statistic)
		if (!node || node.data.nodeType == 'item') {
			return;
		}

		var childrenMap = {};
	    var children = node.getChildren() || [];
	    for (var i = 0; i < children.length; i++) {
	        childrenMap[children[i].data.itemId] = children[i];
	    }
		
		for (i = 0; i < layers.length; i++) {
		    var layer = layers[i];

            if (childrenMap[layer.getId()]) {
                childrenMap[layer.getId()].data.title = layer.getName();
            } else {
                var newChild = {
                    title: layer.getName(),
                    isFolder: false,
                    nodeType: 'item',
                    itemId: layer.getId(),
                    itemType: 'map_layer'
                    /*icon: false*/
                };
                node.addChild(newChild);
            }
		}
		
		node.expand(true);
	},
	_removeLayerFromTree: function (layers) {
	    var node = $("#tree").dynatree("getActiveNode");

	    //Don't add child if it is item (map_layer or statistic)
	    if (!node || node.data.nodeType == 'item') {
	        return;
	    }

	    var childrenMap = {};
	    var children = node.getChildren() || [];
	    for (var i = 0; i < children.length; i++) {
	        childrenMap[children[i].data.itemId] = children[i];
	    }

	    for (i = 0; i < layers.length; i++) {
	        var layer = layers[i];

	        if (childrenMap[layer.getId()]) {
	            node.removeChild(childrenMap[layer.getId()]);
	        }
	    }

	    node.expand(true);
	},
	_getFakeExtension: function (name) {
		return {
			getName: function () {
				return name;
			}
		};
	},
	_openExtension: function (name) {
		var extension = this._getFakeExtension(name),
			rn = 'userinterface.UpdateExtensionRequest';

		var top = this.mainPanel.position().top;
		var left = this.mainPanel.position().left + this.mainPanel.width();

		this.instance.getSandbox().postRequestByName(rn, [extension, 'attach', rn, top, left]); //665
	},
	_closeExtension: function (name) {
		var extension = this._getFakeExtension(name),
			rn = 'userinterface.UpdateExtensionRequest';

		var top = this.mainPanel.position().top;
	    var left = '180';

	    this.instance.getSandbox().postRequestByName(rn, [extension, 'close', rn, top, left]); //665
	},
	
	//-----------------------
	//CONNECTION WITH BACKEND
	//-----------------------
	
	_sendRequest: function(url, successCb, errorCb) {			
		jQuery.ajax({
			type: "GET",
			dataType: 'json',
			beforeSend: function (x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			url: url,
			success: function (pResp) {                    
				if (successCb) {
					successCb(pResp);
				}
			},
			error: function (jqXHR, textStatus) {
				if (errorCb && jqXHR.status !== 0) {
					errorCb(jqXHR, textStatus);
				}
			}
		});			
	},	
	showMessage: function (title, message, buttons) {
	    var me = this,
            loc = this._locale,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	    if (buttons) {
	        dialog.show(title, message, buttons);
	    } else {
	        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
	        //okBtn.setTitle(loc.buttons.ok);
	        okBtn.setTitle("OK");
	        okBtn.addClass('primary');
	        okBtn.setHandler(function () {
	            dialog.close(true);
	            me.dialog = null;
	        });
	        dialog.show(title, message, [okBtn]);
	        me.dialog = dialog;
	    }
	}
}, {
    // the protocol / interface of this object is view
    "protocol": ["Oskari.userinterface.View"],
    // extends DefaulView
    "extend": ["Oskari.userinterface.extension.DefaultView"]
});