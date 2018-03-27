Oskari.clazz.define('Oskari.statistics.statsgrid.Diagram', function(service, locale) {
    this.loc = locale;
    this.sb = service.getSandbox();
    this.service = service;
    this.element = null;
    this._chartInstance = Oskari.clazz.create('Oskari.userinterface.component.Chart');
    this._chartElement = null;
    this._renderState = {
        inProgress: false,
        repaint: false
    };
    this.events();
}, {
    _template: {
        container: jQuery('<div></div>')
    },
    /**
     * @method  @public render Render datatable
     * @param  {Object} el jQuery element
     */
    render : function(el) {
        var me = this;
        if(this.element) {
            // already rendered, just move the element to new el when needed
            if(el !== this.element.parent()) {
                this.element.detach();
                el.append(this.element);
            }
            return;
        }
        this.element = this._template.container.clone();
        el.append(this.element);
        this.updateUI();
    },
    updateUI: function() {
        var me = this;
        var el = this.element;
        if (!el) {
            // ui not yet created so no need to update it
            return;
        }

        if (!this.hasIndicators()) {
            this.clearChart();
            el.html(this.loc.statsgrid.noResults);
            return;
        } else if (this._chartElement) {
            // reattach possibly detached component
            el.html(this._chartElement);
        }
        if(this._renderState.inProgress) {
            // handle render being called multiple times in quick succession
            // previous render needs to end before repaint since we are doing async stuff
            this._renderState.repaint = true;
            // need to call this._renderDone(); to trigger repaint after render done
            return;
        }
        this._renderState.inProgress = true;
        this.getIndicatorData(this.getIndicator(), function(data) {
            if(!data) {
                me._renderDone();
                return;
            }
            if (!me._chartElement) {
                me._chartElement = me.createBarCharts(data);
                el.html(me._chartElement);
            } else {
                me.getChartInstance().redraw(data, {
                    colors: me.getColorScale()
                });
            }
            me._renderDone();
        });
    },
    /****** PRIVATE METHODS ******/
    /**
     * Triggers a new render when needed (if render was called before previous was finished)
     */
    _renderDone : function() {
        var state = this._renderState;
        this._renderState = {};
        if(state.repaint) {
            this.updateUI();
        }
    },
    /**
     * @method createBarCharts
     * Creates the barchart component if chart is not initialized
     */
    createBarCharts: function(data) {
        var me = this;
        if (data === undefined || data.length === 0) {
            Oskari.log("statsgrid.DiagramVisualizer").debug("no indicator data");
            return null;
        }

        if (!this.getChartInstance().chartIsInitialized()) {
            var barchart = this.getChartInstance().createBarChart(data, {
                colors: me.getColorScale()
            });
            var el = jQuery(barchart);
            el.css({
                "width": "100%"
            });
            el.attr('id', 'graphic');
            return el;
        }
    },
    getChartInstance: function() {
        return this._chartInstance;
    },
    clearChart: function() {
        var chart = this.getChartInstance();
        if (chart) {
            chart.clear();
        }
    },
    getIndicator: function() {
        return this.service.getStateService().getActiveIndicator();
    },
    hasIndicators: function() {
        return !!this.service.getStateService().getIndicators().length;
    },
    getIndicatorData: function(indicator, callback) {
        if (!indicator) {
            callback();
            return;
        }
        this.service.getCurrentDataset(function(err, response) {
            if(err) {
                callback();
                return;
            }
            var indicatorData = [];
            response.data.forEach(function(dataItem) {
                indicatorData.push({
                    name: dataItem.name,
                    value: dataItem.values[indicator.hash]
                });
            });
            callback(indicatorData);
        });
    },
    /**
     * @method getColorScale
     * gets the color scale of the mapselection
     * @return colors[] containing colors
     */
    getColorScale: function() {
        /*
        var stateService = this.service.getStateService();
        var activeIndicator = stateService.getActiveIndicator();
        var classificationOpts = stateService.getClassificationOpts(activeIndicator.hash);
        var colors = this.service.getColorService().getColorsForClassification(classificationOpts, true);
        */
        // TODO use ranges from classification to map colors
        return ['#555','#555'];
    },
    events: function() {
        var me = this;
        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            if(event.getCurrent()) {
                me.updateUI();
            }
        });
        this.service.on('StatsGrid.IndicatorEvent', function(event) {
            if (event.isRemoved() && !me.hasIndicators()) {
                // last indicator removed -> update ui/cleanup
                me.updateUI();
            }
        });
        this.service.on('StatsGrid.RegionsetChangedEvent', function() {
            me.updateUI();
        });
    }
});
