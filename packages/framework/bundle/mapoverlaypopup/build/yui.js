/* This is a packed Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define("Oskari.mapframework.ui.module.common.OverlayPopupModule",function(){this._sandbox;this._overlayPopup=null},{__name:"OverlayPopupModule",getName:function(){return this.__name},init:function(a){a.printDebug("Initializing "+this.getName()+" module...");this._sandbox=a;this.showOverlayPopupRequestHandler=Oskari.clazz.create("Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler",a,this);return null},closePopup:function(){if(this._overlayPopup!=null){this._overlayPopup.destroy();this._overlayPopup=null}},_getButtonCallbackWrapper:function(b){var a=this;return function(){if(b){b()}a.closePopup()}},showPopup:function(a,f){var e=this;var d=[];if(f&&f.length>0){for(var c=0;c<f.length;++c){var g=f[c];var b=Ext.create("Ext.button.Button",{text:g.text,handler:e._getButtonCallbackWrapper(g.callback)});d.push(b)}}Ext.Function.defer(function(){e.showWebContent(a,d)},100)},showWebContent:function(f,c){this.closePopup();var b=this._sandbox.getBrowserWindowSize();var a=b.height-200;var e=Ext.create("Ext.Window",{autoScroll:true,bodyCssClass:"overlay-popup-module-content",closable:true,animate:false,width:800,height:a,frame:true,header:false,draggable:false,maximizable:false,resizable:false,modal:true,layout:"fit",html:'<iframe src="'+f+'" style="width:100%;height:100%;border:0;">',listeners:{}});if(c&&c.length>0){var d={xtype:"toolbar",dock:"bottom",items:c};e.addDocked(d)}this._overlayPopup=e;e.show()},start:function(a){a.printDebug("Starting "+this.getName());a.addRequestHandler("ShowOverlayPopupRequest",this.showOverlayPopupRequestHandler)},stop:function(a){a.removeRequestHandler("ShowOverlayPopupRequest",this.showOverlayPopupRequestHandler)},onEvent:function(a){}},{protocol:["Oskari.mapframework.module.Module"]});Oskari.clazz.define("Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequest",function(a,b){this._creator=null;this._autoLoadUrl=a;this._buttonsConf=b},{__name:"ShowOverlayPopupRequest",getName:function(){return this.__name},getAutoLoadUrl:function(){return this._autoLoadUrl},getButtonsConf:function(){return this._buttonsConf}},{protocol:["Oskari.mapframework.request.Request"]});Oskari.clazz.define("Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler",function(a,b){this.sandbox=a;this.plugin=b},{handleRequest:function(a,c){var b=c.getAutoLoadUrl();this.sandbox.printDebug("[Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler] got dataurl "+b);this.plugin.showPopup(b,c.getButtonsConf())}},{protocol:["Oskari.mapframework.core.RequestHandler"]});Oskari.clazz.define("Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance",function(a){this.name="mapoverlaypopup";this.mediator=null;this.sandbox=null;this.impl=null;this.ui=null},{start:function(){if(this.mediator.getState()=="started"){return}this.libs={ext:Oskari.$("Ext")};this.facade=Oskari.$("UI.facade");this.impl=Oskari.clazz.create("Oskari.mapframework.ui.module.common.OverlayPopupModule");var a=this.facade.appendExtensionModule(this.impl,this.name,this.eventHandlers,this,"StatusRegion",{fi:{title:""},sv:{title:"?"},en:{title:""}});this.def=a;this.impl.start(this.facade.getSandbox());this.mediator.setState("started");return this},update:function(d,a,c,e){d.alert("RECEIVED update notification @BUNDLE_INSTANCE: "+e)},stop:function(){this.impl.stop();this.facade.removeExtensionModule(this.impl,this.name,this.eventHandlers,this,this.def);this.def=null;this.impl=null;this.mediator.setState("stopped");return this},getName:function(){return this.__name},__name:"Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance"},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.bundle.extension.Extension"]});