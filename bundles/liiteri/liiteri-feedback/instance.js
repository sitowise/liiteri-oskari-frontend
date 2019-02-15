/**
 * @class Oskari.liiteri.bundle.liiteri-feedback.LiiteriFeedbackBundleInstance
 *  
 * 
 */
Oskari.clazz.define(
    "Oskari.liiteri.bundle.liiteri-feedback.LiiteriFeedbackBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (locale) {
        this.sandbox = null;
        this._localization = locale;
        this.mediator = null;
        this.guideStep = 0;
		this.plugins = {};
    },
    {
        /**
         * @static
         * @property __name
         */
        __name: 'liiteri-feedback',

        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getTitle
         * Extension protocol method
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this._localization['title'];
        },

        /**
         * @method getDescription
         * Extension protocol method
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this._localization['desc'];
        },

        /**
         * @method getSandbox
         * Convenience method to call from Tile and Flyout
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {},

        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }

			var me = this,
				conf = me.conf, // Should this not come as a param?
				sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
				sandbox = Oskari.getSandbox(sandboxName);
			me.sandbox = sandbox;
			// register to sandbox as a module
			sandbox.register(me);			
			
			var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
			sandbox.request(this, request(this));
			
			this._createUI();
        },
		
		/**
		 * @method startExtension
		 * Extension protocol method
		 */
		startExtension: function () {
		    var me = this;
			//me.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-feedback.Tile', me);
			me.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-feedback.Flyout', me);
		},
		
		/**
		 * @method stopExtension
		 * implements Oskari.userinterface.Extension protocol stopExtension method
		 * Clears references to flyout and tile
		 */
		stopExtension: function () {
			this.plugins['Oskari.userinterface.Flyout'] = null;
			//this.plugins['Oskari.userinterface.Tile'] = null
		},
		
        _startGuide: function () {
            var me = this,
                pn = 'Oskari.userinterface.component.Popup',
                dialog = Oskari.clazz.create(pn);
            me.guideStep = 0;
            dialog.makeDraggable();
            dialog.addClass('guidedtour');
            me._showGuideContentForStep(me.guideStep, dialog);
        },

		_guideSteps: [],

        _showGuideContentForStep: function (stepIndex, dialog) {
            var step = this._guideSteps[stepIndex];
            step.setScope(this);
            var buttons = this._getDialogButton(dialog);
            var title = step.title;
            var content = step.content.clone();
            if (step.appendTourSeenCheckbox) {
                content.append('<br><br>');
                var checkboxTemplate =
                    jQuery('<input type="checkbox" ' + 'name="pti_tour_seen" ' + 'id="pti_tour_seen" ' + 'value="1">');
                var checkbox = checkboxTemplate.clone();
                var labelTemplate =
                    jQuery('<label for="pti_tour_seen"></label>');
                var label = labelTemplate.clone();
                label.append(this._localization['tourseen'].label);
                checkbox.bind(
                    'change',
                    function () {
                        if (jQuery(this).prop('checked')) {
                            // Set cookie not to show guided tour again
                            jQuery.cookie(
								"liiteri-announcements-id_" + step.announcementId, "1", {
                                    expires: 365
                                }
                            );
                        } else {
                            // Revert to show guided tour on startup
                            jQuery.cookie(
								"liiteri-announcements-id_" + step.announcementId, "0", {
									expires: 1
                                }
                            );
                        }
                    });
                content.append(checkbox);
                content.append('&nbsp;');
                content.append(label);
            }
            dialog.show(title, content, buttons);
            if (step.getPositionRef) {
                dialog.moveTo(step.getPositionRef(), step.positionAlign);
            } else {
                dialog.resetPosition();
            }
        },
        _getFakeExtension: function (name) {
            return {
                getName: function () {
                    return name;
                }
            };
        },
        _openExtension: function (name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [extension, 'attach']);
        },
        _closeExtension: function (name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [extension, 'close']);
        },
        _getDialogButton: function (dialog) {
            var me = this,
                buttons = [],
                bn,
                closeTxt = me._localization['button']['close'];
            var closeBtn = dialog.createCloseButton(closeTxt);
            buttons.push(closeBtn);

			if (this.guideStep > 0) {
                bn = 'Oskari.userinterface.component.Button';
                var prevBtn = Oskari.clazz.create(bn);
                var prevTxt = me._localization['button']['previous'];
                prevBtn.setTitle(prevTxt);
                prevBtn.setHandler(
                    function () {
                        me.guideStep--;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(prevBtn);
            }

			if (this.guideStep < this._guideSteps.length - 1) {
                bn = 'Oskari.userinterface.component.Button';
                var nextBtn = Oskari.clazz.create(bn);
                var nextTxt = me._localization['button']['next'];
                nextBtn.setTitle(nextTxt);
                nextBtn.setHandler(
                    function () {
                        me.guideStep++;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(nextBtn);
                // custom class for positioned popups
                dialog.addClass('bluetitle');
            } 
            return buttons;
        },
        /**
         * @method init
         * Module protocol method
         */
        init: function () {
            // headless module so nothing to return
            return null;
        },

        /**
         * @method onEvent
         * Module protocol method/Event dispatch
         */
        onEvent: function (event) {
            var me = this;
            var handler = me.eventHandlers[event.getName()];
            if (!handler) {
                var ret = handler.apply(this, [event]);
                if (ret) {
                    return ret;
                }
            }
            return null;
        },

        /**
         * @static
         * @property eventHandlers
         * Best practices: defining which
         * events bundle is listening and how bundle reacts to them
         */
        eventHandlers: {
            // not listening to any events
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            var me = this;
            var sandbox = me.sandbox();
            // unregister module from sandbox
            me.sandbox.unregister(me);
        },
		
		_createUI: function () {
			var me = this;
			for (var pluginType in me.plugins) {
				if (pluginType) {
					me.plugins[pluginType].createUI();
				}
			}

			var feedbackLink = jQuery('<span>' + me._localization.title + '</span>');
			feedbackLink.click(function () {
			    var extension = {
			        getName: function () {
			            return me.__name;
			        }
			    };
		        me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
		    });
			var manualLink = jQuery('<span><a href="' + me._localization.manual.link + '" target="_blank">' + me._localization.manual.text + '</a></span>');
			var privacyLink = jQuery('<span><a href="' + me._localization.privacy.link + '" target="_blank">' + me._localization.privacy.text + '</a></span>');
			var areaLink = jQuery('<span><a href="' + me._localization.area.link + '" target="_blank">' + me._localization.area.text + '</a></span>');
			var linkContainer = jQuery('<div class="footerLinkContainer"></div>');
			linkContainer.append(feedbackLink);
		    linkContainer.append(manualLink);
		    linkContainer.append(privacyLink);
		    linkContainer.append(areaLink);
		    $('#footer-nav').append(linkContainer);
		},
		
		_getAnnouncements: function () {
		var me = this;
		var url = me.getSandbox().getAjaxUrl() + 'action_route=GetAnnouncements';
		
		jQuery.ajax({
			type: 'GET',
			dataType: 'json',
			url: url,
			beforeSend: function (x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success: function (data) {
				var dataArray = data.announcements;				
				me._guideSteps = [];
				
				for (var i=0; i < dataArray.length; i++) {
					if (jQuery.cookie('liiteri-announcements-id_' + dataArray[i].id) != '1') {
						me._guideSteps.push({
							appendTourSeenCheckbox: true,

							setScope: function (inst) {
								this.ref = inst;
							},
							title: dataArray[i].title,
							content: jQuery('<div></div>').append(dataArray[i].message),
							announcementId: dataArray[i].id
						});
					}
				}
				
				me._startGuide();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (jqXHR.responseText && JSON.parse(jqXHR.responseText)) {
					var errorMessage = JSON.parse(jqXHR.responseText)['error'];
					alert(errorMessage);
				} else {
					alert('Error occurred while loading annnouncements!'); 
				}
			}
		});
	},
    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ],
		"extend" : ["Oskari.userinterface.extension.DefaultExtension"]
    }
);