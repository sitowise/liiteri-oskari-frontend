Oskari=(function(){var bundle_locale=function(){this.lang=null;this.localizations={}};bundle_locale.prototype={setLocalization:function(lang,key,value){if(!this.localizations[lang]){this.localizations[lang]={}}this.localizations[lang][key]=value},setLang:function(lang){this.lang=lang},getLang:function(){return this.lang},getLocalization:function(key){return this.localizations[this.lang][key]}};var blocale=new bundle_locale();var supportBundleAsync=false;var mode="dev";var instTs=new Date().getTime();var basePathForBundles=null;var pathBuilders={"default":function(fn,bpath){if(basePathForBundles){return basePathForBundles+fn}return fn},dev:function(fn,bpath){if(basePathForBundles){return basePathForBundles+fn+"?ts="+instTs}return fn+"?ts="+instTs}};function buildPathForLoaderMode(fn,bpath){var pathBuilder=pathBuilders[mode];if(!pathBuilder){if(basePathForBundles){return basePathForBundles+fn}return fn}return pathBuilder(fn,bpath)}var isNotPackMode={dev:true,"default":true,"static":true};function isPackedMode(){return !isNotPackMode[mode]}var _preloaded=false;function preloaded(){return _preloaded}function buildPathForPackedMode(bpath){return bpath+"/build/"+mode+".js"}function buildBundlePathForPackedMode(bpath){return bpath+"/build/bundle-"+mode+".js"}function buildLocalePathForPackedMode(bpath){return bpath+"/build/"+mode+"-locale-"+blocale.getLang()+".js"}var clazzadapter=function(i,md){this.impl=i;for(p in md){this[p]=md[p]}};clazzadapter.prototype={define:function(){throw"define not supported for this adapter "+this.impl},category:function(){throw"category not supported for this adapter "+this.impl},create:function(){throw"create not supported for this adapter "+this.impl},construct:function(){throw"construct not supported for this adapter "+this.impl},global:function(){throw"global not supported for this adapter "+this.impl},metadata:function(){throw"metadata not supported for this adapter "+this.impl},protocol:function(){throw"protocol not supported for this adapter "+this.impl}};var clazzdef=function(){this.packages={};this.protocols={};this.clazzcache={}};var nativeadapter=new clazzadapter(new clazzdef(),{protocol:function(){var args=arguments;if(args.length==0){throw"missing arguments"}return this.impl.protocols[args[0]]},metadata:function(){var args=arguments;if(args.length==0){throw"missing arguments"}var cdef=args[0];var pdefsp=this.impl.clazzcache[cdef];var bp=null;var pp=null;var sp=null;if(!pdefsp){var parts=cdef.split(".");bp=parts[0];pp=parts[1];sp=parts.slice(2).join(".");var pdef=this.impl.packages[pp];if(!pdef){pdef={};this.impl.packages[pp]=pdef}pdefsp=pdef[sp];this.impl.clazzcache[cdef]=pdefsp}if(!pdefsp){throw"clazz "+sp+" does not exist in package "+pp+" bundle "+bp}return pdefsp._metadata},updateMetadata:function(bp,pp,sp,pdefsp,classMeta){if(!pdefsp._metadata){pdefsp._metadata={}}pdefsp._metadata.meta=classMeta;var protocols=classMeta.protocol;if(protocols){for(var p=0;p<protocols.length;p++){var pt=protocols[p];if(!this.impl.protocols[pt]){this.impl.protocols[pt]={}}var cn=bp+"."+pp+"."+sp;this.impl.protocols[pt][cn]=pdefsp}}},compatibility:function(bp,pp,sp,pdefsp){return;var gpp=window[pp];if(!gpp){gpp={};window[pp]=gpp}var ctx=gpp;var sps=sp.split(".");for(var s=0;s<sps.length-1;s++){var spname=sps[s];var gsp=ctx[spname];if(!gsp){gsp={};ctx[spname]=gsp}ctx=gsp}var me=this;var ctxFunc=function(){return me.applyCompatClass(this,bp,pp,sp,arguments)};ctxFunc.prototype=pdefsp._class.prototype;ctx[sps[sps.length-1]]=ctxFunc},applyCompatClass:function(inst,bp,pp,sp,instargs){try{var pdefsp=null;var pdef=this.impl.packages[pp];if(!pdef){pdef={};this.impl.packages[pp]=pdef}pdefsp=pdef[sp];if(!pdefsp){throw"clazz "+sp+" does not exist in package "+pp+" bundle "+bp}pdefsp._constructor.apply(inst,instargs);return inst}catch(err){}},define:function(){var args=arguments;if(args.length==0){throw"missing arguments"}var cdef=args[0];var parts=cdef.split(".");var bp=parts[0];var pp=parts[1];var sp=parts.slice(2).join(".");var pdef=this.impl.packages[pp];if(!pdef){pdef={};this.impl.packages[pp]=pdef}var pdefsp=pdef[sp];
if(pdefsp){pdefsp._constructor=args[1];var catFuncs=args[2];var prot=pdefsp._class.prototype;for(p in catFuncs){var pi=catFuncs[p];prot[p]=pi}return pdefsp}var cd=function(){};cd.prototype=args[2];pdefsp={_class:cd,_constructor:args[1]};pdef[sp]=pdefsp;this.compatibility(bp,pp,sp,pdefsp);if(args.length>3){this.updateMetadata(bp,pp,sp,pdefsp,args[3])}return pdefsp},category:function(){var args=arguments;if(args.length==0){throw"missing arguments"}var cdef=args[0];var parts=cdef.split(".");var bp=parts[0];var pp=parts[1];var sp=parts.slice(2).join(".");var pdef=this.impl.packages[pp];if(!pdef){pdef={};this.impl.packages[pp]=pdef}var pdefsp=pdef[sp];if(!pdefsp){var cd=function(){};cd.prototype={};pdefsp={_class:cd,_constructor:args[1]};pdef[sp]=pdefsp;this.compatibility(bp,pp,sp,pdefsp)}var catName=args[1];var catFuncs=args[2];var prot=pdefsp._class.prototype;for(p in catFuncs){var pi=catFuncs[p];prot[p]=pi}if(!pdefsp._category){pdefsp._category={}}pdefsp._category[catName]=true},create:function(){var args=arguments;if(args.length==0){throw"missing arguments"}var instargs=[];for(var n=1;n<args.length;n++){instargs.push(args[n])}var cdef=args[0];var pdefsp=this.impl.clazzcache[cdef];var bp=null;var pp=null;var sp=null;if(!pdefsp){var parts=cdef.split(".");bp=parts[0];pp=parts[1];sp=parts.slice(2).join(".");var pdef=this.impl.packages[pp];if(!pdef){pdef={};this.impl.packages[pp]=pdef}pdefsp=pdef[sp];this.impl.clazzcache[cdef]=pdefsp}if(!pdefsp){throw"clazz "+sp+" does not exist in package "+pp+" bundle "+bp}var inst=new pdefsp._class();pdefsp._constructor.apply(inst,instargs);return inst},construct:function(){var args=arguments;if(args.length!=2){throw"missing arguments"}var cdef=args[0];var instprops=args[1];var pdefsp=this.impl.clazzcache[cdef];var bp=null;var pp=null;var sp=null;if(!pdefsp){var parts=cdef.split(".");bp=parts[0];pp=parts[1];sp=parts.slice(2).join(".");var pdef=this.impl.packages[pp];if(!pdef){pdef={};this.impl.packages[pp]=pdef}pdefsp=pdef[sp];this.impl.clazzcache[cdef]=pdefsp}if(!pdefsp){throw"clazz "+sp+" does not exist in package "+pp+" bundle "+bp}var inst=new pdefsp._class();pdefsp._constructor.apply(inst,[instprops]);return inst},builder:function(){var args=arguments;if(args.length==0){throw"missing arguments"}var cdef=args[0];var pdefsp=this.impl.clazzcache[cdef];var bp=null;var pp=null;var sp=null;if(!pdefsp){var parts=cdef.split(".");bp=parts[0];pp=parts[1];sp=parts.slice(2).join(".");var pdef=this.impl.packages[pp];if(!pdef){pdef={};this.impl.packages[pp]=pdef}pdefsp=pdef[sp];this.impl.clazzcache[cdef]=pdefsp}if(!pdefsp){throw"clazz "+sp+" does not exist in package "+pp+" bundle "+bp}if(pdefsp._builder){return pdefsp._builder}pdefsp._builder=function(){var instargs=arguments;var inst=new pdefsp._class();pdefsp._constructor.apply(inst,instargs);return inst};return pdefsp._builder}});var clazz=function(){this.ns={};this.alias={};this.globals={}};clazz.prototype={self:function(bp){var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.self},adapt:function(base,adapter){this.ns[base]=adapter},define:function(){var args=arguments;if(args.length==0||!args[0]){return this.ns}var parts=args[0].split(".");var bp=parts[0];var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.define.apply(ai,arguments)},category:function(){var args=arguments;if(args.length==0||!args[0]){return this.ns}var parts=args[0].split(".");var bp=parts[0];var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.category.apply(ai,arguments)},create:function(){var args=arguments;var parts=args[0].split(".");var bp=parts[0];var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.create.apply(ai,arguments)},construct:function(){var args=arguments;if(!args[0]){alert("construct() got null args[0]! ignoring...");return}var parts=args[0].split(".");var bp=parts[0];var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.construct.apply(ai,arguments)},createArrArgs:function(args){if(!args[0]){alert("createArrArgs got null args[0]! ignoring...");return}var parts=args[0].split(".");var bp=parts[0];
var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.create.apply(ai,args)},builder:function(){var args=arguments;if(!arguments||!arguments[0]){for(var argid in arguments){alert(argid+" : "+arguments[argid])}alert("builder : "+arguments)}if(!args[0]){alert("builder got null args[0]! ignoring...");return}var parts=args[0].split(".");var bp=parts[0];var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.builder.apply(ai,arguments)},global:function(){if(arguments.length==0){return this.globals}var name=arguments[0];if(arguments.length==2){this.globals[name]=arguments[1]}return this.globals[name]},metadata:function(){var args=arguments;if(!args[0]){alert("metadata got null args[0]! ignoring...");return}var parts=args[0].split(".");var bp=parts[0];var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.metadata.apply(ai,arguments)},protocol:function(){var args=arguments;if(!args[0]){alert("protocol got null args[0]! ignoring...");return}var parts=args[0].split(".");var bp=parts[0];var ai=this.ns[bp];if(!ai){throw"clazz: ns NOT bound "+bp}return ai.protocol.apply(ai,arguments)}};clazz.prototype.singleton=new clazz();clazz.prototype.singleton.adapt("Oskari",nativeadapter);var bundle_loader_id=0;var bundle_loader=function(manager,cb){this.loader_identifier=++bundle_loader_id;this.manager=manager;this.callback=cb;this.filesRequested=0;this.filesLoaded=0;this.files={};this.fileList=[];this.metadata={}};bundle_loader.prototype={add:function(fn){var me=this;if(!me.files[fn]){var def={src:fn,state:false};me.files[fn]=def;me.filesRequested++;me.fileList.push(def)}},getState:function(){if(this.filesRequested==0){return 1}return(this.filesLoaded/this.filesRequested)},commit:function(){var head=document.getElementsByTagName("head")[0];var fragment=document.createDocumentFragment();var me=this;var numFiles=this.filesRequested;if(numFiles==0){me.callback();return}var onFileLoaded=function(){me.filesLoaded++;me.manager.log("Files loaded "+me.filesLoaded+"/"+me.filesRequested);if(numFiles==me.filesLoaded){me.callback();me.manager.notifyLoaderStateChanged(me,true)}else{me.manager.notifyLoaderStateChanged(me,false)}};var f=false;for(var n=0;n<me.fileList.length;n++){var fn=me.fileList[n].src;var st=me.buildScriptTag(fn,onFileLoaded);if(st){if(preloaded()){onFileLoaded()}else{fragment.appendChild(st);f=true}}}if(f){head.appendChild(fragment)}},buildScriptTag:function(filename,callback){var me=this;var script=document.createElement("script");script.type="text/javascript";script.charset="utf-8";if(preloaded()){script.src="/Oskari/empty.js"}else{script.src=filename}if(script.readyState){script.onreadystatechange=function(){if(script.readyState=="loaded"||script.readyState=="complete"){script.onreadystatechange=null;callback()}}}else{script.onload=callback}return script}};var bundle_mediator=function(opts){this.manager=null;for(p in opts){this[p]=opts[p]}};bundle_mediator.prototype={setState:function(state){this.state=state;this.manager.postChange(this.bundle,this.instance,this.state);return this.state},getState:function(){return this.state},processRequest:function(requestJson){var reqm=this.requestMediator[requestJson.name];reqm.dispatchRequest(requestJson)},postRequest:function(requestJson,callback){var reqm=this.requestMediator[requestJson.name];setTimeout(function(){reqm.dispatchRequest(requestJson);callback()},0)},dispatchRequest:function(requestJson){var bi=this["instance"];return(bi.onRequest[requestJson.name]||bi.onRequest["*"]).apply(bi,requestJson.args)},dispatchEvent:function(event){var bi=this["instance"];bi.onEvent[event].apply(bi,[event])}};var bundle_trigger=function(btc,cb,info){this.config=btc;this.callback=cb;this.fired=false;this.info=info};bundle_trigger.prototype={execute:function(manager,b,bi,info){var me=this;if(me.fired){manager.log("trigger already fired "+info||this.info);return}for(p in me.config["Import-Bundle"]){var srcState=manager.stateForBundleSources[p];if(!srcState||srcState.state!=1){manager.log("trigger not fired due "+p+" for "+info||this.info);return}}me.fired=true;manager.log("posting trigger");
var cb=this.callback;window.setTimeout(function(){cb(manager)},0)}};var bundle_manager=function(){this.serial=0;this.impls={};this.sources={};this.instances={};this.bundles={};this.stateForBundleDefinitions={};this.stateForBundleSources={};this.stateForBundles={};this.stateForBundleInstances={};this.stateForPackages={sources:{},sinks:{}};this.stateForEvents={sources:{},sinks:{}};this.stateForRequests={sinks:{},sources:{}};this.triggers=[];this.loaderStateListeners=[]};bundle_manager.prototype={notifyLoaderStateChanged:function(bl,finished){if(this.loaderStateListeners.length==0){return}for(var l=0;l<this.loaderStateListeners.length;l++){var cb=this.loaderStateListeners[l];cb(bl,finished)}},registerLoaderStateListener:function(cb){this.loaderStateListeners.push(cb)},alert:function(what){if(mode!="dev"){return}if(window.console&&window.console.debug){window.console.debug(what)}},log:function(what){if(mode!="dev"){return}if(window.console&&window.console.debug){window.console.debug(what)}},loadCss:function(sScriptSrc,oCallback){this.log("loading CSS "+sScriptSrc);var h=document.getElementsByTagName("head").length?document.getElementsByTagName("head")[0]:document.body;var fn=sScriptSrc;var s=document.createElement("link");s.type="text/css";s.rel="stylesheet";s.href=fn;h.appendChild(s)},self:function(){return this},install:function(implid,bp,srcs,metadata){var me=this;var bundleImpl=implid;var defState=me.stateForBundleDefinitions[bundleImpl];if(defState){defState.state=1;me.log("SETTING STATE FOR BUNDLEDEF "+bundleImpl+" existing state to "+defState.state)}else{defState={state:1};me.stateForBundleDefinitions[bundleImpl]=defState;me.log("SETTING STATE FOR BUNDLEDEF "+bundleImpl+" NEW state to "+defState.state)}defState.metadata=metadata;me.impls[bundleImpl]=bp;me.sources[bundleImpl]=srcs;var srcState=me.stateForBundleSources[bundleImpl];if(srcState){if(srcState.state==-1){me.log("triggering loadBundleSources for "+bundleImpl+" at loadBundleDefinition");window.setTimeout(function(){me.loadBundleSources(bundleImpl)},0)}else{me.log("source state for "+bundleImpl+" at loadBundleDefinition is "+srcState.state)}}me.postChange(null,null,"bundle_definition_loaded")},installBundleClass:function(implid,clazzName){var cs=clazz.prototype.singleton;var classmeta=cs.metadata(clazzName);var bp=cs.builder(clazzName);var srcs=classmeta.meta.source;var bundleMetadata=classmeta.meta.bundle;this.install(implid,bp,srcs,bundleMetadata)},impl:function(implid){return this.impls[implid]},loadBundleDefinition:function(implid,bundleSrc,pbundlePath){var me=this;var bundleImpl=implid;me.log("loadBundleDefinition called with "+bundleImpl);var defState=me.stateForBundleDefinitions[bundleImpl];if(defState){if(defState.state==1){me.log("bundle definition already loaded for "+bundleImpl);me.postChange(null,null,"bundle_definition_loaded");return}else{me.log("bundle definition already loaded OR WHAT?"+bundleImpl+" "+defState.state);return}}else{defState={state:-1};me.stateForBundleDefinitions[bundleImpl]=defState;me.log("set NEW state for DEFINITION "+bundleImpl+" to "+defState.state)}defState.bundleSrcPath=bundleSrc;var bundlePath=pbundlePath||(bundleSrc.substring(0,bundleSrc.lastIndexOf("/")));defState.bundlePath=bundlePath;var bl=new bundle_loader(this,function(){me.log("bundle_def_loaded_callback")});bl.metadata.context="bundleDefinition";defState.loader=bl;bl.add(bundleSrc);bl.commit()},loadBundleSources:function(implid){var me=this;var bundleImpl=implid;me.log("loadBundleSources called with "+bundleImpl);var defState=me.stateForBundleDefinitions[bundleImpl];if(!defState){throw"INVALID_STATE: bundle definition load not requested for "+bundleImpl}if(defState){me.log("- definition STATE for "+bundleImpl+" at load sources "+defState.state)}if(mode=="static"){me.postChange(null,null,"bundle_definition_loaded");return}var srcState=me.stateForBundleSources[bundleImpl];if(srcState){if(srcState.state==1){me.log("already loaded sources for : "+bundleImpl);return}else{if(srcState.state==-1){me.log("loading previously pending sources for "+bundleImpl+" "+srcState.state+" or what?")
}else{throw"INVALID_STATE: at "+bundleImpl;return}}}else{srcState={state:-1};me.stateForBundleSources[bundleImpl]=srcState;me.log("setting STATE for sources "+bundleImpl+" to "+srcState.state)}if(defState.state!=1){me.log("pending DEFINITION at sources for "+bundleImpl+" to "+defState.state+" -> postponed");return}me.log("STARTING load for sources "+bundleImpl);var srcFiles={count:0,loaded:0,files:{},css:{}};var me=this;var callback=function(){me.log("finished loading "+srcFiles.count+" files for "+bundleImpl+".");me.stateForBundleSources[bundleImpl].state=1;me.log("set NEW state post source load for "+bundleImpl+" to "+me.stateForBundleSources[bundleImpl].state);me.postChange(null,null,"bundle_sources_loaded")};var bundlePath=defState.bundlePath;var srcs=me.sources[bundleImpl];if(srcs){me.log("got sources for "+bundleImpl);for(p in srcs){if(p=="scripts"){var defs=srcs[p];for(var n=0;n<defs.length;n++){var def=defs[n];if(def.type=="text/javascript"){srcFiles.count++;var fn=buildPathForLoaderMode(def.src,bundlePath);var fnWithPath=null;if(fn.indexOf("http")!=-1){fnWithPath=fn}else{fnWithPath=bundlePath+"/"+fn}srcFiles.files[fnWithPath]=def}else{if(def.type=="text/css"){var fn=def.src;var fnWithPath=null;if(fn.indexOf("http")!=-1){fnWithPath=fn}else{fnWithPath=bundlePath+"/"+fn}srcFiles.css[fnWithPath]=def}}}}else{if(p=="locales"){var requiredLocale=blocale.getLang();var defs=srcs[p];for(var n=0;n<defs.length;n++){var def=defs[n];if(requiredLocale&&def.lang&&def.lang!=requiredLocale){continue}if(def.type=="text/javascript"){srcFiles.count++;var fn=buildPathForLoaderMode(def.src,bundlePath);var fnWithPath=null;if(fn.indexOf("http")!=-1){fnWithPath=fn}else{fnWithPath=bundlePath+"/"+fn}srcFiles.files[fnWithPath]=def}else{if(def.type=="text/css"){var fn=def.src;var fnWithPath=null;if(fn.indexOf("http")!=-1){fnWithPath=fn}else{fnWithPath=bundlePath+"/"+fn}srcFiles.css[fnWithPath]=def}}}}}}}else{me.log("NO sources for "+bundleImpl)}for(src in srcFiles.css){var defSrc=src;var fn=buildPathForLoaderMode(defSrc,bundlePath);me.loadCss(fn,callback);me.log("- added css source "+fn+" for "+bundleImpl)}var bl=new bundle_loader(this,callback);bl.metadata.context="bundleSources";bl.metadata.bundleImpl=bundleImpl;srcState.loader=bl;if(isPackedMode()){var fileCount=0;for(js in srcFiles.files){fileCount++}if(fileCount>0){var srcsFn=buildPathForPackedMode(bundlePath);bl.add(srcsFn);me.log("- added PACKED javascript source "+srcsFn+" for "+bundleImpl);var localesFn=buildLocalePathForPackedMode(bundlePath);bl.add(localesFn);me.log("- added PACKED locale javascript source "+localesFn+" for "+bundleImpl)}}else{for(js in srcFiles.files){bl.add(js);me.log("- added javascript source "+js+" for "+bundleImpl)}}bl.commit()},postChange:function(b,bi,info){var me=this;me.update(b,bi,info);for(bid in me.bundles){var o=me.bundles[bid];o.update(me,b,bi,info)}for(i in me.instances){var o=me.instances[i];if(!o){continue}o.update(me,b,bi,info)}},createBundle:function(implid,bundleid){var bundlImpl=implid;var me=this;var defState=me.stateForBundleDefinitions[bundlImpl];if(!defState){throw"INVALID_STATE: for createBundle / definition not loaded "+implid+"/"+bundleid}var bp=this.impls[implid];if(!bp){alert("this.impls["+implid+"] is null!");return}var b=bp(defState);this.bundles[bundleid]=b;this.stateForBundles[bundleid]={state:true,bundlImpl:bundlImpl};this.postChange(b,null,"bundle_created");return b},bindImportedPackages:function(){},bindImportedNamespaces:function(){},bindImportedEvents:function(){},bindExportedPackages:function(){},bindExportedNamespaces:function(){},bindExportedRequests:function(){},update:function(b,bi,info){var me=this;me.log("update called with info "+info);for(var n=0;n<me.triggers.length;n++){var t=me.triggers[n];t.execute(me)}},bundle:function(bundleid){return this.bundles[bundleid]},destroyBundle:function(bundleid){},uninstall:function(implid){var bp=this.impls[implid];return bp},createInstance:function(bundleid){var me=this;if(!me.stateForBundles[bundleid]||!me.stateForBundles[bundleid].state){throw"INVALID_STATE: for createInstance / definition not loaded "+bundleid
}var s=""+(++this.serial);var b=this.bundles[bundleid];var bi=b.create();bi.mediator=new bundle_mediator({bundleId:bundleid,instanceid:s,state:"initial",bundle:b,instance:bi,manager:this,clazz:clazz.prototype.singleton,requestMediator:{}});this.instances[s]=bi;this.stateForBundleInstances[s]={state:true,bundleid:bundleid};this.postChange(b,bi,"instance_created");return bi},instance:function(instanceid){return this.instances[instanceid]},destroyInstance:function(instanceid){var bi=this.instances[instanceid];var mediator=bi.mediator;mediator.bundle=null;mediator.manager=null;mediator.clazz=null;bi.mediator=null;this.instances[instanceid]=null;bi=null;return bi},on:function(cfg,cb,info){this.triggers.push(new bundle_trigger(cfg,cb,info))}};var bundle_facade=function(bm){this.manager=bm;this.bundles={};this.bundleInstances={};this.bundlePath="../src/mapframework/bundle/";this.appSetup=null;this.appConfig={}};bundle_facade.prototype={getBundleInstanceByName:function(bundleinstancename){var me=this;return me.bundleInstances[bundleinstancename]},getBundleInstanceConfigurationByName:function(bundleinstancename){var me=this;return me.appConfig[bundleinstancename]},requireBundle:function(implid,bundleid,cb){var me=this;var b=me.manager.createBundle(implid,bundleid);cb(me.manager,b)},require:function(config,cb,info){var me=this;me.manager.on(config,cb,info);var imports=config["Import-Bundle"];for(p in imports){var pp=p;var def=imports[p];var bundlePath=def.bundlePath||me.bundlePath;if(isPackedMode()){var packedBundleFn=buildBundlePathForPackedMode(bundlePath+pp);bundleDefFilename=buildPathForLoaderMode(packedBundleFn,bundlePath)}else{bundleDefFilename=buildPathForLoaderMode(bundlePath+pp+"/bundle.js",bundlePath)}me.manager.log("FACADE requesting load for "+pp+" from "+bundleDefFilename);me.manager.loadBundleDefinition(pp,bundleDefFilename,bundlePath+pp);me.manager.loadBundleSources(pp)}},setBundlePath:function(p){this.bundlePath=p},loadBundleDeps:function(deps,callback,manager,info){var me=this;var bdep=deps["Import-Bundle"];var depslist=[];var hasPhase=false;for(p in bdep){var name=p;var def=bdep[p];depslist.push({name:name,def:def,phase:def.phase});hasPhase=hasPhase||def.phase}depslist.sort(function(a,b){if(!a.phase&&!b.phase){return 0}if(!a.phase){return 1}if(!b.phase){return -1}return a.phase<b.phase?-1:1});if(hasPhase||!supportBundleAsync){me.loadBundleDep(depslist,callback,manager,info)}else{me.loadBundleDepAsync(deps,callback,manager,info)}},loadBundleDep:function(depslist,callback,manager,info){var me=this;var bundledef=depslist.pop();if(!bundledef){callback(manager);return}var def=bundledef.def;var bundlename=bundledef.name;var fcd=this;var bdep={"Import-Bundle":{}};bdep["Import-Bundle"][bundlename]=def;fcd.require(bdep,function(manager){me.loadBundleDep(depslist,callback,manager,info)},info)},loadBundleDepAsync:function(deps,callback,manager,info){var me=this;var fcd=this;fcd.require(deps,callback,info)},playBundle:function(recData,cb){var metas=recData.metadata;var bundlename=recData.bundlename;var bundleinstancename=recData.bundleinstancename;var isSingleton=metas.Singleton;var fcd=this;var me=this;var instanceRequirements=metas["Require-Bundle-Instance"]||[];var instanceProps=recData.instanceProps;me.loadBundleDeps(metas,function(manager){for(var r=0;r<instanceRequirements.length;r++){var implInfo=instanceRequirements[r];var implid=(typeof(implInfo)==="object")?implInfo.bundlename:implInfo;var bundleid=(typeof(implInfo)==="object")?implInfo.bundleinstancename:implInfo+"Instance";var b=me.bundles[implid];if(!b){b=manager.createBundle(implid,bundleid);me.bundles[implid]=b}var bi=me.bundleInstances[bundleid];if(!bi||!isSingleton){bi=manager.createInstance(bundleid);me.bundleInstances[bundleid]=bi;var configProps=me.getBundleInstanceConfigurationByName(bundleid);if(configProps){for(ip in configProps){bi[ip]=configProps[ip]}}bi.start()}}fcd.requireBundle(bundlename,bundleinstancename,function(){var yy=manager.createInstance(bundleinstancename);for(ip in instanceProps){yy[ip]=instanceProps[ip]}var configProps=me.getBundleInstanceConfigurationByName(bundleinstancename);
if(configProps){for(ip in configProps){yy[ip]=configProps[ip]}}yy.start();me.bundleInstances[bundleinstancename]=yy;cb(yy)})},fcd.manager,bundlename)},setApplicationSetup:function(setup){this.appSetup=setup},getApplicationSetup:function(){return this.appSetup},setConfiguration:function(config){this.appConfig=config},getConfiguration:function(){return this.appConfig},startApplication:function(cb){var me=this;var appSetup=this.appSetup;var appConfig=this.appConfig;var seq=this.appSetup.startupSequence.slice(0);var seqLen=seq.length;var startupInfo={bundlesInstanceConfigurations:appConfig,bundlesInstanceInfos:{}};var mediator={facade:me,seq:seq,bndl:null,player:null,startupInfo:startupInfo,};function schedule(){window.setTimeout(mediator.player,0)}mediator.player=function(){mediator.bndl=mediator.seq.shift();if(mediator.bndl==null){if(cb){cb(startupInfo)}return}mediator.facade.playBundle(mediator.bndl,function(bi){var bndlName=mediator.bndl.bundlename;var bndlInstanceName=mediator.bndl.bundleinstancename;mediator.startupInfo.bundlesInstanceInfos[bndlInstanceName]={bundlename:bndlName,bundleinstancename:bndlInstanceName,bundleInstance:bi};if(mediator.bndl.callback){if(typeof mediator.bndl.callback==="string"){eval(mediator.bndl.callback)}mediator.bndl.callback.apply(this,[bi,bndl])}schedule()})};schedule()},stopApplication:function(){throw"NYI"}};var cs=clazz.prototype.singleton;var bm=new bundle_manager();bm.clazz=cs;var fcd=new bundle_facade(bm);var ga=cs.global;var bndl={bundle_manager:bm,bundle_facade:fcd,bundle_locale:blocale,app:fcd,clazz:cs,"$":function(){return ga.apply(cs,arguments)},clazzadapter:clazzadapter,run:function(func){func()},setLoaderMode:function(m){mode=m},getLoaderMode:function(){return mode},setSupportBundleAsync:function(a){supportBundleAsync=a},getSupportBundleAsync:function(){return supportBundleAsync},setBundleBasePath:function(bp){basePathForBundles=bp},getBundleBasePath:function(){return basePathForBundles},setPreloaded:function(usep){_preloaded=usep},registerLocalization:function(props){if(props.length){for(var p=0;p<props.length;p++){var pp=props[p];blocale.setLocalization(pp.lang,pp.key,pp.value)}}else{return blocale.setLocalization(props.lang,props.key,props.value)}},getLocalization:function(key){return blocale.getLocalization(key)},getLang:function(){return blocale.getLang()},setLang:function(lang){return blocale.setLang(lang)}};ga.apply(cs,["Oskari",bndl]);return bndl})();