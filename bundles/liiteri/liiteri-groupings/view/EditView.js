
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
			'<div class="data-list hidden"></div>' +
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
	me.themeTools = jQuery('<div class="theme-tools"><span class="glyphicon glyphicon-plus theme-tool add-tool"></span><span class="glyphicon glyphicon-minus theme-tool remove-tool"></span><span class="glyphicon glyphicon-arrow-up theme-tool move-up-tool"></span><span class="glyphicon glyphicon-arrow-down theme-tool move-down-tool"></span><span class="glyphicon glyphicon-pencil theme-tool rename-tool"></span></div>');
    me.toolPopup = jQuery('<div class="tool-popup"></div>');
    me.toolPopupText = jQuery('<div class="tool-popup-text"></div>');
    me.importButton = jQuery('<div class="data-import hidden"><span class="glyphicon glyphicon-arrow-left import-tool"></span></div>');
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
	
	me.statsContainer = null;
	me.importedList = null;
	me.dataList = null;
	me.existingLabelSelection = null;
	me.validateTool = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
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
				children.push(me._handleServicePackageTreeData(subChildren));
			} else {
				children.push({title: this.data.name, isFolder: true, nodeType: 'roottheme', children: subChildren, themeName: this.data.name, themeType: this.data.type, activate: true, focus: true/*, icon: false*/}); //TODO localization
			}
			
			
		} else {
			if (!this.isTheme) {
				children.push(me._handleServicePackageTreeData([]));
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
		    onExpand: function() {
		    	var node = jQuery("#tree").dynatree("getActiveNode");
				me._toggleServicePackageThemeButtons(node);
		    },
		    children: children,
		    minExpandLevel: 1,
		    clickFolderMode: 1,
		    imagePath: "/skin-vista/",
		    checkbox: false,
		    selectMode: 1,
			autoFocus: false
		};

        if (!me.isTheme) {
            treeParams['minExpandLevel'] = 2;
        }

		me.importedTree = $("#tree");
		me.importedTree.dynatree(treeParams);

		var activeNode = me.importedTree.dynatree("getActiveNode");
		if (activeNode) {
			$('#themes').find('input[name=themeNameField]').val(activeNode.data.themeName);
			$('#themes').find('select[name=themetype]').val(activeNode.data.themeType);

			if (activeNode.getChildren() && activeNode.getChildren().length > 0) {
				$('#themes').find('select[name=themetype]').prop('disabled', 'disabled');
			}

			var addLayerBtns = jQuery('.groupingsContainer .add-layers-button');
			var addStatBtns = jQuery('.groupingsContainer .add-stat-button');
			var addSubthemeBtns = jQuery('.groupingsContainer .add-subtheme-button');

			if (activeNode.data.themeType == 'map_layers') {
				addLayerBtns.show();
				addStatBtns.hide();
				addSubthemeBtns.hide();

				me.statsContainer.hide();
			} else {
				addLayerBtns.hide();
				addStatBtns.show();
				addSubthemeBtns.show();
			}
			
			me._onActivateTreeNode(activeNode);
		}
	},

	_handleServicePackageTreeData: function(subChildren) {
        var me = this,
        child = {
            title: me.loc.themeTools.servicePackage,
            isFolder: true,
            nodeType: 'root',
			key: 'root',
            activate: true,
            focus: true,
            children: []
        },
        mapLayersRoot = {
			title: me.loc.themeTools.mapLayers,
			isFolder: true,
			nodeType: 'type',
			themeType: 'map_layers',
			key: 'map_layers',
			activate: false,
			focus: false,
			children: []
		},
		statisticsRoot = {
			title: me.loc.themeTools.statistics,
			isFolder: true,
			nodeType: 'type',
			themeType: 'statistics',
			key: 'statistics',
			activate: false,
			focus: false,
			children: []
        };

		subChildren.forEach(function(subChild) {
			switch (subChild.themeType) {
				case 'map_layers':
					mapLayersRoot.children.push(subChild);
					break;
				case 'statistics':
					statisticsRoot.children.push(subChild);
					break;
			}
		});
		child.children.push(mapLayersRoot, statisticsRoot);
		return child;
	},

	_onActivateTreeNode: function(node) {
		var me = this;
		if (me.isTheme) {
			if (node.data.nodeType == 'theme' || node.data.nodeType == 'themetype' || node.data.nodeType == 'roottheme') {
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
			} else {
				jQuery('#themeMetadataContainer').hide();
				if (me.addThemeButton) {
					me.addThemeButton.setEnabled(true);
				}
			}
		} else {
			me._toggleServicePackageThemeButtons(node);
		}

		var addLayerBtns = jQuery('.groupingsContainer .add-layers-button');
		var addStatBtns = jQuery('.groupingsContainer .add-stat-button');
		var addSubthemeBtns = jQuery('.groupingsContainer .add-subtheme-button');

		if (node.data.themeType == 'map_layers') {
			addLayerBtns.show();
			addStatBtns.hide();
			addSubthemeBtns.hide();

			me.statsContainer.hide();
		} else {
			addLayerBtns.hide();
			addStatBtns.show();
			
			/*Prevent to add subtheme if maximum level of statistic subthemes is reached (can be 1 theme + 4 subthemes):
				- Service package: 0 - root, 1 - service package, 2-6 - themes, 7 - statistics
				- Standalone Theme: 0 - root, 1-5 - themes, 6 - statistics*/
			if ((!me.isTheme && node.getLevel() < 6) || (me.isTheme && node.getLevel() < 5)) {
				addSubthemeBtns.show();
			} else {
				addSubthemeBtns.hide();
			}
		}
	},

	_toggleServicePackageThemeButtons: function(node) {
		if ((node == null) ||(node.data == null)) {
			return;
		}
		var nodeType = node.data.nodeType;
		var numParentChildren;
		var addThemeButtons = jQuery('.groupingsContainer .add-tool'),
			removeThemeButtons = jQuery('.groupingsContainer .remove-tool'),
			moveUpThemeButtons = jQuery('.groupingsContainer .move-up-tool'),
			moveDownThemeButtons = jQuery('.groupingsContainer .move-down-tool'),
			renameThemeButtons = jQuery('.groupingsContainer .rename-tool'),
			importButton = jQuery('.groupingsContainer .import-tool');
			switch (nodeType) {
				case 'root':
					addThemeButtons.addClass('disabled');
					removeThemeButtons.addClass('disabled');
					moveUpThemeButtons.addClass('disabled');
					moveDownThemeButtons.addClass('disabled');
					renameThemeButtons.addClass('disabled');
					importButton.addClass('disabled');
					break;
				case 'type':
					addThemeButtons.removeClass('disabled');
					removeThemeButtons.addClass('disabled');
					moveUpThemeButtons.addClass('disabled');
					moveDownThemeButtons.addClass('disabled');
					renameThemeButtons.addClass('disabled');
					importButton.addClass('disabled');
					break;
				case 'theme':
					if (node.data.themeType === 'map_layers') {
						addThemeButtons.addClass('disabled');
					} else {
						addThemeButtons.removeClass('disabled');
					}
					removeThemeButtons.removeClass('disabled');
					numParentChildren = node.parent.childList.length;
					if ((numParentChildren > 1)&&(node.data.key !== node.parent.childList[numParentChildren-1].data.key)) {
						moveDownThemeButtons.removeClass('disabled');
					} else {
						moveDownThemeButtons.addClass('disabled');
					}
					if ((numParentChildren > 1)&&(node.data.key !== node.parent.childList[0].data.key)) {
						moveUpThemeButtons.removeClass('disabled');
					} else {
						moveUpThemeButtons.addClass('disabled');
					}
					renameThemeButtons.removeClass('disabled');
					importButton.removeClass('disabled');
					break;
				case 'item':
					addThemeButtons.addClass('disabled');
					removeThemeButtons.removeClass('disabled');
					numParentChildren = node.parent.childList == null ? 0 : node.parent.childList.length;
					if ((numParentChildren > 1)&&(node.data.key !== node.parent.childList[numParentChildren-1].data.key)) {
						moveDownThemeButtons.removeClass('disabled');
					} else {
						moveDownThemeButtons.addClass('disabled');
					}
					if ((numParentChildren > 1)&&(node.data.key !== node.parent.childList[0].data.key)) {
						moveUpThemeButtons.removeClass('disabled');
					} else {
						moveUpThemeButtons.addClass('disabled');
					}
					renameThemeButtons.addClass('disabled');
					importButton.addClass('disabled');
					break;
				default:
					addThemeButtons.addClass('disabled');
					removeThemeButtons.addClass('disabled');
					moveUpThemeButtons.addClass('disabled');
					moveDownThemeButtons.addClass('disabled');
					renameThemeButtons.addClass('disabled');
					importButton.addClass('disabled');
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

	_createDataListView: function() {
		var me = this;
		var treeData = [
			{
				title: me.loc.themeTools.allData,
				key: 'allData',
				hideCheckbox: true,
				folder: true,
				children: [
					{
						title: me.loc.themeTools.mapLayers,
						key: 'mapLayers',
						themeType: 'map_layers',
						hideCheckbox: true,
						folder: true,
						children: []
					},
					{
						title: me.loc.themeTools.statistics,
						key: 'statistics',
						themeType: 'statistics',
						hideCheckbox: true,
						folder: true,
						children: []
					}
				]
			}
		];
		me.mainPanel.find('div.data-list').removeClass('hidden');
		me.mainPanel.find('div.data-import').removeClass('hidden');
		me.mainPanel.find('div.readyThemes').addClass('import');
		if (me.groupingsData != null) {
			me.groupingsData.groupings.forEach(function (grouping) {
				me._handleGrouping(grouping, treeData[0].children)
			});
		}
		me.dataList.fancytree('option', 'source', treeData);
	},

	_createServicePackageGroupingView: function() {
		var me = this;
		var labels = [];
		// Add and sort
		if (me.groupingsData != null) {
			me.groupingsData.groupings.forEach(function(grouping) {
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
		}
		me.existingLabelSelection.empty();
		labels.forEach(function(label) {
			var labelOption = jQuery('<option></option>');
			labelOption.attr('value', label);
			labelOption.append(label);
			me.existingLabelSelection.append(labelOption);
		});
		if ((me.data != null)&&(me.data.label != null)&&(me.data.label.length > 0)) {
			me.existingLabelSelection.val(me.data.label);
		}
	},

	prepareView: function () {
		var me = this,
			content = me.template.clone();
		
		me.themeList.empty();
		me.themesValues = new Array();
		me.permissionsValues = new Array();
			
		me.mainPanel = content;

		var contentDiv = content.find('div.content'),
			accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion'),
			dataListView = content.find('div.data-list'),
			importButton = me.importButton.clone();
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
		if (!me.isTheme) {
			var labelContainer = jQuery('<div class="servicePackageLabel"></div>');

			var existingLabelField = jQuery('<div class="oskarifield"><label for="existingLabel" class="existingLabelField"></label><select name="existingLabel"></select></div>');
			var existingLabelTitle = existingLabelField.find('label.existingLabelField');
			existingLabelTitle.html(me.loc.chooseLabel);
			me.existingLabelSelection = existingLabelField.find('select[name=existingLabel]');
			labelContainer.append(existingLabelField);

			var newLabelField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'newLabel');
			newLabelField.getField().find('input');
			newLabelField.setLabel(me.loc.createNewLabel);
			newLabelField.bindChange(function() {
				if (newLabelField.getValue().length > 0) {
					me.existingLabelSelection.prop('disabled', true);
					existingLabelTitle.addClass('disabled');
				} else {
					me.existingLabelSelection.prop('disabled', false);
					existingLabelTitle.removeClass('disabled');
				}
			}, true);
			labelContainer.append(newLabelField.getField());

			me.labelPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
			me.labelPanel.setTitle(me.loc.grouping);
			me.labelPanel.setContent(labelContainer);
			me.labelPanel.setVisible(true);
			accordion.addPanel(me.labelPanel);

			me._createServicePackageGroupingView();
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
			dataListView.fancytree({
				source: [],
				icons: false,
				activeVisible: false, // Make sure, active nodes are visible (expanded)
				aria: false, // Enable WAI-ARIA support
				autoActivate: false, // Automatically activate a node when it is focused using keyboard
				autoCollapse: false, // Automatically collapse all siblings, when a node is expanded
				autoScroll: false, // Automatically scroll nodes into visible area
				clickFolderMode: 3, // 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
				checkbox: true, // Show checkboxes
				debugLevel: 0, // 0:quiet, 1:normal, 2:debug
				disabled: false, // Disable control
				focusOnSelect: false, // Set focus when node is checked by a mouse click
				escapeTitles: false, // Escape `node.title` content for display
				generateIds: false, // Generate id attributes like <span id='fancytree-id-KEY'>
				idPrefix: "ft_", // Used to generate node id´s like <span id='fancytree-id-<key>'>
				icon: false, // Display node icons
				keyboard: true, // Support keyboard navigation
				keyPathSeparator: "/", // Used by node.getKeyPath() and tree.loadKeyPath()
				minExpandLevel: 2, // 1: root node is not collapsible
				quicksearch: true, // Navigate to next node by typing the first letters
				rtl: false, // Enable RTL (right-to-left) mode
				selectMode: 2, // 1:single, 2:multi, 3:multi-hier
				tabindex: 0, // Whole tree behaves as one single control
				titlesTabbable: true, // Node titles can receive keyboard focus
				tooltip: false, // Use title as tooltip (also a callback could be specified)
				click: function(event, data){
			        if ((data != null)&&(data.targetType === 'title')) {
						data.node.toggleSelected();
			        }
				}
            });
			me.dataList = dataListView;
		}

		var removeBtnHandler = function () {
            var node = $("#tree").dynatree("getActiveNode");

            if (!node || node.data.nodeType == 'root' || node.data.nodeType == 'roottheme') {
                return;
            }

            node.remove();

            //clear data fields
            $('#themes').find('input[name=themeNameField]').val();
            $('#themes').find('select[name=themetype]').val();

            var activeNode = $("#tree").dynatree("getActiveNode");
            if (activeNode) {
                me._onActivateTreeNode(activeNode);
            }
        }

		if (me.isTheme) {
			//Adding new map layer
			var addLayerBtnTop = Oskari.clazz.create('Oskari.userinterface.component.Button');
			addLayerBtnTop.setTitle(me.loc.themeTools.newMapLayer);
			addLayerBtnTop.addClass('block');
			addLayerBtnTop.addClass('add-layers-button');
			addLayerBtnTop.addClass('addNewThemeButton');
			addLayerBtnTop.setHandler(function () {
				me._openExtension('LayerSelector');
			});
			addLayerBtnTop.insertTo(themesTemplate);

			//Adding new statistic
			var addStatBtnTop = Oskari.clazz.create('Oskari.userinterface.component.Button');
			addStatBtnTop.setTitle(me.loc.themeTools.newStatistics);
			addStatBtnTop.addClass('block');
			addStatBtnTop.addClass('add-stat-button');
			addStatBtnTop.addClass('addNewThemeButton');
			addStatBtnTop.setHandler(function () {
				statsContainer.show();
			});
			addStatBtnTop.insertTo(themesTemplate);

            //Remove selected tree node
            var removeBtnTop = Oskari.clazz.create('Oskari.userinterface.component.Button');
            removeBtnTop.setTitle(me.loc.themeTools.removeItem);
            removeBtnTop.addClass('block');
            removeBtnTop.addClass('addNewThemeButton');
            removeBtnTop.insertTo(themesTemplate);
            removeBtnTop.setHandler(removeBtnHandler);

			//Adding new subtheme
			var addSubthemeBtnTop = Oskari.clazz.create('Oskari.userinterface.component.Button');
			addSubthemeBtnTop.setTitle(me.loc.AddNewTheme);
			addSubthemeBtnTop.addClass('block');
            addSubthemeBtnTop.addClass('addNewThemeButton');
			addSubthemeBtnTop.addClass('add-subtheme-button');
			addSubthemeBtnTop.setHandler(me._addNewTheme);
			addSubthemeBtnTop.insertTo(themesTemplate);
        }

		//Ready themes
		var readyThemesRow = jQuery('<div class="oskarifield ready-themes-row"><span id="metadataCreateDateField" class="metadataFieldValue"></span></div>'); //TODO localization
		if (!me.isTheme) {
		    me._createThemeTools().appendTo(readyThemesRow);
        }

		var readyThemesBox = jQuery("<div class='readyThemes' id='themes'></div>");
		
		var tree = jQuery('<div id="tree"></div>');
		
		readyThemesBox.append(tree);
		readyThemesRow.append(readyThemesBox);
		if (!me.isTheme) {
            readyThemesRow.append(me._createThemeTools());
            readyThemesRow.append(importButton);
            importButton.click(function() {
				var createImportInfoDialog = function(source, target, message) {
                    var infoDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    var closeBtn = infoDialog.createCloseButton(me.loc.close);
                    infoDialog.addClass('import-info-dialog');
					infoDialog.show(source+' => '+target, message, [closeBtn]);
					infoDialog.makeModal();
                };

				var targetNode = $("#tree").dynatree("getActiveNode");
				if ((targetNode == null) || (targetNode.data == null) || (targetNode.data.themeType == null)) {
					return;
				}
            	var selectedData = me.dataList.fancytree('getTree').getSelectedNodes();
            	if (selectedData == null) {
					return;
                }
                var importedFolders = [];
            	var numSelectedData = selectedData.length;
            	for (var i=0; i<numSelectedData; i++) {
            		var sourceNode = selectedData[i];
					if ((sourceNode == null) || (sourceNode.data == null) || (sourceNode.data.themeType == null) || (["statistics", "mapLayers"].indexOf(sourceNode.key) >= 0)) {
						continue;
					}
					var target;
					var numImportedFolders = importedFolders.length;
					for (var j=0; j<numImportedFolders; j++) {
						if (sourceNode.parent.key === importedFolders[j].data.dataKey) {
							target = importedFolders[j];
							break;
						}
					}
					if (target == null) {
						target = targetNode;
					}
					if (sourceNode.data.themeType !== target.data.themeType) {
                		createImportInfoDialog(sourceNode.title, targetNode.data.title, me.loc.multipleThemeTypes);
						continue;
					}
					if ((sourceNode.data.themeType === 'map_layers')&&(sourceNode.folder)) {
                		createImportInfoDialog(sourceNode.title, targetNode.data.title, me.loc.mapLayerNestingLimit);
						continue;
					}
					var numChildren = target.childList == null ? 0 : target.childList.length;
					var sourceExists = false;
					var hasItemChildren = false;
					var hasThemeChildren = false;
					for (var k=0; k<numChildren; k++) {
						if (target.childList[k].data.dataKey === sourceNode.key) {
							sourceExists = true;
							break;
						}
						if (target.childList[k].data.nodeType === "item") {
							hasItemChildren = true;
						} else if (target.childList[k].data.nodeType === "theme") {
							hasThemeChildren = true;
						}
					}
					if (sourceExists) {
						createImportInfoDialog(sourceNode.title, targetNode.data.title, me.loc.existingLayer);
						continue;
					}
					if (sourceNode.data.themeType !== target.data.themeType) {
						createImportInfoDialog(sourceNode.title, targetNode.data.title, me.loc.multipleThemeTypes);
						continue;
					}
					if ((sourceNode.folder)&&(hasItemChildren)) {
						createImportInfoDialog(sourceNode.title, targetNode.data.title, me.loc.hasItemChildren);
						continue;
					}
					if ((!sourceNode.folder)&&(hasThemeChildren)) {
						createImportInfoDialog(sourceNode.title, targetNode.data.title, me.loc.hasThemeChildren);
						continue;
					}
					if (sourceNode.data.itemId == null) {
						target.addChild({
							title: sourceNode.title,
							themeType: sourceNode.data.themeType,
							themeName: sourceNode.title,
							isFolder: true,
							activate: true,
							focus: true,
							select: false,
							nodeType: 'theme',
							dataKey: sourceNode.key
						});
						var children = target.getChildren();
						importedFolders.push(children[children.length-1]);
					} else {
						target.addChild({
							title: sourceNode.title,
							itemId: sourceNode.data.itemId,
							itemType: sourceNode.data.themeType,
							itemName: sourceNode.title,
							isFolder: false,
							activate: true,
							focus: true,
							select: false,
							nodeType: 'item',
							dataKey: sourceNode.key
						});
					}
					sourceNode.setSelected(false);
					target.expand(true);
					target.render();
                }
				var activeNode = jQuery('#tree').dynatree('getActiveNode');
				if (activeNode) {
					me._onActivateTreeNode(activeNode);
				}
            });
        }
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
		var addLayerBtnBottom = Oskari.clazz.create('Oskari.userinterface.component.Button');
		addLayerBtnBottom.setTitle(me.loc.themeTools.newMapLayer);
		addLayerBtnBottom.addClass('block');
		addLayerBtnBottom.addClass('add-layers-button');
		addLayerBtnBottom.setHandler(function () {
			me._openExtension('LayerSelector');
		});
		addLayerBtnBottom.insertTo(addItemButtons);

		//Adding new statistic
		var addStatBtnBottom = Oskari.clazz.create('Oskari.userinterface.component.Button');
		addStatBtnBottom.setTitle(me.loc.themeTools.newStatistics);
		addStatBtnBottom.addClass('block');
		addStatBtnBottom.addClass('add-stat-button');
		addStatBtnBottom.setHandler(function () {
			statsContainer.show();
		});
		addStatBtnBottom.insertTo(addItemButtons);

		//Remove selected tree node
		var removeBtnBottom = Oskari.clazz.create('Oskari.userinterface.component.Button');
		removeBtnBottom.setTitle(me.loc.themeTools.removeItem);
		removeBtnBottom.addClass('block');
		removeBtnBottom.addClass('addNewThemeButton');
		removeBtnBottom.insertTo(addItemButtons);
		removeBtnBottom.setHandler(removeBtnHandler);

		//Adding new subtheme
		var addSubthemeBtnBottom = Oskari.clazz.create('Oskari.userinterface.component.Button');
		addSubthemeBtnBottom.setTitle(me.loc.AddNewTheme);
		addSubthemeBtnBottom.addClass('block');
		addSubthemeBtnBottom.addClass('add-subtheme-button');
		addSubthemeBtnBottom.setHandler(me._addNewTheme);
		addSubthemeBtnBottom.insertTo(addItemButtons);

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
				search_contains: true,
				width: "300px" //select is not in dom yet and chosen would render it as 0 width because real width is not known
            });
		    
		}
        me._sendRequest(me.instance.sandbox.getAjaxUrl() + 'action_route=GetThemeGroupings',
			// success callback
			function (dataArray) {
		        me.groupingsData = dataArray;
		        mergeIndicatorsData();
				if (!me.isTheme) {
					if ((me.themesPanel != null)&&(me.themesPanel.isOpen())) {
						me._createDataListView();
					}
					me._createServicePackageGroupingView();
                }
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
		var addLayerBtns = jQuery('.groupingsContainer .add-layers-button');
		var addStatBtns = jQuery('.groupingsContainer .add-stat-button');
		var addSubthemeBtns = jQuery('.groupingsContainer .add-subtheme-button');

		if (themeTypeSelection != null) {
			if (themeTypeSelection.val() == 'map_layers') {
				addLayerBtns.show();
				addStatBtns.hide();
				addSubthemeBtns.hide();

				statsContainer.hide();
			} else {
				addLayerBtns.hide();
				addStatBtns.show();
				addSubthemeBtns.show();
			}
			
			themeTypeSelection.change(function() {
				if (this.value == 'map_layers') {
					addLayerBtns.show();
					addStatBtns.hide();
					addSubthemeBtns.hide();

					statsContainer.hide();
				} else {
					addLayerBtns.hide();
					addStatBtns.show();
					addSubthemeBtns.show();
				}
				
				//change type of the editing theme
				var node = $("#tree").dynatree("getActiveNode");
				
				if (!node || node.data.nodeType == 'item' || node.data.nodeType == 'root') {
					return;
				}
				
				if (me.addThemeButton) {
					if (this.value == 'map_layers') {
						me.addThemeButton.hide();
					} else {
						me.addThemeButton.show();
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

		jQuery(me.themesPanel).on("AccordionPanel.opened", function (event, panel) {
			if (me.isTheme) {
				return;
			}
			me._createDataListView();
        });

		jQuery(me.themesPanel).on("AccordionPanel.closed", function (event, panel) {
			dataListView.addClass('hidden');
			importButton.addClass('hidden');
			readyThemesBox.removeClass('import');
        });

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

	_compare: function(a, b) {
		var c = ['', ''];
		var language = Oskari.getLang();
		for (var i=0; i < 2; i++) {
			var comparable = arguments[i].title;
			if (comparable != null) {
				if (comparable.name != null) {
					comparable = comparable.name;
				} else {
					c[i] = comparable;
					continue;
				}
			} else {
				comparable = arguments[i].name;
			}
			if (comparable != null) {
				c[i] = (comparable[language] != null) ? comparable[language] : comparable;
			}
		}
		return c[0].localeCompare(c[1]);
	},

	_handleTheme: function(theme) {
		var me = this;
		var language = Oskari.getLang();
		if ((theme == null)||(((theme.themes == null)||(theme.themes.length === 0))&&((theme.elements == null)||(theme.elements.length === 0)))) {
			return null;
		}
		var subThemes = [];
		if (theme.themes != null) {
			var numSubThemes = theme.themes.length;
			for (var i=0; i<numSubThemes; i++) {
				theme.themes[i].id = theme.id.toString()+'.sub';
				var subTheme = me._handleTheme(theme.themes[i]);
				if (subTheme != null) {
					subThemes.push(subTheme);
				}
			}
		}
		var elements = [];
		if (theme.elements != null) {
			var numElements = theme.elements.length;
			for (var j=0; j<numElements; j++) {
				if (theme.elements[j] != null) {
					var name = theme.elements[j].name;
					if (name == null) {
						name = theme.elements[j].id.toString();
                    } else if (name[language] != null) {
						name = (name[language].name == null) ? name[language] : name[language].name;
					}
					elements.push({
						title: name,
						key: theme.type+'.'+theme.elements[j].id,
						themeType: theme.type,
						itemId: theme.elements[j].id,
						layer: true
                    });
				}
			}
        }
        var themeName = theme.name;
        if ((themeName !== null)&&(themeName[language] != null)) {
        	themeName = themeName[language];
        }
		return {
			title: themeName,
			key: 'theme.'+theme.id.toString(),
			themeType: theme.type,
			layer: false,
			folder: true,
			children: subThemes.sort(me._compare).concat(elements.sort(me._compare))
		};
	},

	_handleGrouping: function(grouping, treeData) {
		var me = this;
		if (grouping == null) {
			return;
		}
		var i;
		switch (grouping.type) {
			case 'map_layers':
				i = 0;
				break;
			case 'statistics':
				i = 1;
				break;
			default:
				return;
		}
		var numThemes = treeData[i].children.length;
		var themeIndex = 0;
		var theme = me._handleTheme(grouping);
		if (theme == null) {
			return;
		}
		while (themeIndex < numThemes) {
			if (me._compare(grouping, treeData[i].children[themeIndex]) < 0) {
				break;
			}
			themeIndex++;
		}
		treeData[i].children.splice(themeIndex, 0, theme);
	},

	_addItem: function() {
		var me = this;
		var node = jQuery('#tree').dynatree('getActiveNode');
		var addDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
		addDialog.addClass('servicepackage-add-dialog');
		var popupContent = me.toolPopup.clone();
		var addInstructions = me.toolPopupText.clone();
		addInstructions.append(me.loc.themeTools.addInfo);
		popupContent.append(addInstructions);
		var addInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'add-field');
		var addField = addInput.getField();
		popupContent.append(addField);
		var cancelBtn = addDialog.createCloseButton(me.loc.themeTools.btnCancel);
		var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
		okBtn.setTitle(me.loc.themeTools.btnOk);
		okBtn.setHandler(function () {
			addDialog.close(true);
			if ((node == null) || (node.data == null) || (['type', 'theme'].indexOf(node.data.nodeType) === -1)) {
				return;
			}
			var title = addInput.getValue();
        	me.validateTool.setValue(title);
			if ((title == null) || (title.length === 0) || (!me.validateTool.checkValue())) {
				return;
			}
			// Prevent duplicates
			if (node.childList != null) {
				var numChildren = node.childList.length;
				for (var i=0; i<numChildren; i++) {
					var child = node.childList[i];
					if ((child.data != null) && (child.data.nodeType === 'theme') && (child.data.title === title)) {
						return;
					}
				}
			}
			node.addChild({
				title: title,
				isFolder: true,
				activate: true,
				focus: true,
				nodeType: 'theme',
				themeType: node.data.themeType
			});
			node.expand(true);
			node.render();
			var activeNode = jQuery('#tree').dynatree('getActiveNode');
			if (activeNode) {
				me._onActivateTreeNode(activeNode);
			}
		});
		addDialog.show('', popupContent, [cancelBtn, okBtn]);
		addDialog.makeModal();
		addField.find('input').focus();
    },

	_removeItem: function() {
		var me = this;
		var node = jQuery('#tree').dynatree('getActiveNode');
		var removeDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
		removeDialog.addClass('servicepackage-remove-dialog');
		var cancelBtn = removeDialog.createCloseButton(me.loc.themeTools.btnCancel);
		var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
		okBtn.setTitle(me.loc.themeTools.btnOk);
		okBtn.setHandler(function () {
			removeDialog.close(true);
			if (!node || node.data.nodeType == 'root' || node.data.nodeType == 'type' || node.data.nodeType == 'roottheme') {
				return;
			}
			node.remove();
			//clear data fields
			jQuery('#themes').find('input[name=themeNameField]').val();
			jQuery('#themes').find('select[name=themetype]').val();
			var activeNode = jQuery('#tree').dynatree('getActiveNode');
			if (activeNode) {
				me._onActivateTreeNode(activeNode);
			}
		});
		var popupContent = me.toolPopup.clone();
		var confirmRemove = me.toolPopupText.clone();
		var text = me.loc.themeTools.confirmRemove+' '+node.data.title+'?';
		confirmRemove.append(text);
		popupContent.append(confirmRemove);
		removeDialog.show('', popupContent, [cancelBtn, okBtn]);
		removeDialog.makeModal();
	},

	_moveUpItem: function() {
		var me = this;
		var node = jQuery('#tree').dynatree('getActiveNode');
		if (!node || node.data.nodeType == 'root' || node.data.nodeType == 'type' || node.data.nodeType == 'roottheme' || node.isFirstSibling()) {
			return;
		}
		var prevSibling = node.getPrevSibling();
		if (prevSibling != null) {
			node.move(prevSibling, 'before');
		}
		var activeNode = jQuery('#tree').dynatree('getActiveNode');
		if (activeNode) {
			me._onActivateTreeNode(activeNode);
		}
	},

	_moveDownItem: function() {
		var me = this;
		var node = jQuery('#tree').dynatree('getActiveNode');
		if (!node || node.data.nodeType == 'root' || node.data.nodeType == 'type' || node.data.nodeType == 'roottheme' || node.isLastSibling()) {
			return;
		}
		var nextSibling = node.getNextSibling();
		if (nextSibling != null) {
			node.move(nextSibling, 'after');
		}
		var activeNode = jQuery('#tree').dynatree('getActiveNode');
		if (activeNode) {
			me._onActivateTreeNode(activeNode);
		}
	},

	_renameItem: function() {
		var me = this;
		var node = jQuery('#tree').dynatree('getActiveNode');
		var renameDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
		renameDialog.addClass('servicepackage-rename-dialog');
		var popupContent = me.toolPopup.clone();
		var renameInstructions = me.toolPopupText.clone();
		renameInstructions.append(me.loc.themeTools.renameInfo);
		popupContent.append(renameInstructions);
		var renameInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'rename-field');
		renameInput.setValue(node.data.title);
		var renameField = renameInput.getField();
		popupContent.append(renameField);
		var cancelBtn = renameDialog.createCloseButton(me.loc.themeTools.btnCancel);
		var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
		okBtn.setTitle(me.loc.themeTools.btnOk);
		okBtn.setHandler(function () {
			renameDialog.close(true);
			if (!node || node.data.nodeType == 'root' || node.data.nodeType == 'type' || node.data.nodeType == 'roottheme') {
				return;
			}
			var newTitle = renameInput.getValue();
        	me.validateTool.setValue(newTitle);
			if ((newTitle != null) && (newTitle.length > 0) && (me.validateTool.checkValue())) {
				node.data.title = newTitle;
			}
			node.render();
			var activeNode = jQuery('#tree').dynatree('getActiveNode');
			if (activeNode) {
				me._onActivateTreeNode(activeNode);
			}
		});
		renameDialog.show('', popupContent, [cancelBtn, okBtn]);
		renameDialog.makeModal();
		renameField.find('input').focus();
	},

	_createThemeTools: function() {
		var me = this,
		    themeTools = me.themeTools.clone(),
		    addTool = themeTools.find('.add-tool'),
		    removeTool = themeTools.find('.remove-tool'),
		    moveUpTool = themeTools.find('.move-up-tool'),
		    moveDownTool = themeTools.find('.move-down-tool'),
			renameTool = themeTools.find('.rename-tool');
		addTool.click(function() {
			if (!jQuery(this).hasClass('disabled')) {
	            me._addItem.call(me);
			}
        });
		removeTool.click(function() {
			if (!jQuery(this).hasClass('disabled')) {
	            me._removeItem.call(me);
			}
        });
		moveUpTool.click(function() {
			if (!jQuery(this).hasClass('disabled')) {
	            me._moveUpItem.call(me);
			}
        });
		moveDownTool.click(function() {
			if (!jQuery(this).hasClass('disabled')) {
	            me._moveDownItem.call(me);
			}
        });
		renameTool.click(function() {
			if (!jQuery(this).hasClass('disabled')) {
	            me._renameItem.call(me);
			}
        });
		addTool.attr('title', me.loc.themeTools.add);
		removeTool.attr('title', me.loc.themeTools.remove);
		moveUpTool.attr('title', me.loc.themeTools.moveUp);
		moveDownTool.attr('title', me.loc.themeTools.moveDown);
		renameTool.attr('title', me.loc.themeTools.rename);
		me.themeToolButtons = {
			addTheme: addTool,
			removeTheme: removeTool,
			moveUpTheme: moveUpTool,
			moveDownTheme: moveDownTool,
			renameTheme: renameTool
		};
		return themeTools;
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

	_gatherTheme: function(currentTheme) {
		var me = this;
		if ((currentTheme.children == null)||(currentTheme.children.length === 0)) {
			return null;
		}

		var fName = currentTheme.title;
		var fType = currentTheme.themeType;
		var vThemes = [];

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
						"status" : status
					});
				} else {
					var vTheme = me._gatherTheme(currentTheme.children[j]);
					if (vTheme != null) {
						vThemes.push(vTheme);
					}
				}
			}
		}

		//Stats
		var vStats = [];

		if (currentTheme.themeType == "statistics" && currentTheme.children) {
			for (var j = 0; j < currentTheme.children.length; j++) {
				if (currentTheme.children[j].nodeType == 'item') {
					var status = 'initial';
					if (currentTheme.children[j].select)
						status = 'drawn';
					vStats.push({
						"id": currentTheme.children[j].itemId,
						"type": "statistic",
						"status": status
					});
				} else {
					var vTheme = me._gatherTheme(currentTheme.children[j]);
					if (vTheme != null) {
						vThemes.push(vTheme);
					}
				}
			}
		}

		var elements = [];

		if (fType == 'map_layers') {
			elements = vLayers;
		} else {
			elements = vStats;
		}

		return {
			name: fName,
			type: fType,
			themes: vThemes,
			elements: elements
		};
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
					var themeTypeRoot = root.children[i];
					if (themeTypeRoot.children) {
						for (var k = 0; k < themeTypeRoot.children.length; k++) {
							var theme = me._gatherTheme(themeTypeRoot.children[k]);
							if (theme != null) {
								selections.themes.push(theme);
							}
						}
					}
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
                'email': sharingData[i].email
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
		if ((node == null) || (node.data == null) || (node.data.nodeType == 'item')) {
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