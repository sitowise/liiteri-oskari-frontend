/**
 * @class Oskari.liiteri.bundle.liiteri-announcements.Flyout
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-announcements.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-announcements.LiiteriAnnouncementsBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
		this.container = null;
        this.state = null;
		this.loc = this.instance.getLocalization("flyout");
		this.dataTable = null;
		this.content = null;
        this.errorDialog = null;
		var me = this;
		this._errorCb = function (jqXHR, textStatus) {		    
		    var errorKey = textStatus;
		    var responseJson = jQuery.parseJSON(jqXHR.responseText);
		    if (responseJson && responseJson.error)
		        errorKey = responseJson.error;

		    var errorText = errorKey;
		    if (me.loc.error[errorKey])
		        errorText = me.loc.error[errorKey];

		    me._showError(errorText);
		};
		
		this.datatableLocaleLocation = Oskari.getSandbox().getService('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService').getDataTablesLocaleLocation();
		this.templates = {
			'container': '<div class="announcements"><div class="content"></div><div class="buttons"></div></div>',
			'table': '<table id="announcements-table"  class="stripe hover row-border"><thead><tr>' +
				'<th>' + this.loc.table.id + '</th>' +
				'<th>' + this.loc.table.title + '</th>' +
				//'<th>' + this.loc.table.message + '</th>' +
				'<th>' + this.loc.table.expiration + '</th>' +
				'<th>' + this.loc.table.operations + '</th>' +
				'</tr></thead><tbody></tbody></table>'
		}
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-announcements.Flyout';
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
            if (!jQuery(this.container).hasClass('liiteri-announcements')) {
                jQuery(this.container).addClass('liiteri-announcements');
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
            var content = jQuery(me.templates.container);
			
			this.content = content;
			cel.append(content);
			
			me._showMessagesList(content);
			
			//Button for creating packages
			var createMessageButton = jQuery('<a class="announcementsButton">Luo uusi</a>');//TODO localization
			createMessageButton.click(function(){
				me._showCreatingMessagePopUp();
			});

			content.find('div.buttons').append(createMessageButton);
        },
		
		_showMessagesList: function (content) {
			var me = this;
			var tableElement = jQuery(me.templates.table);
			content.append(tableElement)
		
			var dataTable = tableElement.DataTable({
				"ajax": {
					"url": me.instance.getSandbox().getAjaxUrl() + 'action_route=GetAnnouncements',
					"dataSrc": "announcements"
				},
				"columns": [
					{ "data": "id" },
					{ "data": "title" },
					//{ "data": "message" },
					{ "data": "expirationDate" },
					{ "data": "operations" }
				],
				"columnDefs": [
					{
						"targets": 3,
						"render": function (data, type, row) {
							var operationsLinks = jQuery('<div class="operationsLinks"></div>');
							var editLink = jQuery('<a class="editLink glyphicon glyphicon-pencil"></a>');
							var removeLink = jQuery('<a class="removeLink glyphicon glyphicon-remove-sign"></a>');
							
							operationsLinks.append(editLink);
							operationsLinks.append(removeLink);
							
							//return operationsLinks;
							return operationsLinks.outerHTML();
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
					me._showCreatingMessagePopUp(data);
				}
				
			});
			
			tableElement.find('tbody').on('click', 'a.removeLink', function () {
				var data = dataTable.row($(this).parents('tr')).data();
				
				if (data.id) {
					//var delConfirm = confirm(me.loc.DeleteConfirm);
					var delConfirm = confirm('Oletko varma, että haluat poistaa ilmoituksen?'); //TODO localization
					if (delConfirm == true) {
						me._deleteMessage(data.id);
					}
				}
			});
			
			this.dataTable = dataTable;
		
		},
		
		_deleteMessage: function (id) {
			var me = this;
			var url = me.instance.sandbox.getAjaxUrl() + 'action_route=DeleteAnnouncement';
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
					"id": id
				},
                success: function() {
					alert('Ilmoitus poistettiin onnistuneesti'); //TODO localization
					me.refreshMessagesList();
				},
                error: function() {
					alert('Virhe ilmoituksen poistossa'); //TODO localization
				}
            });
		},
		
		refreshMessagesList: function() {
			this.dataTable.ajax.reload();
		},
		
		_saveMessage: function (data, successCb, errorCb) {
			var me = this;
			var url = me.instance.sandbox.getAjaxUrl() + 'action_route=SaveAnnouncement';
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
					"id": data.id,
					"title": data.title,
					"message": data.message,
					"expirationDate": data.expirationDate
				},
				success: function (response) {
				    if (typeof successCb === 'function') {
				        successCb(response);
				    }
				},
				error: function (jqXHR, textStatus) {
				    if (typeof errorCb === 'function' && jqXHR.status !== 0) {
				        errorCb(jqXHR, textStatus);
				    }
				}
			});
		},
		
		_showCreatingMessagePopUp: function(data) {
			var me = this,
				sandbox = this.instance.getSandbox(),
				dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
				cancelBtn = dialog.createCloseButton('Peruuta'), //TODO localization
				saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
			
			var content = jQuery('<div id="newAnnouncementPopup"></div>');
			
			//Title
			var titleField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'titleField');
			titleField.getField().find('input').before('<br />');
			titleField.setLabel("Otsikko"); //TODO: to locale file
			content.append(titleField.getField());
				
			if (data) {
				titleField.setValue(data.title);
			}
		
			//Message
			var messageField = jQuery('<div class="oskarifield"><label for="messageField">Viesti</label>' +
		    	'<textarea name="messageField" autofocus=""></textarea></div>');//TODO: to locale file
			messageField.find('textarea').jqte({
			    focus: function () {
			        sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
			    },
			    blur: function () {
			        sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
			    }
			});
			content.append(messageField);

			if (data) {
			    messageField.find('textarea').jqteVal(data.message);
			}
			
			//Expiration date
			var expirationDateField = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'expirationDateField');
			expirationDateField.getField().find('input').before('<br />');
			expirationDateField.setLabel("Vanhenemispäivä [yyyy-mm-dd]"); //TODO: to locale file
			content.append(expirationDateField.getField());
			
			if (data) {
				expirationDateField.setValue(data.expirationDate);
			}
			
			//$('input[name=expirationDateField]').datepicker();
			
			saveBtn.addClass('primary');
			saveBtn.setTitle('Tallenna'); //TODO localization
			saveBtn.setHandler(function() {
				//Create Message
				var savingData = {};
				if (data) {
					savingData.id = data.id;
				}
				savingData.title = titleField.getValue();
				savingData.message = $('<div/>').text($('textarea[name=messageField]').val()).html();
				savingData.expirationDate = expirationDateField.getValue();

				if (me._validateData(savingData)) {
				    var successCb = function (response) {
				        me._showMessage(me.loc.title, 'Ilmoitus tallennettiin onnistuneesti');
				        me.refreshMessagesList();
				    };
                    me._saveMessage(savingData, successCb, me._errorCb);
                    dialog.close();
                } else {
                    me._showError(me.loc.error.validation);
                }
			});

			dialog.show('Uuden ilmoituksen lisäys', content, [saveBtn, cancelBtn]); //TODO localization
			//dialog.makeModal();*/
		},
        _validateData: function(data) {
            var result = true;

            if (data.title == null || data.title == "" || $.trim(data.title).length == 0)
                result = false;
            else if (data.message == null || data.message == "" || $.trim(data.message).length == 0)
                result = false;
            else if (data.expirationDate == null || data.expirationDate == "" || $.trim(data.expirationDate).length == 0)
                result = false;
            else {
                var validDate = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                if (!data.expirationDate.match(validDate))
                    result = false;
            }

            return result;
        },
        _showMessage: function (title, text) {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(me.loc.buttons.close);
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            dialog.show(title, text, [okBtn]);
        },
        _showError: function (text) {
            var me = this;
            if (me.errorDialog) {
                me.errorDialog.close(true);
                me.errorDialog = null;
                return;
            }
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(me.loc.buttons.close);
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close(true);
                me.errorDialog = null;
            });
            dialog.show(me.loc.error.title, text, [okBtn]);
            me.errorDialog = dialog;
        },
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
