Oskari.registerLocalization({
    "lang": "en",
    "key": "admin-layerselector",
    "value": {
        "title": "admin: Map layers",
        "desc": "",
        "flyout": {
            "title": "admin: Map layers",
            "fetchingLayers" : "Fetching layers."
        },
        "tile": {
            "title": "A: Map layers",
            "tooltip": "."
        },
        "view": {
            "title": "",
            "prompt": "",
            "templates": {}
        },
        "errors": {
            "title": "Error!",
            "generic": "There was an error in the system. Try again later.",
            "loadFailed": "Error loading map layers. Reload the page and choose admin map layers.",
            "noResults": "The search found no results.."
        },
        "loading": "Loading...",
        "filter": {
            "text": "Search map layers",
            "inspire": "By theme",
            "organization": "By data providers",
            "published": "Users",
            "userThemes" : "User themes"
        },
        "published": {
            "organization": "Published layers",
            "inspire": "Published layer"
        },
        "tooltip": {
            "type-base": "Base",
            "type-wms": "Map layer",
            "type-wfs": "Data product"
        },
        "backendStatus": {
            "OK": {
                "tooltip": "Map layer is currently available.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "Map layer is currently not available.",
                "iconClass": "backendstatus-down"
            },
            "MAINTENANCE": {
                "tooltip": "Interruptions in the availability of map levels is expected during the next few days.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-ok"
            }
        },
        "admin": {
            "capabilitiesLabel" : "WMSCapabilities",
            "confirmResourceKeyChange" : "By changing the values of wmsname and url the layer permissions will reset. Continue?",
            "confirmDeleteLayerGroup" : "Delete layer group. Continue?",
            "confirmDeleteLayer" : "Delete layer. Continue?",
            "layertypes" : {
                "wms": "WMS layer",
                "wfs": "WFS layer",
                "wmts": "WMTS layer",
                "arcgislayer": "ArcGis layer"
            },
            "selectLayer": "Select layer",
            "selectSubLayer": "Select sublayer",

            "addOrganization": "Add organization",
            "addOrganizationDesc": "Add organization i.e. new content producer",
            "addInspire": "Add class",
            "addInspireDesc": "Add class i.e. a new Inspire theme",
            "addLayer": "Add layer",
            "addLayerDesc": "Add layer into this Inspire theme",
            "edit": "Edit",
            "editDesc": "Edit name",
            "layerType": "Layer type",
            "layerTypeDesc": "Layer type: WMS, WFS, WMTS",
            "type": "Layer type",
            "typePlaceholder": "Choose layer type",
            "normalLayer": "WMS layer",
            "baseLayer": "Base layer",
            "groupLayer": "Group layer",
            "wfslayer" : "WFS layer",
            "arcgisLayer": "ArcGis layer",
            "interfaceVersion": "Interface version",
            "interfaceVersionDesc": "Interface version",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "wfs1_0_0": "WFS 1.0.0",
            "wfs1_1_0": "WFS 1.1.0",
            "getInfo": "Get info",
            "selectClass": "Select class",
            "selectClassDesc": "Select Inspire theme",

            "baseName": "Base layer name",
            "groupName": "Group layer name",
            "subLayers": "Sublayers",
            "addSubLayer": "Add sublayer",

            "wmsInterfaceAddress": "WMS interface URL",
            "wmsUrl": "WMS interface URL",
            "wmsInterfaceAddressDesc": "WMS interface URL-addresses separated with commas",
            "wmsServiceMetaId": "WMS metadata id",
            "wmsServiceMetaIdDesc": "Metadata id of WMS service",
            "layerNameAndDesc": "Name and description of the layer",
			
			"downloadServiceUrlDesc": "Download service URL",
			"downloadServiceUrl": "Download service URL",
			"copyrightInfoDesc": "Copyright info",
            "copyrightInfo" : "Copyright info",

            "metaInfoIdDesc": "Metadata id to identify xml description of this metadata",
            "metaInfoId": "Metadata Id",
            "metaInfoUrlDesc": "Metadata Url",
            "metaInfoUrl": "Metadata Url",
            "wmsName": "WMS name",
            "wmsNameDesc": "WMS layer i.e. unique name",

            "wfsusername": "Username",
            "wfspassword": "Password",
            "wfsgmlversion": "GML version",
            "wfsgmlgeometryproperty": "GML geometry property",
            "wfsfeaturenamespaceURI": "Feature namespace URI",
            "wfsfeaturenamespace": "Feature namespace",
            "wfsfeatureelement": "Feature element",
            "wfsgeometrynamespaceURI" : "Geometry namespace URI",

            "addInspireName": "Class name",
            "addInspireNameTitle": "Name of the Inspire class",
            "addOrganizationName": "Organization",
            "addOrganizationNameTitle": "Name of the organization",
            "addNewClass": "Add new class",
            "addNewLayer": "Add new layer",
            "addNewGroupLayer": "Add new group layer",
            "addNewBaseLayer": "Add new base layer",
            "addNewOrganization": "Add new organization",
            "addInspireThemes": "Add class",
            "addInspireThemesDesc": "Add classes (Inspire themes)",
            "opacity": "Opacity",
            "opacityDesc": "Layer opacity (0% will make the layer transparent)",
            "style": "Default style",
            "styleDesc": "Default style",

            "minScale": "Minimum scale",
            "minScaleDesc": "Layer's minimum scale",
            "minScalePlaceholder": "Layer's minimum scale",
            "maxScale": "Maximum scale",
            "maxScaleDesc": "Layer's maximum scale",
            "maxScalePlaceholder": "Layer's maximum scale",
            "srsName": "Coordinate system",
            "srsNamePlaceholder": "Coordinate system",
            "legendImage": "Legenda image",
            "legendImageDesc": "URL for legenda image",
            "legendImagePlaceholder": "URL for legenda image",
            "gfiResponseType": "GFI response type",
            "gfiResponseTypeDesc": "Response type for Get Feature Info (GFI)",
            "gfiStyle": "GFI style",
            "gfiStyleDesc": "GFI style (XSLT)",
            "realtime": "Real time layer",
            "refreshRate": "Refresh rate (in seconds)",

            "generic": {
                "placeholder": "Name in {0}",
                "descplaceholder": "Description in {0}"
            },
            "en": {
                "lang": "English:",
                "title": "En",
                "placeholder": "Name in English",
                "descplaceholder": "Description in English"
            },
            "fi": {
                "lang": "Finnish:",
                "title": "Fi",
                "placeholder": "Name in Finnish",
                "descplaceholder": "Description in Finnish"
            },
            "sv": {
                "lang": "Swedish:",
                "title": "Sv",
                "placeholder": "Name in Swedish",
                "descplaceholder": "Description in Swedish"
            },

            "interfaceAddress": "interface URL",
            "arcgisMapServerInterfaceAddress": "MapServer interface address",
            "arcgisMapServerAddress": "MapServer address",
            "wfsInterfaceAddress": "WFS interface URL",
            "layersLabel" : "Available layers",
            "layerName": "Layer name",
            "interfaceAddressDesc": "URL for WMS layer definitions",
            "viewingRightsRoles": "Viewing Rights roles",
            "metadataReadFailure": "Fetching layer metadata failed.",
            "mandatory_field_missing": "Field is required: ",
            "invalid_field_value": "Invalid value: ",
            "operation_not_permitted_for_layer_id": "Operation not permitted for layer ",
            "no_layer_with_id": "Layer not found with id "
        },
        "cancel": "Cancel",
        "add": "Add",
        "delete": "Remove"
    }
});