/**
 * @class Oskari.mapframework.bundle.parcel.view.StartPrintView
 * Starts parcel printing wizard
 *  This is an initial screen and is always shown at 1st time
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.view.StartPrintView',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
     *      reference to component that created this view
     * @param {Object} localization
     *      localization data in JSON format
     */

    function (instance, localization) {
        this.instance = instance;
        this.template = jQuery("<div class='startprintview'><div class='content'></div><div class='buttons'></div></div>");
        this.templateError = jQuery('<div class="error"><ul></ul></div>');
        this.templateInfo = jQuery("<div class='icon-info'></div>");
        this.checkboxTemplate = jQuery('<input type="checkbox" name="parcelprint_info_seen" id="parcelprint_info_seen" value="1">');
        this.labelTemplate = jQuery('<label for="parcelprint_info_seen"></label>');
        this.loc = localization;
        this.appendAlwaysCheckbox = true;
        this.content = undefined;
        this.buttons = {};
        this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this;
            var content = this.template.clone();
            this.content = content;
            /*content.find('div.content').before(txt);*/
            container.append(content);

            this.alert.insertTo(container);

            this.alert.setContent(this.loc.text, 'default', true);

            var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            continueButton.addClass('primary');
            continueButton.setTitle(this.loc.buttons['continue']);
            continueButton.setHandler(function () {
                me.instance.setParcelPrintMode(true);
            });
            this.buttons['continue'] = continueButton;
            continueButton.insertTo(content.find('div.buttons'));
            if (me.appendAlwaysCheckbox) {
                content.append('<br><br>');
                var checkbox = this.checkboxTemplate.clone();

                var label = this.labelTemplate.clone();
                label.append(me.loc.infoseen.label);
                checkbox.bind(
                    'change',
                    function () {
                        if (jQuery(this).attr('checked')) {
                            // Set cookie not to show parcelprint info again
                            jQuery.cookie(
                                "parcelprint_info_seen",
                                "1",
                                {
                                    expires: 365
                                }
                            );
                        } else {
                            // Revert to show guided tour on startup
                            jQuery.cookie(
                                "parcelprint_info_seen",
                                "0",
                                {
                                    expires: 1
                                }
                            );
                        }
                    }
                );
                content.append(checkbox);
                content.append('&nbsp;');
                content.append(label);
            }

            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

            cancelButton.setTitle(this.loc.buttons.cancel);
            cancelButton.setHandler(function () {
                me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
            });
            this.buttons.cancel = cancelButton;

            cancelButton.insertTo(content.find('div.buttons'));

        }
    });