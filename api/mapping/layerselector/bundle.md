# layerselector

Provides an UI to show which layers are available for the user.

## Description

The bundle offers the user a listing for all the maplayers available in Oskari. The maplayers are grouped by topic or organization by selecting a tab in the upper part of the flyout. The user can filter maplayers by writing something in the input field. This helps the user to find the wanted layer from the long list. Pressing enter key opens up a related keywords popup for advanced filtering. For each maplayer there is an icon presenting layer type (wms/wfs/base/wmts/vector) and an i-icon if the layer has a "dataUrl_uuid" property. Pressing the I-icon sends out a request to show the metadata for the uuid to the user (requires oskari-server functionality). The user can add the maplayer to the map by checking the checkbox next to layername (or uncheck to remove it from map).

## TODO

* handles wmts icon eventhough its not a core layer type

## Screenshot

![screenshot](layerselector2.png)

## Bundle configuration

No configuration is required. Assumes that MapLayerService has been initialized and can be fetched from sandbox.
If there is no configuration, showing layer filter buttons.

Optional configuration to show published layers tab:

```javascript
{
  "conf": {
    "showPublishedTab" : true,
    "showSearchSuggestions" : true,  // if keyword search on, if needed
    "hideLayerFilters": false
  }
}
```

## Bundle state

```javascript
{
  "state": {
    "tab" : "[Tab name]",
    "groups" : ["[group name 1]","[group name 2]"],
    "filter" : ""
  }
}
```

Where:

* tab - the selected tab
* groups - layers groups that are open
* filter - the "search" text/text with what layers are filtered

If filter is given, open groups will be ignored. If filter is undefined, groups will be opened as stated in groups array.

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td>ShowFilteredLayerListRequest</td><td>Shows filtered layer list.</td>
  </tr>
</table>


## Requests the bundle sends out

<table class="table">
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> userinterface.AddExtensionRequest </td><td> Register as part of the UI in start()-method</td>
  </tr>
  <tr>
    <td> userinterface.RemoveExtensionRequest </td><td> Unregister from the UI in stop()-method</td>
  </tr>
  <tr>
    <td> AddMapLayerRequest </td><td> Sent out when user checks the layer checkbox</td>
  </tr>
  <tr>
    <td> RemoveMapLayerRequest </td><td> Sent out when user unchecks the layer checkbox</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td> Unchecks the checkbox on given layers UI container</td>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> Updates the UI with data from MapLayerService - if operation is 'add' (adds the maplayer), 'remove' (removes the maplayer) or 'update' (updates layers name)</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [RightJS tooltips](http://rightjs.org/ui/tooltips/) </td>
    <td> https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/tooltips.js </td>
    <td> RightJS UI component for showing tooltips - used to show tooltips on layer icons</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](/documentation/bundles/framework/divmanazer) </td>
    <td> Expects to be present in application setup </td>
    <td> Oskari's Div handler bundle</td>
  </tr>
  <tr>
    <td> [Backend API](/documentation/backend/layerselector) </td>
    <td> N/A </td>
    <td> Get all Maplayers from backend</td>
  </tr>
</table>
