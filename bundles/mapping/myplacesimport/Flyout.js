/**
 * @class Oskari.mapframework.bundle.myplacesimport.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance} instance
     *      reference to component that created the flyout
     */

    function (instance, locale) {
        this.instance = instance;
        this.locale = locale;
        this.container = undefined;
        this.template = undefined;
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    }, {
        __name: 'Oskari.mapframework.bundle.myplacesimport.Flyout',
        __templates: {
            iframe: '<iframe src="JavaScript:\"\"" id="myplacesimport-target" name="myplacesimport-target" height="0" width="0" frameborder="0" scrolling="no"></iframe>',
            base: '<div class="content">' +
                    '<div class="info"></div>' +
                    '<div class="state"></div>' +
                '</div>',
            help: '<div class="help icon-info"></div>',
            file: '<div class="file-import">' +
                    '<form id="myplacesimport-form" method="post" enctype="multipart/form-data" target="myplacesimport-target">' +
                        '<input type="file" name="file-import"></input>' +
                        '<div class="name"><label>Name</label><input type="text" name="layer-name" /></div>' +
                        '<div class="desc"><label>Description</label><input type="text" name="layer-desc" /></div>' +
                        '<div class="source"><label>Data source</label><input type="text" name="layer-source" /></div>' +
                        '<div class="style">' +
                            '<label>Layer style</label>' +
                            '<div class="style-form"></div>' +
                            '<input type="hidden" name="layer-style" />' +
                        '</div>' +
                        '<input type="submit" value="Submit" class="primary" />' +
                    '</form>' +
                '</div>'
        },
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setTemplate
         * @param {jQuery} template
         */
        setTemplate: function(template) {
            if (this.template && template) {
                this.template.replaceWith(template);
            }
            this.template = template;
        },
        /**
         * @method getTemplate
         * @return {jQuery}
         */
        getTemplate: function() {
            return this.template;
        },
        /**
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         *
         * @method startPlugin
         */
        startPlugin: function () {
            var container = this.getEl(),
                iframe = jQuery(this.__templates.iframe).clone(),
                tooltipCont = jQuery(this.__templates.help).clone();
            container.addClass('myplacesimport');
            container.append(iframe);
            tooltipCont.attr('title', this.locale.help);
            container.append(tooltipCont);

            this.setTemplate(this.createUi());
            container.append(this.getTemplate());
            /* progress */
            this.progressSpinner.insertTo(container);
        },
        /**
         * Interface method implementation
         *
         * @method stopPlugin
         */
        stopPlugin: function () {
            if (this.template) this.template.empty();
            this.setTemplate(undefined);
            if (this.container) this.container.empty();
            this.container = undefined;
        },
        /**
         * Creates a new UI from scratch
         *
         * @method refresh
         */
        refresh: function() {
            this.container
                .find('iframe')
                .replaceWith(jQuery(this.__templates.iframe).clone());

            this.setTemplate(this.createUi());
        },
        /**
         * Creates the UI for a fresh start.
         *
         * @method createUi
         * @return {jQuery} returns the template to place on the DOM
         */
        createUi: function () {
            var locale = this.getLocalization(),
                template = jQuery(this.__templates.base).clone();

            template.find('div.info')
                .html(locale.description);
            template.find('div.state')
                .html(this.__createFileImportTemplate(locale));

            return template;
        },
        /**
        * Checks the file upload form file size
        * @private
        */
        __checkFileSize: function(locale){
            var me = this,
                maxFileSizeMb = me.instance.conf.maxFileSizeMb,
                fileSize = null,
                fileInput = me.container.find('input[name=file-import]');

            // Checks modern browsers (FF, Safari, Opera, Chore and IE 10 >)
            if(fileInput[0]  && fileInput[0].files) {
                fileSize = fileInput[0].files[0].size //size in kb
                fileSize = fileSize / 1048576; //size in mb
            }

            // Check IE 9
            if(fileSize===null && navigator.userAgent.match(/msie/i)) {
                try{
                    var hasAX = "ActiveXObject" in window;
                    if(hasAX){
                        var objFSO = new ActiveXObject("Scripting.FileSystemObject");
                        var filePath = $("#" + fileid)[0].value;
                        var objFile = objFSO.getFile(filePath);
                        var fileSize = objFile.size; //size in kb
                        fileSize = fileSize / 1048576; //size in mb
                    }
                } catch(e){
                    // ActiveX not supported, please check at it's enabled
                    // If ActiveX not enabled, check file size on backend code.
                }
            }

            if(fileSize!==null && fileSize>maxFileSizeMb) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    btn = dialog.createCloseButton(locale.file.fileOverSizeError.close);
                dialog.show(locale.file.fileOverSizeError.title, locale.file.fileOverSizeError.message.replace(/<xx>/g, maxFileSizeMb), [btn]);
                dialog.makeModal();
                dialog.onClose(function() {
                    me.container.find('form input[type=submit]').prop('disabled', true);
                });
            } else {
                me.container.find('form input[type=submit]').prop('disabled', false);
            }


        },
        /**
         * Creates the template for file upload form
         *
         * @method __createFileImportTemplate
         * @private
         * @param  {Object} locale
         * @return {jQuery}
         */
        __createFileImportTemplate: function(locale) {
            var me = this,
                file = jQuery(this.__templates.file).clone(),
                action = this.instance.getService().getFileImportUrl(),
                styleForm = Oskari.clazz.create(
                    'Oskari.userinterface.component.VisualizationForm'
                );

            file.find('div.name label').html(locale.layer.name);
            file.find('div.desc label').html(locale.layer.desc);
            file.find('div.source label').html(locale.layer.source);
            file.find('div.style label').html(locale.layer.style);
            file.find('div.style-form').html(styleForm.getForm());
            file.find('input[name=file-import]').bind('change', function(e){
                me.__checkFileSize(locale);
            });

            file.find('form')
                .attr('action', action)
                .find('input[type=submit]')
                    .val(locale.file.submit)
                    .on('click', function(e) {
                        var form = jQuery(this).parent(),
                            styleJson = JSON.stringify(me.__getStyleValues(styleForm));
                        // Set the value of the hidden style field
                        form.find('input[name=layer-style]').val(styleJson);
                        // Prevent from sending if there were missing fields
                        if (me.__validateForm(form, locale)) {
                            e.preventDefault();
                        } else {
                            me.progressSpinner.start();
                            var executed = 0;
                            me.container.find('iframe').on('load', function() {
                                if (executed > 0) {
                                    return;
                                }
                                executed++;
                                me.progressSpinner.stop();
                                me.__finish(jQuery(this), locale);
                            });
                        }
                    });

            return file;
        },
        /**
         * Returns the visualization form's values.
         *
         * @method __getStyleValues
         * @private
         * @param  {Oskari.userinterface.component.VisualizationForm} styleForm
         * @return {Object}
         */
        __getStyleValues: function(styleForm) {
            var formValues = styleForm.getValues(),
                values = {};

            if (formValues) {
                values.dot = {
                    size: formValues.dot.size,
                    color: '#' + formValues.dot.color,
                    shape: formValues.dot.shape
                };
                values.line = {
                    size: formValues.line.width,
                    color: '#' + formValues.line.color,
                    cap: formValues.line.cap,
                    corner: formValues.line.corner,
                    style: formValues.line.style
                };
                values.area = {
                    size: formValues.area.lineWidth,
                    lineColor: '#' + formValues.area.lineColor,
                    fillColor: '#' + formValues.area.fillColor,
                    lineStyle: formValues.area.lineStyle,
                    fillStyle: formValues.area.fillStyle,
                    lineCorner: formValues.area.lineCorner
                };
            }

            return values;
        },
        /**
         * Validates the form inputs (currently that the name and file are present).
         * Returns true if there were any errors (missing values).
         *
         * @method __validateForm
         * @private
         * @param  {jQuery} form
         * @param  {Object} locale
         * @return {Boolean}
         */
        __validateForm: function(form, locale) {
            var fileInput = form.find('input[type=file]'),
                nameInput = form.find('input[name=layer-name]'),
                errors = false,
                errorTitle, errorMsg;

            if (!fileInput.val() || !nameInput.val()) {
                errors = true;
                errorTitle = locale.validations.error.title;
                errorMsg = locale.validations.error.message;
                this.__showMessage(errorTitle, errorMsg);
            }

            return errors;
        },
        /**
         * Sends the layer data to the backend and shows a message.
         * Also refreshes the UI
         *
         * @method __finish
         * @private
         * @param {jQuery} iframe
         * @param {Object} locale
         */
        __finish: function(iframe, locale) {
            var title = locale.finish.success.title,
                msg = locale.finish.success.message,
                json,
                success = true;

            try {
                json = JSON.parse(iframe.contents().find('pre').html());

                if (this.__jsonError(json)) {
                    success = false;
                }
            } catch(error) {
                this.instance
                    .getSandbox()
                    .printWarn('Error whilst parsing user layer json', error);
                success = false;
            }

            if (success === true) {
                this.instance.addUserLayer(json);
            } else {
                title = null;
                msg = locale.finish.failure.title;
            }

            this.__showMessage(title, msg);
            this.refresh();
        },
        /**
         * Displays a message on the screen
         *
         * @method __showMessage
         * @private
         * @param  {String} title
         * @param  {String} message
         */
        __showMessage: function (title, message) {
            var me = this,
                loc = this._locale,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            dialog.show(title, message);
            dialog.fadeout(5000);
        },
        /**
         * Checks if json is null or undefined or if it has a key `error`.
         *
         * @method __jsonError
         * @private
         * @param  {JSON} json
         * @return {Boolean}
         */
        __jsonError: function(json) {
            var error = false;

            if (json === null || json === undefined) error = true;
            else if (json.error) error = true;

            return error;
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });