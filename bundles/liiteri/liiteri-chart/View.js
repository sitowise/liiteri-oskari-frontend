/**
 * @class Oskari.statistics.bundle.statsgrid.GridModeView
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.liiteri.bundle.liiteri-chart.View',
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
            return 'Oskari.liiteri.bundle.liiteri-chart.View';
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
                        var ua = window.navigator.userAgent;
                        
                        if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0) {
                            var parts = imgdata.split(";");
                            if(parts.length == 2) {
                                alink.click(function() {
                                    var byteCharacters = atob(parts[1].substr(7));
                                    var byteNumbers = new Array(byteCharacters.length);
                                    for (var i = 0; i < byteCharacters.length; i++) {
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    }
                                    var byteArray = new Uint8Array(byteNumbers);
                                    var blob = new Blob([byteArray],{
                                        type: 'image/png'
                                    });
    
                                    navigator.msSaveBlob(blob, me.loc.downloadFileName + '.png');
                                    
                                    return false;
                                });
                            }
                            alink.attr('href','');
                        }
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
            /* chrome doesn't render canvas greater than about 30000px */
            var maxSize = 30000;
            var width = 32 * numberOfElements;
            if (width < minSize)
                width = minSize;
            if (width > maxSize)
                width = maxSize;

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
                    rendererOptions: { fillToZero: true, smooth: false },
                    pointLabels: { show: true, location: 'n', edgeTolerance: -10 },
                    shadow: false
                },
                series: [],
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: data.categories,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            angle: 30,
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
