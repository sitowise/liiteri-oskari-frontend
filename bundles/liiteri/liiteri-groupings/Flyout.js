/**
 * @class Oskari.liiteri.bundle.liiteri-groupings.Flyout
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-groupings.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
		this.container = null;
        this.state = null;
        this.template = jQuery("<div class='startview'>" + "<div class='content'></div>" +
            "<div class='tou'><a href='JavaScript:void(0;)'></a></div>" +
            "<div class='buttons'></div>" + "</div>");
		this.loc = this.instance.getLocalization("StartView");
		this.dataTable = null;
		
		this.content = null;
		
		this.datatableLocaleLocation = Oskari.getSandbox().getService('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService').getDataTablesLocaleLocation();
		this.templates = {
		    'table': '<table id="groupings-table" class="stripe hover row-border"><thead><tr>' +
				'<th>' + this.loc.table.name + '</th>' +
				'<th>' + this.loc.table.mainType + '</th>' +
				'<th>' + this.loc.table.created + '</th>' +
				'<th>' + this.loc.table.updated + '</th>' +
				'<th>' + this.loc.table.state + '</th>' +
				'<th>' + this.loc.table.operations + '</th>' +
				'</tr></thead><tbody></tbody></table>'
		}
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-groupings.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('liiteri-groupings')) {
                jQuery(this.container).addClass('liiteri-groupings');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this;
            //this.template = jQuery('<div></div>');
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('flyout').title;
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {Object} state
         *      state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method createUI
         * Creates the UI for a fresh start
         */
        createUI: function () {
            var me = this,
                sandbox = me.instance.getSandbox();

            // clear container
            var cel = jQuery(this.container);
            cel.empty();
            var content = this.template.clone();
			
			this.content = content;
			cel.append(content);
			
			me._showGroupingList(content);
			
			//Button for creating packages
			var createPackageButton = jQuery('<a class=""><span class="glyphicon glyphicon-tasks"></span>' + me.loc.CreateNewServicePackage + '</a>');
			createPackageButton.click(function(){
				var layers = me.instance.getLayersWithoutPublishRights();
                me.instance.showCustomView(true, layers);
			});
			
			//Button for creating themes
			var createThemeButton = jQuery('<a class=""><span class="glyphicon glyphicon-tasks"></span>' + me.loc.CreateNewTheme + '</a>');
			createThemeButton.click(function(){
				var layers = me.instance.getLayersWithoutPublishRights();
                me.instance.showCustomView(true, layers, null, true);
			});
			
			content.find('div.buttons').append(createPackageButton);
			content.find('div.buttons').append(createThemeButton);
        },
		
		_showGroupingList: function (content) {
			var me = this;
			var tableElement = jQuery(me.templates.table);
			content.append(tableElement)
		
			var dataTable = tableElement.DataTable({
				"ajax": {
					"url": me.instance.getSandbox().getAjaxUrl() + 'action_route=GetGroupings',
					"dataSrc": "groupings"
				},
				"columns": [
					{ "data": "name" },
					{ "data": null },
					{ "data": "created", "defaultContent": "" },
					{ "data": "updated", "defaultContent": "" },
					{ "data": "state", "defaultContent": "" },
					{ "data": null }
				],
				"columnDefs": [
					{
						"targets": 5,
						"render": function (data, type, row) {
							var operationsLinks = jQuery('<div class="operationsLinks"></div>');
							
							var editLink = jQuery('<a class="editLink glyphicon glyphicon-pencil"></a>');
							operationsLinks.append(editLink);
							
							var copyLink = jQuery('<a class="copyLink glyphicon glyphicon-link"></a>');
							operationsLinks.append(copyLink);

							var removeLink = jQuery('<a class="removeLink glyphicon glyphicon-remove-sign"></a>');
							operationsLinks.append(removeLink);
							
							return operationsLinks.outerHTML();
						}
					},
					{
						"targets": 1,
						"render": function (data, type, row) {
							var mainType = data["mainType"];
							if (mainType === 'package') { //TODO localization
								return "Palvelupaketti";
							} else if (mainType === 'theme'){
								return "Teema";
							}
						}
					}
				],
				"language": {
					"url": this.datatableLocaleLocation + this.loc.datatablelanguagefile
				},
				//"scrollY": height + "px",
				"scrollCollapse": true,
				"paging": false,
				"processing": true,
				"searching": false,
				"info": false
			});
			
			tableElement.find('tbody').on('click', 'a.editLink', function () {
				var data = dataTable.row($(this).parents('tr')).data();
				
				if (data) {
					//TODO
					//me._showEditPopUp(data);
					
					var isTheme = true;
					if (data.mainType == 'package') {
						isTheme = false;
					}
					var layers = me.instance.getLayersWithoutPublishRights();
					me.instance.showCustomView(true, layers, data, isTheme);
					//return false;
				}
				
			});
			
			tableElement.find('tbody').on('click', 'a.copyLink', function () {
				var data = dataTable.row($(this).parents('tr')).data();
				if (data == null) {
                    return;
                }
                var url = window.location.protocol+'//'+window.location.host+'/?service_package='+data.id;
				// From http://www.jomendez.com/2017/01/25/copy-clipboard-using-javascript/
				if (window.clipboardData && window.clipboardData.setData) { // IE
					return clipboardData.setData("Text", text);
				} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
					var textarea = document.createElement("textarea");
					textarea.textContent = url;
					textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
					document.body.appendChild(textarea);
					textarea.select();
					try {
						return document.execCommand("copy"); // Security exception may be thrown by some browsers.
					} catch (ex) {
						return false;
					} finally {
						document.body.removeChild(textarea);
					}
				}
	        });

			tableElement.find('tbody').on('click', 'a.removeLink', function () {
				var data = dataTable.row($(this).parents('tr')).data();
				
				if (data.id) {
					var delConfirm = confirm(me.loc.DeleteConfirm);
					if (delConfirm == true) {
						me._deleteServicePackage(data.id, data.mainType);
					}
				}
			});
			
			this.dataTable = dataTable;
		
		},
		
		_deleteServicePackage: function (id, type, success) {
			var me = this;
			var url = me.instance.sandbox.getAjaxUrl() + 'action_route=DeleteGrouping';
            jQuery.ajax({
                type: 'POST',
                //dataType: 'json',
                url: url,
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                data: {
					"groupingId": id,
					"type": type
				}
				,
                success: function() {
					var sandbox = me.instance.getSandbox();
					var eventBuilder = sandbox.getEventBuilder('liiteri-groupings.GroupingUpdatedEvent');
					var event = eventBuilder('');
					
					sandbox.notifyAll(event);
				}
                //error: failure
            });
		},
		
		refreshGroupingsList: function() {
			this.dataTable.ajax.reload();
		},
		show: function () {
		    var me = this;
		    var cont = $(me.container).parent().parent();
            cont.addClass('oskari-attached');
            cont.removeClass('oskari-closed');
        },
        hide: function () {
            var me = this;
            var cont = $(me.container).parent().parent();
            cont.addClass('oskari-closed');
            cont.removeClass('oskari-attached');
        }
		
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
