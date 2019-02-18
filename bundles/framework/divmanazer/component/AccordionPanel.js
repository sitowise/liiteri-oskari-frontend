/**
 * @class Oskari.userinterface.component.AccordionPanel
 *
 * Panel that can be added to Oskari.userinterface.component.Accordion.
 */
Oskari.clazz.define('Oskari.userinterface.component.AccordionPanel',

    /**
     * @method create called automatically on construction
     * TODO: close/open methods?
     * @static
     */
    function () {
        this.template = jQuery('<div class="accordion_panel">' +
            '<div class="header">' +
            '<div class="headerIcon icon-arrow-right"></div>' +
            '<div class="headerText"></div>' +
            '<div class="headerButtonContainer"></div>' +
            '</div>' +
            '<div class="content"></div>' +
            '</div>');
        this.headerButtonTemplate = jQuery('<a href="#"></a>');
        this.title = null;
        this.content = null;
        this.html = this.template.clone();

        var me = this,
            header = me.html.find('div.header');

        header.click(function () {
            if (me.isOpen()) {
                me.close();
            } else {
                me.open();
            }
        });

        this.html.find('div.content').hide();
        Oskari.makeObservable(this);
    }, {
        addClass: function (pClass) {
            this.html.addClass(pClass);
        },
        /**
         * @method setVisible
         * Shows/hides the panel
         * @param {Boolean} bln - true to show, false to hide
         */
        setVisible: function (bln) {
            // checking since we dont assume param is boolean
            if (bln === true) {
                this.html.show();
            } else {
                this.html.hide();
            }
        },
        /**
         * @method isVisible
         * Returns true if panel is currently visible
         * @return {Boolean}
         */
        isVisible: function () {
            // checking since we dont assume param is boolean
            return this.html.is(':visible');
        },
        /**
         * @method isOpen
         * Returns true if panel is currently open
         * @return {Boolean}
         */
        isOpen: function () {
            return this.html.hasClass('open');
        },
        /**
         * @method open
         * Opens the panel programmatically
         */
        open: function () {            
            this.html.addClass('open');
            var header = this.html.find('div.header div.headerIcon');
            /* if there is more than one take first one, i.g. if there is accordionPanel in accordionPanel */
            if (header.length > 1) {
                header = header[0];
                header = $(header);
            }
            header.removeClass('icon-arrow-right');
            header.addClass('icon-arrow-down');
            this.html.children('div.content').show();

            var me = this;
            $(this).trigger("AccordionPanel.opened", [me]);
            this.trigger('open');
        },
        /**
         * @method close
         * Closes the panel programmatically
         */
        close: function () {
            this.html.removeClass('open');
            var header = this.html.find('div.header div.headerIcon');
            header.removeClass('icon-arrow-down');
            header.addClass('icon-arrow-right');
            this.html.children('div.content').hide();

            var me = this;
            $(this).trigger("AccordionPanel.closed", [me]);
            this.trigger('close');
        },
        /**
         * @method setTitle
         * Sets the panel title
         * @param {String} pTitle title for the panel
         */
        setTitle: function (pTitle) {
            this.title = pTitle;
            var header = this.html.find('div.header div.headerText');
            header.html(this.title);
        },
        /**
         * @method getTitle
         * Gets the panel title
         * @return {String}
         */
        getTitle: function () {
            return this.title;
        },
        addHeaderButton: function(config) {
            var container = this.html.find('div.header div.headerButtonContainer');
            var button = this.headerButtonTemplate.clone();
            if (config.cssClass)
                button.addClass(config.cssClass);
            if (config.text)
                button.text(config.text);
            if (config.handler) {
                button.click(function(event) {
                    config.handler(event);
                    event.stopPropagation();
                });
            }
            container.append(button);
        },
        /**
         * @method setId
         * Sets the panel header id
         * @param {String} id id for the panel
         */
        setId: function (id) {
            var header = this.html.find('div.header');
            header.attr('id', id);
        },
        /**
         * @method setContent
         * Sets the panel content.
         * This can be also done with #getContainer()
         * @param {jQuery} pContent reference to DOM element
         */
        setContent: function (pContent) {
            this.content = pContent;
            var content = this.html.find('div.content');
            content.append(this.content);
        },
        /**
         * @method destroy
         * Destroys the panel/removes it from document
         */
        destroy: function () {
            if( !this.html){
              return;
            }
            this.html.remove();
        },
        /**
         * @method getContainer
         * Returns this panels content container which can be populated.
         * This can be also done with #setContent().
         * @return {jQuery} reference to this panels content DOM element
         */
        getContainer: function () {
            return this.html.find('div.content');
        },
        /**
         * Returns the header of the panel.
         *
         * @method getHeader
         * @return {jQuery} refrence to this panels header DOM element
         */
        getHeader: function () {
            return this.html.find('div.header');
        },
        /**
         * @method insertTo
         * Adds this panel to given container.
         * Usually used by Oskari.userinterface.component.Accordion internally.
         * @param {jQuery} container reference to DOM element
         */
        insertTo: function (container) {
            container.append(this.html);
        }
    });