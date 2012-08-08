/* This is a packed Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define("Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance",function(){this.sandbox=null;this.started=false;this.mediator=null},{__name:"Infobox",getName:function(){return this.__name},setSandbox:function(a){this.sandbox=a},getSandbox:function(){return this.sandbox},update:function(){},start:function(){var b=this;if(b.started){return}b.started=true;var a=Oskari.$("sandbox");a.register(b);b.setSandbox(a);for(var c in b.eventHandlers){if(c){a.registerForEventByName(b,c)}}var d=a.findRegisteredModuleInstance("MainMapModule");d.registerPlugin(this.popupPlugin);d.startPlugin(this.popupPlugin);a.addRequestHandler("InfoBox.ShowInfoBoxRequest",this.requestHandlers.showInfoHandler);a.addRequestHandler("InfoBox.HideInfoBoxRequest",this.requestHandlers.hideInfoHandler)},init:function(){var a=this;this.popupPlugin=Oskari.clazz.create("Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin");this.requestHandlers={showInfoHandler:Oskari.clazz.create("Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler",this.popupPlugin),hideInfoHandler:Oskari.clazz.create("Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequestHandler",this.popupPlugin)};return null},onEvent:function(c){var b=this;var a=b.eventHandlers[c.getName()];if(!a){return}return a.apply(this,[c])},eventHandlers:{},stop:function(){var b=this;var a=b.sandbox();for(var c in b.eventHandlers){if(c){a.unregisterFromEventByName(b,c)}}b.sandbox.unregister(b);b.started=false}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module"]});jQuery.fn.outerHTML=function(a){var b;if(!this.length){return typeof val=="undefined"?this:null}if(!a){return this[0].outerHTML||(b=this.wrap("<div>").parent().html(),this.unwrap(),b)}jQuery.each(this,function(d,e){var g,f=e,c=e.outerHTML?"outerHTML":"innerHTML";if(!e.outerHTML){e=jQuery(e).wrap("<div>").parent()[0]}if(jQuery.isFunction(a)){if((g=a.call(f,d,e[c]))!==false){e[c]=g}}else{e[c]=a}if(!e.outerHTML){jQuery(e).children().unwrap()}});return this};Oskari.clazz.define("Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin",function(){this.mapModule=null;this.pluginName=null;this._sandbox=null;this._map=null;this._popups={}},{__name:"OpenLayersPopupPlugin",getName:function(){return this.pluginName},getMapModule:function(){return this.mapModule},setMapModule:function(a){this.mapModule=a;this._map=a.getMap();this.pluginName=a.getName()+this.__name},init:function(){var a=this;this._arrow=jQuery('<div class="popupHeaderArrow"></div>');this._header=jQuery('<div class="popupHeader"></div>');this._contentDiv=jQuery('<div class="popupContent"></div>');this._contentWrapper=jQuery('<div class="contentWrapper"></div>');this._actionLink=jQuery('<span class="infoboxActionLinks"><a href="#"></a></span>');this._contentSeparator=jQuery('<hr class="infoboxLine">')},popup:function(k,t,j,d){var q=this;var b=this._arrow.clone();var o=this._header.clone();var l=this._contentDiv.clone();o.append(t);for(var p=0;p<j.length;p++){if(p!=0){l.append(this._contentSeparator.clone())}var e=j[p].html;var f=this._contentWrapper.clone();f.append(e);var m=j[p].actions;for(var s in m){var n=s;var h=m[s];var g=this._actionLink.clone();var c=g.find("a");c.attr("contentdata",p);c.append(n);f.append(g)}l.append(f)}var r=this.getMapModule().getMap();var a=new OpenLayers.Popup(k,new OpenLayers.LonLat(d.lon,d.lat),new OpenLayers.Size(400,200),b.outerHTML()+o.outerHTML()+l.outerHTML(),false);a.setBackgroundColor("transparent");this._popups[k]=a;jQuery(a.div).css("overflow","");jQuery(a.groupDiv).css("overflow","");a.events.un({click:a.onclick,scope:a});a.events.on({click:function(u){var w=jQuery(u.originalTarget);var v=w.attr("contentdata");var x=w.html();if(j[v]&&j[v].actions&&j[v].actions[x]){j[v].actions[x]()}},scope:a});r.addPopup(a)},close:function(b){if(!b){for(var a in this._popups){this._popups[a].destroy();delete this._popups[a]}return}this._popups[b].destroy();delete this._popups[b]},register:function(){},unregister:function(){},startPlugin:function(a){this._sandbox=a;a.register(this)
},stopPlugin:function(a){a.unregister(this);this._map=null;this._sandbox=null},start:function(a){},stop:function(a){}},{protocol:["Oskari.mapframework.module.Module","Oskari.mapframework.ui.module.common.mapmodule.Plugin"]});Oskari.clazz.define("Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest",function(e,d,c,a,b){this._creator=null;this._id=e;this._title=d;this._content=c;this._position=a;this._hidePrevious=(b==true)},{__name:"InfoBox.ShowInfoBoxRequest",getName:function(){return this.__name},getId:function(){return this._id},getTitle:function(){return this._title},getContent:function(){return this._content},getPosition:function(){return this._position},getHidePrevious:function(){return this._hidePrevious}},{protocol:["Oskari.mapframework.request.Request"]});Oskari.clazz.define("Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler",function(a){this.popupPlugin=a},{handleRequest:function(a,b){if(b.getHidePrevious()){this.popupPlugin.close()}this.popupPlugin.popup(b.getId(),b.getTitle(),b.getContent(),b.getPosition())}},{protocol:["Oskari.mapframework.core.RequestHandler"]});Oskari.clazz.define("Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequest",function(a){this._creator=null;this._id=a},{__name:"InfoBox.HideInfoBoxRequest",getName:function(){return this.__name},getId:function(){return this._id}},{protocol:["Oskari.mapframework.request.Request"]});Oskari.clazz.define("Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequestHandler",function(a){this.popupPlugin=a},{handleRequest:function(a,b){this.popupPlugin.close(b.getId())}},{protocol:["Oskari.mapframework.core.RequestHandler"]});