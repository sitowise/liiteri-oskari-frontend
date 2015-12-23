$(function () {

    var _getUrlParameter = function (sParam, defaultParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
        return defaultParam;
    };

    var lang = _getUrlParameter('lang', 'fi');
    Oskari.setLang(lang);
    var instance = {};
    instance.sandbox = {};
    instance.sandbox.getAjaxUrl = function () {
        return "/?";
    }
    instance.getLocalization = function (key) {
        return Oskari.getLocalization('liiteri-urbanplanning')[key];
    };
    
    jQuery.ajax({
        type: 'GET',
        dataType: 'json',
        url: instance.sandbox.getAjaxUrl() + 'action_route=GetAppSetup',
        success: function (setup) {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
              
                ga('create', setup.configuration['liiteri-ui'].conf.analytics.trackingId, 'auto');
                ga('send', 'pageview', document.location.pathname);
        }
    });

    var summaryElements = [];
    var summaryData = null;

    var _fillData = function (resp) {
	    var form = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanDetailsForm', instance);
	    var data = form.getFormFor(resp);
        $('body').html(data);
	    
        var btn = jQuery('<input type="button"/>');
        btn.addClass('primary');
        btn.attr('value', instance.getLocalization('view').table.close);
        btn.bind('click', function () {
            window.close();
        })
        var printBtn = jQuery('<input type="button"/>');
        printBtn.addClass('primary');
        printBtn.attr('value', instance.getLocalization('view').table.print);
        printBtn.bind('click', function () {
            window.print();
        });
	    
        var buttonContainer = jQuery('<div class="actions"/>');
        buttonContainer.append(btn);
        buttonContainer.append(printBtn);

        if(resp.hasGeometry === true) {
            var mapBtn = jQuery('<input type="button"/>');
            mapBtn.addClass('primary');
            mapBtn.attr('value', 'Näytä kartalla');
            mapBtn.bind('click', function () {
                var url = instance.sandbox.getAjaxUrl() + "asemakaava=" + resp.tyviId;
                var win = window.open(url, '_blank');
                win.focus();
            });  
            buttonContainer.append(mapBtn);
        }
        data.append(buttonContainer);        
    };
    var _fillSummary = function() {
        var form = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.UrbanPlanDetailsForm', instance);
        var data = form.getFormFor(summaryData, true, summaryElements);
        $('body').html(data);
    };
    var _setDataSummary = function (resp, size) {
        summaryData = resp;
        if (summaryElements.length == size && summaryData != null)
            _fillSummary();
    };
    var _setDataSummaryElements = function (resp, size) {
        summaryElements.push(resp);
        if (summaryElements.length == size && summaryData != null)
            _fillSummary();
    };
    var _errorCb = function(jqxhr, textStatus) {
        $('body').text(jqxhr.statusText);
    };

    var planId = _getUrlParameter('id');
    var summary = (_getUrlParameter('summary', 'false') === 'true');

    var service = Oskari.clazz.create('Oskari.liiteri.bundle.liiteri-urbanplanning.service.UrbanPlanningService', instance);
		
    if (summary) {
        var planIds = planId.split(",");
        var numberOfIds = planIds.length;
        service.getUrbanPlanSummaryData(planIds, function (resp) { _setDataSummary(resp, numberOfIds); }, _errorCb);
        for (var ix = 0; ix < planIds.length; ix++) {
            service.getUrbanPlanDetailData(planIds[ix], function (resp) { _setDataSummaryElements(resp, numberOfIds); }, _errorCb);
        }        
    } else {
        service.getUrbanPlanDetailData(planId, _fillData, _errorCb);
    }    
});