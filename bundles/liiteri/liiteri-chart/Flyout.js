/**
 * @class Oskari.liiteri.bundle.liiteri-groupings.Flyout
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-chart.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.liiteri.bundle.liiteri-groupings.LiiteriGroupingsBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
		this.container = null;
        this.state = null;
        this.loc = this.instance.getLocalization("flyout");
        this._chartElementId = 'chartdiv';
		this.templates = {
		}
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-chart.Flyout';
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
            if (!jQuery(this.container).hasClass('liiteri-chart')) {
                jQuery(this.container).addClass('liiteri-chart');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this;
            //this.template = jQuery('<div></div>');
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
            return this.instance.getLocalization('flyout').desc;
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
        renderChart: function (data) {            
            var me = this;
            var options = {
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: { fillToZero: true },
                    pointLabels: { show: true, location: 'n', edgeTolerance: -15 },
                },
                series: [],
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: data.categories
                    },
                    // Pad the y axis just a little so bars can get close to, but
                    // not touch, the grid boundaries.  1.2 is the default padding.
                    yaxis: {
                        pad: 1.05
                        //tickOptions: { formatString: '%d.d' }
                    }
                },
                legend: {
                    show: true,
                    location: 'e',
                    placement: 'outsideGrid'
                }
            };
            _.each(data.serieVariants, function(item) {
                options.series.push({ label: item });
            });            

            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var buttons = [];
            var closeButton = dialog.createCloseButton(me.loc.closeDialog);
            var printButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            printButton.setTitle(me.loc.saveAsPng);
            printButton.setHandler(
                function () {
                    alert('BAZINGA!');
                }
            );
            buttons.push(printButton);
            buttons.push(closeButton);

            var container = jQuery('<div></div>');

            dialog.show(me.loc.title, container, buttons);

            var chartContainer = jQuery('<div id="' + me._chartElementId + '" style="height:400px;width:400px; "></div>');
            container.append(chartContainer);

            $.jqplot(me._chartElementId, data.series, options);

            dialog.moveTo(jQuery('.oskari-flyoutcontentcontainer'), 'right');
        },
        /**
         * @method createUI
         * Creates the UI for a fresh start
         */
        createUI: function () {
            var me = this, sandbox = me.instance.getSandbox();

            // clear container
            var cel = jQuery(this.container);
            cel.empty();
//
//            var chartContainer = jQuery('<div id="' + me._chartElementId + '" style="height:400px;width:400px; "></div>');
//            cel.append(chartContainer);            
        },
    }, {
        'protocol': ['Oskari.userinterface.Flyout']
    });
