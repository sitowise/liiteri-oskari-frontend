/**
 * @class Oskari.statistics.bundle.statsgrid.GridModeView
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-ui.View',
    /**
     * @static constructor function
     */

    function (instance) {
        var me = this;
        this.instance = instance;
        this.loc = this.instance.getLocalization("view");
        this.templates = {
            'downloadImageLink': function (imgsrc) { return jQuery('<a class="downloadLink" href="' + imgsrc + '" download="' + me.loc.downloadFileName + '">' + me.loc.download + '</a>'); }
        };
    }, {
        /**
         * @method getName
         * @return {String} implementation name
         */
        getName: function () {
            return 'Oskari.liiteri.bundle.liiteri-ui.View';
        },
        renderChart: function (data) {
            var me = this;

            var baseContainer = jQuery('<div></div>');
            var container = jQuery('<div style="height:450px;width:600px; overflow: auto"></div>');
            var chartContainer = me._createChartContainer(data);
            container.append(chartContainer);

            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var buttons = [];
            var closeButton = dialog.createCloseButton(me.loc.closeDialog);
            var printButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            printButton.setTitle(me.loc.saveAsPng);
            printButton.setEnabled(false);
            printButton.setHandler(
                function () {
                    printButton.setEnabled(false);
                    baseContainer.find(".downloadLink").remove();
                    setTimeout(function() {                                                
                        var imgdata = chartContainer.jqplotToImageStr({});
                        var alink = me.templates.downloadImageLink(imgdata);
                        baseContainer.append(alink);
                        printButton.setEnabled(true);
                    }, 50);
                }
            );
            buttons.push(printButton);
            buttons.push(closeButton);

            baseContainer.append(container);

            dialog.show(me.loc.title, baseContainer, buttons);
            dialog.makeDraggable();

            dialog.getJqueryContent().loadingOverlay({ iconClass: 'liiteri-logo-icon' });

            setTimeout(function() {
                me._displayChart(chartContainer, data);
                dialog.getJqueryContent().loadingOverlay('remove');
                printButton.setEnabled(true);
            }, 50);
        },
        _createChartContainer: function (data) {
            var numberOfElements = data.categories.length * data.serieVariants.length;
            var minSize = 550;
            var width = 32 * numberOfElements;
            if (width < minSize)
                width = minSize;

            var date = new Date();
            var timestamp = date.getTime();
            var elementId = 'chart-container' + timestamp;
            return jQuery('<div id="' + elementId + '" style="height:400px;width:' + width + 'px; "></div>');
        },
        _displayChart: function (element, data) {
            var elementId = element.attr('id');
            var options = {
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: { fillToZero: true },
                    pointLabels: { show: true, location: 'n', edgeTolerance: -10 },
                },
                series: [],
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: data.categories,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            angle: -30,
                            fontSize: '10pt',
                            showMark: false,
                            showGridline: false
                        }
                    },
                    yaxis: {
                        pad: 1.05
                        //tickOptions: { formatString: '%d.d' }
                    }
                },
                legend: {
                    show: true,
                    location: 'n',
                    placement: 'outsideGrid'
                }
            };
            _.each(data.serieVariants, function (item) {
                options.series.push({ label: item });
            });
            $.jqplot(elementId, data.series, options);
        },
        startPlugin: function () {
        },

        stopPlugin: function () {
        },
    }, {
        "protocol": ["Oskari.userinterface.View"],
        "extend": ["Oskari.userinterface.extension.DefaultView"]
    });
