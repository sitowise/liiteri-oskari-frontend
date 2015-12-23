/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.Flyout
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackagesInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this.template = null;
		this.servicePackageForm = null;
		this.selectedServicePackageId = 0;
		this.servicePackagesJson = null;
		this.servicePackagesDropDown = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-servicepackages.Flyout';
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
            if (!jQuery(this.container).hasClass('liiteri-servicepackages')) {
                jQuery(this.container).addClass('liiteri-servicepackages');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this;
            this.template = jQuery('<div></div>');
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
            return this.instance.getLocalization('flyouttitle');
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
			me.servicePackageForm = content;
            content.append(this.instance.getLocalization('flyout').desc);
			
			content.append('</br>');
			
			var dropDownContainer = jQuery('<div id="servicePackagesDropDownContainer"></div>');
			
			//Drop down with service packages
			var servicePackagesDiv = jQuery('<div id="servicePackagesDropdown"><select id="servicePackagesSelect" name="servicePackages"></select></div>');
			var servicePackagesDropDown = servicePackagesDiv.find('select[name=servicePackages]');
			
			this.servicePackagesDropDown = servicePackagesDropDown;
			
			dropDownContainer.append(servicePackagesDiv);
			
			content.append(dropDownContainer);

			
			//Metadata of selected service package
			var servicePackageNameField = jQuery("<div class='servicePackageRow'>Nimi: <span id='servicePackageNameField'></span></div>");//TODO: to locale file
			content.append(servicePackageNameField);
			var servicePackageShortDescriptionField = jQuery("<div class='servicePackageRow'>Kuvaus: <span id='servicePackageShortDescriptionField'></span></div>");//TODO: to locale file
			content.append(servicePackageShortDescriptionField);
			var servicePackageStateField = jQuery("<div class='servicePackageRow'>Tila: <span id='servicePackageStateField'></span></div>");//TODO: to locale file
			content.append(servicePackageStateField);
			var servicePackageModifyDateField = jQuery("<div class='servicePackageRow'>Muokattu: <span id='servicePackageModifyDateField'></span></div>");//TODO: to locale file
			content.append(servicePackageModifyDateField);
			
			content.append('</br>');
			
			cel.append(content);

			me._getServicePackages(me._fillListWithServicePackages, servicePackagesDropDown);
			
			$("#servicePackagesSelect").change(function (e) {
				me.selectedServicePackageId = 0;
				if ($('#servicePackagesSelect').val() == 0) {
					me._fillFieldsWithServicePackage();
					me._sendServicePackageSelectedEvent();
				} else {
					for (var i=0; i<me.servicePackagesJson.length; i++) {
						if (me.servicePackagesJson[i].id == $('#servicePackagesSelect').val()) {
							var servicePackageJson = me.servicePackagesJson[i];
							me._fillFieldsWithServicePackage(servicePackageJson);
							me._sendServicePackageSelectedEvent(servicePackageJson);
							break;
						}
					}
				}
            });

        },
		
		_fillFieldsWithServicePackage: function(servicePackageJson) {
			me = this;
			if (servicePackageJson != null) {
				me.servicePackageForm.find('#servicePackageNameField').html(servicePackageJson.name != null ? servicePackageJson.name : '');
				me.servicePackageForm.find('#servicePackageShortDescriptionField').html(servicePackageJson.description != null ? servicePackageJson.description : '');
				me.servicePackageForm.find('#servicePackageStateField').html(servicePackageJson.state != null ? servicePackageJson.state : '');
				me.servicePackageForm.find('#servicePackageModifyDateField').html(servicePackageJson.updated != null ? servicePackageJson.updated : '');
			} else {
				me.servicePackageForm.find('#servicePackageNameField').html('');
				me.servicePackageForm.find('#servicePackageShortDescriptionField').html('');
				me.servicePackageForm.find('#servicePackageStateField').html('');
				me.servicePackageForm.find('#servicePackageModifyDateField').html('');
			}
		},
		
		_fillListWithServicePackages: function(servicePackagesJson, servicePackagesDropDown) {
			me = this;
			servicePackagesDropDown.empty();
			var emptyOption1 = jQuery('<option></option>');
			emptyOption1.attr('value', 0);
			emptyOption1.append("[SELECT A SERVICE PACKAGE]");
			servicePackagesDropDown.append(emptyOption1);
			
			for (var i=0; i<servicePackagesJson.length; i++) {
				if (servicePackagesJson[i].mainType === 'package') {
					var option = jQuery('<option></option>');
					option.attr('value', servicePackagesJson[i].id);
					option.append(servicePackagesJson[i].name);
					servicePackagesDropDown.append(option);
				}
			}
		},
		
		_getServicePackages: function(successCb, servicePackagesDropDown) {
			var me = this;
			var url = me.instance.getSandbox().getAjaxUrl() + 'action_route=GetPermittedGroupings';
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
						me.servicePackagesJson = pResp.groupings;
                        successCb(pResp.groupings, servicePackagesDropDown);
                    }
                },
                error: function (jqXHR, textStatus) {
                    //alert('Error occurred while geting data!');
                },
                cache: false
            });
		},
		
		_sendServicePackageSelectedEvent: function (servicePackageJson) {
			var sandbox = this.instance.getSandbox();
			
			var themes = [];
			var servicePackageId = 0;
			
			if (servicePackageJson && servicePackageJson.themes && servicePackageJson.themes.length > 0) {
				//var themes = JSON.parse(servicePackageJson.themes);
				themes = servicePackageJson.themes;
				servicePackageId = servicePackageJson.id;
			}
			
			var eventBuilder = sandbox.getEventBuilder('liiteri-servicepackages.ServicePackageSelectedEvent');
			var event = eventBuilder(themes, servicePackageId);
			
			sandbox.notifyAll(event);
		},
		
		refreshServicePackagesList: function() {
			this._getServicePackages(this._fillListWithServicePackages, this.servicePackagesDropDown);
		},
		
		setServicePackage: function (id) {
			var me = this;
			$("#servicePackagesSelect").val(id);
			
			if ($('#servicePackagesSelect').val() == 0) {
				me._fillFieldsWithServicePackage();
				me._sendServicePackageSelectedEvent();
			} else {
				for (var i=0; i<me.servicePackagesJson.length; i++) {
					if (me.servicePackagesJson[i].id == $('#servicePackagesSelect').val()) {
						var servicePackageJson = me.servicePackagesJson[i];
						me._fillFieldsWithServicePackage(servicePackageJson);
						me._sendServicePackageSelectedEvent(servicePackageJson);
						break;
					}
				}
			}
		}
		
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
