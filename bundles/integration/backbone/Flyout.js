/**
 * @class Oskari.integration.bundle.backbone.Flyout
 *
 *
 *
 * PoC Flyout to show map share timeline kind of information
 *
 */
Oskari.clazz.define('Oskari.integration.bundle.backbone.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, locale, ui) {

    this.instance = instance;

    /* @property locale locale for this */
    this.locale = locale;

    /* @property container the DIV element */
    this.container = null;
    this.ui = ui;

}, {
    getName : function() {
        return 'Oskari.integration.bundle.backbone.Flyout';
    },
    setEl : function(el) {
        this.container = jQuery(el);
    },
    getEl : function() {
        return this.container;
    },
    startPlugin : function() {
        var me = this;
        var ui = me.ui;
        ui.setEl(me.container);

        ui.render();
    },
    stopPlugin : function() {
        this.container.empty();
    },
    getTitle : function() {
        return this.locale.title;
    },
    getDescription : function() {
        return this.locale.description;
    },
    setState : function(state) {
        this.state = state;
    },
    getState : function() {
        return this.state;
    },
    render : function() {
        this.ui.render();
    }
}, {
    'protocol' : ['Oskari.userinterface.Flyout']
});
