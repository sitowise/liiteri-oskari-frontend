/* This is a packed Oskari bundle (bundle script version Thu May 31 2012 11:32:12 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define("Oskari.mapframework.bundle.WikipediaBundleUI",function(b,a){this.libs=b;this.form=null;this.ui=null;this.store=null;this.form=null;this.grid=null;this.bundle=a},{clear:function(){this.store=null;this.form=null;this.libs=null;this.ui=null;this.grid=null},setLibs:function(a){this.libs=a},get:function(){return this.form},setStore:function(a){this.store=a},getStore:function(){return this.store},getGrid:function(){return this.grid},showArticle:function(a){this.bundle.showArticle(a)},create:function(){var a=this.libs.ext;var a=this.libs.ext;var d=this;var b=a.create("Ext.grid.Panel",{store:d.getStore(),title:"Nearby Wikimedia",columns:[{xtype:"actioncolumn",width:50,items:[{icon:"../../map-application-framework/resource/silk-icons/control_play.png",tooltip:"Show",handler:function(f,i,e){var h=d.getStore().getAt(i);var g=h.get("wikipediaUrl");d.showArticle(g)}}]},{text:"Title",flex:1,dataIndex:"title"},{text:"N",width:64,sortable:false,hideable:false,dataIndex:"n"},{text:"E",width:64,dataIndex:"e",sortable:false,hideable:false}]});this.grid=b;var c=new a.create("Ext.panel.Panel",{bodyStyle:"padding:5px 5px 0",height:384,layout:"card",defaults:{bodyPadding:4},items:[b]});this.form=c;return c}});Oskari.clazz.define("Oskari.mapframework.bundle.WikipediaBundleInstance",function(a){this.name="WikipediaModule";this.mediator=null;this.sandbox=null;this.layerId=null;this.layer=null;this.ui=null},{getStore:function(){return this.store},showArticle:function(c){var a="http://"+c;var b=this.sandbox.getRequestBuilder("ShowOverlayPopupRequest")(a);this.sandbox.request(this.getName(),b)},clear:function(){this.store.clearData();this.store.destroyStore();this.store=null},start:function(){if(this.mediator.getState()=="started"){return}this.libs={ext:Oskari.$("Ext")};this.facade=Oskari.$("UI.facade");this.projs={"EPSG:4326":new Proj4js.Proj("EPSG:4326"),"EPSG:3067":new Proj4js.Proj("EPSG:3067")};var a=this.libs.ext;var b=this;this.createModels();this.createStores();var b=this;this.func=a.Function.createThrottled(function(){this.processQuery()},3200,b);var c=this.facade.appendExtensionModule(this,this.name,this.eventHandlers,this,"E",{fi:{title:" Wikipedia"},sv:{title:"?"},en:{title:" Wikipedia"}});this.def=c;this.layerId="____WikiMedia___"+this.mediator.instanceid;this.addVectorLayer();this.mediator.setState("started");return this},createModels:function(){var a=this.libs.ext;var b=this;if(!a.ClassManager.get("Wiki")){a.define("Wiki",{extend:"Ext.data.Model",fields:["summary","distance","rank","title","wikipediaUrl","elevation","countryCode","lng","feature","lang","lat",{name:"n",convert:function(e,d){var c=Proj4js.transform(b.projs["EPSG:4326"],b.projs["EPSG:3067"],{x:d.get("lng"),y:d.get("lat")});return c.y}},{name:"e",convert:function(e,d){var c=Proj4js.transform(b.projs["EPSG:4326"],b.projs["EPSG:3067"],{x:d.get("lng"),y:d.get("lat")});return c.x}}]})}},createStores:function(){var b=this.libs.ext;var c=this;var a=b.create("Ext.data.Store",{model:"Wiki",autoLoad:false,proxy:{type:"jsonp",url:"http://api.geonames.org/findNearbyWikipediaJSON",pageParam:null,startParam:null,limitParam:null,reader:{type:"json",model:"Wiki",root:"geonames"},extraParams:{username:"oskari"}}});this.store=a},init:function(a){this.sandbox=a;this.map=a.getMap();var b=Oskari.clazz.create("Oskari.mapframework.bundle.WikipediaBundleUI",this.libs,this);this.ui=b;b.setLibs(this.libs);b.setStore(this.getStore());b.create();return b.get()},update:function(d,a,c,e){d.alert("RECEIVED update notification @BUNDLE_INSTANCE: "+e)},stop:function(){this.stopped=true;this.removeVectorLayer();this.facade.removeExtensionModule(this,this.name,this.eventHandlers,this,this.def);this.def=null;this.sandbox.printDebug("Clearing STORE etc");this.ui.clear();this.ui=null;this.clear();this.mediator.setState("stopped");return this},setNE:function(b,a){this.n=b;this.e=a},onEvent:function(a){return this.eventHandlers[a.getName()].apply(this,[a])},defaults:{minScale:40000,maxScale:1},getFeatureInfo:function(c,g,a){var i=30;var d=this.libs.ext;var f=this.ui;var h=f.getStore();var b=f.getGrid().getSelectionModel();
var e=this;h.each(function(m){var j=m.get("e");var k=m.get("n");var n=Math.sqrt(Math.pow(c-j,2)+Math.pow(g-k,2));if(n<i){b.select(m);var l=m.get("wikipediaUrl");if(!a){e.showArticle(l)}}})},eventHandlers:{AfterMapLayerRemoveEvent:function(d){var c=d.getMapLayer();if(c.getId()==this.layerId){if(this.sandbox.getObjectCreator(d)!=this.getName()){this.stop();var b=this.mediator.manager;var a=this.mediator.instanceid;b.destroyInstance(a)}}},AfterMapMoveEvent:function(c){var b=this;var a=this.sandbox;var f=c.getScale();if(!(f<this.defaults.minScale&&f>this.defaults.maxScale)){return}var g=c.getCenterY();var d=c.getCenterX();b.sandbox.printDebug("N:"+g+" E:"+d);b.setNE(g,d);b.func()},FeaturesGetInfoEvent:function(f){var d=f.getMapLayer();var b=d.getId();if(b!=this.layerId){return}var a=this.sandbox;a.printDebug("Handling FeaturesGetInfoEvent for "+this.layerId);var c=f.getLon();var e=f.getLat();this.getFeatureInfo(c,e)},MouseHoverEvent:function(c){var a=c.getLon();var b=c.getLat();this.getFeatureInfo(a,b,true)},AfterAddExternalMapLayerEvent:function(a){if(a.getMapLayerId()==this.layerId){this.layer=a.getLayer()}},AfterRemoveExternalMapLayerEvent:function(a){if(a.getMapLayerId()==this.layerId){this.layer=null}}},processQuery:function(){var c=this;if(c.stopped){return}var h=this.n;var f=this.e;c.sandbox.printDebug("STARTING WIKIPEDIA LOAD N:"+h+" E:"+f);var a=this.libs.ext;var g=Proj4js.transform(c.projs["EPSG:3067"],c.projs["EPSG:4326"],{x:f,y:h});var b=g.x;var d=g.y;c.busy=true;c.ui.getStore().load({params:{lat:d,lng:b},callback:function(e){c.processResponse(e);c.sandbox.printDebug("finished WIKIPEDIA LOAD")}})},processResponse:function(b){var a=this.libs.ext;var f=this;var d=[];var c={type:"FeatureCollection",features:d};a.Array.each(b,function(g){d.push({type:"Feature",geometry:{type:"Point",coordinates:[g.get("e"),g.get("n")]},properties:{title:g.get("title"),feature:g.get("feature"),wikipediaUrl:g.get("wikipediaUrl"),summary:g.get("summary")}})});if(this.stopped){return}var e=f.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,c,"application/json","EPSG:3067","replace");f.sandbox.notifyAll(e)},addVectorLayer:function(){var c=this.layerId,b=true,f=false;var a={name:"Wikipedia",wmsName:"1",type:"vectorlayer",styles:{title:"Wikipedia",legend:"",name:"1"},descriptionLink:"http://en.wikipedia.org/",legendImage:"",info:"",isQueryable:true,formats:{value:"text/html"},id:c,minScale:this.defaults.minScale,maxScale:this.defaults.maxScale,style:"",dataUrl:"",wmsUrl:"x",opacity:100,checked:"false"};var d=this.sandbox.getRequestBuilder("AddExternalMapLayerRequest")(c,a);this.sandbox.request(this.getName(),d);var e=this.sandbox.getRequestBuilder("AddMapLayerRequest")(c,b,f);this.sandbox.request(this.getName(),e)},removeVectorLayer:function(){var a=this.layerId;var b=this.sandbox.getRequestBuilder("RemoveMapLayerRequest")(a);this.sandbox.request(this.getName(),b);var c=this.sandbox.getRequestBuilder("RemoveExternalMapLayerRequest")(a);this.sandbox.request(this.getName(),c)},getName:function(){return this.__name},__name:"Oskari.mapframework.bundle.WikipediaBundleInstance"},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module","Oskari.mapframework.bundle.extension.Extension","Oskari.mapframework.bundle.extension.EventListener"]});