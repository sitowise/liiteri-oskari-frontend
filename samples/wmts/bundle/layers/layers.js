/**
 * @class Oskari.mapframework.complexbundle.NlsFiLayerConfig
 * 
 * Map configuration
 * 
 * http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.wmts.NlsFiLayerConfig',
				function(popts) {

					var conf = popts || {};

					conf.userInterfaceLanguage = conf.userInterfaceLanguage
							|| "fi";

					this.conf = conf;

				},
				{

					/**
					 * @method create
					 * 
					 * some nls.fi layers
					 */
					create : function() {

						var startup = this.conf;

						startup.layers = this.sampleLayers;

						// this.createWmtsTestLayer('WMTS',
						// startup.layers.layers);

						// predefined set of layers
						startup.preSelectedLayers = {
						/*
						 * preSelectedLayers : [ { id : "base_27" } ]
						 */
						};

						// app config
						startup.userInterfaceLanguage = "fi";

						startup.globalMapAjaxUrl = "ajax.js?";
						startup.globalPortletNameSpace = "";

						startup.imageLocation = "../../map-application-framework";
						startup.indexMapUrl = '../resource/images/suomi25m_tm35fin.png';
						startup.instructionsText = "Ohjeet";
						startup.instructionsUrl = "http://www.google.fi";
						startup.printUrl = "../print/print.html";
						startup.printWindowHeight = 21 * 32;
						startup.printWindowWidth = 20 * 32;

						startup.mapConfigurations = {
							footer : true,
							scale : 3,
							index_map : true,
							height : 600,
							width : 1000,
							plane_list : true,
							map_function : true,
							zoom_bar : true,
							north : "7204000",
							east : "552000",
							scala_bar : true,
							pan : true
						};

						return startup;
					},

					sampleLayers : {
						layers : [
								{
									wmsName : "rinnevalovarjostus",
									descriptionLink : "",
									orgName : "Geodeettinen laitos",
									type : "wmslayer",
									baseLayerId : 11,
									legendImage : "http://217.152.180.24/cgi-bin/wms_rinnevalo?",
									formats : {
										value : "text/plain"
									},
									isQueryable : false,
									id : 40,
									minScale : 10000000,
									style : "",
									dataUrl : "",
									wmsUrl : "http://217.152.180.24/cgi-bin/wms_rinnevalo?&az=315&alt=45&z=100",
									name : "Rinnevalovarjostus",
									opacity : 50,
									inspire : "Korkeus",
									maxScale : 1
								},

								{
									styles : {},
									orgName : "Taustakartat",
									type : "base",
									baseLayerId : 27,
									formats : {},
									isQueryable : false,
									id : "base_27",
									minScale : 15000000,
									dataUrl : "",
									name : "Taustakartta",
									subLayer : [
											{
												wmsName : "taustakartta_5k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 125,
												minScale : 5000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:5000",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 1
											},
											{
												wmsName : "taustakartta_10k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 127,
												minScale : 20000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:10k",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 5001
											},
											{
												wmsName : "taustakartta_20k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 128,
												minScale : 54000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:20k",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 21000
											},
											{
												wmsName : "taustakartta_40k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 129,
												minScale : 133000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:40k",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 55000
											},
											{
												wmsName : "taustakartta_80k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 130,
												minScale : 200000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:80k",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 133000
											},
											{
												wmsName : "taustakartta_160k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 131,
												minScale : 250000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:160k",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 201000
											},
											{
												wmsName : "taustakartta_320k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 132,
												minScale : 350000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:320k",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 251000
											},
											{
												wmsName : "taustakartta_800k",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 133,
												minScale : 800000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:800k",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 351000
											},
											{
												wmsName : "taustakartta_2m",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 134,
												minScale : 2000000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:2milj",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 801000
											},
											{
												wmsName : "taustakartta_4m",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 135,
												minScale : 4000000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:4milj",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 2000001
											},
											{
												wmsName : "taustakartta_8m",
												styles : [ {
													title : "Normaali v�ri",
													name : "normal"
												}, {
													title : "Vaalennettu v�ri",
													name : "light"
												} ],
												descriptionLink : "",
												baseLayerId : 27,
												orgName : "Taustakartta",
												type : "wmslayer",
												legendImage : "",
												formats : {
													value : "application/vnd.ogc.gml"
												},
												isQueryable : false,
												id : 136,
												minScale : 15000000,
												style : "",
												dataUrl : "",
												wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
												name : "Taustakartta 1:8milj",
												opacity : 100,
												inspire : "Taustakartat",
												maxScale : 4000001
											} ],
									inspire : "Taustakartta",
									maxScale : 1
								} ]
					},

					/**
					 * @getMapConfiguration
					 * 
					 */
					getMapConfiguration : function() {
						return this.conf;
					},

					/**
					 * 
					 */
					createWmtsTestLayer : function(name, json) {
						json
								.push( {

									wmsName : "pti_geoname",
									wmsUrl : "http://jkorhonen.nls.fi/geowebcache/service/wmts?",
									descriptionLink : "",
									orgName : "WMTS/MapLayerService",
									type : "wmtslayer",
									// baseLayerId : 11,
									legendImage : "",
									formats : {
										value : "text/plain"
									},
									isQueryable : false,
									id : 'xxxxpti_geoname',
									minScale : 10000000,
									style : "",
									styles : [ {
										identifier : "_null",
										isDefault : true
									} ],
									dataUrl : "",
									name : "pti_geoname",
									opacity : 50,
									inspire : "WMTS/MapLayerService",
									maxScale : 1,
									tileMatrixSetId : 'EPSG_3067_PTI',
									tileMatrixSetData : {
										tileMatrixSet : {

											"matrixIds" : [
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:0",
														"scaleDenominator" : 7142857.142857144,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10240000
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 20,
														"matrixHeight" : 20
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:1",
														"scaleDenominator" : 3571428.571428572,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10240000
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 40,
														"matrixHeight" : 40
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:2",
														"scaleDenominator" : 1785714.285714286,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10112000
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 79,
														"matrixHeight" : 79
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:3",
														"scaleDenominator" : 714285.7142857143,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10035200
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 196,
														"matrixHeight" : 196
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:4",
														"scaleDenominator" : 357142.85714285716,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10009600
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 391,
														"matrixHeight" : 391
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:5",
														"scaleDenominator" : 178571.42857142858,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10009600
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 782,
														"matrixHeight" : 782
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:6",
														"scaleDenominator" : 71428.57142857143,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10004480
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 1954,
														"matrixHeight" : 1954
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:7",
														"scaleDenominator" : 35714.28571428572,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10001920
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 3907,
														"matrixHeight" : 3907
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:8",
														"scaleDenominator" : 14285.714285714286,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10000384
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 9766,
														"matrixHeight" : 9766
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:9",
														"scaleDenominator" : 7142.857142857143,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10000384
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 19532,
														"matrixHeight" : 19532
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:10",
														"scaleDenominator" : 3571.4285714285716,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10000128
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 39063,
														"matrixHeight" : 39063
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:11",
														"scaleDenominator" : 1785.7142857142858,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10000000
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 78125,
														"matrixHeight" : 78125
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:12",
														"scaleDenominator" : 892.8571428571429,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10000000
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 156250,
														"matrixHeight" : 156250
													} ],
											"identifier" : "EPSG_3067_PTI",
											"supportedCRS" : "urn:ogc:def:crs:EPSG::3067"
										}
									}

								});

						/**
						 * Testing TileMatrixSet fixed for
						 */
						json
								.push( {

									wmsName : "pti_geoname",
									wmsUrl : "http://jkorhonen.nls.fi/geowebcache/service/wmts?",
									descriptionLink : "",
									orgName : "WMTS/MapLayerService",
									type : "wmtslayer",
									// baseLayerId : 11,
									legendImage : "",
									formats : {
										value : "text/plain"
									},
									isQueryable : false,
									id : 'yyyyxxxxpti_geoname',
									minScale : 10000000,
									style : "",
									styles : [ {
										identifier : "_null",
										isDefault : true
									} ],
									dataUrl : "",
									name : "pti_geoname (lower end scales)",
									opacity : 50,
									inspire : "WMTS/MapLayerService",
									maxScale : 1,
									tileMatrixSetId : 'EPSG_3067_PTI',
									tileMatrixSetData : {
										tileMatrixSet : {
											"matrixIds" : [
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:11",
														"scaleDenominator" : 1785.7142857142858,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10000000
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 78125,
														"matrixHeight" : 78125
													},
													{
														"supportedCRS" : "urn:ogc:def:crs:EPSG::3067",
														"identifier" : "EPSG_3067_PTI:12",
														"scaleDenominator" : 892.8571428571429,
														"topLeftCorner" : {
															"lon" : 0,
															"lat" : 10000000
														},
														"tileWidth" : 256,
														"tileHeight" : 256,
														"matrixWidth" : 156250,
														"matrixHeight" : 156250
													} ],
											"identifier" : "EPSG_3067_PTI",
											"supportedCRS" : "urn:ogc:def:crs:EPSG::3067"
										}
									}

								});

					}

				});
