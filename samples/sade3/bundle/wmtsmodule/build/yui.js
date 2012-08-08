/* This is a packed Oskari bundle (bundle script version Thu Feb 23 2012 11:08:28 GMT+0200 (Suomen normaaliaika)) */ 
Oskari.clazz.define("Oskari.mapframework.mapmodule.WmtsPocPlugin",function(a){this.mapModule=null;this.pluginName=null;this._sandbox=null;this._map=null;this._supportedFormats={};this._capsPath=a.capsPath},{__name:"WmtsPocPlugin",getName:function(){return this.pluginName},getMap:function(){return this._map},getMapModule:function(){return this.mapModule},setMapModule:function(a){this.mapModule=a;this.pluginName=a.getName()+this.__name},register:function(){this.getMapModule().setLayerPlugin("WmtsPoc",this)},unregister:function(){this.getMapModule().setLayerPlugin("WmtsPoc",null)},init:function(a){},startPlugin:function(a){this._sandbox=a;this._map=this.getMapModule().getMap();a.register(this);for(p in this.eventHandlers){a.registerForEventByName(this,p)}var b="EPSG_3067_PTI";this.createPtiWMTSLayersFromCaps(b,this.ptiWmsLayerSpecs,"pti_geoname")},stopPlugin:function(a){for(p in this.eventHandlers){a.unregisterFromEventByName(this,p)}a.unregister(this);this._map=null;this._sandbox=null},start:function(a){},stop:function(a){},eventHandlers:{},onEvent:function(a){return this.eventHandlers[a.getName()].apply(this,[a])},preselectLayers:function(a){},ptiWmsLayerSpecs:{pti_taustakartta_10k:{minScale:20000,maxScale:1,format:"image/png",opacity:0.4},pti_taustakartta_20k:{minScale:54000,maxScale:21000,format:"image/png",opacity:0.45},pti_taustakartta_40k:{minScale:133000,maxScale:55000,format:"image/png",opacity:0.5},pti_taustakartta_160k:{minScale:250000,maxScale:133000,format:"image/png",opacity:0.6},pti_taustakartta_320k:{minScale:350000,maxScale:251000,format:"image/png",opacity:0.65},pti_taustakartta_2m:{minScale:2000000,maxScale:801000,format:"image/png",opacity:0.75},pti_taustakartta_4m:{minScale:4000000,maxScale:2000001,format:"image/png",opacity:0.8},pti_taustakartta_8m:{minScale:15000000,maxScale:4000001,format:"image/png",opacity:0.85}},jhsWmsLayerSpecs:{taustakartta_10k:{minScale:20000,maxScale:1,format:"image/png",opacity:0.4},taustakartta_20k:{minScale:54000,maxScale:21000,format:"image/png",opacity:0.45},taustakartta_40k:{minScale:133000,maxScale:55000,format:"image/png",opacity:0.5},taustakartta_160k:{minScale:250000,maxScale:200000,format:"image/png",opacity:0.6},taustakartta_320k:{minScale:350000,maxScale:251000,format:"image/png",opacity:0.65},taustakartta_800k:{minScale:800000,maxScale:351000,format:"image/png",opacity:0.7},taustakartta_2m:{minScale:2000000,maxScale:801000,format:"image/png",opacity:0.75},taustakartta_4m:{minScale:4000000,maxScale:2000001,format:"image/png",opacity:0.8},taustakartta_8m:{minScale:15000000,maxScale:4000001,format:"image/png",opacity:0.85}},createPtiWMTSLayersFromCaps:function(h,a,c){var d=this;var b=d._sandbox;var g=d.getMap();var f=new OpenLayers.Format.WMTSCapabilities();var e=this._capsPath;OpenLayers.Request.GET({url:e,params:{SERVICE:"WMTS",VERSION:"1.0.0",REQUEST:"GetCapabilities"},success:function(n){var r=n.responseXML;if(!r||!r.documentElement){r=n.responseText}var j=f.read(r);window.caps=j;for(ld in a){var m=a[ld];var o=ld;var q=f.createLayer(j,{layer:o,matrixSet:h,format:m.format,opacity:m.opacity||0.5,isBaseLayer:false,buffer:0,minScale:m.minScale,maxScale:m.maxScale});q.getMatrix=function(){var t;if(!this.matrixIds||this.matrixIds.length===0){t={identifier:this.map.getZoom()+this.zoomOffset};b.printDebug("getMatrix based on ZOOM")}else{if("scaleDenominator" in this.matrixIds[0]){b.printDebug("getMatrix based on scaleDenominator");b.printDebug("- resolution "+this.map.getResolution());var s=OpenLayers.METERS_PER_INCH*OpenLayers.INCHES_PER_UNIT[this.units]*this.map.getResolution()/0.00028;b.printDebug("- denom "+s);var x=Number.POSITIVE_INFINITY;var y;for(var u=0,v=this.matrixIds.length;u<v;++u){var w=this.matrixIds[u];b.printDebug(" checking #"+u+" -> "+this.matrixIds[u].scaleDenominator);y=Math.abs(1-(this.matrixIds[u].scaleDenominator/s));b.printDebug("  --> delta "+y);if(y<x){b.printDebug("  --> assigning #"+u+" as matrix (smaller than previous "+x+")");x=y;t=this.matrixIds[u]}}}else{b.printDebug("getMatrix based on ZOOM FALLBACK");t=this.matrixIds[this.map.getZoom()+this.zoomOffset]
}b.printDebug("getMatrix returns "+t.scaleDenominator)}return t};var k=j.contents;var i=k.tileMatrixSets[h];var l=i.matrixIds;b.printDebug(o+" "+l[0].scaleDenominator);g.addLayer(q)}},failure:function(){alert("Trouble getting capabilities doc");OpenLayers.Console.error.apply(OpenLayers.Console,arguments)}})},createWMTSLayers:function(){var b=this;var c=b.getMap();var a=new OpenLayers.Layer.WMTS({visibility:true,name:"WMTS Layer",url:"http://jkorhonen.nls.fi:8888/geowebcache/service/wmts?",layer:"geoname",style:"default",matrixSet:"EPSG_3067_NLSFI",format:"image/png",tileOrigin:new OpenLayers.LonLat(-548576,8388608),tileFullExtent:new OpenLayers.Bounds(-548576,6291456,1548576,8388608),matrixIds:["EPSG_3067_NLSFI:0","EPSG_3067_NLSFI:1","EPSG_3067_NLSFI:2","EPSG_3067_NLSFI:3","EPSG_3067_NLSFI:4","EPSG_3067_NLSFI:5","EPSG_3067_NLSFI:6","EPSG_3067_NLSFI:7","EPSG_3067_NLSFI:8","EPSG_3067_NLSFI:9","EPSG_3067_NLSFI:10","EPSG_3067_NLSFI:11","EPSG_3067_NLSFI:12","EPSG_3067_NLSFI:13","EPSG_3067_NLSFI:14","EPSG_3067_NLSFI:15","EPSG_3067_NLSFI:16","EPSG_3067_NLSFI:17","EPSG_3067_NLSFI:18","EPSG_3067_NLSFI:19","EPSG_3067_NLSFI:20","EPSG_3067_NLSFI:21","EPSG_3067_NLSFI:22","EPSG_3067_NLSFI:23"]});c.addLayers([a]);return c}},{protocol:["Oskari.mapframework.module.Module","Oskari.mapframework.ui.module.common.mapmodule.Plugin"]});Oskari.clazz.define("Oskari.mapframework.bundle.WMTSModuleInstance",function(a){this.name="wmts";this.mediator=null;this.sandbox=null;this.conf=null;this.impl=null;this.ui=null;this.regionSelector="Center"},{getName:function(){return this.name},start:function(){if(this.mediator.getState()=="started"){return}this.mediator.setState("started");return this},update:function(d,a,c,e){d.alert("RECEIVED update notification @BUNDLE_INSTANCE: "+e)},stop:function(){this.mediator.setState("stopped");return this},getName:function(){return this.__name},__name:"Oskari.mapframework.bundle.WMTSModuleInstance"},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.bundle.extension.Extension"]});