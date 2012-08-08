/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 11:38:01 GMT+0300 (Suomen kesäaika)) */ 
/*
 * File:        jquery.dataTables.min.js
 * Version:     1.9.0
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Info:        www.datatables.net
 * 
 * Copyright 2008-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
(function(i,aa,k,l){var j=function(e){function o(a,b){var c=j.defaults.columns,d=a.aoColumns.length,c=i.extend({},j.models.oColumn,c,{sSortingClass:a.oClasses.sSortable,sSortingClassJUI:a.oClasses.sSortJUI,nTh:b?b:k.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mDataProp:c.mDataProp?c.oDefaults:d});a.aoColumns.push(c);if(a.aoPreSearchCols[d]===l||null===a.aoPreSearchCols[d])a.aoPreSearchCols[d]=i.extend({},j.models.oSearch);else{c=a.aoPreSearchCols[d];
if(c.bRegex===l)c.bRegex=!0;if(c.bSmart===l)c.bSmart=!0;if(c.bCaseInsensitive===l)c.bCaseInsensitive=!0}E(a,d,null)}function E(a,b,c){b=a.aoColumns[b];if(c!==l&&null!==c){if(c.sType!==l)b.sType=c.sType,b._bAutoType=!1;i.extend(b,c);n(b,c,"sWidth","sWidthOrig");if(c.iDataSort!==l)b.aDataSort=[c.iDataSort];n(b,c,"aDataSort")}b.fnGetData=V(b.mDataProp);b.fnSetData=sa(b.mDataProp);if(!a.oFeatures.bSort)b.bSortable=!1;if(!b.bSortable||-1==i.inArray("asc",b.asSorting)&&-1==i.inArray("desc",b.asSorting))b.sSortingClass=
a.oClasses.sSortableNone,b.sSortingClassJUI="";else if(b.bSortable||-1==i.inArray("asc",b.asSorting)&&-1==i.inArray("desc",b.asSorting))b.sSortingClass=a.oClasses.sSortable,b.sSortingClassJUI=a.oClasses.sSortJUI;else if(-1!=i.inArray("asc",b.asSorting)&&-1==i.inArray("desc",b.asSorting))b.sSortingClass=a.oClasses.sSortableAsc,b.sSortingClassJUI=a.oClasses.sSortJUIAscAllowed;else if(-1==i.inArray("asc",b.asSorting)&&-1!=i.inArray("desc",b.asSorting))b.sSortingClass=a.oClasses.sSortableDesc,b.sSortingClassJUI=
a.oClasses.sSortJUIDescAllowed}function r(a){if(!1===a.oFeatures.bAutoWidth)return!1;ba(a);for(var b=0,c=a.aoColumns.length;b<c;b++)a.aoColumns[b].nTh.style.width=a.aoColumns[b].sWidth}function s(a,b){for(var c=-1,d=0;d<a.aoColumns.length;d++)if(!0===a.aoColumns[d].bVisible&&c++,c==b)return d;return null}function t(a,b){for(var c=-1,d=0;d<a.aoColumns.length;d++)if(!0===a.aoColumns[d].bVisible&&c++,d==b)return!0===a.aoColumns[d].bVisible?c:null;return null}function v(a){for(var b=0,c=0;c<a.aoColumns.length;c++)!0===
a.aoColumns[c].bVisible&&b++;return b}function B(a){for(var b=j.ext.aTypes,c=b.length,d=0;d<c;d++){var f=b[d](a);if(null!==f)return f}return"string"}function D(a,b){for(var c=b.split(","),d=[],f=0,h=a.aoColumns.length;f<h;f++)for(var g=0;g<h;g++)if(a.aoColumns[f].sName==c[g]){d.push(g);break}return d}function x(a){for(var b="",c=0,d=a.aoColumns.length;c<d;c++)b+=a.aoColumns[c].sName+",";return b.length==d?"":b.slice(0,-1)}function I(a,b,c,d){var f,h,g,e,q;if(b)for(f=b.length-1;0<=f;f--){var m=b[f].aTargets;
i.isArray(m)||F(a,1,"aTargets must be an array of targets, not a "+typeof m);for(h=0,g=m.length;h<g;h++)if("number"===typeof m[h]&&0<=m[h]){for(;a.aoColumns.length<=m[h];)o(a);d(m[h],b[f])}else if("number"===typeof m[h]&&0>m[h])d(a.aoColumns.length+m[h],b[f]);else if("string"===typeof m[h])for(e=0,q=a.aoColumns.length;e<q;e++)("_all"==m[h]||i(a.aoColumns[e].nTh).hasClass(m[h]))&&d(e,b[f])}if(c)for(f=0,a=c.length;f<a;f++)d(f,c[f])}function G(a,b){var c;c=i.isArray(b)?b.slice():i.extend(!0,{},b);var d=
a.aoData.length;c=i.extend(!0,{},j.models.oRow,{_aData:c});a.aoData.push(c);for(var f,h=0,g=a.aoColumns.length;h<g;h++)if(c=a.aoColumns[h],"function"===typeof c.fnRender&&c.bUseRendered&&null!==c.mDataProp&&J(a,d,h,R(a,d,h)),c._bAutoType&&"string"!=c.sType&&(f=w(a,d,h,"type"),null!==f&&""!==f))if(f=B(f),null===c.sType)c.sType=f;else if(c.sType!=f&&"html"!=c.sType)c.sType="string";a.aiDisplayMaster.push(d);a.oFeatures.bDeferRender||ca(a,d);return d}function ta(a){var b,c,d,f,h,g,e,q,m;if(a.bDeferLoading||
null===a.sAjaxSource){e=a.nTBody.childNodes;for(b=0,c=e.length;b<c;b++)if("TR"==e[b].nodeName.toUpperCase()){q=a.aoData.length;e[b]._DT_RowIndex=q;a.aoData.push(i.extend(!0,{},j.models.oRow,{nTr:e[b]}));a.aiDisplayMaster.push(q);g=e[b].childNodes;h=0;for(d=0,f=g.length;d<f;d++)if(m=g[d].nodeName.toUpperCase(),"TD"==m||"TH"==m)J(a,q,h,i.trim(g[d].innerHTML)),h++}}e=S(a);g=[];for(b=0,c=e.length;b<c;b++)for(d=0,f=e[b].childNodes.length;d<f;d++)h=e[b].childNodes[d],m=h.nodeName.toUpperCase(),("TD"==m||
"TH"==m)&&g.push(h);for(f=0,e=a.aoColumns.length;f<e;f++){m=a.aoColumns[f];if(null===m.sTitle)m.sTitle=m.nTh.innerHTML;h=m._bAutoType;q="function"===typeof m.fnRender;var o=null!==m.sClass,r=m.bVisible,l,n;if(h||q||o||!r)for(b=0,c=a.aoData.length;b<c;b++){d=a.aoData[b];l=g[b*e+f];if(h&&"string"!=m.sType&&(n=w(a,b,f,"type"),""!==n))if(n=B(n),null===m.sType)m.sType=n;else if(m.sType!=n&&"html"!=m.sType)m.sType="string";if("function"===typeof m.mDataProp)l.innerHTML=w(a,b,f,"display");if(q)n=R(a,b,f),
l.innerHTML=n,m.bUseRendered&&J(a,b,f,n);o&&(l.className+=" "+m.sClass);r?d._anHidden[f]=null:(d._anHidden[f]=l,l.parentNode.removeChild(l));m.fnCreatedCell&&m.fnCreatedCell.call(a.oInstance,l,w(a,b,f,"display"),d._aData,b,f)}}if(0!==a.aoRowCreatedCallback.length)for(b=0,c=a.aoData.length;b<c;b++)d=a.aoData[b],C(a,"aoRowCreatedCallback",null,[d.nTr,d._aData,b])}function K(a,b){return b._DT_RowIndex!==l?b._DT_RowIndex:null}function da(a,b,c){for(var b=L(a,b),d=0,a=a.aoColumns.length;d<a;d++)if(b[d]===
c)return d;return-1}function W(a,b,c){for(var d=[],f=0,h=a.aoColumns.length;f<h;f++)d.push(w(a,b,f,c));return d}function w(a,b,c,d){var f=a.aoColumns[c];if((c=f.fnGetData(a.aoData[b]._aData,d))===l){if(a.iDrawError!=a.iDraw&&null===f.sDefaultContent)F(a,0,"Requested unknown parameter '"+f.mDataProp+"' from the data source for row "+b),a.iDrawError=a.iDraw;return f.sDefaultContent}if(null===c&&null!==f.sDefaultContent)c=f.sDefaultContent;else if("function"===typeof c)return c();return"display"==d&&
null===c?"":c}function J(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d)}function V(a){if(null===a)return function(){return null};if("function"===typeof a)return function(b,d){return a(b,d)};if("string"===typeof a&&-1!=a.indexOf(".")){var b=a.split(".");return function(a){for(var d=0,f=b.length;d<f;d++)if(a=a[b[d]],a===l)return l;return a}}return function(b){return b[a]}}function sa(a){if(null===a)return function(){};if("function"===typeof a)return function(b,d){a(b,"set",d)};if("string"===
typeof a&&-1!=a.indexOf(".")){var b=a.split(".");return function(a,d){for(var f=0,h=b.length-1;f<h;f++)a=a[b[f]];a[b[b.length-1]]=d}}return function(b,d){b[a]=d}}function X(a){for(var b=[],c=a.aoData.length,d=0;d<c;d++)b.push(a.aoData[d]._aData);return b}function ea(a){a.aoData.splice(0,a.aoData.length);a.aiDisplayMaster.splice(0,a.aiDisplayMaster.length);a.aiDisplay.splice(0,a.aiDisplay.length);z(a)}function fa(a,b){for(var c=-1,d=0,f=a.length;d<f;d++)a[d]==b?c=d:a[d]>b&&a[d]--; -1!=c&&a.splice(c,
1)}function R(a,b,c){var d=a.aoColumns[c];return d.fnRender({iDataRow:b,iDataColumn:c,oSettings:a,aData:a.aoData[b]._aData,mDataProp:d.mDataProp},w(a,b,c,"display"))}function ca(a,b){var c=a.aoData[b],d;if(null===c.nTr){c.nTr=k.createElement("tr");c.nTr._DT_RowIndex=b;if(c._aData.DT_RowId)c.nTr.id=c._aData.DT_RowId;c._aData.DT_RowClass&&i(c.nTr).addClass(c._aData.DT_RowClass);for(var f=0,h=a.aoColumns.length;f<h;f++){var g=a.aoColumns[f];d=k.createElement("td");d.innerHTML="function"===typeof g.fnRender&&
(!g.bUseRendered||null===g.mDataProp)?R(a,b,f):w(a,b,f,"display");if(null!==g.sClass)d.className=g.sClass;g.bVisible?(c.nTr.appendChild(d),c._anHidden[f]=null):c._anHidden[f]=d;g.fnCreatedCell&&g.fnCreatedCell.call(a.oInstance,d,w(a,b,f,"display"),c._aData,b,f)}C(a,"aoRowCreatedCallback",null,[c.nTr,c._aData,b])}}function ua(a){var b,c,d;if(0!==a.nTHead.getElementsByTagName("th").length)for(b=0,d=a.aoColumns.length;b<d;b++){if(c=a.aoColumns[b].nTh,c.setAttribute("role","columnheader"),a.aoColumns[b].bSortable&&
(c.setAttribute("tabindex",a.iTabIndex),c.setAttribute("aria-controls",a.sTableId)),null!==a.aoColumns[b].sClass&&i(c).addClass(a.aoColumns[b].sClass),a.aoColumns[b].sTitle!=c.innerHTML)c.innerHTML=a.aoColumns[b].sTitle}else{var f=k.createElement("tr");for(b=0,d=a.aoColumns.length;b<d;b++)c=a.aoColumns[b].nTh,c.innerHTML=a.aoColumns[b].sTitle,c.setAttribute("tabindex","0"),null!==a.aoColumns[b].sClass&&i(c).addClass(a.aoColumns[b].sClass),f.appendChild(c);i(a.nTHead).html("")[0].appendChild(f);T(a.aoHeader,
a.nTHead)}i(a.nTHead).children("tr").attr("role","row");if(a.bJUI)for(b=0,d=a.aoColumns.length;b<d;b++){c=a.aoColumns[b].nTh;f=k.createElement("div");f.className=a.oClasses.sSortJUIWrapper;i(c).contents().appendTo(f);var h=k.createElement("span");h.className=a.oClasses.sSortIcon;f.appendChild(h);c.appendChild(f)}if(a.oFeatures.bSort)for(b=0;b<a.aoColumns.length;b++)!1!==a.aoColumns[b].bSortable?ga(a,a.aoColumns[b].nTh,b):i(a.aoColumns[b].nTh).addClass(a.oClasses.sSortableNone);""!==a.oClasses.sFooterTH&&
i(a.nTFoot).children("tr").children("th").addClass(a.oClasses.sFooterTH);if(null!==a.nTFoot){c=O(a,null,a.aoFooter);for(b=0,d=a.aoColumns.length;b<d;b++)if(c[b])a.aoColumns[b].nTf=c[b],a.aoColumns[b].sClass&&i(c[b]).addClass(a.aoColumns[b].sClass)}}function U(a,b,c){var d,f,h,g=[],e=[],i=a.aoColumns.length,m;c===l&&(c=!1);for(d=0,f=b.length;d<f;d++){g[d]=b[d].slice();g[d].nTr=b[d].nTr;for(h=i-1;0<=h;h--)!a.aoColumns[h].bVisible&&!c&&g[d].splice(h,1);e.push([])}for(d=0,f=g.length;d<f;d++){if(a=g[d].nTr)for(;h=
a.firstChild;)a.removeChild(h);for(h=0,b=g[d].length;h<b;h++)if(m=i=1,e[d][h]===l){a.appendChild(g[d][h].cell);for(e[d][h]=1;g[d+i]!==l&&g[d][h].cell==g[d+i][h].cell;)e[d+i][h]=1,i++;for(;g[d][h+m]!==l&&g[d][h].cell==g[d][h+m].cell;){for(c=0;c<i;c++)e[d+c][h+m]=1;m++}g[d][h].cell.rowSpan=i;g[d][h].cell.colSpan=m}}}function y(a){var b,c,d=[],f=0,h=a.asStripeClasses.length;b=a.aoOpenRows.length;c=C(a,"aoPreDrawCallback","preDraw",[a]);if(-1===i.inArray(!1,c)){a.bDrawing=!0;if(a.iInitDisplayStart!==
l&&-1!=a.iInitDisplayStart)a._iDisplayStart=a.oFeatures.bServerSide?a.iInitDisplayStart:a.iInitDisplayStart>=a.fnRecordsDisplay()?0:a.iInitDisplayStart,a.iInitDisplayStart=-1,z(a);if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++;else if(a.oFeatures.bServerSide){if(!a.bDestroying&&!va(a))return}else a.iDraw++;if(0!==a.aiDisplay.length){var g=a._iDisplayStart;c=a._iDisplayEnd;if(a.oFeatures.bServerSide)g=0,c=a.aoData.length;for(;g<c;g++){var e=a.aoData[a.aiDisplay[g]];null===e.nTr&&ca(a,a.aiDisplay[g]);
var q=e.nTr;if(0!==h){var m=a.asStripeClasses[f%h];if(e._sRowStripe!=m)i(q).removeClass(e._sRowStripe).addClass(m),e._sRowStripe=m}C(a,"aoRowCallback",null,[q,a.aoData[a.aiDisplay[g]]._aData,f,g]);d.push(q);f++;if(0!==b)for(e=0;e<b;e++)if(q==a.aoOpenRows[e].nParent){d.push(a.aoOpenRows[e].nTr);break}}}else{d[0]=k.createElement("tr");if(a.asStripeClasses[0])d[0].className=a.asStripeClasses[0];h=a.oLanguage.sZeroRecords.replace("_MAX_",a.fnFormatNumber(a.fnRecordsTotal()));if(1==a.iDraw&&null!==a.sAjaxSource&&
!a.oFeatures.bServerSide)h=a.oLanguage.sLoadingRecords;else if(a.oLanguage.sEmptyTable&&0===a.fnRecordsTotal())h=a.oLanguage.sEmptyTable;b=k.createElement("td");b.setAttribute("valign","top");b.colSpan=v(a);b.className=a.oClasses.sRowEmpty;b.innerHTML=h;d[f].appendChild(b)}C(a,"aoHeaderCallback","header",[i(a.nTHead).children("tr")[0],X(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay]);C(a,"aoFooterCallback","footer",[i(a.nTFoot).children("tr")[0],X(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay]);
f=k.createDocumentFragment();b=k.createDocumentFragment();if(a.nTBody){h=a.nTBody.parentNode;b.appendChild(a.nTBody);if(!a.oScroll.bInfinite||!a._bInitComplete||a.bSorted||a.bFiltered)for(;b=a.nTBody.firstChild;)a.nTBody.removeChild(b);for(b=0,c=d.length;b<c;b++)f.appendChild(d[b]);a.nTBody.appendChild(f);null!==h&&h.appendChild(a.nTBody)}C(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1;a.oFeatures.bServerSide&&(H(a,!1),a._bInitComplete||Y(a))}}function Z(a){a.oFeatures.bSort?
P(a,a.oPreviousSearch):a.oFeatures.bFilter?M(a,a.oPreviousSearch):(z(a),y(a))}function wa(a){var b=i("<div></div>")[0];a.nTable.parentNode.insertBefore(b,a.nTable);a.nTableWrapper=i('<div id="'+a.sTableId+'_wrapper" class="'+a.oClasses.sWrapper+'" role="grid"></div>')[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var c=a.nTableWrapper,d=a.sDom.split(""),f,h,g,e,q,m,o,l=0;l<d.length;l++){h=0;g=d[l];if("<"==g){e=i("<div></div>")[0];q=d[l+1];if("'"==q||'"'==q){m="";for(o=2;d[l+o]!=q;)m+=d[l+o],
o++;"H"==m?m="fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix":"F"==m&&(m="fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix");-1!=m.indexOf(".")?(q=m.split("."),e.id=q[0].substr(1,q[0].length-1),e.className=q[1]):"#"==m.charAt(0)?e.id=m.substr(1,m.length-1):e.className=m;l+=o}c.appendChild(e);c=e}else if(">"==g)c=c.parentNode;else if("l"==g&&a.oFeatures.bPaginate&&a.oFeatures.bLengthChange)f=xa(a),h=1;else if("f"==g&&a.oFeatures.bFilter)f=
ya(a),h=1;else if("r"==g&&a.oFeatures.bProcessing)f=za(a),h=1;else if("t"==g)f=Aa(a),h=1;else if("i"==g&&a.oFeatures.bInfo)f=Ba(a),h=1;else if("p"==g&&a.oFeatures.bPaginate)f=Ca(a),h=1;else if(0!==j.ext.aoFeatures.length){e=j.ext.aoFeatures;o=0;for(q=e.length;o<q;o++)if(g==e[o].cFeature){(f=e[o].fnInit(a))&&(h=1);break}}1==h&&null!==f&&("object"!==typeof a.aanFeatures[g]&&(a.aanFeatures[g]=[]),a.aanFeatures[g].push(f),c.appendChild(f))}b.parentNode.replaceChild(a.nTableWrapper,b)}function T(a,b){var c=
i(b).children("tr"),d,f,h,g,e,q,m,j;a.splice(0,a.length);for(f=0,q=c.length;f<q;f++)a.push([]);for(f=0,q=c.length;f<q;f++)for(h=0,m=c[f].childNodes.length;h<m;h++)if(d=c[f].childNodes[h],"TD"==d.nodeName.toUpperCase()||"TH"==d.nodeName.toUpperCase()){var o=1*d.getAttribute("colspan"),l=1*d.getAttribute("rowspan"),o=!o||0===o||1===o?1:o,l=!l||0===l||1===l?1:l;for(g=0;a[f][g];)g++;j=g;for(e=0;e<o;e++)for(g=0;g<l;g++)a[f+g][j+e]={cell:d,unique:1==o?!0:!1},a[f+g].nTr=c[f]}}function O(a,b,c){var d=[];
if(!c)c=a.aoHeader,b&&(c=[],T(c,b));for(var b=0,f=c.length;b<f;b++)for(var h=0,g=c[b].length;h<g;h++)if(c[b][h].unique&&(!d[h]||!a.bSortCellsTop))d[h]=c[b][h].cell;return d}function va(a){if(a.bAjaxDataGet){a.iDraw++;H(a,!0);var b=Da(a);ha(a,b);a.fnServerData.call(a.oInstance,a.sAjaxSource,b,function(b){Ea(a,b)},a);return!1}return!0}function Da(a){var b=a.aoColumns.length,c=[],d,f;c.push({name:"sEcho",value:a.iDraw});c.push({name:"iColumns",value:b});c.push({name:"sColumns",value:x(a)});c.push({name:"iDisplayStart",
value:a._iDisplayStart});c.push({name:"iDisplayLength",value:!1!==a.oFeatures.bPaginate?a._iDisplayLength:-1});for(f=0;f<b;f++)d=a.aoColumns[f].mDataProp,c.push({name:"mDataProp_"+f,value:"function"===typeof d?"function":d});if(!1!==a.oFeatures.bFilter){c.push({name:"sSearch",value:a.oPreviousSearch.sSearch});c.push({name:"bRegex",value:a.oPreviousSearch.bRegex});for(f=0;f<b;f++)c.push({name:"sSearch_"+f,value:a.aoPreSearchCols[f].sSearch}),c.push({name:"bRegex_"+f,value:a.aoPreSearchCols[f].bRegex}),
c.push({name:"bSearchable_"+f,value:a.aoColumns[f].bSearchable})}if(!1!==a.oFeatures.bSort){d=null!==a.aaSortingFixed?a.aaSortingFixed.length:0;var h=a.aaSorting.length;c.push({name:"iSortingCols",value:d+h});for(f=0;f<d;f++)c.push({name:"iSortCol_"+f,value:a.aaSortingFixed[f][0]}),c.push({name:"sSortDir_"+f,value:a.aaSortingFixed[f][1]});for(f=0;f<h;f++)c.push({name:"iSortCol_"+(f+d),value:a.aaSorting[f][0]}),c.push({name:"sSortDir_"+(f+d),value:a.aaSorting[f][1]});for(f=0;f<b;f++)c.push({name:"bSortable_"+
f,value:a.aoColumns[f].bSortable})}return c}function ha(a,b){C(a,"aoServerParams","serverParams",[b])}function Ea(a,b){if(b.sEcho!==l){if(1*b.sEcho<a.iDraw)return;a.iDraw=1*b.sEcho}(!a.oScroll.bInfinite||a.oScroll.bInfinite&&(a.bSorted||a.bFiltered))&&ea(a);a._iRecordsTotal=parseInt(b.iTotalRecords,10);a._iRecordsDisplay=parseInt(b.iTotalDisplayRecords,10);var c=x(a),c=b.sColumns!==l&&""!==c&&b.sColumns!=c,d;c&&(d=D(a,b.sColumns));for(var f=V(a.sAjaxDataProp)(b),h=0,g=f.length;h<g;h++)if(c){for(var e=
[],i=0,m=a.aoColumns.length;i<m;i++)e.push(f[h][d[i]]);G(a,e)}else G(a,f[h]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;y(a);a.bAjaxDataGet=!0;H(a,!1)}function ya(a){var b=a.oPreviousSearch,c=a.oLanguage.sSearch,c=-1!==c.indexOf("_INPUT_")?c.replace("_INPUT_",'<input type="text" />'):""===c?'<input type="text" />':c+' <input type="text" />',d=k.createElement("div");d.className=a.oClasses.sFilter;d.innerHTML="<label>"+c+"</label>";if(!a.aanFeatures.f)d.id=a.sTableId+"_filter";c=i("input",
d);c.val(b.sSearch.replace('"',"&quot;"));c.bind("keyup.DT",function(){for(var c=a.aanFeatures.f,d=0,g=c.length;d<g;d++)c[d]!=i(this).parents("div.dataTables_filter")[0]&&i("input",c[d]).val(this.value);this.value!=b.sSearch&&M(a,{sSearch:this.value,bRegex:b.bRegex,bSmart:b.bSmart,bCaseInsensitive:b.bCaseInsensitive})});c.attr("aria-controls",a.sTableId).bind("keypress.DT",function(a){if(13==a.keyCode)return!1});return d}function M(a,b,c){var d=a.oPreviousSearch,f=a.aoPreSearchCols,h=function(a){d.sSearch=
a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};if(a.oFeatures.bServerSide)h(b);else{Fa(a,b.sSearch,c,b.bRegex,b.bSmart,b.bCaseInsensitive);h(b);for(b=0;b<a.aoPreSearchCols.length;b++)Ga(a,f[b].sSearch,b,f[b].bRegex,f[b].bSmart,f[b].bCaseInsensitive);Ha(a)}a.bFiltered=!0;i(a.oInstance).trigger("filter",a);a._iDisplayStart=0;z(a);y(a);ia(a,0)}function Ha(a){for(var b=j.ext.afnFiltering,c=0,d=b.length;c<d;c++)for(var f=0,h=0,g=a.aiDisplay.length;h<g;h++){var e=a.aiDisplay[h-
f];b[c](a,W(a,e,"filter"),e)||(a.aiDisplay.splice(h-f,1),f++)}}function Ga(a,b,c,d,f,h){if(""!==b)for(var g=0,b=ja(b,d,f,h),d=a.aiDisplay.length-1;0<=d;d--)f=ka(w(a,a.aiDisplay[d],c,"filter"),a.aoColumns[c].sType),b.test(f)||(a.aiDisplay.splice(d,1),g++)}function Fa(a,b,c,d,f,h){d=ja(b,d,f,h);f=a.oPreviousSearch;c||(c=0);0!==j.ext.afnFiltering.length&&(c=1);if(0>=b.length)a.aiDisplay.splice(0,a.aiDisplay.length),a.aiDisplay=a.aiDisplayMaster.slice();else if(a.aiDisplay.length==a.aiDisplayMaster.length||
f.sSearch.length>b.length||1==c||0!==b.indexOf(f.sSearch)){a.aiDisplay.splice(0,a.aiDisplay.length);ia(a,1);for(b=0;b<a.aiDisplayMaster.length;b++)d.test(a.asDataSearch[b])&&a.aiDisplay.push(a.aiDisplayMaster[b])}else for(b=c=0;b<a.asDataSearch.length;b++)d.test(a.asDataSearch[b])||(a.aiDisplay.splice(b-c,1),c++)}function ia(a,b){if(!a.oFeatures.bServerSide){a.asDataSearch.splice(0,a.asDataSearch.length);for(var c=b&&1===b?a.aiDisplayMaster:a.aiDisplay,d=0,f=c.length;d<f;d++)a.asDataSearch[d]=la(a,
W(a,c[d],"filter"))}}function la(a,b){var c="";if(a.__nTmpFilter===l)a.__nTmpFilter=k.createElement("div");for(var d=a.__nTmpFilter,f=0,h=a.aoColumns.length;f<h;f++)a.aoColumns[f].bSearchable&&(c+=ka(b[f],a.aoColumns[f].sType)+"  ");if(-1!==c.indexOf("&"))d.innerHTML=c,c=d.textContent?d.textContent:d.innerText,c=c.replace(/\n/g," ").replace(/\r/g,"");return c}function ja(a,b,c,d){if(c)return a=b?a.split(" "):ma(a).split(" "),a="^(?=.*?"+a.join(")(?=.*?")+").*$",RegExp(a,d?"i":"");a=b?a:ma(a);return RegExp(a,
d?"i":"")}function ka(a,b){return"function"===typeof j.ext.ofnSearch[b]?j.ext.ofnSearch[b](a):"html"==b?a.replace(/[\r\n]/g," ").replace(/<.*?>/g,""):"string"===typeof a?a.replace(/[\r\n]/g," "):null===a?"":a}function ma(a){return a.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^)","g"),"\\$1")}function Ba(a){var b=k.createElement("div");b.className=a.oClasses.sInfo;if(!a.aanFeatures.i)a.aoDrawCallback.push({fn:Ia,sName:"information"}),b.id=a.sTableId+"_info";a.nTable.setAttribute("aria-describedby",
a.sTableId+"_info");return b}function Ia(a){if(a.oFeatures.bInfo&&0!==a.aanFeatures.i.length){var b=a._iDisplayStart+1,c=a.fnDisplayEnd(),d=a.fnRecordsTotal(),f=a.fnRecordsDisplay(),h=a.fnFormatNumber(b),g=a.fnFormatNumber(c),e=a.fnFormatNumber(d),q=a.fnFormatNumber(f);a.oScroll.bInfinite&&(h=a.fnFormatNumber(1));h=0===a.fnRecordsDisplay()&&a.fnRecordsDisplay()==a.fnRecordsTotal()?a.oLanguage.sInfoEmpty+a.oLanguage.sInfoPostFix:0===a.fnRecordsDisplay()?a.oLanguage.sInfoEmpty+" "+a.oLanguage.sInfoFiltered.replace("_MAX_",
e)+a.oLanguage.sInfoPostFix:a.fnRecordsDisplay()==a.fnRecordsTotal()?a.oLanguage.sInfo.replace("_START_",h).replace("_END_",g).replace("_TOTAL_",q)+a.oLanguage.sInfoPostFix:a.oLanguage.sInfo.replace("_START_",h).replace("_END_",g).replace("_TOTAL_",q)+" "+a.oLanguage.sInfoFiltered.replace("_MAX_",a.fnFormatNumber(a.fnRecordsTotal()))+a.oLanguage.sInfoPostFix;null!==a.oLanguage.fnInfoCallback&&(h=a.oLanguage.fnInfoCallback.call(a.oInstance,a,b,c,d,f,h));a=a.aanFeatures.i;b=0;for(c=a.length;b<c;b++)i(a[b]).html(h)}}
function $(a){var b,c,d=a.iInitDisplayStart;if(!1===a.bInitialised)setTimeout(function(){$(a)},200);else{wa(a);ua(a);U(a,a.aoHeader);a.nTFoot&&U(a,a.aoFooter);H(a,!0);a.oFeatures.bAutoWidth&&ba(a);for(b=0,c=a.aoColumns.length;b<c;b++)if(null!==a.aoColumns[b].sWidth)a.aoColumns[b].nTh.style.width=p(a.aoColumns[b].sWidth);a.oFeatures.bSort?P(a):a.oFeatures.bFilter?M(a,a.oPreviousSearch):(a.aiDisplay=a.aiDisplayMaster.slice(),z(a),y(a));null!==a.sAjaxSource&&!a.oFeatures.bServerSide?(c=[],ha(a,c),a.fnServerData.call(a.oInstance,
a.sAjaxSource,c,function(c){var h=""!==a.sAjaxDataProp?V(a.sAjaxDataProp)(c):c;for(b=0;b<h.length;b++)G(a,h[b]);a.iInitDisplayStart=d;a.oFeatures.bSort?P(a):(a.aiDisplay=a.aiDisplayMaster.slice(),z(a),y(a));H(a,!1);Y(a,c)},a)):a.oFeatures.bServerSide||(H(a,!1),Y(a))}}function Y(a,b){a._bInitComplete=!0;C(a,"aoInitComplete","init",[a,b])}function na(a){!a.sEmptyTable&&a.sZeroRecords&&n(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&a.sZeroRecords&&n(a,a,"sZeroRecords","sLoadingRecords")}function xa(a){if(a.oScroll.bInfinite)return null;
var b='<select size="1" '+('name="'+a.sTableId+'_length"')+">",c,d,f=a.aLengthMenu;if(2==f.length&&"object"===typeof f[0]&&"object"===typeof f[1])for(c=0,d=f[0].length;c<d;c++)b+='<option value="'+f[0][c]+'">'+f[1][c]+"</option>";else for(c=0,d=f.length;c<d;c++)b+='<option value="'+f[c]+'">'+f[c]+"</option>";b+="</select>";f=k.createElement("div");if(!a.aanFeatures.l)f.id=a.sTableId+"_length";f.className=a.oClasses.sLength;f.innerHTML="<label>"+a.oLanguage.sLengthMenu.replace("_MENU_",b)+"</label>";
i('select option[value="'+a._iDisplayLength+'"]',f).attr("selected",!0);i("select",f).bind("change.DT",function(){var b=i(this).val(),f=a.aanFeatures.l;for(c=0,d=f.length;c<d;c++)f[c]!=this.parentNode&&i("select",f[c]).val(b);a._iDisplayLength=parseInt(b,10);z(a);if(a.fnDisplayEnd()==a.fnRecordsDisplay()&&(a._iDisplayStart=a.fnDisplayEnd()-a._iDisplayLength,0>a._iDisplayStart))a._iDisplayStart=0;if(-1==a._iDisplayLength)a._iDisplayStart=0;y(a)});i("select",f).attr("aria-controls",a.sTableId);return f}
function z(a){a._iDisplayEnd=!1===a.oFeatures.bPaginate?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength>a.aiDisplay.length||-1==a._iDisplayLength?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength}function Ca(a){if(a.oScroll.bInfinite)return null;var b=k.createElement("div");b.className=a.oClasses.sPaging+a.sPaginationType;j.ext.oPagination[a.sPaginationType].fnInit(a,b,function(a){z(a);y(a)});a.aanFeatures.p||a.aoDrawCallback.push({fn:function(a){j.ext.oPagination[a.sPaginationType].fnUpdate(a,
function(a){z(a);y(a)})},sName:"pagination"});return b}function oa(a,b){var c=a._iDisplayStart;if("number"===typeof b){if(a._iDisplayStart=b*a._iDisplayLength,a._iDisplayStart>a.fnRecordsDisplay())a._iDisplayStart=0}else if("first"==b)a._iDisplayStart=0;else if("previous"==b){if(a._iDisplayStart=0<=a._iDisplayLength?a._iDisplayStart-a._iDisplayLength:0,0>a._iDisplayStart)a._iDisplayStart=0}else if("next"==b)0<=a._iDisplayLength?a._iDisplayStart+a._iDisplayLength<a.fnRecordsDisplay()&&(a._iDisplayStart+=
a._iDisplayLength):a._iDisplayStart=0;else if("last"==b)if(0<=a._iDisplayLength){var d=parseInt((a.fnRecordsDisplay()-1)/a._iDisplayLength,10)+1;a._iDisplayStart=(d-1)*a._iDisplayLength}else a._iDisplayStart=0;else F(a,0,"Unknown paging action: "+b);i(a.oInstance).trigger("page",a);return c!=a._iDisplayStart}function za(a){var b=k.createElement("div");if(!a.aanFeatures.r)b.id=a.sTableId+"_processing";b.innerHTML=a.oLanguage.sProcessing;b.className=a.oClasses.sProcessing;a.nTable.parentNode.insertBefore(b,
a.nTable);return b}function H(a,b){if(a.oFeatures.bProcessing)for(var c=a.aanFeatures.r,d=0,f=c.length;d<f;d++)c[d].style.visibility=b?"visible":"hidden";i(a.oInstance).trigger("processing",[a,b])}function Aa(a){if(""===a.oScroll.sX&&""===a.oScroll.sY)return a.nTable;var b=k.createElement("div"),c=k.createElement("div"),d=k.createElement("div"),f=k.createElement("div"),h=k.createElement("div"),g=k.createElement("div"),e=a.nTable.cloneNode(!1),q=a.nTable.cloneNode(!1),m=a.nTable.getElementsByTagName("thead")[0],
j=0===a.nTable.getElementsByTagName("tfoot").length?null:a.nTable.getElementsByTagName("tfoot")[0],o=a.oClasses;c.appendChild(d);h.appendChild(g);f.appendChild(a.nTable);b.appendChild(c);b.appendChild(f);d.appendChild(e);e.appendChild(m);null!==j&&(b.appendChild(h),g.appendChild(q),q.appendChild(j));b.className=o.sScrollWrapper;c.className=o.sScrollHead;d.className=o.sScrollHeadInner;f.className=o.sScrollBody;h.className=o.sScrollFoot;g.className=o.sScrollFootInner;if(a.oScroll.bAutoCss)c.style.overflow=
"hidden",c.style.position="relative",h.style.overflow="hidden",f.style.overflow="auto";c.style.border="0";c.style.width="100%";h.style.border="0";d.style.width="150%";e.removeAttribute("id");e.style.marginLeft="0";a.nTable.style.marginLeft="0";if(null!==j)q.removeAttribute("id"),q.style.marginLeft="0";d=i(a.nTable).children("caption");g=0;for(q=d.length;g<q;g++)e.appendChild(d[g]);if(""!==a.oScroll.sX){c.style.width=p(a.oScroll.sX);f.style.width=p(a.oScroll.sX);if(null!==j)h.style.width=p(a.oScroll.sX);
i(f).scroll(function(){c.scrollLeft=this.scrollLeft;if(null!==j)h.scrollLeft=this.scrollLeft})}if(""!==a.oScroll.sY)f.style.height=p(a.oScroll.sY);a.aoDrawCallback.push({fn:Ja,sName:"scrolling"});a.oScroll.bInfinite&&i(f).scroll(function(){!a.bDrawing&&0!==i(this).scrollTop()&&i(this).scrollTop()+i(this).height()>i(a.nTable).height()-a.oScroll.iLoadGap&&a.fnDisplayEnd()<a.fnRecordsDisplay()&&(oa(a,"next"),z(a),y(a))});a.nScrollHead=c;a.nScrollFoot=h;return b}function Ja(a){var b=a.nScrollHead.getElementsByTagName("div")[0],
c=b.getElementsByTagName("table")[0],d=a.nTable.parentNode,f,h,g,e,j,m,o,l,r=[],n=null!==a.nTFoot?a.nScrollFoot.getElementsByTagName("div")[0]:null,E=null!==a.nTFoot?n.getElementsByTagName("table")[0]:null,k=i.browser.msie&&7>=i.browser.version;g=a.nTable.getElementsByTagName("thead");0<g.length&&a.nTable.removeChild(g[0]);null!==a.nTFoot&&(j=a.nTable.getElementsByTagName("tfoot"),0<j.length&&a.nTable.removeChild(j[0]));g=a.nTHead.cloneNode(!0);a.nTable.insertBefore(g,a.nTable.childNodes[0]);null!==
a.nTFoot&&(j=a.nTFoot.cloneNode(!0),a.nTable.insertBefore(j,a.nTable.childNodes[1]));if(""===a.oScroll.sX)d.style.width="100%",b.parentNode.style.width="100%";var t=O(a,g);for(f=0,h=t.length;f<h;f++)o=s(a,f),t[f].style.width=a.aoColumns[o].sWidth;null!==a.nTFoot&&N(function(a){a.style.width=""},j.getElementsByTagName("tr"));f=i(a.nTable).outerWidth();if(""===a.oScroll.sX){if(a.nTable.style.width="100%",k&&(i("tbody",d).height()>d.offsetHeight||"scroll"==i(d).css("overflow-y")))a.nTable.style.width=
p(i(a.nTable).outerWidth()-a.oScroll.iBarWidth)}else if(""!==a.oScroll.sXInner)a.nTable.style.width=p(a.oScroll.sXInner);else if(f==i(d).width()&&i(d).height()<i(a.nTable).height()){if(a.nTable.style.width=p(f-a.oScroll.iBarWidth),i(a.nTable).outerWidth()>f-a.oScroll.iBarWidth)a.nTable.style.width=p(f)}else a.nTable.style.width=p(f);f=i(a.nTable).outerWidth();h=a.nTHead.getElementsByTagName("tr");g=g.getElementsByTagName("tr");N(function(a,b){m=a.style;m.paddingTop="0";m.paddingBottom="0";m.borderTopWidth=
"0";m.borderBottomWidth="0";m.height=0;l=i(a).width();b.style.width=p(l);r.push(l)},g,h);i(g).height(0);null!==a.nTFoot&&(e=j.getElementsByTagName("tr"),j=a.nTFoot.getElementsByTagName("tr"),N(function(a,b){m=a.style;m.paddingTop="0";m.paddingBottom="0";m.borderTopWidth="0";m.borderBottomWidth="0";m.height=0;l=i(a).width();b.style.width=p(l);r.push(l)},e,j),i(e).height(0));N(function(a){a.innerHTML="";a.style.width=p(r.shift())},g);null!==a.nTFoot&&N(function(a){a.innerHTML="";a.style.width=p(r.shift())},
e);if(i(a.nTable).outerWidth()<f){e=d.scrollHeight>d.offsetHeight||"scroll"==i(d).css("overflow-y")?f+a.oScroll.iBarWidth:f;if(k&&(d.scrollHeight>d.offsetHeight||"scroll"==i(d).css("overflow-y")))a.nTable.style.width=p(e-a.oScroll.iBarWidth);d.style.width=p(e);b.parentNode.style.width=p(e);if(null!==a.nTFoot)n.parentNode.style.width=p(e);""===a.oScroll.sX?F(a,1,"The table cannot fit into the current element which will cause column misalignment. The table has been drawn at its minimum possible width."):
""!==a.oScroll.sXInner&&F(a,1,"The table cannot fit into the current element which will cause column misalignment. Increase the sScrollXInner value or remove it to allow automatic calculation")}else if(d.style.width=p("100%"),b.parentNode.style.width=p("100%"),null!==a.nTFoot)n.parentNode.style.width=p("100%");if(""===a.oScroll.sY&&k)d.style.height=p(a.nTable.offsetHeight+a.oScroll.iBarWidth);if(""!==a.oScroll.sY&&a.oScroll.bCollapse&&(d.style.height=p(a.oScroll.sY),k=""!==a.oScroll.sX&&a.nTable.offsetWidth>
d.offsetWidth?a.oScroll.iBarWidth:0,a.nTable.offsetHeight<d.offsetHeight))d.style.height=p(i(a.nTable).height()+k);k=i(a.nTable).outerWidth();c.style.width=p(k);b.style.width=p(k);if(null!==a.nTFoot)n.style.width=p(a.nTable.offsetWidth),E.style.width=p(a.nTable.offsetWidth);if(a.bSorted||a.bFiltered)d.scrollTop=0}function N(a,b,c){for(var d=0,f=b.length;d<f;d++)for(var h=0,g=b[d].childNodes.length;h<g;h++)1==b[d].childNodes[h].nodeType&&(c?a(b[d].childNodes[h],c[d].childNodes[h]):a(b[d].childNodes[h]))}
function Ka(a,b){if(!a||null===a||""===a)return 0;b||(b=k.getElementsByTagName("body")[0]);var c,d=k.createElement("div");d.style.width=p(a);b.appendChild(d);c=d.offsetWidth;b.removeChild(d);return c}function ba(a){var b=0,c,d=0,f=a.aoColumns.length,h,g=i("th",a.nTHead),e=a.nTable.getAttribute("width");for(h=0;h<f;h++)if(a.aoColumns[h].bVisible&&(d++,null!==a.aoColumns[h].sWidth)){c=Ka(a.aoColumns[h].sWidthOrig,a.nTable.parentNode);if(null!==c)a.aoColumns[h].sWidth=p(c);b++}if(f==g.length&&0===b&&
d==f&&""===a.oScroll.sX&&""===a.oScroll.sY)for(h=0;h<a.aoColumns.length;h++){if(c=i(g[h]).width(),null!==c)a.aoColumns[h].sWidth=p(c)}else{b=a.nTable.cloneNode(!1);h=a.nTHead.cloneNode(!0);d=k.createElement("tbody");c=k.createElement("tr");b.removeAttribute("id");b.appendChild(h);null!==a.nTFoot&&(b.appendChild(a.nTFoot.cloneNode(!0)),N(function(a){a.style.width=""},b.getElementsByTagName("tr")));b.appendChild(d);d.appendChild(c);d=i("thead th",b);0===d.length&&(d=i("tbody tr:eq(0)>td",b));g=O(a,
h);for(h=d=0;h<f;h++){var j=a.aoColumns[h];j.bVisible&&null!==j.sWidthOrig&&""!==j.sWidthOrig?g[h-d].style.width=p(j.sWidthOrig):j.bVisible?g[h-d].style.width="":d++}for(h=0;h<f;h++)a.aoColumns[h].bVisible&&(d=La(a,h),null!==d&&(d=d.cloneNode(!0),""!==a.aoColumns[h].sContentPadding&&(d.innerHTML+=a.aoColumns[h].sContentPadding),c.appendChild(d)));f=a.nTable.parentNode;f.appendChild(b);if(""!==a.oScroll.sX&&""!==a.oScroll.sXInner)b.style.width=p(a.oScroll.sXInner);else if(""!==a.oScroll.sX){if(b.style.width=
"",i(b).width()<f.offsetWidth)b.style.width=p(f.offsetWidth)}else if(""!==a.oScroll.sY)b.style.width=p(f.offsetWidth);else if(e)b.style.width=p(e);b.style.visibility="hidden";Ma(a,b);f=i("tbody tr:eq(0)",b).children();0===f.length&&(f=O(a,i("thead",b)[0]));if(""!==a.oScroll.sX){for(h=d=c=0;h<a.aoColumns.length;h++)a.aoColumns[h].bVisible&&(c=null===a.aoColumns[h].sWidthOrig?c+i(f[d]).outerWidth():c+(parseInt(a.aoColumns[h].sWidth.replace("px",""),10)+(i(f[d]).outerWidth()-i(f[d]).width())),d++);b.style.width=
p(c);a.nTable.style.width=p(c)}for(h=d=0;h<a.aoColumns.length;h++)if(a.aoColumns[h].bVisible){c=i(f[d]).width();if(null!==c&&0<c)a.aoColumns[h].sWidth=p(c);d++}f=i(b).css("width");a.nTable.style.width=-1!==f.indexOf("%")?f:p(i(b).outerWidth());b.parentNode.removeChild(b)}if(e)a.nTable.style.width=p(e)}function Ma(a,b){if(""===a.oScroll.sX&&""!==a.oScroll.sY)i(b).width(),b.style.width=p(i(b).outerWidth()-a.oScroll.iBarWidth);else if(""!==a.oScroll.sX)b.style.width=p(i(b).outerWidth())}function La(a,
b){var c=Na(a,b);if(0>c)return null;if(null===a.aoData[c].nTr){var d=k.createElement("td");d.innerHTML=w(a,c,b,"");return d}return L(a,c)[b]}function Na(a,b){for(var c=-1,d=-1,f=0;f<a.aoData.length;f++){var h=w(a,f,b,"display")+"",h=h.replace(/<.*?>/g,"");if(h.length>c)c=h.length,d=f}return d}function p(a){if(null===a)return"0px";if("number"==typeof a)return 0>a?"0px":a+"px";var b=a.charCodeAt(a.length-1);return 48>b||57<b?a:a+"px"}function Oa(){var a=k.createElement("p"),b=a.style;b.width="100%";
b.height="200px";b.padding="0px";var c=k.createElement("div"),b=c.style;b.position="absolute";b.top="0px";b.left="0px";b.visibility="hidden";b.width="200px";b.height="150px";b.padding="0px";b.overflow="hidden";c.appendChild(a);k.body.appendChild(c);b=a.offsetWidth;c.style.overflow="scroll";a=a.offsetWidth;if(b==a)a=c.clientWidth;k.body.removeChild(c);return b-a}function P(a,b){var c,d,f,h,g,e,o=[],m=[],r=j.ext.oSort,n=a.aoData,k=a.aoColumns,E=a.oLanguage.oAria;if(!a.oFeatures.bServerSide&&(0!==a.aaSorting.length||
null!==a.aaSortingFixed)){o=null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(c=0;c<o.length;c++)if(d=o[c][0],f=t(a,d),h=a.aoColumns[d].sSortDataType,j.ext.afnSortData[h]){g=j.ext.afnSortData[h](a,d,f);for(f=0,h=n.length;f<h;f++)J(a,f,d,g[f])}for(c=0,d=a.aiDisplayMaster.length;c<d;c++)m[a.aiDisplayMaster[c]]=c;var p=o.length,s;for(c=0,d=n.length;c<d;c++)for(f=0;f<p;f++){s=k[o[f][0]].aDataSort;for(g=0,e=s.length;g<e;g++)h=k[s[g]].sType,h=r[(h?h:"string")+"-pre"],
n[c]._aSortData[s[g]]=h?h(w(a,c,s[g],"sort")):w(a,c,s[g],"sort")}a.aiDisplayMaster.sort(function(a,b){var c,d,f,h,g;for(c=0;c<p;c++){g=k[o[c][0]].aDataSort;for(d=0,f=g.length;d<f;d++)if(h=k[g[d]].sType,h=r[(h?h:"string")+"-"+o[c][1]](n[a]._aSortData[g[d]],n[b]._aSortData[g[d]]),0!==h)return h}return r["numeric-asc"](m[a],m[b])})}(b===l||b)&&!a.oFeatures.bDeferRender&&Q(a);for(c=0,d=a.aoColumns.length;c<d;c++)f=k[c].nTh,f.removeAttribute("aria-sort"),f.removeAttribute("aria-label"),k[c].bSortable?
0<o.length&&o[0][0]==c?(f.setAttribute("aria-sort","asc"==o[0][1]?"ascending":"descending"),f.setAttribute("aria-label",k[c].sTitle+("asc"==(k[c].asSorting[o[0][2]+1]?k[c].asSorting[o[0][2]+1]:k[c].asSorting[0])?E.sSortAscending:E.sSortDescending))):f.setAttribute("aria-label",k[c].sTitle+("asc"==k[c].asSorting[0]?E.sSortAscending:E.sSortDescending)):f.setAttribute("aria-label",k[c].sTitle);a.bSorted=!0;i(a.oInstance).trigger("sort",a);a.oFeatures.bFilter?M(a,a.oPreviousSearch,1):(a.aiDisplay=a.aiDisplayMaster.slice(),
a._iDisplayStart=0,z(a),y(a))}function ga(a,b,c,d){Pa(b,{},function(b){if(!1!==a.aoColumns[c].bSortable){var h=function(){var d,h;if(b.shiftKey){for(var e=!1,i=0;i<a.aaSorting.length;i++)if(a.aaSorting[i][0]==c){e=!0;d=a.aaSorting[i][0];h=a.aaSorting[i][2]+1;a.aoColumns[d].asSorting[h]?(a.aaSorting[i][1]=a.aoColumns[d].asSorting[h],a.aaSorting[i][2]=h):a.aaSorting.splice(i,1);break}!1===e&&a.aaSorting.push([c,a.aoColumns[c].asSorting[0],0])}else 1==a.aaSorting.length&&a.aaSorting[0][0]==c?(d=a.aaSorting[0][0],
h=a.aaSorting[0][2]+1,a.aoColumns[d].asSorting[h]||(h=0),a.aaSorting[0][1]=a.aoColumns[d].asSorting[h],a.aaSorting[0][2]=h):(a.aaSorting.splice(0,a.aaSorting.length),a.aaSorting.push([c,a.aoColumns[c].asSorting[0],0]));P(a)};a.oFeatures.bProcessing?(H(a,!0),setTimeout(function(){h();a.oFeatures.bServerSide||H(a,!1)},0)):h();"function"==typeof d&&d(a)}})}function Q(a){var b,c,d,f,h,g=a.aoColumns.length,e=a.oClasses;for(b=0;b<g;b++)a.aoColumns[b].bSortable&&i(a.aoColumns[b].nTh).removeClass(e.sSortAsc+
" "+e.sSortDesc+" "+a.aoColumns[b].sSortingClass);f=null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(b=0;b<a.aoColumns.length;b++)if(a.aoColumns[b].bSortable){h=a.aoColumns[b].sSortingClass;d=-1;for(c=0;c<f.length;c++)if(f[c][0]==b){h="asc"==f[c][1]?e.sSortAsc:e.sSortDesc;d=c;break}i(a.aoColumns[b].nTh).addClass(h);a.bJUI&&(c=i("span."+e.sSortIcon,a.aoColumns[b].nTh),c.removeClass(e.sSortJUIAsc+" "+e.sSortJUIDesc+" "+e.sSortJUI+" "+e.sSortJUIAscAllowed+" "+e.sSortJUIDescAllowed),
c.addClass(-1==d?a.aoColumns[b].sSortingClassJUI:"asc"==f[d][1]?e.sSortJUIAsc:e.sSortJUIDesc))}else i(a.aoColumns[b].nTh).addClass(a.aoColumns[b].sSortingClass);h=e.sSortColumn;if(a.oFeatures.bSort&&a.oFeatures.bSortClasses){d=L(a);if(a.oFeatures.bDeferRender)i(d).removeClass(h+"1 "+h+"2 "+h+"3");else if(d.length>=g)for(b=0;b<g;b++)if(-1!=d[b].className.indexOf(h+"1"))for(c=0,a=d.length/g;c<a;c++)d[g*c+b].className=i.trim(d[g*c+b].className.replace(h+"1",""));else if(-1!=d[b].className.indexOf(h+
"2"))for(c=0,a=d.length/g;c<a;c++)d[g*c+b].className=i.trim(d[g*c+b].className.replace(h+"2",""));else if(-1!=d[b].className.indexOf(h+"3"))for(c=0,a=d.length/g;c<a;c++)d[g*c+b].className=i.trim(d[g*c+b].className.replace(" "+h+"3",""));var e=1,j;for(b=0;b<f.length;b++){j=parseInt(f[b][0],10);for(c=0,a=d.length/g;c<a;c++)d[g*c+j].className+=" "+h+e;3>e&&e++}}}function pa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b,c;b=a.oScroll.bInfinite;var d={iCreate:(new Date).getTime(),iStart:b?0:a._iDisplayStart,
iEnd:b?a._iDisplayLength:a._iDisplayEnd,iLength:a._iDisplayLength,aaSorting:i.extend(!0,[],a.aaSorting),oSearch:i.extend(!0,{},a.oPreviousSearch),aoSearchCols:i.extend(!0,[],a.aoPreSearchCols),abVisCols:[]};for(b=0,c=a.aoColumns.length;b<c;b++)d.abVisCols.push(a.aoColumns[b].bVisible);C(a,"aoStateSaveParams","stateSaveParams",[a,d]);a.fnStateSave.call(a.oInstance,a,d)}}function Qa(a,b){if(a.oFeatures.bStateSave){var c=a.fnStateLoad.call(a.oInstance,a);if(c){var d=C(a,"aoStateLoadParams","stateLoadParams",
[a,c]);if(-1===i.inArray(!1,d)){a.oLoadedState=i.extend(!0,{},c);a._iDisplayStart=c.iStart;a.iInitDisplayStart=c.iStart;a._iDisplayEnd=c.iEnd;a._iDisplayLength=c.iLength;a.aaSorting=c.aaSorting.slice();a.saved_aaSorting=c.aaSorting.slice();i.extend(a.oPreviousSearch,c.oSearch);i.extend(!0,a.aoPreSearchCols,c.aoSearchCols);b.saved_aoColumns=[];for(d=0;d<c.abVisCols.length;d++)b.saved_aoColumns[d]={},b.saved_aoColumns[d].bVisible=c.abVisCols[d];C(a,"aoStateLoaded","stateLoaded",[a,c])}}}}function Ra(a){for(var b=
aa.location.pathname.split("/"),a=a+"_"+b[b.length-1].replace(/[\/:]/g,"").toLowerCase()+"=",b=k.cookie.split(";"),c=0;c<b.length;c++){for(var d=b[c];" "==d.charAt(0);)d=d.substring(1,d.length);if(0===d.indexOf(a))return decodeURIComponent(d.substring(a.length,d.length))}return null}function u(a){for(var b=0;b<j.settings.length;b++)if(j.settings[b].nTable===a)return j.settings[b];return null}function S(a){for(var b=[],a=a.aoData,c=0,d=a.length;c<d;c++)null!==a[c].nTr&&b.push(a[c].nTr);return b}function L(a,
b){var c=[],d,f,h,e,i,j;f=0;var o=a.aoData.length;b!==l&&(f=b,o=b+1);for(h=f;h<o;h++)if(j=a.aoData[h],null!==j.nTr){f=[];for(e=0,i=j.nTr.childNodes.length;e<i;e++)d=j.nTr.childNodes[e].nodeName.toLowerCase(),("td"==d||"th"==d)&&f.push(j.nTr.childNodes[e]);d=0;for(e=0,i=a.aoColumns.length;e<i;e++)a.aoColumns[e].bVisible?c.push(f[e-d]):(c.push(j._anHidden[e]),d++)}return c}function F(a,b,c){a=null===a?"DataTables warning: "+c:"DataTables warning (table id = '"+a.sTableId+"'): "+c;if(0===b)if("alert"==
j.ext.sErrMode)alert(a);else throw a;else console!==l&&console.log&&console.log(a)}function n(a,b,c,d){d===l&&(d=c);b[c]!==l&&(a[d]=b[c])}function Sa(a,b){for(var c in a)a.hasOwnProperty(c)&&b[c]!==l&&("object"===typeof e[c]&&!1===i.isArray(b[c])?i.extend(!0,a[c],b[c]):a[c]=b[c]);return a}function Pa(a,b,c){i(a).bind("click.DT",b,function(b){c(b);a.blur()}).bind("keypress.DT",b,function(a){13===a.which&&c(a)}).bind("selectstart.DT",function(){return!1})}function A(a,b,c,d){c&&a[b].push({fn:c,sName:d})}
function C(a,b,c,d){for(var b=a[b],f=[],h=b.length-1;0<=h;h--)f.push(b[h].fn.apply(a.oInstance,d));null!==c&&i(a.oInstance).trigger(c,d);return f}function Ta(a){return function(){var b=[u(this[j.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return j.ext.oApi[a].apply(this,b)}}var Ua=aa.JSON?JSON.stringify:function(a){var b=typeof a;if("object"!==b||null===a)return"string"===b&&(a='"'+a+'"'),a+"";var c,d,f=[],h=i.isArray(a);for(c in a)d=a[c],b=typeof d,"string"===b?d='"'+d+'"':"object"===
b&&null!==d&&(d=Ua(d)),f.push((h?"":'"'+c+'":')+d);return(h?"[":"{")+f+(h?"]":"}")};this.$=function(a,b){var c,d,f=[],h=u(this[j.ext.iApiIndex]);b||(b={});b=i.extend({},{filter:"none",order:"current",page:"all"},b);if("current"==b.page)for(c=h._iDisplayStart,d=h.fnDisplayEnd();c<d;c++)f.push(h.aoData[h.aiDisplay[c]].nTr);else if("current"==b.order&&"none"==b.filter)for(c=0,d=h.aiDisplayMaster.length;c<d;c++)f.push(h.aoData[h.aiDisplayMaster[c]].nTr);else if("current"==b.order&&"applied"==b.filter)for(c=
0,d=h.aiDisplay.length;c<d;c++)f.push(h.aoData[h.aiDisplay[c]].nTr);else if("original"==b.order&&"none"==b.filter)for(c=0,d=h.aoData.length;c<d;c++)f.push(h.aoData[c].nTr);else if("original"==b.order&&"applied"==b.filter)for(c=0,d=h.aoData.length;c<d;c++)-1!==i.inArray(c,h.aiDisplay)&&f.push(h.aoData[c].nTr);else F(h,1,"Unknown selection options");d=i(f);c=d.filter(a);d=d.find(a);return i([].concat(i.makeArray(c),i.makeArray(d)))};this._=function(a,b){var c=[],d,f,h=this.$(a,b);for(d=0,f=h.length;d<
f;d++)c.push(this.fnGetData(h[d]));return c};this.fnAddData=function(a,b){if(0===a.length)return[];var c=[],d,f=u(this[j.ext.iApiIndex]);if("object"===typeof a[0]&&null!==a[0])for(var h=0;h<a.length;h++){d=G(f,a[h]);if(-1==d)return c;c.push(d)}else{d=G(f,a);if(-1==d)return c;c.push(d)}f.aiDisplay=f.aiDisplayMaster.slice();(b===l||b)&&Z(f);return c};this.fnAdjustColumnSizing=function(a){var b=u(this[j.ext.iApiIndex]);r(b);a===l||a?this.fnDraw(!1):(""!==b.oScroll.sX||""!==b.oScroll.sY)&&this.oApi._fnScrollDraw(b)};
this.fnClearTable=function(a){var b=u(this[j.ext.iApiIndex]);ea(b);(a===l||a)&&y(b)};this.fnClose=function(a){for(var b=u(this[j.ext.iApiIndex]),c=0;c<b.aoOpenRows.length;c++)if(b.aoOpenRows[c].nParent==a)return(a=b.aoOpenRows[c].nTr.parentNode)&&a.removeChild(b.aoOpenRows[c].nTr),b.aoOpenRows.splice(c,1),0;return 1};this.fnDeleteRow=function(a,b,c){var d=u(this[j.ext.iApiIndex]),f,h,a="object"===typeof a?K(d,a):a,e=d.aoData.splice(a,1);for(f=0,h=d.aoData.length;f<h;f++)if(null!==d.aoData[f].nTr)d.aoData[f].nTr._DT_RowIndex=
f;f=i.inArray(a,d.aiDisplay);d.asDataSearch.splice(f,1);fa(d.aiDisplayMaster,a);fa(d.aiDisplay,a);"function"===typeof b&&b.call(this,d,e);if(d._iDisplayStart>=d.aiDisplay.length&&(d._iDisplayStart-=d._iDisplayLength,0>d._iDisplayStart))d._iDisplayStart=0;if(c===l||c)z(d),y(d);return e};this.fnDestroy=function(a){var b=u(this[j.ext.iApiIndex]),c=b.nTableWrapper.parentNode,d=b.nTBody,f,e,a=a===l?!1:!0;b.bDestroying=!0;for(f=0,e=b.aoDestroyCallback.length;f<e;f++)b.aoDestroyCallback[f].fn();for(f=0,
e=b.aoColumns.length;f<e;f++)!1===b.aoColumns[f].bVisible&&this.fnSetColumnVis(f,!0);i(b.nTableWrapper).find("*").andSelf().unbind(".DT");i("tbody>tr>td."+b.oClasses.sRowEmpty,b.nTable).parent().remove();b.nTable!=b.nTHead.parentNode&&(i(b.nTable).children("thead").remove(),b.nTable.appendChild(b.nTHead));b.nTFoot&&b.nTable!=b.nTFoot.parentNode&&(i(b.nTable).children("tfoot").remove(),b.nTable.appendChild(b.nTFoot));b.nTable.parentNode.removeChild(b.nTable);i(b.nTableWrapper).remove();b.aaSorting=
[];b.aaSortingFixed=[];Q(b);i(S(b)).removeClass(b.asStripeClasses.join(" "));i("th, td",b.nTHead).removeClass([b.oClasses.sSortable,b.oClasses.sSortableAsc,b.oClasses.sSortableDesc,b.oClasses.sSortableNone].join(" "));b.bJUI&&(i("th span."+b.oClasses.sSortIcon+", td span."+b.oClasses.sSortIcon,b.nTHead).remove(),i("th, td",b.nTHead).each(function(){var a=i("div."+b.oClasses.sSortJUIWrapper,this),c=a.contents();i(this).append(c);a.remove()}));!a&&b.nTableReinsertBefore?c.insertBefore(b.nTable,b.nTableReinsertBefore):
a||c.appendChild(b.nTable);for(f=0,e=b.aoData.length;f<e;f++)null!==b.aoData[f].nTr&&d.appendChild(b.aoData[f].nTr);if(!0===b.oFeatures.bAutoWidth)b.nTable.style.width=p(b.sDestroyWidth);i(d).children("tr:even").addClass(b.asDestroyStripes[0]);i(d).children("tr:odd").addClass(b.asDestroyStripes[1]);for(f=0,e=j.settings.length;f<e;f++)j.settings[f]==b&&j.settings.splice(f,1);b=null};this.fnDraw=function(a){var b=u(this[j.ext.iApiIndex]);a?(z(b),y(b)):Z(b)};this.fnFilter=function(a,b,c,d,f,e){var g=
u(this[j.ext.iApiIndex]);if(g.oFeatures.bFilter){if(c===l||null===c)c=!1;if(d===l||null===d)d=!0;if(f===l||null===f)f=!0;if(e===l||null===e)e=!0;if(b===l||null===b){if(M(g,{sSearch:a+"",bRegex:c,bSmart:d,bCaseInsensitive:e},1),f&&g.aanFeatures.f){b=g.aanFeatures.f;c=0;for(d=b.length;c<d;c++)i("input",b[c]).val(a)}}else i.extend(g.aoPreSearchCols[b],{sSearch:a+"",bRegex:c,bSmart:d,bCaseInsensitive:e}),M(g,g.oPreviousSearch,1)}};this.fnGetData=function(a,b){var c=u(this[j.ext.iApiIndex]);if(a!==l){var d=
a;if("object"===typeof a){var f=a.nodeName.toLowerCase();"tr"===f?d=K(c,a):"td"===f&&(d=K(c,a.parentNode),b=da(c,d,a))}return b!==l?w(c,d,b,""):c.aoData[d]!==l?c.aoData[d]._aData:null}return X(c)};this.fnGetNodes=function(a){var b=u(this[j.ext.iApiIndex]);return a!==l?b.aoData[a]!==l?b.aoData[a].nTr:null:S(b)};this.fnGetPosition=function(a){var b=u(this[j.ext.iApiIndex]),c=a.nodeName.toUpperCase();if("TR"==c)return K(b,a);return"TD"==c||"TH"==c?(c=K(b,a.parentNode),a=da(b,c,a),[c,t(b,a),a]):null};
this.fnIsOpen=function(a){for(var b=u(this[j.ext.iApiIndex]),c=0;c<b.aoOpenRows.length;c++)if(b.aoOpenRows[c].nParent==a)return!0;return!1};this.fnOpen=function(a,b,c){var d=u(this[j.ext.iApiIndex]),f=S(d);if(-1!==i.inArray(a,f)){this.fnClose(a);var f=k.createElement("tr"),e=k.createElement("td");f.appendChild(e);e.className=c;e.colSpan=v(d);"string"===typeof b?e.innerHTML=b:i(e).html(b);b=i("tr",d.nTBody);-1!=i.inArray(a,b)&&i(f).insertAfter(a);d.aoOpenRows.push({nTr:f,nParent:a});return f}};this.fnPageChange=
function(a,b){var c=u(this[j.ext.iApiIndex]);oa(c,a);z(c);(b===l||b)&&y(c)};this.fnSetColumnVis=function(a,b,c){var d=u(this[j.ext.iApiIndex]),f,e,g=d.aoColumns,i=d.aoData,o,m;if(g[a].bVisible!=b){if(b){for(f=e=0;f<a;f++)g[f].bVisible&&e++;m=e>=v(d);if(!m)for(f=a;f<g.length;f++)if(g[f].bVisible){o=f;break}for(f=0,e=i.length;f<e;f++)null!==i[f].nTr&&(m?i[f].nTr.appendChild(i[f]._anHidden[a]):i[f].nTr.insertBefore(i[f]._anHidden[a],L(d,f)[o]))}else for(f=0,e=i.length;f<e;f++)null!==i[f].nTr&&(o=L(d,
f)[a],i[f]._anHidden[a]=o,o.parentNode.removeChild(o));g[a].bVisible=b;U(d,d.aoHeader);d.nTFoot&&U(d,d.aoFooter);for(f=0,e=d.aoOpenRows.length;f<e;f++)d.aoOpenRows[f].nTr.colSpan=v(d);if(c===l||c)r(d),y(d);pa(d)}};this.fnSettings=function(){return u(this[j.ext.iApiIndex])};this.fnSort=function(a){var b=u(this[j.ext.iApiIndex]);b.aaSorting=a;P(b)};this.fnSortListener=function(a,b,c){ga(u(this[j.ext.iApiIndex]),a,b,c)};this.fnUpdate=function(a,b,c,d,f){var e=u(this[j.ext.iApiIndex]),b="object"===typeof b?
K(e,b):b;if(e.__fnUpdateDeep===l&&i.isArray(a)&&"object"===typeof a){e.aoData[b]._aData=a.slice();e.__fnUpdateDeep=!0;for(c=0;c<e.aoColumns.length;c++)this.fnUpdate(w(e,b,c),b,c,!1,!1);e.__fnUpdateDeep=l}else if(e.__fnUpdateDeep===l&&null!==a&&"object"===typeof a){e.aoData[b]._aData=i.extend(!0,{},a);e.__fnUpdateDeep=!0;for(c=0;c<e.aoColumns.length;c++)this.fnUpdate(w(e,b,c),b,c,!1,!1);e.__fnUpdateDeep=l}else{J(e,b,c,a);var a=w(e,b,c,"display"),g=e.aoColumns[c];null!==g.fnRender&&(a=R(e,b,c),g.bUseRendered&&
J(e,b,c,a));if(null!==e.aoData[b].nTr)L(e,b)[c].innerHTML=a}c=i.inArray(b,e.aiDisplay);e.asDataSearch[c]=la(e,W(e,b,"filter"));(f===l||f)&&r(e);(d===l||d)&&Z(e);return 0};this.fnVersionCheck=j.ext.fnVersionCheck;this.oApi={_fnExternApiFunc:Ta,_fnInitialise:$,_fnInitComplete:Y,_fnLanguageCompat:na,_fnAddColumn:o,_fnColumnOptions:E,_fnAddData:G,_fnCreateTr:ca,_fnGatherData:ta,_fnBuildHead:ua,_fnDrawHead:U,_fnDraw:y,_fnReDraw:Z,_fnAjaxUpdate:va,_fnAjaxParameters:Da,_fnAjaxUpdateDraw:Ea,_fnServerParams:ha,
_fnAddOptionsHtml:wa,_fnFeatureHtmlTable:Aa,_fnScrollDraw:Ja,_fnAdjustColumnSizing:r,_fnFeatureHtmlFilter:ya,_fnFilterComplete:M,_fnFilterCustom:Ha,_fnFilterColumn:Ga,_fnFilter:Fa,_fnBuildSearchArray:ia,_fnBuildSearchRow:la,_fnFilterCreateSearch:ja,_fnDataToSearch:ka,_fnSort:P,_fnSortAttachListener:ga,_fnSortingClasses:Q,_fnFeatureHtmlPaginate:Ca,_fnPageChange:oa,_fnFeatureHtmlInfo:Ba,_fnUpdateInfo:Ia,_fnFeatureHtmlLength:xa,_fnFeatureHtmlProcessing:za,_fnProcessingDisplay:H,_fnVisibleToColumnIndex:s,
_fnColumnIndexToVisible:t,_fnNodeToDataIndex:K,_fnVisbleColumns:v,_fnCalculateEnd:z,_fnConvertToWidth:Ka,_fnCalculateColumnWidths:ba,_fnScrollingWidthAdjust:Ma,_fnGetWidestNode:La,_fnGetMaxLenString:Na,_fnStringToCss:p,_fnDetectType:B,_fnSettingsFromNode:u,_fnGetDataMaster:X,_fnGetTrNodes:S,_fnGetTdNodes:L,_fnEscapeRegex:ma,_fnDeleteIndex:fa,_fnReOrderIndex:D,_fnColumnOrdering:x,_fnLog:F,_fnClearTable:ea,_fnSaveState:pa,_fnLoadState:Qa,_fnCreateCookie:function(a,b,c,d,e){var h=new Date;h.setTime(h.getTime()+
1E3*c);var c=aa.location.pathname.split("/"),a=a+"_"+c.pop().replace(/[\/:]/g,"").toLowerCase(),g;null!==e?(g="function"===typeof i.parseJSON?i.parseJSON(b):eval("("+b+")"),b=e(a,g,h.toGMTString(),c.join("/")+"/")):b=a+"="+encodeURIComponent(b)+"; expires="+h.toGMTString()+"; path="+c.join("/")+"/";e="";h=9999999999999;if(4096<(null!==Ra(a)?k.cookie.length:b.length+k.cookie.length)+10){for(var a=k.cookie.split(";"),j=0,o=a.length;j<o;j++)if(-1!=a[j].indexOf(d)){var m=a[j].split("=");try{g=eval("("+
decodeURIComponent(m[1])+")")}catch(l){continue}if(g.iCreate&&g.iCreate<h)e=m[0],h=g.iCreate}if(""!==e)k.cookie=e+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+c.join("/")+"/"}k.cookie=b},_fnReadCookie:Ra,_fnDetectHeader:T,_fnGetUniqueThs:O,_fnScrollBarWidth:Oa,_fnApplyToChildren:N,_fnMap:n,_fnGetRowData:W,_fnGetCellData:w,_fnSetCellData:J,_fnGetObjectDataFn:V,_fnSetObjectDataFn:sa,_fnApplyColumnDefs:I,_fnBindAction:Pa,_fnExtend:Sa,_fnCallbackReg:A,_fnCallbackFire:C,_fnJsonString:Ua,_fnRender:R,
_fnNodeToColumnIndex:da};i.extend(j.ext.oApi,this.oApi);for(var qa in j.ext.oApi)qa&&(this[qa]=Ta(qa));var ra=this;return this.each(function(){var a=0,b,c,d;c=this.getAttribute("id");var f=!1,h=!1;if("table"!=this.nodeName.toLowerCase())F(null,0,"Attempted to initialise DataTables on a node which is not a table: "+this.nodeName);else{for(a=0,b=j.settings.length;a<b;a++){if(j.settings[a].nTable==this){if(e===l||e.bRetrieve)return j.settings[a].oInstance;if(e.bDestroy){j.settings[a].oInstance.fnDestroy();
break}else{F(j.settings[a],0,"Cannot reinitialise DataTable.\n\nTo retrieve the DataTables object for this table, pass no arguments or see the docs for bRetrieve and bDestroy");return}}if(j.settings[a].sTableId==this.id){j.settings.splice(a,1);break}}if(null===c)this.id=c="DataTables_Table_"+j.ext._oExternConfig.iNextUnique++;var g=i.extend(!0,{},j.models.oSettings,{nTable:this,oApi:ra.oApi,oInit:e,sDestroyWidth:i(this).width(),sInstance:c,sTableId:c});j.settings.push(g);g.oInstance=1===ra.length?
ra:i(this).dataTable();e||(e={});e.oLanguage&&na(e.oLanguage);e=Sa(i.extend(!0,{},j.defaults),e);n(g.oFeatures,e,"bPaginate");n(g.oFeatures,e,"bLengthChange");n(g.oFeatures,e,"bFilter");n(g.oFeatures,e,"bSort");n(g.oFeatures,e,"bInfo");n(g.oFeatures,e,"bProcessing");n(g.oFeatures,e,"bAutoWidth");n(g.oFeatures,e,"bSortClasses");n(g.oFeatures,e,"bServerSide");n(g.oFeatures,e,"bDeferRender");n(g.oScroll,e,"sScrollX","sX");n(g.oScroll,e,"sScrollXInner","sXInner");n(g.oScroll,e,"sScrollY","sY");n(g.oScroll,
e,"bScrollCollapse","bCollapse");n(g.oScroll,e,"bScrollInfinite","bInfinite");n(g.oScroll,e,"iScrollLoadGap","iLoadGap");n(g.oScroll,e,"bScrollAutoCss","bAutoCss");n(g,e,"asStripClasses","asStripeClasses");n(g,e,"asStripeClasses");n(g,e,"fnServerData");n(g,e,"fnFormatNumber");n(g,e,"sServerMethod");n(g,e,"aaSorting");n(g,e,"aaSortingFixed");n(g,e,"aLengthMenu");n(g,e,"sPaginationType");n(g,e,"sAjaxSource");n(g,e,"sAjaxDataProp");n(g,e,"iCookieDuration");n(g,e,"sCookiePrefix");n(g,e,"sDom");n(g,e,
"bSortCellsTop");n(g,e,"iTabIndex");n(g,e,"oSearch","oPreviousSearch");n(g,e,"aoSearchCols","aoPreSearchCols");n(g,e,"iDisplayLength","_iDisplayLength");n(g,e,"bJQueryUI","bJUI");n(g,e,"fnCookieCallback");n(g,e,"fnStateLoad");n(g,e,"fnStateSave");n(g.oLanguage,e,"fnInfoCallback");A(g,"aoDrawCallback",e.fnDrawCallback,"user");A(g,"aoServerParams",e.fnServerParams,"user");A(g,"aoStateSaveParams",e.fnStateSaveParams,"user");A(g,"aoStateLoadParams",e.fnStateLoadParams,"user");A(g,"aoStateLoaded",e.fnStateLoaded,
"user");A(g,"aoRowCallback",e.fnRowCallback,"user");A(g,"aoRowCreatedCallback",e.fnCreatedRow,"user");A(g,"aoHeaderCallback",e.fnHeaderCallback,"user");A(g,"aoFooterCallback",e.fnFooterCallback,"user");A(g,"aoInitComplete",e.fnInitComplete,"user");A(g,"aoPreDrawCallback",e.fnPreDrawCallback,"user");g.oFeatures.bServerSide&&g.oFeatures.bSort&&g.oFeatures.bSortClasses?A(g,"aoDrawCallback",Q,"server_side_sort_classes"):g.oFeatures.bDeferRender&&A(g,"aoDrawCallback",Q,"defer_sort_classes");if(e.bJQueryUI){if(i.extend(g.oClasses,
j.ext.oJUIClasses),e.sDom===j.defaults.sDom&&"lfrtip"===j.defaults.sDom)g.sDom='<"H"lfr>t<"F"ip>'}else i.extend(g.oClasses,j.ext.oStdClasses);i(this).addClass(g.oClasses.sTable);if(""!==g.oScroll.sX||""!==g.oScroll.sY)g.oScroll.iBarWidth=Oa();if(g.iInitDisplayStart===l)g.iInitDisplayStart=e.iDisplayStart,g._iDisplayStart=e.iDisplayStart;if(e.bStateSave)g.oFeatures.bStateSave=!0,Qa(g,e),A(g,"aoDrawCallback",pa,"state_save");if(null!==e.iDeferLoading)g.bDeferLoading=!0,g._iRecordsTotal=e.iDeferLoading,
g._iRecordsDisplay=e.iDeferLoading;null!==e.aaData&&(h=!0);""!==e.oLanguage.sUrl?(g.oLanguage.sUrl=e.oLanguage.sUrl,i.getJSON(g.oLanguage.sUrl,null,function(a){na(a);i.extend(!0,g.oLanguage,e.oLanguage,a);$(g)}),f=!0):i.extend(!0,g.oLanguage,e.oLanguage);c=!1;d=i(this).children("tbody").children("tr");for(a=0,b=g.asStripeClasses.length;a<b;a++)if(d.filter(":lt(2)").hasClass(g.asStripeClasses[a])){c=!0;break}if(c)g.asDestroyStripes=["",""],i(d[0]).hasClass(g.oClasses.sStripeOdd)&&(g.asDestroyStripes[0]+=
g.oClasses.sStripeOdd+" "),i(d[0]).hasClass(g.oClasses.sStripeEven)&&(g.asDestroyStripes[0]+=g.oClasses.sStripeEven),i(d[1]).hasClass(g.oClasses.sStripeOdd)&&(g.asDestroyStripes[1]+=g.oClasses.sStripeOdd+" "),i(d[1]).hasClass(g.oClasses.sStripeEven)&&(g.asDestroyStripes[1]+=g.oClasses.sStripeEven),d.removeClass(g.asStripeClasses.join(" "));c=[];a=this.getElementsByTagName("thead");0!==a.length&&(T(g.aoHeader,a[0]),c=O(g));if(null===e.aoColumns){d=[];for(a=0,b=c.length;a<b;a++)d.push(null)}else d=
e.aoColumns;for(a=0,b=d.length;a<b;a++){if(e.saved_aoColumns!==l&&e.saved_aoColumns.length==b)null===d[a]&&(d[a]={}),d[a].bVisible=e.saved_aoColumns[a].bVisible;o(g,c?c[a]:null)}I(g,e.aoColumnDefs,d,function(a,b){E(g,a,b)});for(a=0,b=g.aaSorting.length;a<b;a++){g.aaSorting[a][0]>=g.aoColumns.length&&(g.aaSorting[a][0]=0);var r=g.aoColumns[g.aaSorting[a][0]];g.aaSorting[a][2]===l&&(g.aaSorting[a][2]=0);e.aaSorting===l&&g.saved_aaSorting===l&&(g.aaSorting[a][1]=r.asSorting[0]);for(c=0,d=r.asSorting.length;c<
d;c++)if(g.aaSorting[a][1]==r.asSorting[c]){g.aaSorting[a][2]=c;break}}Q(g);a=i(this).children("thead");0===a.length&&(a=[k.createElement("thead")],this.appendChild(a[0]));g.nTHead=a[0];a=i(this).children("tbody");0===a.length&&(a=[k.createElement("tbody")],this.appendChild(a[0]));g.nTBody=a[0];g.nTBody.setAttribute("role","alert");g.nTBody.setAttribute("aria-live","polite");g.nTBody.setAttribute("aria-relevant","all");a=i(this).children("tfoot");if(0<a.length)g.nTFoot=a[0],T(g.aoFooter,g.nTFoot);
if(h)for(a=0;a<e.aaData.length;a++)G(g,e.aaData[a]);else ta(g);g.aiDisplay=g.aiDisplayMaster.slice();g.bInitialised=!0;!1===f&&$(g)}})};j.version="1.9.0";j.settings=[];j.models={};j.models.ext={afnFiltering:[],afnSortData:[],aoFeatures:[],aTypes:[],fnVersionCheck:function(e){for(var i=function(e,i){for(;e.length<i;)e+="0";return e},l=j.ext.sVersion.split("."),e=e.split("."),r="",k="",t=0,v=e.length;t<v;t++)r+=i(l[t],3),k+=i(e[t],3);return parseInt(r,10)>=parseInt(k,10)},iApiIndex:0,ofnSearch:{},oApi:{},
oStdClasses:{},oJUIClasses:{},oPagination:{},oSort:{},sVersion:j.version,sErrMode:"alert",_oExternConfig:{iNextUnique:0}};j.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};j.models.oRow={nTr:null,_aData:[],_aSortData:[],_anHidden:[],_sRowStripe:""};j.models.oColumn={aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bUseRendered:null,bVisible:null,_bAutoType:!0,fnCreatedCell:null,fnGetData:null,fnRender:null,fnSetData:null,mDataProp:null,nTh:null,nTf:null,sClass:null,
sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};j.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:["odd","even"],bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollAutoCss:!0,bScrollCollapse:!1,
bScrollInfinite:!1,bServerSide:!1,bSort:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCookieCallback:null,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(e){if(1E3>e)return e;for(var i=e+"",e=i.split(""),j="",i=i.length,l=0;l<i;l++)0===l%3&&0!==l&&(j=this.oLanguage.sInfoThousands+j),j=e[i-l-1]+j;return j},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:function(e,j,l,k){k.jqXHR=i.ajax({url:e,
data:j,success:function(e){i(k.oInstance).trigger("xhr",k);l(e)},dataType:"json",cache:!1,type:k.sServerMethod,error:function(e,i){"parsererror"==i&&alert("DataTables warning: JSON data from server could not be parsed. This is caused by a JSON formatting error.")}})},fnServerParams:null,fnStateLoad:function(e){var e=this.oApi._fnReadCookie(e.sCookiePrefix+e.sInstance),j;try{j="function"===typeof i.parseJSON?i.parseJSON(e):eval("("+e+")")}catch(l){j=null}return j},fnStateLoadParams:null,fnStateLoaded:null,
fnStateSave:function(e,i){this.oApi._fnCreateCookie(e.sCookiePrefix+e.sInstance,this.oApi._fnJsonString(i),e.iCookieDuration,e.sCookiePrefix,e.fnCookieCallback)},fnStateSaveParams:null,iCookieDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iScrollLoadGap:100,iTabIndex:0,oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",
sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sInfoThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sUrl:"",sZeroRecords:"No matching records found"},oSearch:i.extend({},j.models.oSearch),sAjaxDataProp:"aaData",sAjaxSource:null,sCookiePrefix:"SpryMedia_DataTables_",sDom:"lfrtip",sPaginationType:"two_button",sScrollX:"",
sScrollXInner:"",sScrollY:"",sServerMethod:"GET"};j.defaults.columns={aDataSort:null,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bUseRendered:!0,bVisible:!0,fnCreatedCell:null,fnRender:null,iDataSort:-1,mDataProp:null,sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};j.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,
bSortClasses:null,bStateSave:null},oScroll:{bAutoCss:null,bCollapse:null,bInfinite:null,iBarWidth:0,iLoadGap:null,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],asDataSearch:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:null,asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],
aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,sPaginationType:"two_button",iCookieDuration:0,sCookiePrefix:"",fnCookieCallback:null,aoStateSave:[],aoStateLoad:[],oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,
aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iDisplayEnd:10,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsTotal,10):this.aiDisplayMaster.length},fnRecordsDisplay:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsDisplay,10):this.aiDisplay.length},fnDisplayEnd:function(){return this.oFeatures.bServerSide?
!1===this.oFeatures.bPaginate||-1==this._iDisplayLength?this._iDisplayStart+this.aiDisplay.length:Math.min(this._iDisplayStart+this._iDisplayLength,this._iRecordsDisplay):this._iDisplayEnd},oInstance:null,sInstance:null,iTabIndex:0};j.ext=i.extend(!0,{},j.models.ext);i.extend(j.ext.oStdClasses,{sTable:"dataTable",sPagePrevEnabled:"paginate_enabled_previous",sPagePrevDisabled:"paginate_disabled_previous",sPageNextEnabled:"paginate_enabled_next",sPageNextDisabled:"paginate_disabled_next",sPageJUINext:"",
sPageJUIPrev:"",sPageButton:"paginate_button",sPageButtonActive:"paginate_active",sPageButtonStaticDisabled:"paginate_button paginate_button_disabled",sPageFirst:"first",sPagePrevious:"previous",sPageNext:"next",sPageLast:"last",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",
sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",
sFooterTH:""});i.extend(j.ext.oJUIClasses,j.ext.oStdClasses,{sPagePrevEnabled:"fg-button ui-button ui-state-default ui-corner-left",sPagePrevDisabled:"fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",sPageNextEnabled:"fg-button ui-button ui-state-default ui-corner-right",sPageNextDisabled:"fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",sPageJUINext:"ui-icon ui-icon-circle-arrow-e",sPageJUIPrev:"ui-icon ui-icon-circle-arrow-w",sPageButton:"fg-button ui-button ui-state-default",
sPageButtonActive:"fg-button ui-button ui-state-default ui-state-disabled",sPageButtonStaticDisabled:"fg-button ui-button ui-state-default ui-state-disabled",sPageFirst:"first ui-corner-tl ui-corner-bl",sPageLast:"last ui-corner-tr ui-corner-br",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sSortAsc:"ui-state-default",sSortDesc:"ui-state-default",sSortable:"ui-state-default",sSortableAsc:"ui-state-default",sSortableDesc:"ui-state-default",sSortableNone:"ui-state-default",
sSortJUIAsc:"css_right ui-icon ui-icon-triangle-1-n",sSortJUIDesc:"css_right ui-icon ui-icon-triangle-1-s",sSortJUI:"css_right ui-icon ui-icon-carat-2-n-s",sSortJUIAscAllowed:"css_right ui-icon ui-icon-carat-1-n",sSortJUIDescAllowed:"css_right ui-icon ui-icon-carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead ui-state-default",sScrollFoot:"dataTables_scrollFoot ui-state-default",sFooterTH:"ui-state-default"});i.extend(j.ext.oPagination,
{two_button:{fnInit:function(e,j,l){var k=e.oLanguage.oPaginate,s=function(i){e.oApi._fnPageChange(e,i.data.action)&&l(e)},k=!e.bJUI?'<a class="'+e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+k.sPrevious+'</a><a class="'+e.oClasses.sPageNextDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+k.sNext+"</a>":'<a class="'+e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUIPrev+'"></span></a><a class="'+e.oClasses.sPageNextDisabled+
'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUINext+'"></span></a>';i(j).append(k);var t=i("a",j),k=t[0],t=t[1];e.oApi._fnBindAction(k,{action:"previous"},s);e.oApi._fnBindAction(t,{action:"next"},s);if(!e.aanFeatures.p)j.id=e.sTableId+"_paginate",k.id=e.sTableId+"_previous",t.id=e.sTableId+"_next",k.setAttribute("aria-controls",e.sTableId),t.setAttribute("aria-controls",e.sTableId)},fnUpdate:function(e){if(e.aanFeatures.p)for(var i=e.oClasses,j=e.aanFeatures.p,l=0,
k=j.length;l<k;l++)if(0!==j[l].childNodes.length)j[l].childNodes[0].className=0===e._iDisplayStart?i.sPagePrevDisabled:i.sPagePrevEnabled,j[l].childNodes[1].className=e.fnDisplayEnd()==e.fnRecordsDisplay()?i.sPageNextDisabled:i.sPageNextEnabled}},iFullNumbersShowPages:5,full_numbers:{fnInit:function(e,j,l){var k=e.oLanguage.oPaginate,s=e.oClasses,t=function(i){e.oApi._fnPageChange(e,i.data.action)&&l(e)};i(j).append('<a  tabindex="'+e.iTabIndex+'" class="'+s.sPageButton+" "+s.sPageFirst+'">'+k.sFirst+
'</a><a  tabindex="'+e.iTabIndex+'" class="'+s.sPageButton+" "+s.sPagePrevious+'">'+k.sPrevious+'</a><span></span><a tabindex="'+e.iTabIndex+'" class="'+s.sPageButton+" "+s.sPageNext+'">'+k.sNext+'</a><a tabindex="'+e.iTabIndex+'" class="'+s.sPageButton+" "+s.sPageLast+'">'+k.sLast+"</a>");var v=i("a",j),k=v[0],s=v[1],B=v[2],v=v[3];e.oApi._fnBindAction(k,{action:"first"},t);e.oApi._fnBindAction(s,{action:"previous"},t);e.oApi._fnBindAction(B,{action:"next"},t);e.oApi._fnBindAction(v,{action:"last"},
t);if(!e.aanFeatures.p)j.id=e.sTableId+"_paginate",k.id=e.sTableId+"_first",s.id=e.sTableId+"_previous",B.id=e.sTableId+"_next",v.id=e.sTableId+"_last"},fnUpdate:function(e,l){if(e.aanFeatures.p){var k=j.ext.oPagination.iFullNumbersShowPages,r=Math.floor(k/2),s=Math.ceil(e.fnRecordsDisplay()/e._iDisplayLength),t=Math.ceil(e._iDisplayStart/e._iDisplayLength)+1,v="",B,D=e.oClasses,x,I=e.aanFeatures.p,G=function(i){e.oApi._fnBindAction(this,{page:i+B-1},function(i){e.oApi._fnPageChange(e,i.data.page);
l(e);i.preventDefault()})};s<k?(B=1,r=s):t<=r?(B=1,r=k):t>=s-r?(B=s-k+1,r=s):(B=t-Math.ceil(k/2)+1,r=B+k-1);for(k=B;k<=r;k++)v+=t!==k?'<a tabindex="'+e.iTabIndex+'" class="'+D.sPageButton+'">'+e.fnFormatNumber(k)+"</a>":'<a tabindex="'+e.iTabIndex+'" class="'+D.sPageButtonActive+'">'+e.fnFormatNumber(k)+"</a>";for(k=0,r=I.length;k<r;k++)0!==I[k].childNodes.length&&(i("span:eq(0)",I[k]).html(v).children("a").each(G),x=I[k].getElementsByTagName("a"),x=[x[0],x[1],x[x.length-2],x[x.length-1]],i(x).removeClass(D.sPageButton+
" "+D.sPageButtonActive+" "+D.sPageButtonStaticDisabled),i([x[0],x[1]]).addClass(1==t?D.sPageButtonStaticDisabled:D.sPageButton),i([x[2],x[3]]).addClass(0===s||t===s||-1===e._iDisplayLength?D.sPageButtonStaticDisabled:D.sPageButton))}}}});i.extend(j.ext.oSort,{"string-pre":function(e){"string"!=typeof e&&(e="");return e.toLowerCase()},"string-asc":function(e,i){return e<i?-1:e>i?1:0},"string-desc":function(e,i){return e<i?1:e>i?-1:0},"html-pre":function(e){return e.replace(/<.*?>/g,"").toLowerCase()},
"html-asc":function(e,i){return e<i?-1:e>i?1:0},"html-desc":function(e,i){return e<i?1:e>i?-1:0},"date-pre":function(e){e=Date.parse(e);if(isNaN(e)||""===e)e=Date.parse("01/01/1970 00:00:00");return e},"date-asc":function(e,i){return e-i},"date-desc":function(e,i){return i-e},"numeric-pre":function(e){return"-"==e||""===e?0:1*e},"numeric-asc":function(e,i){return e-i},"numeric-desc":function(e,i){return i-e}});i.extend(j.ext.aTypes,[function(e){if("number"===typeof e)return"numeric";if("string"!==
typeof e)return null;var i,j=!1;i=e.charAt(0);if(-1=="0123456789-".indexOf(i))return null;for(var k=1;k<e.length;k++){i=e.charAt(k);if(-1=="0123456789.".indexOf(i))return null;if("."==i){if(j)return null;j=!0}}return"numeric"},function(e){var i=Date.parse(e);return null!==i&&!isNaN(i)||"string"===typeof e&&0===e.length?"date":null},function(e){return"string"===typeof e&&-1!=e.indexOf("<")&&-1!=e.indexOf(">")?"html":null}]);i.fn.DataTable=j;i.fn.dataTable=j;i.fn.dataTableSettings=j.settings;i.fn.dataTableExt=
j.ext})(jQuery,window,document,void 0);
/**
 * @class Oskari.poc.jquery.bundle.FeatureInfoBundleInstance
 *
 */
Oskari.clazz.define("Oskari.poc.jquery.bundle.FeatureInfoBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.template = null;
	this.plugins = {};

	/**
	 * @property injected yuilibrary property (by bundle)
	 */
	this.yuilibrary = null;

}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'jqueryFeatureInfo',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 *
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method start
	 *
	 * implements BundleInstance start methdod
	 *
	 * Note this is async as DOJO requires are resolved and
	 * notified by callback
	 *
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		/**
		 * Let's extend UI
		 */
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		/**
		 * let's load dependencies me
		 */
		me.mediator.bundle.require(function() {
			me.refresh();
		});
	},
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 *
	 * implements bundle instance update method
	 */
	"update" : function() {

	},
	/**
	 * @method afterChangeMapLayerOpacityEvent
	 */
	afterChangeMapLayerOpacityEvent : function(event) {

	},
	/**
	 * @method onEvent
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
	/**
	 * @property eventHandlers
	 * @static
	 *
	 */
	eventHandlers : {
		'AfterMapLayerAddEvent' : function(event) {
			//this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			//this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapMoveEvent' : function(event) {

		},
		/**
		 * @method AfterChangeMapLayerOpacityEvent
		 */
		'AfterChangeMapLayerOpacityEvent' : function(event) {
			if(this.sandbox.getObjectCreator(event) != this.getName()) {
				/* someone changed opacity */
				this.afterChangeMapLayerOpacityEvent(event);
			}
		}
	},

	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregister(this);
		this.started = false;
	},
	setSandbox : function(sandbox) {
		this.sandbox = null;
	},
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.jquery.featureinfo.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.jquery.featureinfo.Tile', this);
	},
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	getTitle : function() {
		return "Layer Selection";
	},
	getDescription : function() {
		return "Sample";
	},
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method refresh
	 *
	 * (re)creates selected layers to a hardcoded DOM div
	 * #featureinfo This
	 */
	refresh : function() {
		var me = this;

		this.plugins['Oskari.userinterface.Flyout'].refresh();
		this.plugins['Oskari.userinterface.Tile'].refresh();

	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.poc.yuilibrary.featureinfo.Flyout
 */
Oskari.clazz.define('Oskari.poc.jquery.featureinfo.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.templateRow = null;
	this.templateCell = null;
	this.state = null;
	this.yuilibrary = null;
}, {
	getName : function() {
		return 'Oskari.poc.jquery.featureinfo.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = el[0];
		// ?
	},
	startPlugin : function() {
		this.template = $('<table id="samitest" class="featureTypeGrid"></table>');
		this.templateRow = $('<tr></tr>');
		this.templateCell = $('<td></td>');
	},
	stopPlugin : function() {

	},
	getTitle : function() {
		return "Taulukko JQuery";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	refresh : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();
		jQuery(me.container).empty();
		var data = [];
		for(var t = 0; t < 250; t++) {
			data.push({
				id: t,
				name : 'sami' + t
			});
		}
			
		var table = jQuery(me.template).clone();
		table.append("<thead><tr><th>id</th><th>name</th></tr></thead>");

		for(var i = 0, len = data.length; i < len; ++i) {
			
			var row = jQuery(me.templateRow).clone();
			
			row.append(jQuery(me.templateCell).clone().append(data[i].id));
			row.append(jQuery(me.templateCell).clone().append(data[i].name));
			table.append(row);
		}
		jQuery(me.container).append(table);
		
		
		var oTable = jQuery('#samitest').dataTable({
			"oLanguage": {
				"sEmptyTable": "Tyhjä!",
				"sProcessing": "Ladataan...",
		        "sLengthMenu": "Näytä _MENU_ tietuetta/sivu",
		        "sZeroRecords": "ei löytynyt",
		        "sInfo": "Tietueet: _START_ - _END_ Yhteensä _TOTAL_ kpl",
		        "sInfoEmtpy": "Ei tietueita",
		        "sInfoFiltered": "(Rajattu/kaikkiaan _MAX_)",
		        "sInfoPostFix": "",
		        "sSearch": "Rajaus:",
		        "sUrl": "",
		        "oPaginate": {
	                "sFirst":    "  <<  ",
	                "sPrevious": "Edellinen",
	                "sNext":     "Seuraava",
	                "sLast":     "  >>  "
	            }
			}
		});
		
	    jQuery("#samitest tbody tr").live('click', function( e ) {
	        jQuery(this).toggleClass('row_selected');
	        /*if ( jQuery(this).hasClass('row_selected') ) {
	            jQuery(this).removeClass('row_selected');
	        }
	        else {
	            oTable.$('tr.row_selected').removeClass('row_selected');
	            jQuery(this).addClass('row_selected');
	        }
	        */
	        var anSelected = oTable.$('tr.row_selected');
	        console.dir(oTable.fnGetData());
	        //var nTds = $('td', this);
	        var index = -1;
	        if(anSelected.length > 0) {
	        	index = anSelected[0]._DT_RowIndex;
	        }
	        
	        if(index != -1) {
	        	var allRows = oTable.$('tr');
	        	console.dir(allRows[index]);
	        	console.log('rivimäärä: ' + allRows.length);
	        }
	    });
	     
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.poc.yuilibrary.featureinfo.Tile
 */
Oskari.clazz.define('Oskari.poc.jquery.featureinfo.Tile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
}, {
	getName : function() {
		return 'Oskari.poc.jquery.featureinfo.Tile';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		this.refresh();
	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return "Kohdetiedot";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		console.log("Tile.setState", this, state);
	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		var layers = sandbox.findAllSelectedMapLayers();

		/*var status = cel.children('.oskari-tile-status');
		 status.empty();

		 status.append('(' + layers.length + ')');*/

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
