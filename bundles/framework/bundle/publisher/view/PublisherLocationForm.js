/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLocationForm
 *
 * Represents the basic info (name, domain, language) view for the publisher
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLocationForm',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher.view.BasicPublisher} publisher
     *       publisher reference for language change
     */

    function (localization, publisher) {
        this.loc = localization;
        this._publisher = publisher;
        this.fields = {
            'domain': {
                "label": localization.domain.label,
                "placeholder": localization.domain.placeholder,
                "helptags": 'portti,help,publisher,domain',
                "tooltip": localization.domain.tooltip
            },
            'name': {
                "label": localization.name.label,
                "placeholder": localization.name.placeholder,
                "helptags": 'portti,help,publisher,name',
                "tooltip": localization.name.tooltip
            }
        };
        this.langField = {
            template: jQuery('<div class="field" style="display: none;">' +
                '<div class="help icon-info" title="' + localization.language.tooltip + '" helptags="portti,help,publisher,language"></div>' +
                '<label for="language">' + localization.language.label + '</label><br clear="all" />' +
                '<select name="language"></select>' +
                '</div>'),
            optionTemplate: jQuery('<option></option>')
        };
    }, {
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         */
        init: function (pData) {
            var me = this,
                fkey,
                data,
                field;
            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    field = Oskari.clazz.create('Oskari.userinterface.component.FormInput', fkey);
                    field.getField().find('input').before('<br />');
                    field.setLabel(data.label);
                    field.setTooltip(data.tooltip, data.helptags);
                    field.setPlaceholder(data.placeholder);
                    data.field = field;
                }
            }

            this.fields.domain.field.setRequired(true, this.loc.error.domain);
            this.fields.domain.field.setContentCheck(true, this.loc.error.domainIllegalCharacters);

            this.fields.domain.field.setValidator(function (inputField) {
                var value = inputField.getValue(),
                    name = inputField.getName(),
                    errors = [];
                if (value.indexOf('http') === 0 || value.indexOf('www') === 0) {
                    errors.push({
                        "field": name,
                        "error": me.loc.error.domainStart
                    });
                    return errors;
                }
                return errors;
            });
            this.fields.name.field.setRequired(true, this.loc.error.name);
            this.fields.name.field.setContentCheck(true, this.loc.error.nameIllegalCharacters);

            if (pData) {
                // set initial values
                this.fields.domain.field.setValue(pData.domain);
                this.fields.name.field.setValue(pData.name);
            }

            // language options are rendered based on localization
            var langField = this.langField.template.clone(),
                languageSelection = langField.find('select[name=language]'),
                langOpts = this.loc.language.options,
                selectedLang = Oskari.getLang(),
                opt,
                option;
            if (pData && pData.lang) {
                // if we get data as param -> use lang from it, otherwise use Oskari.getLang()
                selectedLang = pData.lang;
            }
            for (opt in langOpts) {
                if (langOpts.hasOwnProperty(opt)) {
                    option = this.langField.optionTemplate.clone();
                    option.attr('value', opt);
                    if (selectedLang === opt) {
                        option.attr('selected', 'selected');
                    }
                    option.append(langOpts[opt]);
                    languageSelection.append(option);
                }
            }
            // plugins should change language when user changes selection
            languageSelection.change(function () {
                me._publisher.setPluginLanguage(jQuery(this).attr('value'));
            });
            this.langField.field = langField;
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.domain.title);
            var contentPanel = panel.getContainer(),
                fkey,
                data;
            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    contentPanel.append(data.field.getField());
                }
            }
            contentPanel.append(this.langField.field);
            return panel;
        },
        /**
         * Returns the selections the user has done with the form inputs.
         * {
         *     domain : <domain field value>,
         *     name : <name field value>,
         *     language : <language user selected>
         * }
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var values = {},
                fkey,
                data;
            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    values[fkey] = data.field.getValue();
                }
            }
            values.language = this.langField.field.find('select[name=language]').val();
            return values;
        },
        /**
         * Returns any errors found in validation or an empty
         * array if valid. Error object format is defined in Oskari.userinterface.component.FormInput
         * validate() function.
         *
         * @method validate
         * @return {Object[]}
         */
        validate: function () {
            var errors = [],
                fkey,
                data;
            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    errors = errors.concat(data.field.validate());
                }
            }
            return errors;
        }
    });