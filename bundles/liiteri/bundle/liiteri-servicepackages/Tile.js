/**
 * @class Oskari.liiteri.bundle.liiteri-servicepackages.Tile
 * Renders the "liiteri-servicepackages" tile.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-servicepackages.Tile',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-servicepackages.LiiteriServicePackagesInstance} instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
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
            return 'Oskari.liiteri.bundle.liiteri-servicepackages.Tile';
        },
        getSequenceNumber: function() {
            return 60;
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
            //this.container = jQuery(el);
			this.container = el[0];
//            if (!jQuery(this.container).hasClass('liiteri-servicepackages')) {
//                jQuery(this.container).addClass('liiteri-servicepackages');
//            }
        },
        /**
         * @method startPlugin
         * Interface method implementation, calls #refresh()
         */
        startPlugin: function () {
			this.template = jQuery('<div></div>');
			this.createUI();
        },
        /**
         * @method stopPlugin
         * Interface method implementation, clears the container
         */
        stopPlugin: function () {
            this.container.empty();
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the tile
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the tile
         */
        getDescription: function() {
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
        setState: function (state) { },
        refresh: function () { },
        createUI: function() {
        },		
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Tile']
    });
