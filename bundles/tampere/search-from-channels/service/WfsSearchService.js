/**
 * @class Oskari.tampere.bundle.searchfromchannels.service.WfsSearchService
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 */
Oskari.clazz.define('Oskari.tampere.bundle.searchfromchannels.service.WfsSearchService',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchUrl ajax URL to actual search implementation
 */
function (searchUrl) {

    /* searchUrl url that will give us results */
    this._searchUrl = searchUrl;
}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.tampere.bundle.searchfromchannels.service.WfsSearchService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    /** @static @property __name service name */
    __name : "SearchService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method doSearch
     *
     * Makes the actual ajax call to search service implementation
	 * @param {String}
	 *            searchString the query to search with
	 * @param {Function}
	 *            onSuccess callback method for successful search
	 * @param {Function}
	 *            onComplete callback method for search completion
     */
    doSearch : function(searchString, channelIds, onSuccess, onError) {
        var lang = Oskari.getLang(),
            epsg = Oskari.getSandbox().getMap().getSrsName();
        jQuery.ajax({
            dataType : "json",
            type : "POST",
            url : this._searchUrl,
            data : {
                "searchKey" : searchString,
                "Language" : lang,
                "epsg" : epsg,
                "channels" : channelIds.join()
            },
            error : onError,
            success : onSuccess
        });
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance */