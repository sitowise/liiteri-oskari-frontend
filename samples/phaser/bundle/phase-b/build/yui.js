/* This is a packed Oskari bundle (bundle script version Wed Nov 30 2011 14:02:48 GMT+0200 (Suomen normaaliaika)) */ 
Proj4js.defs["EPSG:3067"]="+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs";Proj4js.defs["EPSG:4326"]="+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";Ext.define("Ext.app.PortalColumn",{extend:"Ext.container.Container",alias:"widget.portalcolumn",layout:{type:"anchor"},defaultType:"portlet",cls:"x-portal-column",autoHeight:true});Ext.define("Ext.app.PortalPanel",{extend:"Ext.panel.Panel",alias:"widget.portalpanel",requires:["Ext.layout.component.Body"],cls:"x-portal",bodyCls:"x-portal-body",defaultType:"portalcolumn",componentLayout:"body",autoScroll:true,initComponent:function(){var a=this;this.layout={type:"column"};this.callParent();this.addEvents({validatedrop:true,beforedragover:true,dragover:true,beforedrop:true,drop:true});this.on("drop",this.doLayout,this)},beforeLayout:function(){var b=this.layout.getLayoutItems(),a=b.length,c=0,d;for(;c<a;c++){d=b[c];d.columnWidth=1/a;d.removeCls(["x-portal-column-first","x-portal-column-last"])}b[0].addCls("x-portal-column-first");b[a-1].addCls("x-portal-column-last");return this.callParent(arguments)},initEvents:function(){this.callParent();this.dd=Ext.create("Ext.app.PortalDropZone",this,this.dropConfig)},beforeDestroy:function(){if(this.dd){this.dd.unreg()}Ext.app.PortalPanel.superclass.beforeDestroy.call(this)}});Ext.define("Ext.app.PortalDropZone",{extend:"Ext.dd.DropTarget",constructor:function(a,b){this.portal=a;Ext.dd.ScrollManager.register(a.body);Ext.app.PortalDropZone.superclass.constructor.call(this,a.body,b);a.body.ddScrollConfig=this.ddScrollConfig},ddScrollConfig:{vthresh:50,hthresh:-1,animate:true,increment:200},createEvent:function(a,f,d,b,h,g){return{portal:this.portal,panel:d.panel,columnIndex:b,column:h,position:g,data:d,source:a,rawEvent:f,status:this.dropAllowed}},notifyOver:function(u,t,v){var d=t.getXY(),a=this.portal,p=u.proxy;if(!this.grid){this.grid=this.getGrid()}var b=a.body.dom.clientWidth;if(!this.lastCW){this.lastCW=b}else{if(this.lastCW!=b){this.lastCW=b;this.grid=this.getGrid()}}var o=0,c=0,n=this.grid.columnX,q=n.length,m=false;for(q;o<q;o++){c=n[o].x+n[o].w;if(d[0]<c){m=true;break}}if(!m){o--}var i,g=0,r=0,l=false,k=a.items.getAt(o),s=k.items.items,j=false;q=s.length;for(q;g<q;g++){i=s[g];r=i.el.getHeight();if(r===0){j=true}else{if((i.el.getY()+(r/2))>d[1]){l=true;break}}}g=(l&&i?g:k.items.getCount())+(j?-1:0);var f=this.createEvent(u,t,v,o,k,g);if(a.fireEvent("validatedrop",f)!==false&&a.fireEvent("beforedragover",f)!==false){p.getProxy().setWidth("auto");if(i){p.moveProxy(i.el.dom.parentNode,l?i.el.dom:null)}else{p.moveProxy(k.el.dom,null)}this.lastPos={c:k,col:o,p:j||(l&&i)?g:false};this.scrollPos=a.body.getScroll();a.fireEvent("dragover",f);return f.status}else{return f.status}},notifyOut:function(){delete this.grid},notifyDrop:function(l,h,g){delete this.grid;if(!this.lastPos){return}var j=this.lastPos.c,f=this.lastPos.col,k=this.lastPos.p,a=l.panel,b=this.createEvent(l,h,g,f,j,k!==false?k:j.items.getCount());if(this.portal.fireEvent("validatedrop",b)!==false&&this.portal.fireEvent("beforedrop",b)!==false){a.el.dom.style.display="";if(k!==false){j.insert(k,a)}else{j.add(a)}l.proxy.hide();this.portal.fireEvent("drop",b);var m=this.scrollPos.top;if(m){var i=this.portal.body.dom;setTimeout(function(){i.scrollTop=m},10)}}delete this.lastPos;return true},getGrid:function(){var a=this.portal.body.getBox();a.columnX=[];this.portal.items.each(function(b){a.columnX.push({x:b.el.getX(),w:b.el.getWidth()})});return a},unreg:function(){Ext.dd.ScrollManager.unregister(this.portal.body);Ext.app.PortalDropZone.superclass.unreg.call(this)}});Ext.define("Ext.app.Portlet",{extend:"Ext.panel.Panel",alias:"widget.portlet",layout:"fit",anchor:"100%",frame:true,closable:true,collapsible:true,animCollapse:true,draggable:true,cls:"x-portlet",doClose:function(){this.el.animate({opacity:0,callback:function(){this.fireEvent("close",this);this[this.closeAction]()},scope:this})}});Ext.define("Ext.ux.statusbar.StatusBar",{extend:"Ext.toolbar.Toolbar",alternateClassName:"Ext.ux.StatusBar",alias:"widget.statusbar",requires:["Ext.toolbar.TextItem"],cls:"x-statusbar",busyIconCls:"x-status-busy",busyText:"Loading...",autoClear:5000,emptyText:"&nbsp;",activeThreadId:0,initComponent:function(){if(this.statusAlign==="right"){this.cls+=" x-status-right"}this.callParent(arguments)},afterRender:function(){this.callParent(arguments);var a=this.statusAlign==="right";this.currIconCls=this.iconCls||this.defaultIconCls;this.statusEl=Ext.create("Ext.toolbar.TextItem",{cls:"x-status-text "+(this.currIconCls||""),text:this.text||this.defaultText||""});if(a){this.add("->");this.add(this.statusEl)}else{this.insert(0,this.statusEl);this.insert(1,"->")}this.height=27;this.doLayout()},setStatus:function(d){d=d||{};if(Ext.isString(d)){d={text:d}}if(d.text!==undefined){this.setText(d.text)}if(d.iconCls!==undefined){this.setIcon(d.iconCls)}if(d.clear){var e=d.clear,b=this.autoClear,a={useDefaults:true,anim:true};if(Ext.isObject(e)){e=Ext.applyIf(e,a);if(e.wait){b=e.wait}}else{if(Ext.isNumber(e)){b=e;e=a}else{if(Ext.isBoolean(e)){e=a}}}e.threadId=this.activeThreadId;Ext.defer(this.clearStatus,b,this,[e])}this.doLayout();return this},clearStatus:function(c){c=c||{};if(c.threadId&&c.threadId!==this.activeThreadId){return this}var b=c.useDefaults?this.defaultText:this.emptyText,a=c.useDefaults?(this.defaultIconCls?this.defaultIconCls:""):"";if(c.anim){this.statusEl.el.puff({remove:false,useDisplay:true,scope:this,callback:function(){this.setStatus({text:b,iconCls:a});this.statusEl.el.show()}})}else{this.statusEl.hide();this.setStatus({text:b,iconCls:a});this.statusEl.show()}this.doLayout();return this},setText:function(a){this.activeThreadId++;this.text=a||"";if(this.rendered){this.statusEl.setText(this.text)}return this},getText:function(){return this.text},setIcon:function(a){this.activeThreadId++;a=a||"";if(this.rendered){if(this.currIconCls){this.statusEl.removeCls(this.currIconCls);this.currIconCls=null}if(a.length>0){this.statusEl.addCls(a);this.currIconCls=a}}else{this.currIconCls=a}return this},showBusy:function(a){if(Ext.isString(a)){a={text:a}}a=Ext.applyIf(a||{},{text:this.busyText,iconCls:this.busyIconCls});return this.setStatus(a)}});Ext.define("Ext.ux.data.PagingMemoryProxy",{extend:"Ext.data.proxy.Memory",alias:"proxy.pagingmemory",alternateClassName:"Ext.data.PagingMemoryProxy",read:function(c,g,h){var d=this.getReader(),i=d.read(this.data),e,a,f,b;h=h||this;a=c.filters;if(a.length>0){b=[];Ext.each(i.records,function(j){var o=true,p=a.length,k;for(k=0;k<p;k++){var n=a[k],m=n.filterFn,l=n.scope;o=o&&m.call(l,j)}if(o){b.push(j)}},this);i.records=b;i.totalRecords=i.total=b.length}e=c.sorters;if(e.length>0){f=function(l,k){var j=e[0].sort(l,k),n=e.length,m;for(m=1;m<n;m++){j=j||e[m].sort.call(this,l,k)}return j};i.records.sort(f)}if(c.start!==undefined&&c.limit!==undefined){i.records=i.records.slice(c.start,c.start+c.limit);i.count=i.records.length}Ext.apply(c,{resultSet:i});c.setCompleted();c.setSuccessful();Ext.Function.defer(function(){Ext.callback(g,h,[c])},10)}});Oskari.clazz.define("Oskari.framework.all.Sample",function(){},{start:function(b){var a={title:"Map",fi:"Map",sv:"?",en:"Map",bundlename:"startup",bundleinstancename:"startup",metadata:{"Import-Bundle":{domain:{bundlePath:"bundle/"},"core-base":{bundlePath:"bundle/"},"core-map":{bundlePath:"bundle/"},"core-map-full":{bundlePath:"bundle/"},"sandbox-base":{bundlePath:"bundle/"},"sandbox-map":{bundlePath:"bundle/"},"event-base":{bundlePath:"bundle/"},"event-map":{bundlePath:"bundle/"},"event-map-layer":{bundlePath:"bundle/"},"event-map-full":{bundlePath:"bundle/"},"request-base":{bundlePath:"bundle/"},"request-map":{bundlePath:"bundle/"},"request-map-layer":{bundlePath:"bundle/"},"request-map-full":{bundlePath:"bundle/"},"service-base":{bundlePath:"bundle/"},"service-map":{bundlePath:"bundle/"},"service-map-full":{bundlePath:"bundle/"},common:{bundlePath:"bundle/"},layerhandler:{bundlePath:"bundle/"},layerselection:{bundlePath:"bundle/"},layerselector:{bundlePath:"bundle/"},mapasker:{bundlePath:"bundle/"},mapcontrols:{bundlePath:"bundle/"},"mapmodule-plugin":{bundlePath:"bundle/"},mapoverlaypopup:{bundlePath:"bundle/"},mapposition:{bundlePath:"bundle/"},mapprint:{bundlePath:"bundle/"},mapster:{bundlePath:"bundle/"},myplaces:{bundlePath:"bundle/"},runtime:{bundlePath:"bundle/"},yui:{bundlePath:"../tools/bundle/"},startup:{bundlePath:"bundle/"}},"Require-Bundle-Instance":[]},instanceProps:{}};Oskari.bundle_facade.playBundle(a,function(){if(Oskari.getLoaderMode()=="dev"){var c=Oskari.clazz.create("Oskari.tools.Yui");var d=c.yui_command_line_for_app("%YUICOMPRESSOR%");document.write('<body><pre style="font: 9pt Verdana;">'+d+"</pre></body>")}else{document.write('<body><pre style="font: 9pt Verdana;">loaded packed versions created with '+Oskari.getLoaderMode()+"</pre></body>")}})}});