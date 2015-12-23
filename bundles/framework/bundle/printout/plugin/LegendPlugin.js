/**
 * @class Oskari.mapframework.bundle.printout.plugin.LegendPlugin
 * Common methods to create geojson legend and plot lengend to OL map
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.plugin.LegendPlugin',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance, conf, locale) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.mapModule = null;
        this.pluginName = null;
        this.conf = conf;
        if (!this.conf) {
            this.conf = {};
        }
        this.locale = locale;
        this.headerLayer = null;
        this.printAreaLayer = null;
        this.boxesLayer = null;
        this._map = null;

    }, {
        __name: "LegendPlugin",
        __qname: "Oskari.mapframework.bundle.printout.plugin.LegendPlugin",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.pluginName;
        },

        getMap: function () {
            return this._map;
        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {},
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {},
        /**
         * @method startPlugin
         *
         * Interface method for the plugin protocol. Registers requesthandlers and
         * eventlisteners. Creates the plugin UI.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();
            sandbox.register(this);

        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol. Unregisters requesthandlers and
         * eventlisteners. Removes the plugin UI.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {

            sandbox.unregister(this);

        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @method init
         * Initializes the service
         */
        init: function () {
            // Default style for print area layer
            var smPrintArea = new OpenLayers.StyleMap({
                'default': this.conf.printAreaDefault
            });

            this.printAreaLayer = new OpenLayers.Layer.Vector("PrintArea", {
                styleMap: smPrintArea
            });

            // Default style for legend box and legend title layer
            var smHeader = new OpenLayers.StyleMap({
                'default': this.conf.legendBoxDefault
            });

            this.headerLayer = new OpenLayers.Layer.Vector("LegendHeader", {
                styleMap: smHeader
            });
            // Default style for legend boxes layer
            var smBoxes = new OpenLayers.StyleMap({
                'default': this.conf.colorBoxDefault
            });

            this.boxesLayer = new OpenLayers.Layer.Vector("LegendBoxes", {
                styleMap: smBoxes
            });

        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this._map = mapModule.getMap();
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method plotLegend
         * Plot legend features
         * @param {String} title  Legend title
         * @param {Object[]} ranges legend boxes data (box color and ranges)
         * @param {Object} printInfo print map params
         * @param {String} legend_pos  Legend position (LL,LU,RU,RL) (left lower, left upper, right upper, right lower)
         * @return {Object} legendgjs  legend in geojson featurecollection
         *
         */
        plotLegend: function (title, ranges, printInfo, legend_pos) {
            // Keep layers on top
            var map = this.getMapModule().getMap();
            if (map.getLayerIndex(this.printAreaLayer) === -1) {
                map.addLayer(this.printAreaLayer);
                map.setLayerIndex(this.printAreaLayer, 10004);
            } else {
                map.raiseLayer(this.printAreaLayer, 101);
            }

            if (map.getLayerIndex(this.headerLayer) === -1) {
                map.addLayer(this.headerLayer);
                map.setLayerIndex(this.headerLayer, 10005);
            } else {
                map.raiseLayer(this.headerLayer, 102);
            }

            if (map.getLayerIndex(this.boxesLayer === -1)) {
                map.addLayer(this.boxesLayer);
                map.setLayerIndex(this.boxesLayer, 10006);
            } else {
                map.raiseLayer(this.boxesLayer, 103);
            }

            // remove old, if any
            this.clearLegendLayers();

            this.conf.general.minLegendItemHeight = 11;
            this.conf.general.defaultItemWidth = 14;
            this.conf.general.defaultItemHeight = 14;
            for (var i = 0; i < ranges.length; i++) {
                if (!ranges[i].hasOwnProperty('width'))
                    ranges[i].width = this.conf.general.defaultItemWidth;
                if (!ranges[i].hasOwnProperty('height'))
                    ranges[i].height = this.conf.general.defaultItemHeight;
            }

            // Legend box coordinates
            var legend_geom = this._getLegendGeom(title, ranges, printInfo, legend_pos);

            this._plotLegendHeader(title, ranges, legend_geom);

            this._plotLegendBoxes(title, ranges, legend_geom);

            // Create geojson graphics for print
            return this._createPrintGeoJSON();

        },
        /**
         * @method _maxLayerIndex
         *
         *
         * @private
         * @return{boolean} true; statslayers exists
         *
         */
        _maxLayerIndex: function () {
            var top = 0;
            var layers = this.instance.getSandbox().findAllSelectedMapLayers(),
                i;

            // request updates for map tiles
            for (i = 0; i < layers.length; i++) {
                if (this.getMapModule().getMap().getLayerIndex(layers[i]) > top) {
                    top = this.getMapModule().getMap().getLayerIndex(layers[i]);
                }
            }
            return top;
        },
        /**
         * @method _getLegendGeom
         * Get geometry for lenegd box
         * @param {String} title  Legend title
         * @param {Object[]} ranges legend boxes data (box color and ranges)
         * @param {Object} printInfo print map params
         * @param {String} legend_pos  Legend position (LL,LU,RU,RL) (left lower, left upper, right upper, right lower)
         * @return {Object} legend geometry box
         *
         */
        _getLegendGeom: function (title, ranges, printInfo, legend_pos) {

            
            // Print area in pixels
            var properties = printInfo.features[0].properties;
            var pixel_width = properties.targetWidth;
            var pixel_height = properties.targetHeight;

            // Legend box coordinates
            var coords = printInfo.features[0].geometry.coordinates[0];
            var width = Number(coords[1][0]) - Number(coords[0][0]);
            var height = Number(coords[2][1]) - Number(coords[1][1]);

            // Split long title row - max lenght is this.conf.general.charsInrow
            var titles = [],
                i;
            
            title = title.replace(/<br>/g, " / ");
            if (title.length > this.conf.general.charsInrow) {
                var titlesplit = title.split(" ");
                var titletemp = "";
                for (i = 0; i < titlesplit.length; i++) {
                    if ((titletemp.length + titlesplit[i].length + 1) < this.conf.general.charsInrow) {
                        titletemp = titletemp + titlesplit[i] + " ";
                    } else {
                        titles.push(titletemp);
                        titletemp = titlesplit[i] + " ";
                    }

                }
                if (titletemp.length > 0) {
                    titles.push(titletemp);
                }
            } else {
                titles.push(title);
            }

            // Use longer side
            var lside = width;
            if (height > width) {
                lside = height;
            }

            //header
            var l_height = this.conf.general.legendRowHeight * lside * (titles.length + 1);
            var titlebox_size = l_height / (titles.length + 1);
            for (var ix = 0; ix < ranges.length; ix++) {
                if (ranges[ix].height > this.conf.general.minLegendItemHeight)
                    l_height += 1.2 * (ranges[ix].height * height / pixel_height);
                else
                    l_height += 1.2 * (this.conf.general.minLegendItemHeight * height / pixel_height);
            }
            
            // Legend width in meters
            var l_width = this.conf.general.legendWidth * lside;            

            var lcoord = [];
            // Legend LL
            if (legend_pos === 'LL') {
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0], coords[0][1] + l_height));
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0] + l_width, coords[0][1] + l_height));
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0] + l_width, coords[0][1]));
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0], coords[0][1]));
            } else if (legend_pos === 'LU') {
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0], coords[3][1]));
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0] + l_width, coords[3][1]));
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0] + l_width, coords[3][1] - l_height));
                lcoord.push(new OpenLayers.Geometry.Point(coords[0][0], coords[3][1] - l_height));
            } else if (legend_pos === 'RU') {
                lcoord.push(new OpenLayers.Geometry.Point(coords[2][0] - l_width, coords[2][1]));
                lcoord.push(new OpenLayers.Geometry.Point(coords[2][0], coords[2][1]));
                lcoord.push(new OpenLayers.Geometry.Point(coords[2][0], coords[2][1] - l_height));
                lcoord.push(new OpenLayers.Geometry.Point(coords[2][0] - l_width, coords[2][1] - l_height));
            } else if (legend_pos === 'RL') {
                lcoord.push(new OpenLayers.Geometry.Point(coords[1][0] - l_width, coords[1][1] + l_height));
                lcoord.push(new OpenLayers.Geometry.Point(coords[1][0], coords[1][1] + l_height));
                lcoord.push(new OpenLayers.Geometry.Point(coords[1][0], coords[1][1]));
                lcoord.push(new OpenLayers.Geometry.Point(coords[1][0] - l_width, coords[1][1]));
            }

            // Print area
            var acoord = [],
                coordp;
            i = 0;
            while (coordp = coords[i++]) {
                acoord.push(new OpenLayers.Geometry.Point(coordp[0], coordp[1]));
            }

            var legend_box = {
                "print_area": acoord,
                "bbox": lcoord,
                "titlebox_size" : titlebox_size,
                "properties": properties,
                "titles": titles,
                'width': width,
                'height': height,
                'pixel_width': pixel_width,
                'pixel_height': pixel_height
            };

            return legend_box;

        },

        /**
         * @method clearLegendLayers
         * Clear  temp layers of Legend
         *
         */
        clearLegendLayers: function () {
            if (this.headerLayer) {
                this.headerLayer.removeAllFeatures();
            }
            if (this.boxesLayer) {
                this.boxesLayer.removeAllFeatures();
            }
            if (this.printAreaLayer) {
                this.printAreaLayer.removeAllFeatures();
            }

        },
        /**
         * @method _plotLegendHeader
         * Create and plot Legend title and legend box to OL temp layer.
         * @param {String} title  Legend title
         * @param {Object[]} ranges legend boxes data (box color and ranges)
         * @param {Object} legend_geom legend box for to fill with details
         */
        _plotLegendHeader: function (title, ranges, legend_geom) {
            var me = this;
            var coords = legend_geom.bbox;
            var points = coords;
            var ring = new OpenLayers.Geometry.LinearRing(points);
            var polygon = new OpenLayers.Geometry.Polygon([ring]);

            var myempty = '';

            // create some attributes for the feature
            var attributes = {
                "color": "#FFFFFF", // white fill color
                "name": myempty

            };
            // Print area  - excluded in print geojson
            var line = new OpenLayers.Geometry.LineString(legend_geom.print_area);
            var fea_print_area = new OpenLayers.Feature.Vector(line, null);
            me.printAreaLayer.addFeatures([fea_print_area]);
            me.printAreaLayer.redraw();

            // Legend box
            var feature_bbox = new OpenLayers.Feature.Vector(polygon, attributes);
            me.headerLayer.addFeatures([feature_bbox]);

            //Title - add title rows
            var titles = legend_geom.titles,
                i;
            for (i = 0; i < titles.length; i++) {
                var point = coords[0].clone();
                var label_point = new OpenLayers.Geometry.Point(point.x + (0.2 * legend_geom.titlebox_size), point.y - ((i * legend_geom.titlebox_size) + (legend_geom.titlebox_size / 2.0)));

                // create some attributes for the feature
                var pattributes = {
                    "name": titles[i]
                };

                var feature_label = new OpenLayers.Feature.Vector(label_point, pattributes);
                me.headerLayer.addFeatures([feature_label]);
            }
            me.headerLayer.redraw();

        },
        /**
         * @method _plotLegendBoxes
         * Plot legend range boxes
         * @param {String} title  Legend title
         * @param {Object[]} legend boxes data (box color and ranges)
         * @param {Object} legend_geom legend box for to fill with details
         */
        _plotLegendBoxes: function (title, ranges, legend_geom) {
            var me = this;
            // property value for empty label - doesn't work in IE
            var myempty = '';           
            var coords = legend_geom.bbox;
            var titles = legend_geom.titles;
            var point = coords[0].clone();

            // Loop ranges
            var x_LU = point.x + (0.2 * this.conf.general.legendWidth);
            var y_LU = point.y - (titles.length * legend_geom.titlebox_size)
                ,i;
            // this is for header label space
            
            var rgb2hex = function(rgb) {
                if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }

            for (i = 0; i < ranges.length; ++i) {
                var range = ranges[i];
                var mycolor = rgb2hex(ranges[i].color.trim());
                var geomWidth = (legend_geom.width * ranges[i].width) / legend_geom.pixel_width;
                var geomHeight = (legend_geom.height * ranges[i].height) / legend_geom.pixel_height;
                var outerGeomWidth = 1.2 * geomWidth;
                var lineHeight = (legend_geom.height * (this.conf.general.minLegendItemHeight > ranges[i].height ? this.conf.general.minLegendItemHeight : ranges[i].height)) / legend_geom.pixel_height;
                var outerLineHeight = 1.2 * lineHeight;
                var x = x_LU;
                var y = y_LU;

                var polygon;
                if (ranges[i].type == 'rectangle') {
                    var points = [new OpenLayers.Geometry.Point(x, y), new OpenLayers.Geometry.Point(x + geomWidth, y), new OpenLayers.Geometry.Point(x + geomWidth, y - geomHeight), new OpenLayers.Geometry.Point(x, y - geomHeight)];
                    var ring = new OpenLayers.Geometry.LinearRing(points);
                    polygon = new OpenLayers.Geometry.Polygon([ring]);
                } else if (ranges[i].type == 'circle') {
                    polygon = OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(x + geomHeight / 2, y - geomHeight / 2), geomHeight / 2, 20, 0);
                }                

                // create some attributes for the feature
                var attributes = {
                    "color": mycolor,
                    "name": myempty

                };

                var feature_bbox = new OpenLayers.Feature.Vector(polygon, attributes);
                me.boxesLayer.addFeatures([feature_bbox]);

                //Title
                point = new OpenLayers.Geometry.Point(x + outerGeomWidth, y - lineHeight);

                // create some attributes for the feature
                var pattributes = {
                    "name": range.range

                };

                var feature_label = new OpenLayers.Feature.Vector(point, pattributes);
                me.boxesLayer.addFeatures([feature_label]);

                y_LU = y_LU - outerLineHeight;
            }
            me.boxesLayer.redraw();

        },

        _createPrintGeoJSON: function () {

            var geojson_format = new OpenLayers.Format.GeoJSON();
            // GeoJson collection
            var geojsCollection = [];
            // Legend header graphics
            var header = JSON.parse(geojson_format.write(this.headerLayer.features));
            var geojs = {
                "type": "geojson",
                "name": this.headerLayer.name,
                "id": this.headerLayer.name,
                "data": {
                    "type": "FeatureCollection",
                    "features": header.features
                },
                "styles": []
            };

            geojs.styles.push(this._getDefaultStyle(this.headerLayer.styleMap));
            geojsCollection.push(geojs);

            // Legend range box graphics
            var boxes = JSON.parse(geojson_format.write(this.boxesLayer.features));
            geojs = {
                "type": "geojson",
                "name": this.boxesLayer.name,
                "id": this.boxesLayer.name,
                "data": {
                    "type": "FeatureCollection",
                    "features": boxes.features
                },
                "styles": []
            };

            geojs.styles.push(this._getDefaultStyle(this.boxesLayer.styleMap));
            geojsCollection.push(geojs);

            return geojsCollection;

        },
        /**
         * @method _getDefaultStyle
         * Oskari openlayers style to basic printout format
         * @param {OpenLayers.Feature.Vector.styleMap} feature to be plotted as  new Parcel.
         * @return {object}  print style
         */
        _getDefaultStyle: function (styleMap) {
            var style = styleMap.styles["default"].defaultStyle;
            var id = styleMap.styles["default"].id;
            var printStyle = {
                "title": "Standard",
                "name": id,
                "styleMap": {
                    "default": {}
                }

            };
            printStyle.styleMap["default"] = this._cleanStyle(style, ['labelXOffset', 'labelYOffset']);
            return printStyle;
        },
        /**
         * @method _cleanStyle
         * remove given parameters out of style
         * certain attributes are not supported in backend geotools printing
         * @param {Object} JSON style attributes
         * @param {Array} style attributes for to remove.
         * @return {object}  cleaned  style
         */
        _cleanStyle: function (stylein, attrs_to_remove) {
            // Loop style attributes
            var style = jQuery.extend(true, {}, stylein),
                i;
            for (i = 0; i < attrs_to_remove.length; i++) {
                var key = attrs_to_remove[i];
                if (style[key]) {
                    if (style[key].toString().indexOf("${delta") > -1) {
                        delete style[key];
                    }
                }

            }

            return style;
        },
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    });