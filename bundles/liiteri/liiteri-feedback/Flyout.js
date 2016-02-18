/**
 * @class Oskari.liiteri.bundle.liiteri-feedback.Flyout
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-feedback.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-feedback.LiiteriFeedbackBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
		this.container = null;
        this.state = null;
		this.loc = this.instance.getLocalization("flyout");
		this.dataTable = null;
		this.content = null;
		
		this.datatableLocaleLocation = Oskari.getSandbox().getService('Oskari.liiteri.bundle.liiteri-ui.service.UIConfigurationService').getDataTablesLocaleLocation();
		this.templates = {
			'container': '<div class="feedback"></div>',
			'form': '<form id="feedback-form" method="POST">' + 
				'<div id="feedback-response"></div>' +
				'<h1>' + this.loc.topic + '</h1>' +
				'<div class="editor-label">' + this.loc.description + '</div>' +
				'<div class="editor-label">' + this.loc.form.topic + ' *</div>' +
				'<div><input type="text" name="feedback_topic" /></div>' +
				'<div class="editor-label">' + this.loc.form.message + ' *</div>' +
				'<div><textarea name="feedback_message" rows=8 cols=40 maxlength=2500></textarea></div>' +
				'<h2>' + this.loc.form.contact + '</h2>' +
				'<div class="editor-label">' + this.loc.form.first_name + '</div>' +
				'<div><input type="text" name="feedback_first_name" /></div>' + 
				'<div class="editor-label">' + this.loc.form.last_name + '</div>' +
				'<div><input type="text" name="feedback_last_name" /></div>' +
				'<div class="editor-label">' + this.loc.form.phone + '</div>' +
				'<div><input type="text" name="feedback_phone" /></div>' +
				'<div class="editor-label">' + this.loc.form.email + '</div>' +
				'<div><input type="text" name="feedback_email" /></div>' +
				'<div class="editor-label"><input type="submit" name="submit" value="' + this.loc.form.submit + '" /></div>' +
				'<input type="hidden" name="feedback_browser_version" value="' + navigator.userAgent + '" />' +
				'</form>'
		}
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-feedback.Flyout';
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
            if (!jQuery(this.container).hasClass('liiteri-feedback')) {
                jQuery(this.container).addClass('liiteri-feedback');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this;
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
            var cel = jQuery(this.container);
            cel.empty();
            var content = jQuery(me.templates.container);
            var form = $(me.templates.form);

			this.content = content;
			cel.append(content);
			content.append(form);
			var tableElement = jQuery(me.templates.table);

			$("#feedback-form").on("submit", function (event) {
			    me._sendFeedback(event, me);
			});	
        },
        _sendFeedback: function (event, obj)
		{
			var parentObject = obj;
			if (event.preventDefault)
			{
			    event.preventDefault();
			}
			else
			{
				event.returnValue = false;
			}
			
			if (parentObject._validateForm())
			{
				var url = this.instance.sandbox.getAjaxUrl() + 'action_route=SendFeedback';
	            jQuery.ajax({
	                type: 'POST',
	                url: url,
	                data: $("#feedback-form").serialize(),
	                beforeSend: function (x) {
						if (x && x.overrideMimeType) {
							x.overrideMimeType("text/html;charset=UTF-8");
						}
					},
	                success: function(data) {
	                	parentObject._showResponse(parentObject.loc.response);
	                	parentObject._clearFormFields();
					}
	            });
			}
			else
			{
				parentObject._showValidationError(parentObject.loc.validation);
			}
		},
		_clearFormFields: function()
		{
			$("#feedback-form input[type!=submit], #feedback-form textarea").each(function(){
				$(this).val("");
			});
		},
		_validateForm: function()
		{
			var result = true;
			if ($("#feedback-form input[name=feedback_topic]").val() == "" || $("#feedback-form textarea[name=feedback_message]").val() == "")
			{
				result = false;
			}
			return result;
		},
		_showValidationError: function(text)
		{
			$("#feedback-response").css("display", "none").removeClass().addClass('error').text(text).show("medium");	
		},
		_showResponse: function(text)
		{
			$("#feedback-response").css("display", "none").removeClass().addClass('correct').text(text).show("medium");
		}
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
