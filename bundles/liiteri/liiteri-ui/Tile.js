/**
 * @class Oskari.liiteri.bundle.liiteri-groupings.Tile
 * Renders the "liiteri-groupings" tile.
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.Tile',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundleInstance} instance
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
            return 'Oskari.liiteri.bundle.liiteri-ui.Tile';
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
            return this.instance.getLocalization('tile').title;
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
				var extension = sandbox.findRegisteredModuleInstance('StatsGrid');
				if (extension != null && extension != undefined) {
					//FIXME check if StatsGrid is open
					sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'close']);
				}
			});
			
			cel.append(tileButton);		
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Tile']
    });
