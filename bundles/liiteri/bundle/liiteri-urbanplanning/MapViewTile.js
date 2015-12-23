/**
 * @class Oskari.liiteri.bundle.liiteri-urbanplanning.MapViewTile
 * Renders the "liiteri-urbanplanning" tile.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-urbanplanning.MapViewTile',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-urbanplanning.TileLiiteriUrbanPlanningInstance} instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.template = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-urbanplanning.MapViewTile';
        },
        getSequenceNumber: function () {
            return 50;
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
			this.container = jQuery(el);
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
            if (this.container && this.container.empty) {
                this.container.empty();
            }
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the tile
         */
        getTitle: function () {
            return this.instance.getLocalization().tile.title;
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the tile
         */
        getDescription: function () {},
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
        setState: function (state) {},
        /**
         * @method _createUI
         * Creates the UI for a fresh start
         */
        createUI: function () {
        	var me = this,
            sandbox = me.instance.getSandbox();

	        // clear container
	        var cel = jQuery(this.container);
	        cel.empty();
			
			var tileButton = jQuery('<div class="oskari-tile-title">' + me.getTitle() + '</div>');
			tileButton.click(function() {
				window.location = me.instance.conf.location;
			});
			
			cel.append(tileButton);
			cel.append($('<div class="oskari-tile-status"></div>'));
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Tile']
    });
