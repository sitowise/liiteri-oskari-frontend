Oskari.registerLocalization(
{
    "lang": "en",
    "key": "admin-layerselector",
    "value": {
        "title": "Map Layer Administration",
        "desc": "",
        "flyout": {
            "title": "Map Layer Administration",
            "fetchingLayers": "Fetching the map layers."
        },
        "tile": {
            "title": "A: Map Layers",
            "tooltip": "NOT TRANSLATED"
        },
        "view": {
            "title": "",
            "prompt": "",
            "templates": {}
        },
        "errors": {
            "title": "Error",
            "generic": "A system error occurred. Data has not been updated.",
            "loadFailed": "Map layers could not be loaded. Please reload the page and select map layers again.",
            "noResults": "No search results found.",
            "layerTypeNotSupported": "The map layer type is not yet supported:",
            "not_empty": "There are map layers in this theme. Please move them to another theme before removing the theme."
        },
        "loading": "Loading…",
        "filter": {
            "text": "Search Map Layers",
            "inspire": "By Theme",
            "organization": "By Data Provider",
            "published": "Users",
            "userThemes" : "User themes"
        },
        "published": {
            "organization": "Published",
            "inspire": "Published"
        },
        "tooltip": {
            "type-base": "Background map",
            "type-wms": "Map layer",
            "type-wfs": "Data product"
        },
        "backendStatus": {
            "OK": {
                "tooltip": "The map layer is currently available.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "The map layer is currently not available.",
                "iconClass": "backendstatus-down"
            },
            "MAINTENANCE": {
                "tooltip": "There will be short breaks in the map layer's availability during the next few days.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-ok"
            }
        },
        "admin": {
            "capabilitiesLabel": "Capabilities",
            "confirmResourceKeyChange": "You have changed the unique name or  the interface address for this map layer. For security reasons the user rights for this map layer will be removed and you must set them again. Do you want to continue?",
            "confirmDeleteLayerGroup": "The map layer group will be removed. Do you want to continue?",
            "confirmDeleteLayer": "The map layer will be removed. Do you want to continue?",
            "layertypes": {
                "wms": "WMS layer",
                "wfs": "WFS layer",
                "wmts": "WMTS layer",
                "arcgis": "ArcGISCache layer",
                "arcgis93": "ArcGISRest layer",
                "arcgislayer": "ArcGis layer"
            },
            "selectLayer": "Select map layer",
            "selectSubLayer": "Select sub layer",
            "addOrganization": "Add organisation",
            "addOrganizationDesc": "Add a new organisation / data provider.",
            "addInspire": "Add theme",
            "addInspireDesc": "Add a new theme.",
            "addLayer": "Add map layer",
            "addLayerDesc": "Add a new map layer to this theme.",
            "edit": "Edit",
            "editDesc": "Edit the map layer's name.",
            "layerType": "Map layer type",
            "layerTypeDesc": "Select an approriate layer type. The current options are WMS (Web Map Service), WFS (Web Feature Service), WMTS (Web Map Tile Service), ArcGisCache (ArcGis Cache tile) and ArcGisRest (ArcGis rest layer).",
            "type": "Map layer type",
            "typePlaceholder": "The selected map layer type. Please click \"Cancel\" and try again, if you want to change the type.",
            "baseLayer": "Background map layer",
            "groupLayer": "Map layer group",
            "wfslayer" : "WFS layer",
            "arcgisLayer": "ArcGis layer",
            "interfaceVersion": "Interface version",
            "interfaceVersionDesc": "Select an appropriate version. Prioritize the newest version that is supported.",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "wfs1_0_0": "WFS 1.0.0",
            "wfs1_1_0": "WFS 1.1.0",
            "getInfo": "Get info",
            "editWfs": "Edit WFS",
            "selectClass": "Select theme",
            "selectClassDesc": "Select a theme describing the map layer from the list.",
            "baseName": "Background Map Layer Name",
            "groupName": "Map Layer Group name",
            "subLayers": "Sub layers",
            "addSubLayer": "Add sub layer",
            "editSubLayer": "Edit sub layer",
            "wmsInterfaceAddress": "Interface URL",
            "wmsUrl": "Interface URL",
            "wmsInterfaceAddressDesc": "Type the web service address in the URL form without question mark and other parameters after that. Fetch map layer parameters by clicking \"Get info\".",
            "wmsServiceMetaId": "Service metadata identifier",
            "wmsServiceMetaIdDesc": "Give a file identifier for the metadata describing the interface.",
            "layerNameAndDesc": "Map Layer Name and Description",
            "metaInfoIdDesc": "The metadata file identifier is an XML file identifier. It is fetched automatically from the GetCapabilities response.",
            "metaInfoId": "Metadata file identifier",
            "wmsName": "Unique name",
            "wmsNameDesc": "The unique name is a technical identifier. It is fetched automatically from the GetCapabilities response.",
            "username": "Username",
            "password": "Password",
            "attributes": "Attributes",
            "selectedTime": "Selected time",
            "time": "Supported time",
            "addInspireName": "Theme Name",
            "addInspireNameTitle": "Type a theme name in different languages.",
            "addOrganizationName": "Data Provider Name",
            "addOrganizationNameTitle": "Type the organisation name in different languages.",
            "addNewClass": "Add theme",
            "addNewLayer": "Add map layer",
            "addNewGroupLayer": "Add map layer group",
            "addNewBaseLayer": "Add background map",
            "addNewOrganization": "Add organisation",
            "addInspireTheme": "Theme",
            "addInspireThemeDesc": "Select an appropriate theme from the list.",
            "opacity": "Opacity",
            "opacityDesc": "Define the opacity that is used by default. If the opacity is 100%, it covers up all other layers below the layer. If the opacity is 0%, it is totally transparent. Users can control opacity in the ‘Selected Layers’ menu.",
            "style": "Default Style",
            "styleDesc": "The style options are fetched automatically from the GetCapabilities response. Select a default style from the list. If there are several options, users can select a theme in the ‘Selected Layers’ menu.",
            "minScale": "Minimum scale",
            "minScaleDesc": "The minimum scale is fetched automatically from the GetCapabilities response. The map layer is shown only if the scale is above this limit. Scales are defines as scale denominators. If scale limits are not defined, the map layers is shown at all scale levels.",
            "minScalePlaceholder": "Minimum scale in the form 5669294 (1:5669294)",
            "maxScale": "Maximum scale",
            "maxScaleDesc": "The maximum scale is fetched automatically from the GetCapabilities response. The map layer is shown only if the scale is below this limit. Scales are defines as scale denominators. If scale limits are not defined, the map layers is shown at all scale levels.",
            "maxScalePlaceholder": "Maximum scale in the form 1 (1:1)",
            "srsName": "Coordinate system",
            "srsNamePlaceholder": "Define a appropriate coordinate system.",
            "legendImage": "Map legend URL",
            "legendImageDesc": "The URL address for map legend is fetched automatically from the GetCapabilities response.",
            "legendImagePlaceholder": "Give the URL address of the map legend.",
            "gfiContent": "Additional GFI info",
            "gfiResponseType": "GFI response type",
            "gfiResponseTypeDesc": "Select a format for Get Feature Information (GFI). Possible formats are fetched automatically from the GetCapabilities response.",
            "gfiStyle": "GFI style (XSLT)",
            "gfiStyleDesc": "Define a style for Get Feature Information (GFI) as XSLT transformation.",
            "manualRefresh": "Manual refresh",
            "matrixSetId": "WMTS TileMatrixSet ID",
            "matrixSetIdDesc": "WMTS TileMatrixSet ID is a technical tile matrix identifier. It is fetched automatically from the GetCapabilities response.",
            "matrixSet": "JSON for WMTS layer",
            "matrixSetDesc": "The layer data in the JSON format is fetched automatically from the GetCapabilities response.",
            "realtime": "Real time layer",
            "refreshRate": "Click the checkbox, if the map layer is updated in real time. The refresh rate is defined in the seconds.",
            "jobTypeDesc": "WFS engine",
            "jobTypeDefault": "default",
            "jobTypes": {
                "default": "Default",
                "fe": "Feature engine"
            },
            "generic": {
                "placeholder": "Name in {0}",
                "descplaceholder": "Description in {0}"
            },
            "en": {
                "title": "En",
                "placeholder": "Name in English",
                "descplaceholder": "Description in English"
            },
            "fi": {
                "title": "Fi",
                "placeholder": "Name in Finnish",
                "descplaceholder": "Description in Finnish"
            },
            "sv": {
                "title": "Sv",
                "placeholder": "Name in Swedish",
                "descplaceholder": "Description in Swedish"
            },
            "interfaceAddress": "Interface URL",
            "interfaceAddressDesc": "Type the web service address in the URL form without question mark and other parameters after that. Fetch map layer parameters by clicking \"Get data\".",
            "viewingRightsRoles": "View rights to roles",
            "metadataReadFailure": "The map layer metadata could not be fetched.",
            "permissionFailure": "The given username or password is invalid.",
            "mandatory_field_missing": "The following field(s) are required:",
            "invalid_field_value": "The given value is invalid:",
            "operation_not_permitted_for_layer_id": "You do not have rights to update or add map layers.",
            "no_layer_with_id": "The map layer with this id does not exist. It may have already been removed.",
            "success": "Update succeeded",
            "errorRemoveLayer": "The map layer could not be removed.",
            "errorInsertAllreadyExists": "The new map layer has been added. A map layer with same identifier already exists.",
            "errorRemoveGroupLayer": "The map layer group could not be removed.",
            "errorSaveGroupLayer": "The map layer group could not be saved.",
            "errorTitle": "Error",
            "warningTitle": "Warning",
            "successTitle": "Saving Succeeded",
            "warning_some_of_the_layers_could_not_be_parsed": "Some of the map layers could not be parsed."
        },
        "cancel": "Cancel",
        "add": "Add",
        "save": "Save",
        "delete": "Remove",
        "ok": "OK"
    }
}
);